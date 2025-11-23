from typing import Optional
from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Integer

from database import init_db, SessionLocal
from models import Record as SQLRecord
from crud import get_records_with_count
from schemas import RecordsResponse  # single source of truth for responses

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------
# /records (list + filters)
# ---------------------
@app.get("/records", response_model=RecordsResponse)
def read_records(
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None),
    genre: Optional[str] = Query(None),
    year_range: Optional[str] = Query(None),  # "YYYY-YYYY"
    has_b_side: bool = Query(False),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
):
    total_count, records = get_records_with_count(
        db=db,
        search=search,
        genre=genre,
        year_range=year_range,
        has_b_side=has_b_side,
        skip=skip,
        limit=limit,
    )
    return {"total_count": total_count, "records": records}


# ---------------------
# /index (alphabetical browse + extra filters)
# ---------------------
@app.get("/index", response_model=RecordsResponse)
def get_alphabetical_index(
    column: str = Query(..., description="DB column key, e.g. 'artist', 'title', 'label'"),
    letter: str = Query(..., min_length=1, max_length=1, description="A–Z or #"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    year_range: Optional[str] = Query(None, description="YYYY-YYYY"),
    genre: Optional[str] = Query(None),
    has_b_side: bool = Query(False),
    db: Session = Depends(get_db),
):
    valid_cols = {c.name for c in SQLRecord.__table__.columns}
    col_name = column.lower()
    if col_name not in valid_cols:
        raise HTTPException(status_code=400, detail=f"Invalid column: {column}")

    col = SQLRecord.__table__.columns[col_name]

    # base filters
    q = db.query(SQLRecord).filter(col.isnot(None), col != "")

    # A–Z or '#'
    if letter == "#":
        first = func.substr(func.trim(col), 1, 1)
        q = q.filter(~func.upper(first).between("A", "Z"))
    else:
        q = q.filter(col.ilike(f"{letter.upper()}%"))

    # optional: year range
    if year_range and "-" in year_range:
        s, e = (p.strip() for p in year_range.split("-", 1))
        q = q.filter(
            cast(SQLRecord.year, Integer).between(
                int(s) if s.isdigit() else 0,
                int(e) if e.isdigit() else 9999
            )
        )

    # optional: genre contains
    if genre:
        q = q.filter(SQLRecord.genre.ilike(f"%{genre}%"))

    # optional: require B-side
    if has_b_side:
        q = q.filter(SQLRecord.b_side_title.isnot(None), SQLRecord.b_side_title != "")

    # ordering + pagination
    q = q.order_by(col.asc(), SQLRecord.id.asc())
    total = q.count()
    rows = q.offset(skip).limit(limit).all()
    return {"total_count": total, "records": rows}


# --- debug helper (optional; remove later) ---
@app.get("/debug/columns")
def debug_columns():
    return sorted([c.name for c in SQLRecord.__table__.columns])

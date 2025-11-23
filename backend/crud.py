
from sqlalchemy.orm import Session
from sqlalchemy import or_, cast, Integer
from models import Record


def get_records_with_count(
    db: Session,
    search: str | None = None,
    genre: str | None = None,
    year_range: str | None = None,
    has_b_side: bool = False,
    skip: int = 0,
    limit: int = 50,
):
    query = db.query(Record)

    if search:
        like = f"%{search}%"
        query = query.filter(
            or_(
                Record.artist.ilike(like),
                Record.title.ilike(like),
                Record.producer.ilike(like),
                Record.b_side_title.ilike(like),
                Record.b_side_artist.ilike(like),
            )
        )

    if genre:
        query = query.filter(Record.genre.ilike(f"%{genre}%"))

    if year_range and "-" in year_range:
        start_s, end_s = (s.strip() for s in year_range.split("-", 1))
        # Cast to int when possible; non-numeric becomes NULL and is excluded by BETWEEN
        query = query.filter(
            cast(Record.year, Integer).between(
                int(start_s) if start_s.isdigit() else 0,
                int(end_s) if end_s.isdigit() else 9999,
            )
        )

    if has_b_side:
        # Treat empty strings as no B-side
        query = query.filter(Record.b_side_title.isnot(None), Record.b_side_title != "")

    total_count = query.count()
    records = query.offset(skip).limit(limit).all()

    # Return a tuple so main.py can unpack cleanly
    return total_count, records

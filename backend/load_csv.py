import csv
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Record, Base

Base.metadata.create_all(bind=engine)


column_map = {
    "00artist": "artist",
    "00artist_credit": "artist_credit",
    "00title": "title",
    "00title_credit": "title_credit",
    "00matrix_number": "matrix_number",
    "00label_number": "label_number",
    "00label": "label",
    "00country": "country",
    "00format": "format",
    "blank1": "blank_1",
    "00producer": "producer",
    "00year": "year",
    "00riddim": "riddim",
    "version": "version",
    "b_side_artist": "b_side_artist",
    "b_side_artist_credit": "b_side_artist_credit",
    "b_side_title": "b_side_title",
    "b_side_title_credit": "b_side_title_credit",
    "b_side_matrix_number": "b_side_matrix_number",
    "b_side_label_number": "b_side_label_number",
    "song_origin": "song_origin",
    "notes": "notes",
    "00genre": "genre",
    "aadditions": "aadditions"
}


def load_csv_to_db(csv_path: str):
    db: Session = SessionLocal()
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            clean = {k.strip().lower(): (v.strip() if v else "") for k, v in row.items()}

            kwargs = {}
            for csv_col, model_field in column_map.items():
                kwargs[model_field] = clean.get(csv_col, "")

            record = Record(**kwargs)
            db.add(record)

        db.commit()
    db.close()
    print("CSV loaded into the database.")

if __name__ == "__main__":
    load_csv_to_db("RKR.csv")



from sqlalchemy import Column, Integer, String
from database import Base

class Record(Base):
    __tablename__ = "records"

    id = Column(Integer, primary_key=True, index=True)

    artist = Column(String, nullable=True)
    artist_credit = Column(String, nullable=True)
    title = Column(String, nullable=True)
    title_credit = Column(String, nullable=True)
    matrix_number = Column(String, nullable=True)
    label_number = Column(String, nullable=True)
    label = Column(String, nullable=True)
    country = Column(String, nullable=True)
    format = Column(String, nullable=True)
    blank_1 = Column(String, nullable=True)
    producer = Column(String, nullable=True)
    year = Column(String, nullable=True)
    riddim = Column(String, nullable=True)
    version = Column(String, nullable=True)
    b_side_artist = Column(String, nullable=True)
    b_side_artist_credit = Column(String, nullable=True)
    b_side_title = Column(String, nullable=True)
    b_side_title_credit = Column(String, nullable=True)
    b_side_matrix_number = Column(String, nullable=True)
    b_side_label_number = Column(String, nullable=True)
    song_origin = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    genre = Column(String, nullable=True)
    aadditions = Column(String, nullable=True)


from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class RecordOut(BaseModel):
    id: int
    artist: Optional[str] = None
    artist_credit: Optional[str] = None
    title: Optional[str] = None
    title_credit: Optional[str] = None
    matrix_number: Optional[str] = None
    format: Optional[str] = None
    country: Optional[str] = None
    label_number: Optional[str] = None
    producer: Optional[str] = None
    year: Optional[str] = None
    riddim: Optional[str] = None
    version: Optional[str] = None
    b_side_artist: Optional[str] = None
    b_side_artist_credit: Optional[str] = None
    b_side_title: Optional[str] = None
    b_side_title_credit: Optional[str] = None
    b_side_matrix_number: Optional[str] = None
    b_side_label_number: Optional[str] = None
    song_origin: Optional[str] = None
    notes: Optional[str] = None
    genre: Optional[str] = None
    aadditions: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class RecordsResponse(BaseModel):
    total_count: int
    records: List[RecordOut]

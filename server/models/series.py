import enum
from db import db
from sqlalchemy.sql import func
from sqlalchemy import desc, Index

from ts_vector import TSVector

class SeriesStatusEnum(enum.Enum):
    TO_WATCH = "to_watch"
    WATCHING = "watching"
    COMPLETED = "completed"
    ABANDONED = "abandoned"
    ON_HOLD = "on_hold"

class SeriesModel(db.Model):  
    __tablename__ = "series"  

    id = db.Column(db.Integer(), primary_key=True)
    image_url = db.Column(db.String(), nullable=True)
    title = db.Column(db.String(), nullable=False)
    description = db.Column(db.Text(), nullable=True)
    rating = db.Column(db.SmallInteger(), nullable=True)
    status = db.Column(db.Enum(SeriesStatusEnum))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=False, nullable=False)
    creation_time = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = db.relationship("UserModel", back_populates="series")

    ts_series_vector = db.Column(
        TSVector(),
        db.Computed(
            "to_tsvector('english', title || ' ' || description)",
            persisted=True
        )
    )

    __table_args__ = (
        Index('ix_series___ts_vector__', ts_series_vector, postgresql_using='gin'),
    )
import enum
from db import db

class StatusEnum(enum.Enum):
    TO_WATCH = "to_watch"
    WATCHING = "watching"
    COMPLETED = "completed"
    ABANDONED = "abandoned"
    ON_HOLD = "on_hold"

class MovieModel(db.Model):  
    __tablename__ = "movies"  

    id = db.Column(db.Integer(), primary_key=True)
    image_url = db.Column(db.String(), nullable=True)
    title = db.Column(db.String(), nullable=False)
    description = db.Column(db.Text(), nullable=True)
    rating = db.Column(db.SmallInteger(), nullable=True)
    status = db.Column(db.Enum(StatusEnum))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=False, nullable=False)

    user = db.relationship("UserModel", back_populates="movies")
import enum
from db import db

class BookStatusEnum(enum.Enum):
    TO_READ = "to_read"
    READING = "reading"
    COMPLETED = "completed"
    ABANDONED = "abandoned"
    ON_HOLD = "on_hold"

class BookModel(db.Model):  
    __tablename__ = "books"  

    id = db.Column(db.Integer(), primary_key=True)
    image_url = db.Column(db.String(), nullable=True)
    title = db.Column(db.String(), nullable=False)
    description = db.Column(db.Text(), nullable=True)
    author = db.Column(db.String(), nullable=True)
    rating = db.Column(db.SmallInteger(), nullable=True)
    status = db.Column(db.Enum(BookStatusEnum))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=False, nullable=False)

    user = db.relationship("UserModel", back_populates="books")
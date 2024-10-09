from db import db
from sqlalchemy.sql import func

class UserModel(db.Model):  
	__tablename__ = "users"  
	  
	id = db.Column(db.Integer(), primary_key=True)
	email = db.Column(db.String(), unique=True, nullable=False)  
	password = db.Column(db.String(), nullable=False)
	creation_time = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)

	movies = db.relationship("MovieModel", back_populates="user", lazy="dynamic", cascade="all, delete")
	books = db.relationship("BookModel", back_populates="user", lazy="dynamic", cascade="all, delete")
	series = db.relationship("SeriesModel", back_populates="user", lazy="dynamic", cascade="all, delete")
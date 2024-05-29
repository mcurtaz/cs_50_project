from db import db

class UserModel(db.Model):  
	__tablename__ = "users"  
	  
	id = db.Column(db.Integer(), primary_key=True)  
	email = db.Column(db.String(), unique=True, nullable=False)  
	password = db.Column(db.String(), nullable=False)

	movies = db.relationship("MovieModel", back_populates="user", lazy="dynamic", cascade="all, delete")
	books = db.relationship("BookModel", back_populates="user", lazy="dynamic", cascade="all, delete")
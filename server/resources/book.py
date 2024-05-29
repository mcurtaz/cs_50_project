from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import (
    jwt_required,
	get_jwt_identity
)

from sqlalchemy.exc import SQLAlchemyError

from db import db
from models import BookModel
from models import UserModel
from schemas import BookSchema, BookPutSchema, PlainBookSchema

blp = Blueprint("Books", __name__, description="Operations on books")

@blp.route("/book")
class BookList(MethodView):
	@jwt_required()
	@blp.response(200, PlainBookSchema(many=True))
	def get(self):
		user = UserModel.query.filter_by(id=get_jwt_identity()).one_or_404()
		return user.books.all()

	@jwt_required() 
	@blp.arguments(BookSchema)  
	@blp.response(201, PlainBookSchema)  
	def post(self, book_data):  
		book = BookModel(**book_data, user_id = get_jwt_identity())
	
		try:  
			db.session.add(book)
			db.session.commit()
		except SQLAlchemyError:
			abort(500, message="An error occurred while inserting the book.")
		
		return book

@blp.route("/book/<string:book_id>")
class Book(MethodView):
	@jwt_required()
	@blp.response(200, PlainBookSchema())
	def get(self, book_id):
		if not book_id:
			abort(400, message="Missing book id")

		book = BookModel.query.filter_by(id=book_id).one_or_404()
		return book

	@jwt_required()
	@blp.arguments(BookPutSchema)
	@blp.response(200, PlainBookSchema)
	def put(self, book_data, book_id):
		if not book_id:
			abort(400, message="Missing book id")

		book = db.session.get(BookModel, book_id)

		if book and book.user_id != get_jwt_identity():
			abort(403, message="Insufficient permissions to access the resource")
	
		if book:
			if "image_url" in book_data:
				book.image_url = book_data["image_url"]
			if "title" in book_data:
				book.title = book_data["title"]
			if "description" in book_data:
				book.description = book_data["description"]
			if "author" in book_data:
				book.description = book_data["author"]
			if "rating" in book_data:
				book.rating = book_data["rating"]
			if "status" in book_data:
				book.status = book_data["status"]
		else:
			book = BookModel(**book_data)  
			db.session.add(book)  
		
		try:  
			db.session.commit()  
		except SQLAlchemyError:  
			abort(500, message="An error occurred while updating the book.")  
		
		return book

	@jwt_required()
	def delete(self, book_id):
		if not book_id:
			abort(400, message="Missing book id")

		book = BookModel.query.filter_by(id=book_id).one_or_404()

		if book.user_id != get_jwt_identity():
			abort(403, message="Insufficient permissions to access the resource")

		db.session.delete(book)
		db.session.commit()

		return {"message": "book deleted."}, 200
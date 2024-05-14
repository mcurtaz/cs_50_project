from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import (
    jwt_required,
	get_jwt_identity
)

from sqlalchemy.exc import SQLAlchemyError

from db import db
from models import MovieModel
from models import UserModel
from schemas import MovieSchema, MoviePutSchema, PlainMovieSchema

blp = Blueprint("Movies", __name__, description="Operations on movies")

@blp.route("/movie")
class MovieList(MethodView):
	@jwt_required()
	@blp.response(200, PlainMovieSchema(many=True))
	def get(self):
		user = UserModel.query.filter_by(id=get_jwt_identity()).one_or_404()
		return user.movies.all()

	@jwt_required() 
	@blp.arguments(MovieSchema)  
	@blp.response(201, MovieSchema)  
	def post(self, movie_data):  
		movie = MovieModel(**movie_data, user_id = get_jwt_identity())
	
		try:  
			db.session.add(movie)
			db.session.commit()
		except SQLAlchemyError:
			abort(500, message="An error occurred while inserting the movie.")
		
		return movie

@blp.route("/movie/<string:movie_id>")
class Movie(MethodView):
	@jwt_required()
	@blp.response(200, PlainMovieSchema())
	def get(self, movie_id):
		if not movie_id:
			abort(400, message="Missing movie id")

		movie = MovieModel.query.filter_by(id=movie_id).one_or_404()
		return movie

	@jwt_required()
	@blp.arguments(MoviePutSchema)
	@blp.response(200, PlainMovieSchema)
	def put(self, movie_data, movie_id):
		if not movie_id:
			abort(400, message="Missing movie id")

		movie = db.session.get(MovieModel, movie_id)

		if movie and movie.user_id != get_jwt_identity():
			abort(403, message="Insufficient permissions to access the resource")
	
		if movie:
			if "image_url" in movie_data:
				movie.image_url = movie_data["image_url"]
			if "title" in movie_data:
				movie.title = movie_data["title"]
			if "description" in movie_data:
				movie.description = movie_data["description"]
			if "rating" in movie_data:
				movie.rating = movie_data["rating"]
			if "status" in movie_data:
				movie.status = movie_data["status"]
		else:
			movie = MovieModel(**movie_data)  
			db.session.add(movie)  
		
		try:  
			db.session.commit()  
		except SQLAlchemyError:  
			abort(500, message="An error occurred while updating the movie.")  
		
		return movie

	@jwt_required()
	def delete(self, movie_id):
		if not movie_id:
			abort(400, message="Missing movie id")

		movie = MovieModel.query.filter_by(id=movie_id).one_or_404()

		if movie.user_id != get_jwt_identity():
			abort(403, message="Insufficient permissions to access the resource")

		db.session.delete(movie)
		db.session.commit()

		return {"message": "Movie deleted."}, 200
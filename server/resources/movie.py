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
from schemas import MovieSchema

blp = Blueprint("Movies", __name__, description="Operations on movies")

@blp.route("/movie")
class MovieList(MethodView):
	@jwt_required()
	@blp.response(200, MovieSchema(many=True))
	def get(self):
		user = UserModel.query.get_or_404(get_jwt_identity());
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
	@blp.response(200, MovieSchema())
	def get(self, movie_id):
		movie = MovieModel.query.get_or_404(movie_id)
		return movie

	@jwt_required()
	@blp.arguments(MovieSchema)
	@blp.response(200, MovieSchema)
	def put(self, movie_data, movie_id):
		movie = MovieModel.query.get(movie_id)

		if movie.user_id != get_jwt_identity():
			abort(403, message="Insufficient permissions to access the resource")
	
		if movie:
			movie |= movie_data
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
		movie = MovieModel.query.get_or_404(movie_id)

		if movie.user_id != get_jwt_identity():
			abort(403, message="Insufficient permissions to access the resource")

		movie.delete_from_db()
		return {"message": "Movie deleted."}, 200
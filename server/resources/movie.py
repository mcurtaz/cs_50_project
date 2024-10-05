from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import (
    jwt_required,
	get_jwt_identity
)

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.sql.expression import func

from db import db
from models import MovieModel
from models import UserModel
from schemas import MovieSchema, MoviePutSchema, PlainMovieSchema, MovieListRequestSchema, MovieListSchema

blp = Blueprint("Movies", __name__, description="Operations on movies")

@blp.route("/movie")
class MovieList(MethodView):
	@jwt_required()
	@blp.arguments(MovieListRequestSchema, location="query")
	@blp.response(200, MovieListSchema)
	def get(self, request_data):

		if not "page" in request_data:
			page = 1
		else:
			page = request_data["page"]
		
		per_page = 10

		user = UserModel.query.filter_by(id=get_jwt_identity()).one_or_404()
		
		query = user.movies

		if "status" in request_data:
			query = query.filter_by(status=request_data["status"])

		if "q" in request_data:
			query = query.filter(MovieModel.ts_movie_vector.match(request_data["q"]))
		
		movieList = user.movies.order_by(MovieModel.title).paginate(page=page,per_page=per_page,error_out=False)

		return {
			"pagination": {
				"page": movieList.page,
				"has_prev": movieList.has_prev,
				"has_next": movieList.has_next,
				"pages": movieList.pages
			},
			"movies": movieList
		}

	@jwt_required() 
	@blp.arguments(MovieSchema)  
	@blp.response(201, PlainMovieSchema)  
	def post(self, movie_data):  
		movie = MovieModel(**movie_data, user_id = get_jwt_identity())
	
		try:  
			db.session.add(movie)
			db.session.commit()
		except SQLAlchemyError:
			abort(500, message="An error occurred while inserting the movie.")
		
		return movie

@blp.route("/movie/dashboard")
class MovieDashboard(MethodView):
	@jwt_required()
	@blp.response(200, PlainMovieSchema(many=True))
	def get(self):

		user = UserModel.query.filter_by(id=get_jwt_identity()).one_or_404()
		movies = user.movies.order_by(func.random()).limit(5).all()

		return movies
	
@blp.route("/movie/<string:movie_id>")
class Movie(MethodView):
	@jwt_required()
	@blp.response(200, PlainMovieSchema())
	def get(self, movie_id):
		if not movie_id:
			abort(400, message="Missing movie id")

		movie = MovieModel.query.filter_by(id=movie_id).one_or_404()

		if movie and movie.user_id != get_jwt_identity():
			abort(403, message="Insufficient permissions to access the resource")

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
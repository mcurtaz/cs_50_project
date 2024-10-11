from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import (
    jwt_required,
	get_jwt_identity
)

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.sql.expression import func

from db import db
from models import SeriesModel
from models import UserModel
from schemas import SeriesSchema, SeriesPutSchema, PlainSeriesSchema, SeriesListRequestSchema, SeriesListSchema

blp = Blueprint("Series", __name__, description="Operations on series")

@blp.route("/series")
class SeriesList(MethodView):
	@jwt_required()
	@blp.arguments(SeriesListRequestSchema, location="query")
	@blp.response(200, SeriesListSchema)
	def get(self, request_data):

		if not "page" in request_data:
			page = 1
		else:
			page = request_data["page"]
		
		per_page = 10

		user = UserModel.query.filter_by(id=get_jwt_identity()).one_or_404()
		
		query = user.series

		if "status" in request_data:
			query = query.filter_by(status=request_data["status"])

		if "q" in request_data:
			query = query.filter(SeriesModel.ts_series_vector.match(request_data["q"]))
		
		seriesList = query.order_by(SeriesModel.title).paginate(page=page,per_page=per_page,error_out=False)

		return {
			"pagination": {
				"page": seriesList.page,
				"has_prev": seriesList.has_prev,
				"has_next": seriesList.has_next,
				"pages": seriesList.pages
			},
			"series": seriesList
		}

	@jwt_required() 
	@blp.arguments(SeriesSchema)  
	@blp.response(201, PlainSeriesSchema)  
	def post(self, series_data):  
		series = SeriesModel(**series_data, user_id = get_jwt_identity())
	
		try:  
			db.session.add(series)
			db.session.commit()
		except SQLAlchemyError:
			abort(500, message="An error occurred while inserting the series.")
		
		return series

@blp.route("/series/dashboard")
class SeriesDashboard(MethodView):
	@jwt_required()
	@blp.response(200, PlainSeriesSchema(many=True))
	def get(self):

		user = UserModel.query.filter_by(id=get_jwt_identity()).one_or_404()
		series = user.series.order_by(func.random()).limit(5).all()

		return series
	
@blp.route("/series/<string:series_id>")
class Series(MethodView):
	@jwt_required()
	@blp.response(200, PlainSeriesSchema())
	def get(self, series_id):
		if not series_id:
			abort(400, message="Missing series id")

		series = SeriesModel.query.filter_by(id=series_id).one_or_404()

		if series and series.user_id != get_jwt_identity():
			abort(403, message="Insufficient permissions to access the resource")

		return series

	@jwt_required()
	@blp.arguments(SeriesPutSchema)
	@blp.response(200, PlainSeriesSchema)
	def put(self, series_data, series_id):
		if not series_id:
			abort(400, message="Missing series id")

		series = db.session.get(SeriesModel, series_id)

		if series and series.user_id != get_jwt_identity():
			abort(403, message="Insufficient permissions to access the resource")
	
		if series:
			if "image_url" in series_data:
				series.image_url = series_data["image_url"]
			if "title" in series_data:
				series.title = series_data["title"]
			if "description" in series_data:
				series.description = series_data["description"]
			if "rating" in series_data:
				series.rating = series_data["rating"]
			if "status" in series_data:
				series.status = series_data["status"]
		else:
			series = SeriesModel(**series_data)  
			db.session.add(series)  
		
		try:  
			db.session.commit()  
		except SQLAlchemyError:  
			abort(500, message="An error occurred while updating the series.")  
		
		return series

	@jwt_required()
	def delete(self, series_id):
		if not series_id:
			abort(400, message="Missing series id")

		series = SeriesModel.query.filter_by(id=series_id).one_or_404()

		if series.user_id != get_jwt_identity():
			abort(403, message="Insufficient permissions to access the resource")

		db.session.delete(series)
		db.session.commit()

		return {"message": "Series deleted."}, 200
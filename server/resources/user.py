from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
)
from passlib.hash import pbkdf2_sha256

from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from db import db
from models import UserModel
from schemas import UserSchema, PlainUserSchema

blp = Blueprint("Users", __name__, description="Operations on users")

@blp.route("/register")  
class UserRegister(MethodView):
	@blp.arguments(UserSchema)
	def post(self, user_data):  
		user = UserModel(
			email=user_data["email"],
			password=pbkdf2_sha256.hash(user_data["password"]),
		)
		
		try:
			db.session.add(user)
			db.session.commit()
		except IntegrityError:
			abort(409, message="A user with that email already exists.")
		except SQLAlchemyError:
			abort(500, message="An error occurred creating the store.")

		return {"message": "User created successfully."}, 201

@blp.route("/login")
class UserLogin(MethodView):
	@blp.arguments(UserSchema)
	def post(self, user_data):
		user = UserModel.query.filter(
			UserModel.email == user_data["email"]
		).first()

		if user and pbkdf2_sha256.verify(user_data["password"], user.password):
			access_token = create_access_token(identity=user.id, fresh=True)
			refresh_token = create_refresh_token(user.id)
			return {"access_token": access_token, "refresh_token": refresh_token}, 200

		abort(401, message="Invalid credentials.")

@blp.route("/me")
class UserLogin(MethodView):
	@jwt_required()
	@blp.response(200, PlainUserSchema)  
	def post(self):
		user = UserModel.query.filter_by(id=get_jwt_identity()).one_or_404()
		
		return user

@blp.route("/refresh")
class TokenRefresh(MethodView):
	@jwt_required(refresh=True)
	def post(self):
		current_user = get_jwt_identity()
		new_token = create_access_token(identity=current_user, fresh=False)

        # Invalidate token?
		# jti = get_jwt()["jti"]
		# add to invalid token table

		return {"access_token": new_token}, 200
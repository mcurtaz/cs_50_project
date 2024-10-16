import os
import secrets

from flask import Flask
from flask_smorest import Api
from flask_migrate import Migrate
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from db import db
from resources.user import blp as UserBlueprint
from resources.movie import blp as MovieBlueprint
from resources.book import blp as BookBlueprint
from resources.series import blp as SeriesBlueprint

def create_app(db_url=None):
    load_dotenv()
    app = Flask(__name__)
    app.config["API_TITLE"] = "Stores REST API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/"
    app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
    app.config["OPENAPI_SWAGGER_UI_URL"] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url or os.getenv("DATABASE_URL", "sqlite:///data.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["PROPAGATE_EXCEPTIONS"] = True
    app.config['SQLALCHEMY_ECHO'] = False # enable to debug
    app.config['FLASK_DEBUG'] = False # enable to debug
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", str(secrets.SystemRandom().getrandbits(128)))
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 900 # 15 minutes

    cors = CORS(app, resources={r"/*": {"origins": "*"}})
    
    db.init_app(app)
    migrate = Migrate(app, db) 
    api = Api(app)
    jwt = JWTManager(app)

    api.register_blueprint(UserBlueprint, url_prefix='/api')
    api.register_blueprint(MovieBlueprint, url_prefix='/api')
    api.register_blueprint(BookBlueprint, url_prefix='/api')
    api.register_blueprint(SeriesBlueprint, url_prefix='/api')

    return app
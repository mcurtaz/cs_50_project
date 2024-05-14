from marshmallow import Schema, fields

from models.movie import StatusEnum

class PlainUserSchema(Schema):
    id = fields.Int(required=True, dump_only=True)
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True)

class PlainMovieSchema(Schema):
    id = fields.Int(required=True, dump_only=True)
    # user_id = fields.Int(required=True, dump_only=True) This is handled by the application throught the access_token
    image_url = fields.Url()
    title = fields.Str(required=True)
    description = fields.Str()
    rating = fields.Int()
    status = fields.Enum(enum=StatusEnum, by_value=False)

class MoviePutSchema(Schema):
    image_url = fields.Url()
    title = fields.Str()
    description = fields.Str()
    rating = fields.Int()
    status = fields.Enum(enum=StatusEnum, by_value=False)

class MovieSchema(PlainMovieSchema):
    user = fields.Nested(PlainUserSchema(), dump_only=True)

class UserSchema(PlainUserSchema):
    movies = fields.List(fields.Nested(PlainMovieSchema()), dump_only=True)
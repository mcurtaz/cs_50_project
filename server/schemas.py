from marshmallow import Schema, fields

from models.movie import MovieStatusEnum
from models.series import SeriesStatusEnum
from models.book import BookStatusEnum

class PlainUserSchema(Schema):
    id = fields.Int(required=True, dump_only=True)
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True)
    
class PaginationSchema(Schema):
    page = fields.Int(required=False)
    has_prev = fields.Bool(dump_only=True)
    has_next = fields.Bool(dump_only=True)
    pages = fields.Int(dump_only=True)

class PlainMovieSchema(Schema):
    id = fields.Int(required=True, dump_only=True)
    # user_id = fields.Int(required=True, dump_only=True) This is handled by the application throught the access_token
    image_url = fields.Url(allow_none=True)
    title = fields.Str(required=True)
    description = fields.Str()
    rating = fields.Int()
    status = fields.Enum(enum=MovieStatusEnum, by_value=False)
    creation_time = fields.DateTime(dump_only=True)

class MoviePutSchema(Schema):
    image_url = fields.Url(allow_none=True)
    title = fields.Str()
    description = fields.Str()
    rating = fields.Int()
    status = fields.Enum(enum=MovieStatusEnum, by_value=False)

class MovieSchema(PlainMovieSchema):
    user = fields.Nested(PlainUserSchema(), dump_only=True)

class MovieListSchema(Schema):
    pagination = fields.Nested(PaginationSchema())
    movies = fields.List(fields.Nested(PlainMovieSchema()))

class MovieListRequestSchema(PaginationSchema):
    status = fields.Enum(enum=MovieStatusEnum, by_value=False)
    q = fields.Str()

class PlainSeriesSchema(Schema):
    id = fields.Int(required=True, dump_only=True)
    # user_id = fields.Int(required=True, dump_only=True) This is handled by the application throught the access_token
    image_url = fields.Url(allow_none=True)
    title = fields.Str(required=True)
    description = fields.Str()
    rating = fields.Int()
    status = fields.Enum(enum=SeriesStatusEnum, by_value=False)
    creation_time = fields.DateTime(dump_only=True)

class SeriesPutSchema(Schema):
    image_url = fields.Url(allow_none=True)
    title = fields.Str()
    description = fields.Str()
    rating = fields.Int()
    status = fields.Enum(enum=SeriesStatusEnum, by_value=False)

class SeriesSchema(PlainSeriesSchema):
    user = fields.Nested(PlainUserSchema(), dump_only=True)

class SeriesListSchema(Schema):
    pagination = fields.Nested(PaginationSchema())
    series = fields.List(fields.Nested(PlainSeriesSchema()))

class SeriesListRequestSchema(PaginationSchema):
    status = fields.Enum(enum=SeriesStatusEnum, by_value=False)
    q = fields.Str()

class PlainBookSchema(Schema):
    id = fields.Int(required=True, dump_only=True)
    # user_id = fields.Int(required=True, dump_only=True) This is handled by the application throught the access_token
    image_url = fields.Url(allow_none=True)
    title = fields.Str(required=True)
    description = fields.Str()
    author = fields.Str()
    rating = fields.Int()
    status = fields.Enum(enum=BookStatusEnum, by_value=False)
    creation_time = fields.DateTime(dump_only=True)

class BookPutSchema(Schema):
    image_url = fields.Url(allow_none=True)
    title = fields.Str()
    author = fields.Str()
    description = fields.Str()
    rating = fields.Int()
    status = fields.Enum(enum=BookStatusEnum, by_value=False)

class BookSchema(PlainBookSchema):
    user = fields.Nested(PlainUserSchema(), dump_only=True)

class BookListSchema(Schema):
    pagination = fields.Nested(PaginationSchema())
    books = fields.List(fields.Nested(PlainBookSchema()))

class BookListRequestSchema(PaginationSchema):
    status = fields.Enum(enum=BookStatusEnum, by_value=False)
    q = fields.Str()

class UserSchema(PlainUserSchema):
    movies = fields.List(fields.Nested(PlainMovieSchema()), dump_only=True)
    books = fields.List(fields.Nested(PlainBookSchema()), dump_only=True)
    series = fields.List(fields.Nested(PlainSeriesSchema()), dump_only=True)

class LoginResponseSchema(Schema):
    access_token = fields.Str(required=True)
    refresh_token = fields.Str(required=True)
    user = fields.Nested(PlainUserSchema(), dump_only=True)
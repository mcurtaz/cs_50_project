from marshmallow import Schema, fields

from models.movie import StatusEnum

class UserSchema(Schema):
    id = fields.Int(required=True, dump_only=True)
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True)

class MovieSchema(Schema):
    id = fields.Int(required=True, dump_only=True)
    image_url = fields.Url(equired=False)
    title = fields.Str(required=True)
    description = fields.Str(required=False)
    rating = fields.Int(required=False)
    status = fields.Enum(enum=StatusEnum, by_value=False)
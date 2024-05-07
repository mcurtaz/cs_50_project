from marshmallow import Schema, fields

class UserSchema(Schema):
    id = fields.Int(required=True, dump_only=True)
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True)
from marshmallow import Schema, fields

class RegistroSchema(Schema):
    correo = fields.Email(required=True)
    nombre_usuario = fields.Str(required=True)
    contrasena = fields.Str(required=True, load_only=True)

class LoginSchema(Schema):
    correo = fields.Email(required=True)
    contrasena = fields.Str(required=True, load_only=True)

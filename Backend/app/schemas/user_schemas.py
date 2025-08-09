from marshmallow import Schema, fields

class UsuarioSchema(Schema):
    id = fields.Int(dump_only=True)
    correo = fields.Email()
    nombre_usuario = fields.Str()
    activo = fields.Bool()
    creado_en = fields.DateTime()

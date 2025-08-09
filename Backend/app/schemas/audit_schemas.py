from marshmallow import Schema, fields

class AuditoriaSchema(Schema):
    id = fields.Int()
    accion = fields.Str()
    tipo_recurso = fields.Str()
    recurso_id = fields.Str()
    estado = fields.Str()
    creado_en = fields.DateTime()

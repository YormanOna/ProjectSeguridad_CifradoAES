from marshmallow import Schema, fields

class ClaveSchema(Schema):
    id = fields.Int(dump_only=True)
    etiqueta = fields.Str()
    activa = fields.Bool()
    creada_en = fields.DateTime()

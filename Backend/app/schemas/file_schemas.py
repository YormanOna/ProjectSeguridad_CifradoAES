from marshmallow import Schema, fields

class ArchivoSubidaSchema(Schema):
    nombre = fields.Str(required=True)
    tipo_mime = fields.Str(required=False)

class ArchivoRespuestaSchema(Schema):
    id = fields.Int()
    nombre_original = fields.Str()
    tipo_mime = fields.Str()
    tamano_bytes = fields.Int()
    creado_en = fields.DateTime()

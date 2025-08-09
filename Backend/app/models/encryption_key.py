from datetime import datetime
from ..extensions import db

class ClaveCifradoUsuario(db.Model):
    __tablename__ = "claves_cifrado_usuarios"

    id = db.Column(db.BigInteger, primary_key=True)
    usuario_id = db.Column(db.BigInteger, db.ForeignKey("usuarios.id"), index=True, nullable=False)
    etiqueta = db.Column(db.String(100), nullable=False)
    uek_envuelta = db.Column(db.LargeBinary, nullable=False)  # UEK cifrada con KEK (derivada de MASTER_SECRET)
    kdf = db.Column(db.String(50), nullable=False, default="argon2id")
    kdf_salt = db.Column(db.LargeBinary, nullable=True)
    kdf_parametros = db.Column(db.JSON, nullable=True)
    activa = db.Column(db.Boolean, default=True, nullable=False)
    creada_en = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    rotada_en = db.Column(db.DateTime, nullable=True)

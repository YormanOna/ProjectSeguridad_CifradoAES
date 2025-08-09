from datetime import datetime
from ..extensions import db

class Usuario(db.Model):
    __tablename__ = "usuarios"

    id = db.Column(db.BigInteger, primary_key=True)
    correo = db.Column(db.String(255), unique=True, nullable=False, index=True)
    nombre_usuario = db.Column(db.String(80), unique=True, nullable=False)
    contrasena_hash = db.Column(db.String(255), nullable=False)
    activo = db.Column(db.Boolean, default=True, nullable=False)
    creado_en = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    actualizado_en = db.Column(db.DateTime, onupdate=datetime.utcnow)

    roles = db.relationship("Rol", secondary="usuarios_roles", backref="usuarios", lazy="joined")
    claves = db.relationship("ClaveCifradoUsuario", backref="usuario", lazy=True)

from datetime import datetime
from ..extensions import db

usuarios_roles = db.Table(
    "usuarios_roles",
    db.Column("usuario_id", db.BigInteger, db.ForeignKey("usuarios.id"), primary_key=True),
    db.Column("rol_id", db.BigInteger, db.ForeignKey("roles.id"), primary_key=True),
)

class Rol(db.Model):
    __tablename__ = "roles"

    id = db.Column(db.BigInteger, primary_key=True)
    nombre = db.Column(db.String(50), unique=True, nullable=False)
    descripcion = db.Column(db.String(255))
    creado_en = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

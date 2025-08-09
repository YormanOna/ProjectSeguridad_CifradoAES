from datetime import datetime
from ..extensions import db

class RegistroAuditoria(db.Model):
    __tablename__ = "registros_auditoria"

    id = db.Column(db.BigInteger, primary_key=True)
    actor_usuario_id = db.Column(db.BigInteger, db.ForeignKey("usuarios.id"), nullable=True, index=True)
    accion = db.Column(db.String(50), nullable=False)  # LOGIN, SUBIR_ARCHIVO, CIFRAR, DESCIFRAR, ROTAR_CLAVE
    tipo_recurso = db.Column(db.String(30), nullable=True)  # ARCHIVO, CLAVE, USUARIO
    recurso_id = db.Column(db.String(100), nullable=True)
    ip = db.Column(db.String(64), nullable=True)
    agente_usuario = db.Column(db.String(255), nullable=True)
    estado = db.Column(db.String(20), nullable=False, default="SUCCESS")
    detalles = db.Column(db.JSON, nullable=True)
    creado_en = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

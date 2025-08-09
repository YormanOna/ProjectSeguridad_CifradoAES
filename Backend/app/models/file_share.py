from datetime import datetime
from ..extensions import db

class ArchivoCompartido(db.Model):
    __tablename__ = "archivos_compartidos"

    id = db.Column(db.BigInteger, primary_key=True)
    archivo_id = db.Column(db.BigInteger, db.ForeignKey("archivos.id"), index=True, nullable=False)
    usuario_destino_id = db.Column(db.BigInteger, db.ForeignKey("usuarios.id"), index=True, nullable=False)
    dek_envuelta_para_destino = db.Column(db.LargeBinary, nullable=False)
    permisos = db.Column(db.String(20), nullable=False, default="read")  # read | owner
    creado_en = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

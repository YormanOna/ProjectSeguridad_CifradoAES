from datetime import datetime
from ..extensions import db

class Archivo(db.Model):
    __tablename__ = "archivos"

    id = db.Column(db.BigInteger, primary_key=True)
    propietario_id = db.Column(db.BigInteger, db.ForeignKey("usuarios.id"), index=True, nullable=False)
    nombre_original = db.Column(db.String(255), nullable=False)
    tipo_mime = db.Column(db.String(120), nullable=True)
    tamano_bytes = db.Column(db.BigInteger, nullable=True)

    backend_almacenamiento = db.Column(db.String(20), nullable=False, default="db_blob")  # db_blob | fs
    ruta_almacenamiento = db.Column(db.String(500), nullable=True)
    blob_cifrado = db.Column(db.LargeBinary, nullable=True)

    dek_envuelta = db.Column(db.LargeBinary, nullable=False)  # DEK envuelta con UEK activa
    cifrado = db.Column(db.String(50), nullable=False, default="AES-256-GCM")
    nonce = db.Column(db.LargeBinary, nullable=False)
    tag = db.Column(db.LargeBinary, nullable=False)
    hash_verificacion = db.Column(db.String(128), nullable=True)  # Hash SHA-256 del archivo original

    metadatos = db.Column(db.JSON, nullable=True)
    creado_en = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    actualizado_en = db.Column(db.DateTime, onupdate=datetime.utcnow)

    propietario = db.relationship("Usuario", backref="archivos", lazy=True)

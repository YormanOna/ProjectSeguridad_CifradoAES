from datetime import datetime
from ..extensions import db

class TokenRefresco(db.Model):
    __tablename__ = "tokens_refresco"

    id = db.Column(db.BigInteger, primary_key=True)
    usuario_id = db.Column(db.BigInteger, db.ForeignKey("usuarios.id"), index=True, nullable=False)
    token_hash = db.Column(db.String(255), nullable=False, index=True)
    expira_en = db.Column(db.DateTime, nullable=False)
    revocado = db.Column(db.Boolean, default=False, nullable=False)
    creado_en = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

class JWTListaNegra(db.Model):
    __tablename__ = "jwt_lista_negra"

    id = db.Column(db.BigInteger, primary_key=True)
    jti = db.Column(db.String(255), unique=True, nullable=False, index=True)
    expira_en = db.Column(db.DateTime, nullable=False)

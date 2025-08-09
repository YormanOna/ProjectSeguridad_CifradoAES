from typing import Optional
from ..extensions import db
from ..models.encryption_key import ClaveCifradoUsuario

class ClaveRepositorio:
    @staticmethod
    def crear(clave: ClaveCifradoUsuario) -> ClaveCifradoUsuario:
        db.session.add(clave)
        db.session.commit()
        return clave

    @staticmethod
    def obtener_activa_por_usuario(usuario_id: int) -> Optional[ClaveCifradoUsuario]:
        return ClaveCifradoUsuario.query.filter_by(usuario_id=usuario_id, activa=True).first()

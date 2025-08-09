from typing import Optional
from ..extensions import db
from ..models.user import Usuario

class UsuarioRepositorio:
    @staticmethod
    def crear(usuario: Usuario) -> Usuario:
        db.session.add(usuario)
        db.session.commit()
        return usuario

    @staticmethod
    def buscar_por_correo(correo: str) -> Optional[Usuario]:
        from sqlalchemy.orm import joinedload
        return Usuario.query.options(joinedload(Usuario.roles)).filter_by(correo=correo).first()

    @staticmethod
    def buscar_por_nombre_usuario(nombre_usuario: str) -> Optional[Usuario]:
        return Usuario.query.filter_by(nombre_usuario=nombre_usuario).first()

    @staticmethod
    def buscar_por_id(uid: int) -> Optional[Usuario]:
        return Usuario.query.get(uid)

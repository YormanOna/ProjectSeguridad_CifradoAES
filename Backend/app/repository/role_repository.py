from ..extensions import db
from ..models.role import Rol

class RolRepositorio:
    @staticmethod
    def obtener_o_crear(nombre: str, descripcion: str | None = None) -> Rol:
        rol = Rol.query.filter_by(nombre=nombre).first()
        if not rol:
            rol = Rol(nombre=nombre, descripcion=descripcion)
            db.session.add(rol)
            db.session.commit()
        return rol

from ..repository.user_repository import UsuarioRepositorio
from ..models.user import Usuario

class UsuarioServicio:
    @staticmethod
    def obtener_por_id(uid: int) -> Usuario | None:
        return UsuarioRepositorio.buscar_por_id(uid)

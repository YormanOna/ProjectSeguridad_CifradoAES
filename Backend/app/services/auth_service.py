from datetime import datetime, timedelta
from flask_jwt_extended import create_access_token, create_refresh_token
from ..extensions import bcrypt
from ..models.user import Usuario
from ..repository.user_repository import UsuarioRepositorio
from ..repository.role_repository import RolRepositorio

class AutenticacionServicio:
    @staticmethod
    def registrar_usuario(correo: str, nombre_usuario: str, contrasena: str, es_admin: bool = False) -> Usuario:
        hash_ = bcrypt.generate_password_hash(contrasena).decode("utf-8")
        usuario = Usuario(correo=correo, nombre_usuario=nombre_usuario, contrasena_hash=hash_)
        UsuarioRepositorio.crear(usuario)

        rol_user = RolRepositorio.obtener_o_crear("USER", "Rol de usuario")
        usuario.roles.append(rol_user)

        if es_admin:
            rol_admin = RolRepositorio.obtener_o_crear("ADMIN", "Rol administrador")
            usuario.roles.append(rol_admin)
        return usuario

    @staticmethod
    def verificar_credenciales(correo: str, contrasena: str) -> Usuario | None:
        usuario = UsuarioRepositorio.buscar_por_correo(correo)
        if usuario and bcrypt.check_password_hash(usuario.contrasena_hash, contrasena) and usuario.activo:
            return usuario
        return None

    @staticmethod
    def emitir_tokens(usuario: Usuario) -> dict:
        identidad = {"id": usuario.id, "usuario": usuario.nombre_usuario, "roles": [r.nombre for r in usuario.roles]}
        access = create_access_token(identity=identidad, additional_claims={"roles": identidad["roles"]})
        refresh = create_refresh_token(identity=identidad)
        return {"access_token": access, "refresh_token": refresh, "expira_en": int((datetime.utcnow() + timedelta(minutes=30)).timestamp())}

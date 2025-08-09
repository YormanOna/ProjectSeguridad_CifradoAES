from datetime import datetime, timedelta, timezone
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

        # Obtener o crear roles
        rol_user = RolRepositorio.obtener_o_crear("USER", "Rol de usuario")
        usuario.roles.append(rol_user)
        print(f"🔧 Rol USER asignado a {nombre_usuario}")

        if es_admin:
            rol_admin = RolRepositorio.obtener_o_crear("ADMIN", "Rol administrador")
            usuario.roles.append(rol_admin)
            print(f"🔧 Rol ADMIN asignado a {nombre_usuario}")
        
        # Asegurar que se guarden los cambios en la base de datos
        from ..extensions import db
        db.session.commit()
        
        # Verificar que los roles se guardaron
        db.session.refresh(usuario)
        roles_finales = [r.nombre for r in usuario.roles]
        print(f"🔧 Roles finales de {nombre_usuario}: {roles_finales}")
        
        return usuario

    @staticmethod
    def verificar_credenciales(correo: str, contrasena: str) -> Usuario | None:
        usuario = UsuarioRepositorio.buscar_por_correo(correo)
        if usuario and bcrypt.check_password_hash(usuario.contrasena_hash, contrasena) and usuario.activo:
            return usuario
        return None

    @staticmethod
    def emitir_tokens(usuario: Usuario) -> dict:
        # Convertir el ID del usuario a string (requerido por Flask-JWT-Extended)
        identidad = str(usuario.id)
        roles = [r.nombre for r in usuario.roles]
        
        # Debug: imprimir roles del usuario
        print(f"Usuario: {usuario.nombre_usuario} - Roles: {roles}")
        print(f"🔧 JWT identity será: {identidad} (tipo: {type(identidad)})")
        
        # Usar timezone aware datetime para evitar problemas con timestamps
        ahora = datetime.now(timezone.utc)
        expiracion = ahora + timedelta(minutes=30)
        
        access = create_access_token(identity=identidad, additional_claims={"roles": roles, "usuario": usuario.nombre_usuario})
        refresh = create_refresh_token(identity=identidad)
        return {"access_token": access, "refresh_token": refresh, "expira_en": int(expiracion.timestamp())}

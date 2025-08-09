from functools import wraps
from typing import Callable
from flask import jsonify
from flask_jwt_extended import (
    verify_jwt_in_request,
    get_jwt,
    get_jwt_identity,
)

# Decorador para exigir uno o varios roles en el JWT
def requiere_roles(*roles_requeridos: str) -> Callable:
    """
    Uso:
        @jwt_required()
        @requiere_roles("ADMIN")            # un rol
        @requiere_roles("USER", "ADMIN")    # cualquiera de esos roles
    """
    def _wrapper(fn: Callable) -> Callable:
        @wraps(fn)
        def _decorated(*args, **kwargs):
            # Verifica que el JWT venga en la petición (Bearer <token>)
            verify_jwt_in_request()
            claims = get_jwt() or {}
            roles = claims.get("roles", [])
            if not any(r in roles for r in roles_requeridos):
                return jsonify({"mensaje": "No autorizado. Rol requerido.", "roles_requeridos": roles_requeridos}), 403
            return fn(*args, **kwargs)
        return _decorated
    return _wrapper


# Helper opcional para obtener identidad desde cualquier endpoint protegido
def obtener_identidad_actual() -> dict | None:
    """
    Devuelve el objeto identidad que pusiste al crear el token (id, usuario, roles).
    """
    try:
        verify_jwt_in_request(optional=True)
        return get_jwt_identity()
    except Exception:
        return None


# Callbacks de error para respuestas consistentes del JWT (regístralos en app/__init__.py)
def registrar_callbacks_jwt(jwt_manager) -> None:
    """
    Llama a esta función DESPUÉS de jwt.init_app(app) en tu app factory:
        from .security.jwt_utils import registrar_callbacks_jwt
        ...
        jwt.init_app(app)
        registrar_callbacks_jwt(jwt)

    Esto configura respuestas JSON para errores comunes de JWT.
    """
    @jwt_manager.unauthorized_loader
    def _sin_autorizacion(mensaje: str):
        return jsonify({"mensaje": "Token no enviado o cabecera inválida", "detalle": mensaje}), 401

    @jwt_manager.invalid_token_loader
    def _token_invalido(motivo: str):
        return jsonify({"mensaje": "Token inválido", "detalle": motivo}), 401

    @jwt_manager.expired_token_loader
    def _token_expirado(cabecera, datos):
        return jsonify({"mensaje": "Token expirado", "tipo": datos.get("type", "access")}), 401

    @jwt_manager.needs_fresh_token_loader
    def _token_no_fresco(cabecera, datos):
        return jsonify({"mensaje": "Se requiere un token fresco"}), 401

    @jwt_manager.revoked_token_loader
    def _token_revocado(cabecera, datos):
        return jsonify({"mensaje": "Token revocado"}), 401

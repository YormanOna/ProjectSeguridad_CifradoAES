from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from ..models.user import Usuario
from ..repository.user_repository import UsuarioRepositorio

bp = Blueprint('debug', __name__, url_prefix='/debug')

@bp.get("/init-data")
def inicializar_datos():
    """Endpoint para inicializar datos básicos manualmente"""
    try:
        from ..utils.init_data import inicializar_datos_base
        inicializar_datos_base()
        return jsonify({"message": "Datos inicializados correctamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.get("/simple")
@jwt_required()
def debug_simple():
    """Endpoint simple solo con JWT, sin roles"""
    try:
        identity = get_jwt_identity()
        return jsonify({"message": "JWT funcionando", "identity": identity}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.get("/token-info")
@jwt_required()
def debug_token():
    """Endpoint temporal para debuguear información del token"""
    try:
        identity = get_jwt_identity()
        claims = get_jwt()
        
        # Buscar usuario en BD
        usuario = UsuarioRepositorio.buscar_por_id(identity)
        roles_bd = [r.nombre for r in usuario.roles] if usuario else []
        
        return jsonify({
            "identity": identity,
            "claims": claims,
            "usuario_bd": usuario.nombre_usuario if usuario else None,
            "roles_bd": roles_bd,
            "roles_token": claims.get("roles", [])
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

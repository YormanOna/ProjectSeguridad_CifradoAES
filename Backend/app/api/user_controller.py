from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..security.permissions import requiere_usuario
from ..services.user_service import UsuarioServicio
from ..schemas.user_schemas import UsuarioSchema

bp = Blueprint("usuarios", __name__)
usuario_schema = UsuarioSchema()

@bp.get("/yo")
@jwt_required()
@requiere_usuario
def yo():
    identidad = get_jwt_identity()
    u = UsuarioServicio.obtener_por_id(identidad["id"])
    return usuario_schema.dump(u), 200

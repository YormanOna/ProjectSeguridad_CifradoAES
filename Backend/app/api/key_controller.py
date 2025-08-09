from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..security.permissions import requiere_usuario
from ..services.key_service import ClaveServicio
from ..schemas.key_schemas import ClaveSchema
from ..repository.encryption_key_repository import ClaveRepositorio

bp = Blueprint("claves", __name__)
clave_schema = ClaveSchema()

@bp.post("/generar")
@jwt_required()
@requiere_usuario
def generar():
    identidad = get_jwt_identity()
    clave = ClaveServicio.generar_uek_para_usuario(identidad["id"])
    return clave_schema.dump(clave), 201

@bp.get("/activa")
@jwt_required()
@requiere_usuario
def activa():
    identidad = get_jwt_identity()
    clave = ClaveRepositorio.obtener_activa_por_usuario(identidad["id"])
    if not clave:
        return jsonify({"mensaje": "No hay clave activa"}), 404
    return clave_schema.dump(clave), 200

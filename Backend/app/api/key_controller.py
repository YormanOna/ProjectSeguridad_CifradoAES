from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
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
    usuario_id = int(get_jwt_identity())  # Convertir de string a int
    
    # Obtener datos tanto de JSON como de form-data
    if request.is_json:
        data = request.get_json() or {}
    else:
        data = request.form.to_dict() or {}
    
    etiqueta = data.get('etiqueta', f'Clave-{usuario_id}-{datetime.now().strftime("%Y%m%d-%H%M%S")}')
    
    clave = ClaveServicio.generar_uek_para_usuario(usuario_id, etiqueta=etiqueta)
    return clave_schema.dump(clave), 201

@bp.get("/activa")
@jwt_required()
@requiere_usuario
def activa():
    usuario_id = int(get_jwt_identity())  # Convertir de string a int
    
    clave = ClaveRepositorio.obtener_activa_por_usuario(usuario_id)
    if not clave:
        return jsonify({"mensaje": "No hay clave activa"}), 404
    return clave_schema.dump(clave), 200

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from ..security.permissions import requiere_admin
from ..models.audit_log import RegistroAuditoria
from ..schemas.audit_schemas import AuditoriaSchema

bp = Blueprint("auditoria", __name__)
schema = AuditoriaSchema(many=True)

@bp.get("/")
@jwt_required()
@requiere_admin
def listar():
    registros = RegistroAuditoria.query.order_by(RegistroAuditoria.creado_en.desc()).limit(200).all()
    return schema.dump(registros), 200

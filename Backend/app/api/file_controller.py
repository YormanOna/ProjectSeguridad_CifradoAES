from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..security.permissions import requiere_usuario
from ..services.file_service import ArchivoServicio
from ..repository.file_repository import ArchivoRepositorio
from ..schemas.file_schemas import ArchivoRespuestaSchema
from io import BytesIO

bp = Blueprint("archivos", __name__)
resp_schema = ArchivoRespuestaSchema()

@bp.post("/cifrar")
@jwt_required()
@requiere_usuario
def cifrar():
    identidad = get_jwt_identity()
    if "archivo" not in request.files:
        return jsonify({"mensaje": "Falta archivo"}), 400
    archivo_subido = request.files["archivo"]
    data = archivo_subido.read()
    arch = ArchivoServicio.cifrar_y_guardar(
        propietario_id=identidad["id"],
        nombre=archivo_subido.filename,
        tipo_mime=archivo_subido.mimetype,
        data=data,
        ip=request.remote_addr,
        user_agent=request.headers.get("User-Agent")
    )
    return resp_schema.dump(arch), 201

@bp.get("/descifrar/<int:archivo_id>")
@jwt_required()
@requiere_usuario
def descifrar(archivo_id: int):
    identidad = get_jwt_identity()
    arch = ArchivoRepositorio.buscar_por_id(archivo_id)
    if not arch or arch.propietario_id != identidad["id"]:
        return jsonify({"mensaje": "No encontrado o sin permiso"}), 404
    datos = ArchivoServicio.descargar_y_descifrar(arch, identidad["id"])
    return send_file(BytesIO(datos), as_attachment=True, download_name=arch.nombre_original, mimetype=arch.tipo_mime or "application/octet-stream")

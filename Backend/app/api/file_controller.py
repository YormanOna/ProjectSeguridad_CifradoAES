from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..security.permissions import requiere_usuario
from ..services.file_service import ArchivoServicio
from ..repository.file_repository import ArchivoRepositorio
from ..schemas.file_schemas import ArchivoRespuestaSchema
from ..models.file import Archivo
from io import BytesIO

bp = Blueprint("archivos", __name__)
resp_schema = ArchivoRespuestaSchema()
resp_schema_many = ArchivoRespuestaSchema(many=True)

@bp.post("/cifrar")
@jwt_required()
@requiere_usuario
def cifrar():
    usuario_id = int(get_jwt_identity())  # Convertir de string a int
    
    if "archivo" not in request.files:
        return jsonify({"mensaje": "Falta archivo"}), 400
        
    archivo_subido = request.files["archivo"]
    data = archivo_subido.read()
    arch = ArchivoServicio.cifrar_y_guardar(
        propietario_id=usuario_id,
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
    usuario_id = int(get_jwt_identity())  # Convertir de string a int
    
    arch = ArchivoRepositorio.buscar_por_id(archivo_id)
    if not arch or arch.propietario_id != usuario_id:
        return jsonify({"mensaje": "No encontrado o sin permiso"}), 404
    datos = ArchivoServicio.descargar_y_descifrar(arch, usuario_id)
    return send_file(BytesIO(datos), as_attachment=True, download_name=arch.nombre_original, mimetype=arch.tipo_mime or "application/octet-stream")

@bp.get("/<int:archivo_id>")
@jwt_required()
@requiere_usuario
def obtener_archivo(archivo_id: int):
    """Obtener detalles de un archivo específico"""
    usuario_id = int(get_jwt_identity())
    
    arch = ArchivoRepositorio.buscar_por_id(archivo_id)
    if not arch or arch.propietario_id != usuario_id:
        return jsonify({"mensaje": "No encontrado o sin permiso"}), 404
    
    return jsonify(resp_schema.dump(arch)), 200

@bp.get("/")
@jwt_required()
@requiere_usuario
def listar_archivos():
    """Obtener lista de archivos del usuario actual"""
    usuario_id = int(get_jwt_identity())  # Convertir de string a int
    
    try:
        # Obtener archivos del usuario
        archivos = Archivo.query.filter_by(propietario_id=usuario_id).order_by(Archivo.creado_en.desc()).all()
        
        # Serializar usando el schema
        return jsonify(resp_schema_many.dump(archivos)), 200
        
    except Exception as e:
        return jsonify({"mensaje": f"Error obteniendo archivos: {str(e)}"}), 500

@bp.get("/descargar-cifrado/<int:archivo_id>")
@jwt_required()
@requiere_usuario
def descargar_cifrado(archivo_id: int):
    """Descargar archivo cifrado sin descifrar"""
    usuario_id = int(get_jwt_identity())  # Convertir de string a int
    
    arch = ArchivoRepositorio.buscar_por_id(archivo_id)
    if not arch or arch.propietario_id != usuario_id:
        return jsonify({"mensaje": "No encontrado o sin permiso"}), 404
    
    try:
        # Obtener datos cifrados directamente del storage
        datos_cifrados = ArchivoServicio.obtener_datos_cifrados(arch)
        nombre_cifrado = f"{arch.nombre_original}.encrypted"
        
        return send_file(
            BytesIO(datos_cifrados), 
            as_attachment=True, 
            download_name=nombre_cifrado, 
            mimetype="application/octet-stream"
        )
    except Exception as e:
        return jsonify({"mensaje": f"Error descargando archivo cifrado: {str(e)}"}), 500

@bp.delete("/<int:archivo_id>")
@jwt_required()
@requiere_usuario
def eliminar_archivo(archivo_id: int):
    """Eliminar archivo por ID (solo el propietario)"""
    usuario_id = int(get_jwt_identity())
    
    arch = ArchivoRepositorio.buscar_por_id(archivo_id)
    if not arch or arch.propietario_id != usuario_id:
        return jsonify({"mensaje": "No encontrado o sin permiso"}), 404
    
    try:
        # Eliminar archivo de la base de datos
        ArchivoRepositorio.eliminar(arch)
        return jsonify({"mensaje": "Archivo eliminado exitosamente"}), 200
    except Exception as e:
        return jsonify({"mensaje": f"Error eliminando archivo: {str(e)}"}), 500

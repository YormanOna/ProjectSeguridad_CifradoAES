from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from sqlalchemy import func
from ..models.file import Archivo
from ..models.encryption_key import ClaveCifradoUsuario
from ..models.audit_log import RegistroAuditoria
from ..models.user import Usuario
from ..extensions import db
from ..security.permissions import requiere_usuario

bp = Blueprint('dashboard', __name__, url_prefix='/dashboard')

@bp.get("/stats")
@jwt_required()
@requiere_usuario
def obtener_estadisticas():
    """Obtener estadísticas del dashboard para el usuario actual"""
    try:
        usuario_id = int(get_jwt_identity())  # Convertir de string a int
        
        # Estadísticas de archivos del usuario
        total_archivos = Archivo.query.filter_by(propietario_id=usuario_id).count()
        archivos_cifrados = total_archivos  # Todos están cifrados
        
        # Claves activas del usuario
        claves_activas = ClaveCifradoUsuario.query.filter_by(
            usuario_id=usuario_id,
            activa=True
        ).count()
        
        # Espacio usado por el usuario
        espacio_usado_bytes = db.session.query(func.sum(Archivo.tamano_bytes))\
            .filter_by(propietario_id=usuario_id).scalar() or 0
        espacio_usado = f"{espacio_usado_bytes / (1024**3):.2f} GB" if espacio_usado_bytes > 0 else "0 GB"
        
        # Última actividad
        ultima_actividad = RegistroAuditoria.query.filter_by(actor_usuario_id=usuario_id)\
            .order_by(RegistroAuditoria.creado_en.desc()).first()
        
        ultima_actividad_texto = "Sin actividad"
        if ultima_actividad:
            delta = datetime.utcnow() - ultima_actividad.creado_en
            if delta.days > 0:
                ultima_actividad_texto = f"Hace {delta.days} días"
            elif delta.seconds > 3600:
                horas = delta.seconds // 3600
                ultima_actividad_texto = f"Hace {horas} horas"
            elif delta.seconds > 60:
                minutos = delta.seconds // 60
                ultima_actividad_texto = f"Hace {minutos} minutos"
            else:
                ultima_actividad_texto = "Hace unos segundos"
        
        return jsonify({
            "totalArchivos": total_archivos,
            "archivosCifrados": archivos_cifrados,
            "clavesActivas": claves_activas,
            "ultimaActividad": ultima_actividad_texto,
            "espacioUsado": espacio_usado,
            "sistemaEstado": "Operativo"
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Error obteniendo estadísticas: {str(e)}"}), 500

# COMENTAMOS TODA LA FUNCIÓN DE ACTIVITY QUE ESTÁ CAUSANDO PROBLEMAS
# def obtener_actividad_reciente():
#     """Obtener actividad reciente del usuario"""
#     try:
#         usuario_id = int(get_jwt_identity())  # Convertir de string a int
#         limit = 5  # Últimas 5 actividades
#         
#         actividades = RegistroAuditoria.query.filter_by(actor_usuario_id=usuario_id)\
#             .order_by(RegistroAuditoria.creado_en.desc())\
#             .limit(limit).all()
#         
#         resultado = []
#         for actividad in actividades:
#             # Calcular tiempo relativo
#             delta = datetime.utcnow() - actividad.creado_en
#             if delta.days > 0:
#                 tiempo = f"Hace {delta.days} días"
#             elif delta.seconds > 3600:
#                 horas = delta.seconds // 3600
#                 tiempo = f"Hace {horas} horas"
#             elif delta.seconds > 60:
#                 minutos = delta.seconds // 60
#                 tiempo = f"Hace {minutos} min"
#             else:
#                 tiempo = "Hace unos segundos"
#             
#             # Mapear acción a texto legible
#             accion_map = {
#                 'SUBIR_ARCHIVO': 'Archivo cifrado',
#                 'DESCARGAR_ARCHIVO': 'Descarga segura',
#                 'GENERAR_CLAVE': 'Clave generada',
#                 'ROTAR_CLAVE': 'Clave rotada',
#                 'LOGIN': 'Inicio de sesión',
#                 'CIFRAR': 'Archivo cifrado',
#                 'DESCIFRAR': 'Archivo descifrado'
#             }
#             
#             accion_texto = accion_map.get(actividad.accion, actividad.accion)
#             
#             # Determinar nombre del archivo o recurso
#             archivo_nombre = "Operación del sistema"
#             if actividad.tipo_recurso == 'ARCHIVO' and actividad.recurso_id:
#                 archivo = Archivo.query.filter_by(id=actividad.recurso_id).first()
#                 if archivo:
#                     archivo_nombre = archivo.nombre_original
#             elif actividad.tipo_recurso == 'CLAVE' and actividad.recurso_id:
#                 archivo_nombre = f"UEK-{actividad.recurso_id[:8]}"
#             
#             resultado.append({
#                 "id": actividad.id,
#                 "action": accion_texto,
#                 "file": archivo_nombre,
#                 "time": tiempo,
#                 "status": "success" if actividad.estado == "SUCCESS" else "warning"
#             })
#         
#         return jsonify(resultado), 200
#         
#     except Exception as e:
#         return jsonify({"error": f"Error obteniendo actividad: {str(e)}"}), 500

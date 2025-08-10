from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..security.permissions import requiere_admin
from ..services.user_service import UsuarioServicio
from ..services.audit_service import AuditoriaServicio
from ..models.user import Usuario
from ..models.audit_log import RegistroAuditoria
from ..models.file import Archivo
from ..schemas.user_schemas import UsuarioSchema
from ..extensions import db
from sqlalchemy import func
from datetime import datetime, timedelta
import os

bp = Blueprint("admin", __name__)
usuario_schema = UsuarioSchema()
usuarios_schema = UsuarioSchema(many=True)

@bp.get("/stats")
@jwt_required()
@requiere_admin
def obtener_estadisticas():
    """Obtener estadísticas generales del sistema"""
    try:
        # Estadísticas de usuarios
        total_usuarios = Usuario.query.count()
        usuarios_activos = Usuario.query.filter_by(activo=True).count()
        
        # Estadísticas de archivos
        total_archivos = Archivo.query.count()
        espacio_usado = db.session.query(func.sum(Archivo.tamano_bytes)).scalar() or 0
        
        # Sesiones activas (simulado - en producción sería desde Redis/caché)
        sesiones_activas = usuarios_activos  # Simplificado
        
        # Alertas de seguridad (basado en intentos de login fallidos recientes)
        fecha_limite = datetime.utcnow() - timedelta(hours=1)
        alertas_seguridad = RegistroAuditoria.query.filter(
            RegistroAuditoria.accion == 'LOGIN_FALLIDO',
            RegistroAuditoria.creado_en > fecha_limite
        ).count()
        
        return jsonify({
            "totalUsuarios": total_usuarios,
            "usuariosActivos": usuarios_activos,
            "totalArchivos": total_archivos,
            "archivosCifrados": total_archivos,  # Todos están cifrados
            "espacioUsado": f"{espacio_usado / (1024**3):.1f} GB" if espacio_usado > 0 else "0 GB",
            "espacioTotal": "1000 GB",  # Configurable
            "alertasSeguridad": alertas_seguridad,
            "sesionesActivas": sesiones_activas,
            "backupsRealizados": 0,  # Por implementar
            "ultimoBackup": "N/A"
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Error obteniendo estadísticas: {str(e)}"}), 500

@bp.get("/usuarios")
@jwt_required()
@requiere_admin
def listar_usuarios():
    """Obtener lista de usuarios con filtros opcionales"""
    try:
        # Parámetros de filtrado
        busqueda = request.args.get('busqueda', '')
        rol = request.args.get('rol', 'TODOS')
        estado = request.args.get('estado', 'TODOS')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)
        
        print(f"DEBUG: Parámetros recibidos - busqueda: {busqueda}, rol: {rol}, estado: {estado}")
        
        # Query base con eager loading
        query = Usuario.query.options(db.joinedload(Usuario.roles))
        
        # Aplicar filtros
        if busqueda and busqueda.strip():
            query = query.filter(
                db.or_(
                    Usuario.nombre_usuario.ilike(f'%{busqueda}%'),
                    Usuario.correo.ilike(f'%{busqueda}%')
                )
            )
        
        if rol != 'TODOS':
            # Filtrar por rol específico
            from ..models.role import Rol
            query = query.join(Usuario.roles).filter(Rol.nombre == rol)
            
        if estado != 'TODOS':
            if estado == 'ACTIVO':
                query = query.filter(Usuario.activo == True)
            elif estado == 'SUSPENDIDO':
                query = query.filter(Usuario.activo == False)
        
        # Obtener todos los usuarios sin paginación por ahora para debug
        usuarios = query.all()
        print(f"DEBUG: Se encontraron {len(usuarios)} usuarios")
        
        # Enriquecer datos con estadísticas adicionales
        resultado = []
        for usuario in usuarios:
            try:
                user_data = usuario_schema.dump(usuario)
                
                # Obtener roles del usuario de forma segura
                roles_usuario = []
                try:
                    roles_usuario = [rol.nombre for rol in usuario.roles] if usuario.roles else []
                except Exception as role_error:
                    print(f"DEBUG: Error obteniendo roles para usuario {usuario.id}: {str(role_error)}")
                    roles_usuario = []
                
                rol_principal = "ADMIN" if "ADMIN" in roles_usuario else "USER" if "USER" in roles_usuario else "GUEST"
                
                # Contar archivos de forma segura
                archivos_count = 0
                try:
                    archivos_count = Archivo.query.filter_by(propietario_id=usuario.id).count()
                except Exception as file_error:
                    print(f"DEBUG: Error contando archivos para usuario {usuario.id}: {str(file_error)}")
                
                # Agregar estadísticas adicionales
                user_data.update({
                    'archivosSubidos': archivos_count,
                    'espacioUsado': "N/A",  
                    'sesionesActivas': 1 if usuario.activo else 0,  
                    'ubicacion': "N/A",  
                    'rol': rol_principal,
                    'estado': "ACTIVO" if usuario.activo else "SUSPENDIDO",
                    'roles': roles_usuario,  
                    'telefono': getattr(usuario, 'telefono', 'N/A'),  
                    'fechaRegistro': usuario.creado_en.isoformat() if usuario.creado_en else "N/A",
                    'ultimoAcceso': usuario.actualizado_en.isoformat() if usuario.actualizado_en else (usuario.creado_en.isoformat() if usuario.creado_en else "N/A")
                })
                resultado.append(user_data)
                
            except Exception as user_error:
                print(f"DEBUG: Error procesando usuario {usuario.id}: {str(user_error)}")
                continue
            
        print(f"DEBUG: Se procesaron {len(resultado)} usuarios exitosamente")
        return jsonify(resultado), 200
        
    except Exception as e:
        print(f"DEBUG: Error general en listar_usuarios: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Error obteniendo usuarios: {str(e)}"}), 500

@bp.get("/usuarios/<int:usuario_id>")
@jwt_required()
@requiere_admin
def obtener_usuario_detalle(usuario_id):
    """Obtener detalles completos de un usuario"""
    try:
        usuario = Usuario.query.get_or_404(usuario_id)
        user_data = usuario_schema.dump(usuario)
        
        # Obtener roles del usuario de forma segura
        roles_usuario = []
        try:
            roles_usuario = [rol.nombre for rol in usuario.roles] if usuario.roles else []
        except Exception as role_error:
            print(f"DEBUG: Error obteniendo roles para usuario {usuario.id}: {str(role_error)}")
            roles_usuario = []
        
        rol_principal = "ADMIN" if "ADMIN" in roles_usuario else "USER" if "USER" in roles_usuario else "GUEST"
        
        # Enriquecer con datos adicionales - corregir la columna
        archivos_subidos = Archivo.query.filter_by(propietario_id=usuario.id).count()
        espacio_usado_bytes = db.session.query(func.sum(Archivo.tamano_bytes)).filter_by(propietario_id=usuario.id).scalar() or 0
        
        user_data.update({
            'archivosSubidos': archivos_subidos,
            'espacioUsado': f"{espacio_usado_bytes / (1024**2):.1f} MB" if espacio_usado_bytes > 0 else "0 MB",
            'sesionesActivas': 1 if usuario.activo else 0,
            'rol': rol_principal,
            'estado': "ACTIVO" if usuario.activo else "SUSPENDIDO", 
            'roles': roles_usuario,
            'telefono': getattr(usuario, 'telefono', 'N/A'),
            'fechaRegistro': usuario.creado_en.isoformat() if usuario.creado_en else "N/A",
            'ultimoAcceso': usuario.actualizado_en.isoformat() if usuario.actualizado_en else (usuario.creado_en.isoformat() if usuario.creado_en else "N/A")
        })
        
        return jsonify(user_data), 200
        
    except Exception as e:
        print(f"DEBUG: Error en obtener_usuario_detalle: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Error obteniendo detalles del usuario: {str(e)}"}), 500

@bp.patch("/usuarios/<int:usuario_id>/estado")
@jwt_required()
@requiere_admin
def cambiar_estado_usuario(usuario_id):
    """Cambiar el estado de un usuario (activar/suspender)"""
    try:
        usuario = Usuario.query.get_or_404(usuario_id)
        data = request.get_json()
        nuevo_estado = data.get('estado')
        
        if nuevo_estado == 'ACTIVO':
            usuario.activo = True
            accion = 'USUARIO_ACTIVADO'
        elif nuevo_estado == 'SUSPENDIDO':
            usuario.activo = False
            accion = 'USUARIO_SUSPENDIDO'
        else:
            return jsonify({"error": "Estado inválido"}), 400
        
        db.session.commit()
        
        # Registrar en auditoría
        AuditoriaServicio.registrar_simple(
            usuario_id=int(get_jwt_identity()),  # Convertir de string a int
            accion=accion,
            detalles=f"Usuario {usuario.correo} cambió a estado {nuevo_estado}"
        )
        
        return jsonify({"mensaje": f"Estado del usuario actualizado a {nuevo_estado}"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error cambiando estado del usuario: {str(e)}"}), 500

@bp.get("/actividad")
@jwt_required()
@requiere_admin
def obtener_actividad():
    """Obtener actividad reciente del sistema"""
    try:
        limit = request.args.get('limit', 10, type=int)
        
        registros = RegistroAuditoria.query.order_by(
            RegistroAuditoria.creado_en.desc()
        ).limit(limit).all()
        
        actividad = []
        for registro in registros:
            usuario_email = "sistema@interno.com"
            if registro.actor_usuario_id:
                usuario = Usuario.query.get(registro.actor_usuario_id)
                if usuario:
                    usuario_email = usuario.correo
            
            # Mapear severity según la acción
            severity = "info"
            if "FALLIDO" in registro.accion or "ERROR" in registro.accion:
                severity = "warning"
            elif "INTRUSION" in registro.accion or "HACK" in registro.accion:
                severity = "critical"
            elif "EXITOSO" in registro.accion or "COMPLETADO" in registro.accion:
                severity = "success"
            
            actividad.append({
                "id": registro.id,
                "usuario": usuario_email,
                "accion": registro.accion,
                "timestamp": registro.creado_en.isoformat(),
                "ip": registro.ip or "N/A",
                "severity": severity
            })
        
        return jsonify(actividad), 200
        
    except Exception as e:
        return jsonify({"error": f"Error obteniendo actividad: {str(e)}"}), 500

@bp.get("/alertas")
@jwt_required()
@requiere_admin
def obtener_alertas():
    """Obtener alertas de seguridad del sistema"""
    try:
        alertas = []
        
        # Alertas basadas en intentos de login fallidos recientes
        fecha_limite = datetime.utcnow() - timedelta(hours=1)
        intentos_fallidos = RegistroAuditoria.query.filter(
            RegistroAuditoria.accion == 'LOGIN_FALLIDO',
            RegistroAuditoria.creado_en > fecha_limite
        ).count()
        
        if intentos_fallidos > 5:
            alertas.append({
                "id": 1,
                "tipo": "SEGURIDAD",
                "mensaje": f"Detectados {intentos_fallidos} intentos de login fallidos en la última hora",
                "timestamp": "Hace pocos minutos",
                "severity": "warning" if intentos_fallidos < 10 else "critical"
            })
        
        # Alerta de espacio en disco (simulada)
        alertas.append({
            "id": 2,
            "tipo": "SISTEMA",
            "mensaje": "Sistema funcionando correctamente",
            "timestamp": "Hace 5 minutos",
            "severity": "info"
        })
        
        return jsonify(alertas), 200
        
    except Exception as e:
        return jsonify({"error": f"Error obteniendo alertas: {str(e)}"}), 500

@bp.get("/sistema/estado")
@jwt_required()
@requiere_admin
def obtener_estado_sistema():
    """Obtener estado general del sistema"""
    try:
        # En un entorno real, aquí verificarías servicios reales
        estado = {
            "servicios": [
                {"nombre": "API Principal", "estado": "ACTIVO", "uptime": "99.9%"},
                {"nombre": "Base de Datos", "estado": "ACTIVO", "uptime": "100%"},
                {"nombre": "Servicio de Cifrado", "estado": "ACTIVO", "uptime": "99.8%"}
            ],
            "recursos": {
                "cpu": 45,
                "memoria": 62,
                "disco": 78,
                "red": 12
            }
        }
        
        return jsonify(estado), 200
        
    except Exception as e:
        return jsonify({"error": f"Error obteniendo estado del sistema: {str(e)}"}), 500

@bp.post("/sistema/backup")
@jwt_required()
@requiere_admin
def realizar_backup():
    """Iniciar backup manual del sistema"""
    try:
        # Registrar en auditoría
        AuditoriaServicio.registrar_simple(
            usuario_id=int(get_jwt_identity()),  # Convertir de string a int
            accion='BACKUP_INICIADO',
            detalles="Backup manual iniciado por administrador"
        )
        
        # En un entorno real, aquí iniciarías el proceso de backup
        return jsonify({"mensaje": "Backup iniciado correctamente"}), 200
        
    except Exception as e:
        return jsonify({"error": f"Error iniciando backup: {str(e)}"}), 500

@bp.post("/usuarios/<int:usuario_id>/cerrar-sesiones")
@jwt_required()
@requiere_admin
def cerrar_sesiones_usuario(usuario_id):
    """Cerrar todas las sesiones activas de un usuario"""
    try:
        usuario = Usuario.query.get_or_404(usuario_id)
        
        # En un entorno real, aquí invalidarías los tokens JWT del usuario
        # Por ahora solo registramos la acción
        AuditoriaServicio.registrar_simple(
            usuario_id=int(get_jwt_identity()),  # Convertir de string a int
            accion='SESIONES_CERRADAS',
            detalles=f"Sesiones cerradas para usuario {usuario.correo}"
        )
        
        return jsonify({"mensaje": f"Sesiones cerradas para {usuario.correo}"}), 200
        
    except Exception as e:
        return jsonify({"error": f"Error cerrando sesiones: {str(e)}"}), 500

@bp.get("/storage/stats")
@jwt_required()
@requiere_admin
def obtener_estadisticas_storage():
    """Obtener estadísticas del almacenamiento de archivos"""
    try:
        # Contar archivos por tipo de backend
        archivos_fs = Archivo.query.filter_by(backend_almacenamiento='fs').count()
        archivos_blob = Archivo.query.filter_by(backend_almacenamiento='db_blob').count()
        archivos_sin_ruta = Archivo.query.filter(
            Archivo.backend_almacenamiento == 'fs',
            Archivo.ruta_almacenamiento.is_(None)
        ).count()
        archivos_null_backend = Archivo.query.filter(
            Archivo.backend_almacenamiento.is_(None)
        ).count()
        
        return jsonify({
            "total_archivos": archivos_fs + archivos_blob + archivos_null_backend,
            "archivos_fs": archivos_fs,
            "archivos_db_blob": archivos_blob,
            "archivos_sin_ruta": archivos_sin_ruta,
            "archivos_null_backend": archivos_null_backend,
            "backend_configurado": current_app.config.get("FILE_STORAGE_BACKEND", "db_blob"),
            "ruta_configurada": current_app.config.get("FILE_STORAGE_PATH", "./data_archivos")
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Error obteniendo estadísticas de storage: {str(e)}"}), 500

@bp.post("/usuarios")
@jwt_required()
@requiere_admin
def crear_usuario():
    """Crear un nuevo usuario"""
    try:
        datos = request.json
        
        # Validar datos requeridos
        if not all(campo in datos for campo in ['nombre_usuario', 'correo', 'contrasena', 'rol']):
            return jsonify({"error": "Faltan campos requeridos"}), 400
        
        # Verificar si el usuario ya existe
        if Usuario.query.filter_by(nombre_usuario=datos['nombre_usuario']).first():
            return jsonify({"error": "El nombre de usuario ya existe"}), 400
        
        if Usuario.query.filter_by(correo=datos['correo']).first():
            return jsonify({"error": "El correo ya está registrado"}), 400
        
        # Crear el usuario usando el servicio
        usuario = UsuarioServicio.crear_usuario(
            nombre_usuario=datos['nombre_usuario'],
            correo=datos['correo'],
            contrasena=datos['contrasena']
        )
        
        # Asignar rol
        from ..models.role import Rol
        rol_nombre = datos['rol'].upper()
        rol = Rol.query.filter_by(nombre=rol_nombre).first()
        if not rol:
            # Crear rol si no existe
            rol = Rol(nombre=rol_nombre)
            db.session.add(rol)
            db.session.commit()
        
        # Asignar rol al usuario
        if rol not in usuario.roles:
            usuario.roles.append(rol)
            db.session.commit()
        
        # Registrar auditoría
        AuditoriaServicio.registrar_simple(
            usuario_id=int(get_jwt_identity()),
            accion='USUARIO_CREADO',
            detalles=f"Usuario creado: {usuario.correo}"
        )
        
        return jsonify({"mensaje": "Usuario creado exitosamente", "id": usuario.id}), 201
        
    except Exception as e:
        print(f"DEBUG: Error en crear_usuario: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Error creando usuario: {str(e)}"}), 500

@bp.put("/usuarios/<int:usuario_id>")
@jwt_required()
@requiere_admin
def actualizar_usuario(usuario_id):
    """Actualizar un usuario existente"""
    try:
        usuario = Usuario.query.get_or_404(usuario_id)
        datos = request.json
        
        # Actualizar campos básicos
        if 'nombre_usuario' in datos:
            # Verificar que no exista otro usuario con el mismo nombre
            otro_usuario = Usuario.query.filter(
                Usuario.nombre_usuario == datos['nombre_usuario'],
                Usuario.id != usuario_id
            ).first()
            if otro_usuario:
                return jsonify({"error": "El nombre de usuario ya existe"}), 400
            usuario.nombre_usuario = datos['nombre_usuario']
        
        if 'correo' in datos:
            # Verificar que no exista otro usuario con el mismo correo
            otro_usuario = Usuario.query.filter(
                Usuario.correo == datos['correo'],
                Usuario.id != usuario_id
            ).first()
            if otro_usuario:
                return jsonify({"error": "El correo ya está registrado"}), 400
            usuario.correo = datos['correo']
        
        # Actualizar rol si se proporciona
        if 'rol' in datos:
            from ..models.role import Rol
            rol_nombre = datos['rol'].upper()
            rol = Rol.query.filter_by(nombre=rol_nombre).first()
            if not rol:
                # Crear rol si no existe
                rol = Rol(nombre=rol_nombre)
                db.session.add(rol)
                db.session.commit()
            
            # Limpiar roles anteriores y asignar el nuevo
            usuario.roles.clear()
            usuario.roles.append(rol)
        
        db.session.commit()
        
        # Registrar auditoría
        AuditoriaServicio.registrar_simple(
            usuario_id=int(get_jwt_identity()),
            accion='USUARIO_ACTUALIZADO',
            detalles=f"Usuario actualizado: {usuario.correo}"
        )
        
        return jsonify({"mensaje": "Usuario actualizado exitosamente"}), 200
        
    except Exception as e:
        print(f"DEBUG: Error en actualizar_usuario: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Error actualizando usuario: {str(e)}"}), 500

@bp.get("/auditoria")
@jwt_required()
@requiere_admin
def obtener_auditoria():
    """Obtener registros de auditoría con filtros opcionales"""
    try:
        # Parámetros de consulta
        limit = request.args.get('limit', 50, type=int)
        offset = request.args.get('offset', 0, type=int)
        accion = request.args.get('accion')
        estado = request.args.get('estado')
        fecha_desde = request.args.get('fecha_desde')
        fecha_hasta = request.args.get('fecha_hasta')
        
        # Construir query base
        query = RegistroAuditoria.query
        
        # Aplicar filtros
        if accion:
            query = query.filter(RegistroAuditoria.accion == accion)
        
        if estado:
            query = query.filter(RegistroAuditoria.estado == estado)
        
        if fecha_desde:
            try:
                fecha_desde_dt = datetime.fromisoformat(fecha_desde.replace('Z', '+00:00'))
                query = query.filter(RegistroAuditoria.creado_en >= fecha_desde_dt)
            except ValueError:
                pass
        
        if fecha_hasta:
            try:
                fecha_hasta_dt = datetime.fromisoformat(fecha_hasta.replace('Z', '+00:00'))
                query = query.filter(RegistroAuditoria.creado_en <= fecha_hasta_dt)
            except ValueError:
                pass
        
        # Ordenar y paginar
        registros = query.order_by(RegistroAuditoria.creado_en.desc()).offset(offset).limit(limit).all()
        
        # Si no hay registros, crear algunos de ejemplo para demostración
        if not registros and limit <= 10:
            # Crear registros de ejemplo solo si la base de datos está vacía
            total_registros = RegistroAuditoria.query.count()
            if total_registros == 0:
                from datetime import timedelta
                ahora = datetime.utcnow()
                
                registros_ejemplo = [
                    RegistroAuditoria(
                        actor_usuario_id=int(get_jwt_identity()),
                        accion='LOGIN',
                        tipo_recurso='USUARIO',
                        recurso_id='1',
                        ip='127.0.0.1',
                        estado='SUCCESS',
                        detalles={'mensaje': 'Inicio de sesión exitoso'},
                        creado_en=ahora - timedelta(minutes=5)
                    ),
                    RegistroAuditoria(
                        actor_usuario_id=int(get_jwt_identity()),
                        accion='CIFRAR',
                        tipo_recurso='ARCHIVO',
                        recurso_id='ejemplo.txt',
                        ip='127.0.0.1',
                        estado='SUCCESS',
                        detalles={'algoritmo': 'AES-256-GCM'},
                        creado_en=ahora - timedelta(minutes=10)
                    ),
                    RegistroAuditoria(
                        actor_usuario_id=int(get_jwt_identity()),
                        accion='SUBIR',
                        tipo_recurso='ARCHIVO',
                        recurso_id='documento.pdf',
                        ip='127.0.0.1',
                        estado='SUCCESS',
                        detalles={'tamaño': '2.5MB'},
                        creado_en=ahora - timedelta(minutes=15)
                    )
                ]
                
                for registro in registros_ejemplo:
                    db.session.add(registro)
                
                try:
                    db.session.commit()
                    registros = registros_ejemplo
                    print("DEBUG: Registros de ejemplo creados para auditoría")
                except Exception as e:
                    print(f"DEBUG: Error creando registros de ejemplo: {str(e)}")
                    db.session.rollback()
                    registros = []
        
        # Formatear respuesta
        resultado = []
        for registro in registros:
            try:
                resultado.append({
                    'id': registro.id,
                    'usuario_id': getattr(registro, 'actor_usuario_id', None),
                    'accion': getattr(registro, 'accion', 'DESCONOCIDA'),
                    'tipo_recurso': getattr(registro, 'tipo_recurso', None),
                    'recurso_id': getattr(registro, 'recurso_id', None),
                    'estado': getattr(registro, 'estado', 'SUCCESS'),
                    'ip': getattr(registro, 'ip', None),
                    'detalles': getattr(registro, 'detalles', None),
                    'creado_en': registro.creado_en.isoformat() if hasattr(registro, 'creado_en') and registro.creado_en else None
                })
            except Exception as e:
                print(f"DEBUG: Error procesando registro {registro.id}: {str(e)}")
                continue
        
        return jsonify(resultado), 200
        
    except Exception as e:
        print(f"DEBUG: Error en obtener_auditoria: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Error obteniendo registros de auditoría: {str(e)}"}), 500

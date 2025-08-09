from ..extensions import db
from ..models.user import Usuario
from ..models.role import Rol
from ..services.auth_service import AutenticacionServicio
import os

def inicializar_datos_base():
    """
    Inicializar datos básicos de la aplicación:
    - Crear roles básicos
    - Crear usuario administrador por defecto
    """
    try:
        # 1. Crear roles básicos
        rol_admin = Rol.query.filter_by(nombre='ADMIN').first()
        if not rol_admin:
            rol_admin = Rol(nombre='ADMIN', descripcion='Rol de administrador')
            db.session.add(rol_admin)
            print("✅ Rol ADMIN creado")
        
        rol_user = Rol.query.filter_by(nombre='USER').first()
        if not rol_user:
            rol_user = Rol(nombre='USER', descripcion='Rol de usuario')
            db.session.add(rol_user)
            print("✅ Rol USER creado")
        
        db.session.commit()
        
        # 2. Crear usuario administrador por defecto
        admin_email = os.getenv('ADMIN_EMAIL', 'admin@securevault.com')
        admin_password = os.getenv('ADMIN_PASSWORD', 'admin123')
        
        usuario_admin = Usuario.query.filter_by(correo=admin_email).first()
        if not usuario_admin:
            # Crear usuario admin
            usuario_admin = AutenticacionServicio.registrar_usuario(
                correo=admin_email,
                nombre_usuario='admin',
                contrasena=admin_password,
                es_admin=True
            )
            print(f"✅ Usuario administrador creado: {admin_email}")
            print(f"   Contraseña por defecto: {admin_password}")
            print("   ⚠️ CAMBIA LA CONTRASEÑA EN PRODUCCIÓN")
        else:
            # Verificar que el admin existente tenga rol ADMIN
            if rol_admin not in usuario_admin.roles:
                usuario_admin.roles.append(rol_admin)
                db.session.commit()
                print("✅ Rol ADMIN asignado al usuario existente")
        
        # 3. Arreglar usuarios sin roles
        usuarios_sin_roles = []
        for usuario in Usuario.query.all():
            if len(usuario.roles) == 0:
                usuarios_sin_roles.append(usuario)
                usuario.roles.append(rol_user)
        
        if usuarios_sin_roles:
            db.session.commit()
            print(f"✅ Rol USER asignado a {len(usuarios_sin_roles)} usuarios sin roles")
        
        print("✅ Inicialización de datos completada")
        
    except Exception as e:
        print(f"❌ Error en inicialización: {str(e)}")
        db.session.rollback()

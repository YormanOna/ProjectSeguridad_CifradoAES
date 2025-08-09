from flask import Flask
from .auth_controller import bp as auth_bp
from .user_controller import bp as user_bp
from .key_controller import bp as key_bp
from .file_controller import bp as file_bp
from .audit_controller import bp as audit_bp
from .admin_controller import bp as admin_bp
from .dashboard_controller import bp as dashboard_bp
from .debug_controller import bp as debug_bp

def registrar_blueprints(app: Flask):
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(user_bp, url_prefix="/api/usuarios")
    app.register_blueprint(key_bp, url_prefix="/api/claves")
    app.register_blueprint(file_bp, url_prefix="/api/archivos")
    app.register_blueprint(audit_bp, url_prefix="/api/auditoria")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(debug_bp, url_prefix="/api/debug")

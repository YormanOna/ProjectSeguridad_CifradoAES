from flask import Flask
from .config import cargar_configuracion
from .extensions import db, migrate, bcrypt, jwt, cors, limiter
from .api import registrar_blueprints
from .security.jwt_utils import registrar_callbacks_jwt

def crear_app(config_name: str | None = None) -> Flask:
    app = Flask(__name__)
    cargar_configuracion(app, config_name)

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    registrar_callbacks_jwt(jwt)
    cors.init_app(app)
    limiter.init_app(app)

    registrar_blueprints(app)
    return app

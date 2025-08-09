from . import crear_app

# Punto de entrada para "flask --app app.main run"
app = crear_app()

# Extensión CLI de Flask-Migrate
from .extensions import db
from flask_migrate import Migrate
from .models import user, role, auth, encryption_key, file, file_share, audit_log  # noqa: F401

migrate = Migrate(app, db)

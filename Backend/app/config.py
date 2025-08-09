import os
from datetime import timedelta

def cargar_configuracion(app, config_name=None):
    from dotenv import load_dotenv
    load_dotenv()

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///dev.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret")

    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET", "jwt-secret")
    app.config["JWT_ALGORITHM"] = os.getenv("JWT_ALGORITHM", "HS256")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(
        minutes=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES_MIN", "30"))
    )
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(
        days=int(os.getenv("JWT_REFRESH_TOKEN_EXPIRES_DAYS", "7"))
    )

    app.config["MASTER_SECRET"] = os.getenv("MASTER_SECRET", "cambia-esto")
    app.config["FILE_STORAGE_BACKEND"] = os.getenv("FILE_STORAGE_BACKEND", "db_blob")
    app.config["FILE_STORAGE_PATH"] = os.getenv("FILE_STORAGE_PATH", "./data_archivos")
    app.config["MAX_CONTENT_LENGTH"] = int(os.getenv("MAX_CONTENT_LENGTH", "52428800"))

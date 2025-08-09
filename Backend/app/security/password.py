from ..extensions import bcrypt

def generar_hash_contrasena(contrasena: str) -> str:
    return bcrypt.generate_password_hash(contrasena).decode("utf-8")

def verificar_contrasena(hash_: str, contrasena: str) -> bool:
    return bcrypt.check_password_hash(hash_, contrasena)

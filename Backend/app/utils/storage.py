import os
from typing import Tuple
from flask import current_app

def guardar_blob(nombre: str, datos_cifrados: bytes, tipo_mime: str | None) -> Tuple[str, str | None, bytes | None]:
    backend = current_app.config.get("FILE_STORAGE_BACKEND", "db_blob")
    if backend == "fs":
        base = current_app.config.get("FILE_STORAGE_PATH", "./data_archivos")
        os.makedirs(base, exist_ok=True)
        ruta = os.path.join(base, nombre + ".cifrado")
        with open(ruta, "wb") as f:
            f.write(datos_cifrados)
        return "fs", ruta, None
    else:
        return "db_blob", None, datos_cifrados

def leer_blob(backend: str, ruta: str | None, blob: bytes | None) -> bytes:
    if backend == "fs":
        if not ruta or not os.path.exists(ruta):
            raise FileNotFoundError("Ruta de archivo cifrado no encontrada")
        with open(ruta, "rb") as f:
            return f.read()
    else:
        if blob is None:
            raise ValueError("Blob cifrado vacío")
        return blob

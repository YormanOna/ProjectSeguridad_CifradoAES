def validar_nombre_archivo(nombre: str) -> bool:
    return len(nombre) > 0 and "/" not in nombre and "\\" not in nombre

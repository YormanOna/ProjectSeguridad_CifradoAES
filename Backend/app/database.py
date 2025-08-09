from .extensions import db

def guardar_entidad(entidad):
    db.session.add(entidad)
    db.session.commit()
    return entidad

def eliminar_entidad(entidad):
    db.session.delete(entidad)
    db.session.commit()

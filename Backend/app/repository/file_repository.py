from typing import Optional
from ..extensions import db
from ..models.file import Archivo

class ArchivoRepositorio:
    @staticmethod
    def crear(archivo: Archivo) -> Archivo:
        db.session.add(archivo)
        db.session.commit()
        return archivo

    @staticmethod
    def buscar_por_id(archivo_id: int) -> Optional[Archivo]:
        return Archivo.query.get(archivo_id)
        
    @staticmethod
    def eliminar(archivo: Archivo) -> None:
        """Eliminar archivo de la base de datos"""
        db.session.delete(archivo)
        db.session.commit()

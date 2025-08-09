from ..extensions import db
from ..models.file_share import ArchivoCompartido

class ArchivoCompartidoRepositorio:
    @staticmethod
    def crear(comp: ArchivoCompartido) -> ArchivoCompartido:
        db.session.add(comp)
        db.session.commit()
        return comp

from ..extensions import db
from ..models.audit_log import RegistroAuditoria

class AuditoriaRepositorio:
    @staticmethod
    def registrar(registro: RegistroAuditoria) -> RegistroAuditoria:
        db.session.add(registro)
        db.session.commit()
        return registro

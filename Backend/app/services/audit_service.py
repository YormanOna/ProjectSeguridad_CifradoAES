from ..repository.audit_repository import AuditoriaRepositorio
from ..models.audit_log import RegistroAuditoria

class AuditoriaServicio:
    @staticmethod
    def registrar(actor_usuario_id: int | None, accion: str, tipo_recurso: str | None, recurso_id: str | None, ip: str | None, agente: str | None, estado: str, detalles: dict | None):
        reg = RegistroAuditoria(
            actor_usuario_id=actor_usuario_id,
            accion=accion,
            tipo_recurso=tipo_recurso,
            recurso_id=recurso_id,
            ip=ip,
            agente_usuario=agente,
            estado=estado,
            detalles=detalles
        )
        return AuditoriaRepositorio.registrar(reg)

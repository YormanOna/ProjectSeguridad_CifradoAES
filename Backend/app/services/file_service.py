from ..repository.file_repository import ArchivoRepositorio
from ..repository.audit_repository import AuditoriaRepositorio
from ..models.file import Archivo
from ..models.audit_log import RegistroAuditoria
from ..cryptoutils.aes import cifrar_aes_gcm, descifrar_aes_gcm, generar_bytes_aleatorios
from ..cryptoutils.keywrap import envolver, desarrollar
from .key_service import ClaveServicio
from ..utils.storage import guardar_blob, leer_blob

class ArchivoServicio:
    @staticmethod
    def cifrar_y_guardar(propietario_id: int, nombre: str, tipo_mime: str | None, data: bytes, ip: str | None, user_agent: str | None) -> Archivo:
        # 1) Obtener UEK del usuario (desenvuelta)
        uek = ClaveServicio.obtener_uek_desenvuelta_para_usuario(propietario_id)
        # 2) Generar DEK aleatoria
        dek = generar_bytes_aleatorios(32)
        # 3) Cifrar datos con AES-GCM
        nonce, tag, cifrado = cifrar_aes_gcm(dek, data)
        # 4) Envolver DEK con UEK
        dek_envuelta = envolver(uek, dek)
        # 5) Guardar blob según backend
        backend, ruta, blob = guardar_blob(nombre, cifrado, tipo_mime)
        # 6) Persistir metadatos
        archivo = Archivo(
            propietario_id=propietario_id,
            nombre_original=nombre,
            tipo_mime=tipo_mime,
            tamano_bytes=len(data),
            backend_almacenamiento=backend,
            ruta_almacenamiento=ruta,
            blob_cifrado=blob,
            dek_envuelta=dek_envuelta,
            nonce=nonce,
            tag=tag,
            metadatos={"version": 1},
        )
        archivo = ArchivoRepositorio.crear(archivo)
        # 7) Auditoría
        AuditoriaRepositorio.registrar(RegistroAuditoria(
            actor_usuario_id=propietario_id,
            accion="CIFRAR",
            tipo_recurso="ARCHIVO",
            recurso_id=str(archivo.id),
            ip=ip,
            agente_usuario=user_agent,
            estado="SUCCESS",
            detalles={"nombre": nombre, "tamano_bytes": len(data)}
        ))
        return archivo

    @staticmethod
    def descargar_y_descifrar(archivo: Archivo, solicitante_id: int) -> bytes:
        # 1) Obtener UEK del propietario (para este ejemplo, sólo propietario)
        uek = ClaveServicio.obtener_uek_desenvuelta_para_usuario(archivo.propietario_id)
        # 2) Desarrollar DEK
        dek = desarrollar(uek, archivo.dek_envuelta)
        # 3) Leer blob cifrado
        blob = leer_blob(archivo.backend_almacenamiento, archivo.ruta_almacenamiento, archivo.blob_cifrado)
        # 4) Descifrar
        datos = descifrar_aes_gcm(dek, archivo.nonce, archivo.tag, blob)
        return datos

    @staticmethod
    def obtener_datos_cifrados(archivo: Archivo) -> bytes:
        """Obtener datos cifrados sin descifrar"""
        # Leer blob cifrado directamente del storage
        blob = leer_blob(archivo.backend_almacenamiento, archivo.ruta_almacenamiento, archivo.blob_cifrado)
        return blob

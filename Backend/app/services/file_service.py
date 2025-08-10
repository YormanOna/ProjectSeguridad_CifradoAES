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
        # 1) Calcular hash de verificación del archivo original
        import hashlib
        hash_verificacion = hashlib.sha256(data).hexdigest()
        
        # 2) Obtener la primera clave activa del usuario (en lugar de UEK del sistema)
        from ..models.encryption_key import ClaveCifradoUsuario
        from ..cryptoutils.kdf import derivar_kek
        import os
        
        # Buscar una clave activa del usuario
        clave_usuario = ClaveCifradoUsuario.query.filter_by(
            usuario_id=propietario_id,
            activa=True
        ).first()
        
        if not clave_usuario:
            raise ValueError("El usuario no tiene claves de cifrado activas. Debe crear una clave en 'Gestión de Claves'.")
        
        # Obtener MASTER_SECRET y derivar KEK
        master_secret = os.getenv("MASTER_SECRET", "cambia-esto").encode()
        kek, _, _ = derivar_kek(master_secret, clave_usuario.kdf_salt)
        
        # Desenvolver la clave real del usuario
        clave_usuario_real = desarrollar(kek, clave_usuario.uek_envuelta)
        
        # 2) Generar DEK aleatoria
        dek = generar_bytes_aleatorios(32)
        # 3) Cifrar datos con AES-GCM
        nonce, tag, cifrado = cifrar_aes_gcm(dek, data)
        # 4) Envolver DEK con la clave del usuario (no con UEK del sistema)
        dek_envuelta = envolver(clave_usuario_real, dek)
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
            hash_verificacion=hash_verificacion,  # Usar campo directo
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

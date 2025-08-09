import os
from ..repository.encryption_key_repository import ClaveRepositorio
from ..models.encryption_key import ClaveCifradoUsuario
from ..cryptoutils.kdf import derivar_kek
from ..cryptoutils.keywrap import envolver, desarrollar
from ..cryptoutils.aes import generar_bytes_aleatorios

class ClaveServicio:
    @staticmethod
    def generar_uek_para_usuario(usuario_id: int, etiqueta: str = "clave principal") -> ClaveCifradoUsuario:
        # UEK aleatoria (32 bytes)
        uek = generar_bytes_aleatorios(32)

        # KEK derivado de MASTER_SECRET (+ salt)
        master = os.getenv("MASTER_SECRET", "cambia-esto").encode()
        kek, kdf_salt, kdf_params = derivar_kek(master)

        uek_envuelta = envolver(kek, uek)

        clave = ClaveCifradoUsuario(
            usuario_id=usuario_id,
            etiqueta=etiqueta,
            uek_envuelta=uek_envuelta,
            kdf="argon2id",
            kdf_salt=kdf_salt,
            kdf_parametros=kdf_params,
            activa=True,
        )
        return ClaveRepositorio.crear(clave)

    @staticmethod
    def obtener_uek_desenvuelta_para_usuario(usuario_id: int) -> bytes:
        clave = ClaveRepositorio.obtener_activa_por_usuario(usuario_id)
        if not clave:
            clave = ClaveServicio.generar_uek_para_usuario(usuario_id)

        master = os.getenv("MASTER_SECRET", "cambia-esto").encode()
        kek, _, _ = derivar_kek(master, salt=clave.kdf_salt, params=clave.kdf_parametros)
        return desarrollar(kek, clave.uek_envuelta)

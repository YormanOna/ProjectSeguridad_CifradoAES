# app/cryptoutils/kdf.py
import os
from typing import Tuple, Optional, Dict

# Intentamos Argon2id; si no está disponible, usamos Scrypt.
try:
    from cryptography.hazmat.primitives.kdf.argon2 import Argon2id  # type: ignore
    _ARGON2_OK = True
except Exception:
    _ARGON2_OK = False

from cryptography.hazmat.primitives.kdf.scrypt import Scrypt

def derivar_kek(master: bytes,
                salt: Optional[bytes] = None,
                params: Optional[Dict] = None) -> Tuple[bytes, bytes, Dict]:
    """
    Deriva una KEK (Key Encryption Key) desde MASTER_SECRET.
    - Usa Argon2id si está disponible (cryptography con soporte Argon2).
    - Si no, cae a Scrypt (portátil y estable).
    Retorna: (kek, salt, params_usados)
    """
    if salt is None:
        salt = os.urandom(16)

    if _ARGON2_OK:
        if params is None:
            params = {
                "time_cost": 3,
                "memory_cost": 2**15,  # 32 MiB
                "parallelism": 2,
                "hash_len": 32
            }
        # Usar los parámetros requeridos por la versión actual de cryptography
        kdf = Argon2id(
            iterations=params["time_cost"],     # Requerido como posicional
            lanes=params["parallelism"],        # Requerido como posicional
            memory_cost=params["memory_cost"],  # Requerido como posicional
            length=params["hash_len"],
            salt=salt,
        )
        kek = kdf.derive(master)
        return kek, salt, params
    else:
        if params is None:
            params = {"n": 2**14, "r": 8, "p": 1, "length": 32}
        kdf = Scrypt(
            salt=salt,
            length=params["length"],
            n=params["n"],
            r=params["r"],
            p=params["p"],
        )
        kek = kdf.derive(master)
        return kek, salt, params

from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes
from .aes import cifrar_aes_gcm, descifrar_aes_gcm

def _derivar_clave_wrap(clave_base: bytes, info: bytes) -> bytes:
    hkdf = HKDF(algorithm=hashes.SHA256(), length=32, salt=None, info=info)
    return hkdf.derive(clave_base)

def envolver(clave_wrap: bytes, clave_objetivo: bytes) -> bytes:
    """
    Envuelve 'clave_objetivo' usando clave_wrap derivada para wrap.
    Formato: nonce(12) || tag(16) || cifrado
    """
    k = _derivar_clave_wrap(clave_wrap, b"wrap-key")
    nonce, tag, cifrado = cifrar_aes_gcm(k, clave_objetivo)
    return nonce + tag + cifrado

def desarrollar(clave_wrap: bytes, dato_envuelto: bytes) -> bytes:
    k = _derivar_clave_wrap(clave_wrap, b"wrap-key")
    nonce = dato_envuelto[:12]
    tag = dato_envuelto[12:28]
    cifrado = dato_envuelto[28:]
    return descifrar_aes_gcm(k, nonce, tag, cifrado)

import io
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
from .aes import descifrar_aes_gcm
import os

def decrypt_file_aes(file, password) -> bytes:
    """
    password puede ser str (para clave manual) o bytes (para clave del sistema)
    """
    print(f"=== decrypt_file_aes: Iniciando con archivo {file.filename} ===")
    raw = file.read()
    print(f"Archivo leído: {len(raw)} bytes")
    
    if len(raw) < 44:
        raise ValueError(f"Archivo muy pequeño ({len(raw)} bytes). Mínimo requerido: 44 bytes")
    
    salt = raw[:16]
    nonce = raw[16:28]
    tag = raw[28:44]
    ciphertext = raw[44:]
    
    print(f"Salt: {len(salt)} bytes, Nonce: {len(nonce)} bytes, Tag: {len(tag)} bytes, Ciphertext: {len(ciphertext)} bytes")
    
    # Si password es bytes, usarla directamente; si es str, derivar con PBKDF2
    if isinstance(password, bytes):
        key = password
        print("Usando clave directa (bytes)")
    else:
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
            backend=default_backend()
        )
        key = kdf.derive(password.encode())
        print("Clave derivada con PBKDF2")
    
    try:
        result = descifrar_aes_gcm(key, nonce, tag, ciphertext)
        print(f"Descifrado AES exitoso: {len(result)} bytes")
        return result
    except Exception as e:
        print(f"Error en descifrar_aes_gcm: {str(e)}")
        raise

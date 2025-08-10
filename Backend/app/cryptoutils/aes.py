from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

def generar_bytes_aleatorios(n: int) -> bytes:
    return os.urandom(n)

def cifrar_aes_gcm(clave: bytes, datos: bytes, aad: bytes | None = None) -> tuple[bytes, bytes, bytes]:
    """
    Retorna (nonce, tag, cifrado). AESGCM combina, pero devolvemos tag separado para claridad.
    """
    aesgcm = AESGCM(clave)
    nonce = os.urandom(12)
    cifrado_total = aesgcm.encrypt(nonce, datos, aad)
    # AESGCM empaqueta tag al final. Para separar:
    tag = cifrado_total[-16:]
    cifrado = cifrado_total[:-16]
    return nonce, tag, cifrado

def descifrar_aes_gcm(clave: bytes, nonce: bytes, tag: bytes, cifrado_sin_tag: bytes, aad: bytes | None = None) -> bytes:
    print(f"=== descifrar_aes_gcm ===")
    print(f"Clave: {len(clave)} bytes")
    print(f"Nonce: {len(nonce)} bytes")
    print(f"Tag: {len(tag)} bytes") 
    print(f"Cifrado: {len(cifrado_sin_tag)} bytes")
    
    try:
        aesgcm = AESGCM(clave)
        cifrado_total = cifrado_sin_tag + tag
        print(f"Cifrado total: {len(cifrado_total)} bytes")
        
        resultado = aesgcm.decrypt(nonce, cifrado_total, aad)
        print(f"Descifrado exitoso: {len(resultado)} bytes")
        return resultado
    except Exception as e:
        print(f"Error específico en aesgcm.decrypt: {type(e).__name__}: {str(e)}")
        raise e

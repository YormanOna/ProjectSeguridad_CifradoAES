from flask import Blueprint, request, send_file, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.cryptoutils.file_crypto_utils import decrypt_file_aes
from app.models.encryption_key import ClaveCifradoUsuario
from app.models.file import Archivo
from app.cryptoutils.keywrap import desarrollar
from app.cryptoutils.aes import descifrar_aes_gcm
import tempfile

bp = Blueprint('file_crypto', __name__)

@bp.route('/desencriptar', methods=['POST'])
@jwt_required()
def decrypt_download():
    print("=== DEBUG: Iniciando descifrado ===")
    file = request.files.get('file')
    etiqueta = request.form.get('key')  # Etiqueta de la clave
    
    print(f"Archivo recibido: {file.filename if file else 'None'}")
    print(f"Etiqueta recibida: {etiqueta if etiqueta else 'None'}")
    
    if not file or not etiqueta:
        print("ERROR: Archivo o etiqueta faltante")
        return jsonify({'error': 'Archivo y etiqueta requeridos'}), 400

    try:
        # Obtener ID del usuario actual
        usuario_id = int(get_jwt_identity())
        print(f"Usuario ID: {usuario_id}")
        
        # Buscar la clave por etiqueta
        clave_obj = ClaveCifradoUsuario.query.filter_by(
            usuario_id=usuario_id,
            etiqueta=etiqueta,
            activa=True
        ).first()
        
        if not clave_obj:
            print(f"ERROR: No se encontró clave activa con etiqueta '{etiqueta}'")
            return jsonify({'error': f'No se encontró clave activa con etiqueta "{etiqueta}"'}), 400
        
        print(f"Clave encontrada: ID {clave_obj.id}")
        
        # Obtener MASTER_SECRET y derivar KEK
        import os
        from app.cryptoutils.kdf import derivar_kek
        
        master_secret = os.getenv("MASTER_SECRET", "cambia-esto").encode()
        
        # Derivar KEK usando el salt almacenado con la clave
        kek, _, _ = derivar_kek(master_secret, clave_obj.kdf_salt)
        
        # Desenvolver la clave real del usuario
        clave_usuario_real = desarrollar(kek, clave_obj.uek_envuelta)
        print(f"Clave del usuario obtenida: {len(clave_usuario_real)} bytes")
        
        # Este endpoint es para descifrar archivos descargados desde la interfaz,
        # por lo tanto SIEMPRE son archivos de la base de datos
        raw = file.read()
        print(f"Archivo leído: {len(raw)} bytes")
        
        # Buscar el archivo original en la base de datos por nombre
        nombre_original = file.filename.replace('.encrypted', '').replace('.enc', '')
        archivo_db = Archivo.query.filter_by(
            propietario_id=usuario_id,
            nombre_original=nombre_original
        ).first()
        
        if not archivo_db:
            print(f"ERROR: No se encontró archivo en DB con nombre: {nombre_original}")
            return jsonify({'error': 'Archivo no encontrado en la base de datos'}), 400
        
        print(f"Archivo encontrado en DB: ID {archivo_db.id}")
        
        # Obtener la clave DEK del archivo usando la función ya importada
        dek = desarrollar(clave_usuario_real, archivo_db.dek_envuelta)
        print(f"DEK del archivo obtenida: {len(dek)} bytes")
        
        # Descifrar usando los metadatos del archivo de la DB
        # El raw contiene los datos cifrados que se descargaron
        # Pero necesitamos usar nonce y tag de la base de datos
        decrypted_bytes = descifrar_aes_gcm(
            dek, 
            archivo_db.nonce, 
            archivo_db.tag, 
            archivo_db.blob_cifrado or raw  # Usar blob_cifrado si está disponible
        )
        
        print(f"Descifrado exitoso, {len(decrypted_bytes)} bytes")
        
        # Crear archivo temporal para el descargado
        temp = tempfile.NamedTemporaryFile(delete=False)
        temp.write(decrypted_bytes)
        temp.close()
        
        # Obtener el nombre original del archivo
        original_filename = file.filename
        if original_filename.endswith('.encrypted'):
            original_filename = original_filename[:-10]  # Remover .encrypted
        elif original_filename.endswith('.enc'):
            original_filename = original_filename[:-4]  # Remover .enc
            
        print(f"Enviando archivo descifrado: {original_filename}")
        return send_file(temp.name, as_attachment=True, download_name=original_filename, mimetype='application/octet-stream')
        
    except Exception as e:
        print(f"ERROR en descifrado: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400

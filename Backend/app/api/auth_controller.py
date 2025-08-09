from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, create_access_token, create_refresh_token, get_jwt_identity
from ..services.auth_service import AutenticacionServicio
from ..schemas.auth_schemas import RegistroSchema, LoginSchema
from ..security.rate_limit import limite_login

bp = Blueprint("auth", __name__)
registro_schema = RegistroSchema()
login_schema = LoginSchema()

@bp.post("/registro")
@limite_login
def registro():
    datos = registro_schema.load(request.json)
    usuario = AutenticacionServicio.registrar_usuario(
        correo=datos["correo"],
        nombre_usuario=datos["nombre_usuario"],
        contrasena=datos["contrasena"]
    )
    return jsonify({"mensaje": "registrado", "usuario_id": usuario.id}), 201

@bp.post("/login")
@limite_login
def login():
    datos = login_schema.load(request.json)
    usuario = AutenticacionServicio.verificar_credenciales(datos["correo"], datos["contrasena"])
    if not usuario:
        return jsonify({"mensaje": "Credenciales inválidas"}), 401
    tokens = AutenticacionServicio.emitir_tokens(usuario)
    return jsonify(tokens), 200

@bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    identidad = get_jwt_identity()
    access = create_access_token(identity=identidad, additional_claims={"roles": identidad.get("roles", [])})
    return jsonify({"access_token": access}), 200

from .jwt_utils import requiere_roles

requiere_admin = requiere_roles("ADMIN")
requiere_usuario = requiere_roles("USER")  # Solo requiere rol USER
requiere_usuario_o_admin = requiere_roles("USER", "ADMIN")  # Acepta USER o ADMIN

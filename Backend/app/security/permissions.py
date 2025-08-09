from .jwt_utils import requiere_roles

requiere_admin = requiere_roles("ADMIN")
requiere_usuario = requiere_roles("USER", "ADMIN")

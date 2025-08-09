from ..extensions import limiter

# Ejemplos de límites por defecto se declaran en los blueprints si se desea
limite_login = limiter.limit("5/minute")
limite_subida = limiter.limit("20/minute")

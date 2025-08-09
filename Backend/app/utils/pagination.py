def paginar(query, pagina: int = 1, tamano: int = 20):
    return query.paginate(page=pagina, per_page=tamano, error_out=False)

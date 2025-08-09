import http from "./http";

export const apiSubirArchivo = (file) => {
  const fd = new FormData();
  fd.append("archivo", file);
  return http.post("/archivos/cifrar", fd, {
    headers: { "Content-Type": "multipart/form-data" }
  }).then(r => r.data);
};

// Descarga archivo descifrado por ID (propietario)
export const apiDescargarArchivo = (id) =>
  http.get(`/archivos/descifrar/${id}`, { responseType: "blob" });

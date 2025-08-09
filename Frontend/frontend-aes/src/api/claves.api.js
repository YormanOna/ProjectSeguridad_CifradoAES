import http from "./http";

export const apiClaveActiva = () =>
  http.get("/claves/activa").then(r => r.data);

export const apiGenerarClave = (data = {}) =>
  http.post("/claves/generar", data).then(r => r.data);

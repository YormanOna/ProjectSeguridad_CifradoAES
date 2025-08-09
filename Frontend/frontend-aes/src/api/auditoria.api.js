import http from "./http";

export const apiAuditoriaListado = () =>
  http.get("/auditoria/").then(r => r.data);

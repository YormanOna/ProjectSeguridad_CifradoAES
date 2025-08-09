import http from "./http";

export const apiLogin = (correo, contrasena) =>
  http.post("/auth/login", { correo, contrasena }).then(r => r.data);

export const apiRegistro = (correo, nombre_usuario, contrasena) =>
  http.post("/auth/registro", { correo, nombre_usuario, contrasena }).then(r => r.data);

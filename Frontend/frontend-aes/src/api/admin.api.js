import http from "./http";

// Obtener estadísticas generales del sistema
export const apiAdminStats = () =>
  http.get("/admin/stats").then(r => r.data);

// Obtener lista de usuarios
export const apiAdminUsuarios = (params = {}) =>
  http.get("/admin/usuarios", { params }).then(r => r.data);

// Obtener detalles de un usuario específico
export const apiAdminUsuarioDetalle = (usuarioId) =>
  http.get(`/admin/usuarios/${usuarioId}`).then(r => r.data);

// Crear nuevo usuario
export const apiAdminCrearUsuario = (userData) =>
  http.post("/admin/usuarios", userData).then(r => r.data);

// Actualizar usuario
export const apiAdminActualizarUsuario = (usuarioId, userData) =>
  http.put(`/admin/usuarios/${usuarioId}`, userData).then(r => r.data);

// Cambiar estado de usuario (activar/suspender)
export const apiAdminCambiarEstadoUsuario = (usuarioId, estado) =>
  http.patch(`/admin/usuarios/${usuarioId}/estado`, { estado }).then(r => r.data);

// Eliminar usuario
export const apiAdminEliminarUsuario = (usuarioId) =>
  http.delete(`/admin/usuarios/${usuarioId}`).then(r => r.data);

// Obtener actividad reciente del sistema
export const apiAdminActividad = (params = {}) =>
  http.get("/admin/actividad", { params }).then(r => r.data);

// Obtener alertas de seguridad
export const apiAdminAlertas = () =>
  http.get("/admin/alertas").then(r => r.data);

// Obtener estado del sistema
export const apiAdminEstadoSistema = () =>
  http.get("/admin/sistema/estado").then(r => r.data);

// Realizar backup manual
export const apiAdminBackupManual = () =>
  http.post("/admin/sistema/backup").then(r => r.data);

// Cerrar todas las sesiones de un usuario
export const apiAdminCerrarSesiones = (usuarioId) =>
  http.post(`/admin/usuarios/${usuarioId}/cerrar-sesiones`).then(r => r.data);

// Obtener reportes
export const apiAdminReportes = (tipo, fechaInicio, fechaFin) =>
  http.get("/admin/reportes", { 
    params: { tipo, fecha_inicio: fechaInicio, fecha_fin: fechaFin }
  }).then(r => r.data);

// Exportar datos
export const apiAdminExportar = (tipo) =>
  http.get(`/admin/exportar/${tipo}`, { responseType: 'blob' }).then(r => r.data);

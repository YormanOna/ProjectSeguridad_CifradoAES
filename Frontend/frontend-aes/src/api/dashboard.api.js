import http from './http';

export const apiObtenerEstadisticasDashboard = async () => {
  const response = await http.get('/dashboard/stats');
  return response.data;
};

export const apiObtenerActividadReciente = async () => {
  const response = await http.get('/dashboard/activity');
  return response.data;
};

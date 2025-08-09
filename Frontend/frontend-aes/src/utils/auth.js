import Cookies from "js-cookie";

// Función para verificar si un token ha expirado
export function isTokenExpired(token) {
  if (!token) return true;
  
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;
    
    // Verificar si el token expira en los próximos 60 segundos
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < (now + 60);
  } catch (error) {
    console.error('Error verificando expiración del token:', error);
    return true;
  }
}

// Función para decodificar JWT (sin verificar la firma, solo para leer claims)
export function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
}

// Obtener información del usuario actual desde el token
export function getCurrentUser() {
  const token = Cookies.get("access_token");
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  if (!decoded) return null;
  
  return {
    id: decoded.sub,
    username: decoded.usuario,
    roles: decoded.roles || [],
    isAdmin: decoded.roles?.includes('ADMIN') || false,
    isUser: decoded.roles?.includes('USER') || false
  };
}

// Verificar si el usuario tiene un rol específico
export function hasRole(role) {
  const user = getCurrentUser();
  return user?.roles?.includes(role) || false;
}

// Verificar si el usuario es admin
export function isAdmin() {
  return hasRole('ADMIN');
}

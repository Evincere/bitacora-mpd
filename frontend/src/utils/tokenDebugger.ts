/**
 * @file tokenDebugger.ts
 * @description Utilidad para depurar tokens JWT y sus permisos
 */

/**
 * Decodifica un token JWT sin verificar su firma
 * @param token Token JWT a decodificar
 * @returns Contenido decodificado del token o null si no es válido
 */
export const decodeToken = (token: string): any => {
  try {
    // Dividir el token en sus partes
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('El token no tiene el formato JWT esperado');
      return null;
    }

    // Decodificar la parte de payload (segunda parte)
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
};

/**
 * Verifica si un token contiene un permiso específico
 * @param token Token JWT a verificar
 * @param permission Permiso a buscar
 * @returns true si el token contiene el permiso, false en caso contrario
 */
export const hasPermission = (token: string, permission: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.authorities) {
    return false;
  }

  return decoded.authorities.includes(permission);
};

/**
 * Imprime información detallada sobre un token JWT
 * @param token Token JWT a analizar
 */
export const debugToken = (token: string | null): void => {
  if (!token) {
    console.error('No hay token para depurar');
    return;
  }

  const decoded = decodeToken(token);
  if (!decoded) {
    console.error('No se pudo decodificar el token');
    return;
  }

  console.group('Información del token JWT');
  console.log('Token completo:', token);
  console.log('Payload decodificado:', decoded);
  
  if (decoded.exp) {
    const expirationDate = new Date(decoded.exp * 1000);
    const now = new Date();
    console.log('Fecha de expiración:', expirationDate.toLocaleString());
    console.log('Tiempo restante:', Math.floor((expirationDate.getTime() - now.getTime()) / 1000 / 60), 'minutos');
  }
  
  if (decoded.authorities) {
    console.log('Permisos del usuario:');
    decoded.authorities.forEach((auth: string) => {
      console.log(`- ${auth}`);
    });
    
    // Verificar permisos específicos
    console.log('Tiene permiso READ_USERS:', decoded.authorities.includes('READ_USERS'));
    console.log('Tiene permiso WRITE_USERS:', decoded.authorities.includes('WRITE_USERS'));
    console.log('Tiene rol ROLE_ADMIN:', decoded.authorities.includes('ROLE_ADMIN'));
  }
  
  console.groupEnd();
};

// Exportar funciones de utilidad
const tokenDebugger = {
  decodeToken,
  hasPermission,
  debugToken
};

export default tokenDebugger;

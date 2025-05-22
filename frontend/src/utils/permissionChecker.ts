/**
 * @file permissionChecker.ts
 * @description Utilidad para verificar permisos de usuario
 */

import tokenService from '@/core/utils/tokenService';
import tokenDebugger from './tokenDebugger';

/**
 * Verifica si el usuario actual tiene un permiso específico
 * @param permission Permiso a verificar
 * @returns true si el usuario tiene el permiso, false en caso contrario
 */
export const hasPermission = (permission: string): boolean => {
  const token = tokenService.getToken();
  if (!token) {
    console.warn('No hay token para verificar permisos');
    return false;
  }

  const decoded = tokenDebugger.decodeToken(token);
  if (!decoded || !decoded.authorities) {
    console.warn('No se pudieron decodificar las autoridades del token');
    return false;
  }

  const hasPermission = decoded.authorities.includes(permission);
  console.log(`Verificando permiso ${permission}: ${hasPermission ? 'SÍ' : 'NO'}`);
  return hasPermission;
};

/**
 * Verifica si el usuario actual tiene un rol específico
 * @param role Rol a verificar (sin el prefijo ROLE_)
 * @returns true si el usuario tiene el rol, false en caso contrario
 */
export const hasRole = (role: string): boolean => {
  return hasPermission(`ROLE_${role}`);
};

/**
 * Obtiene todos los permisos del usuario actual
 * @returns Array con los permisos del usuario o array vacío si no hay token
 */
export const getUserPermissions = (): string[] => {
  const token = tokenService.getToken();
  if (!token) {
    console.warn('No hay token para obtener permisos');
    return [];
  }

  const decoded = tokenDebugger.decodeToken(token);
  if (!decoded || !decoded.authorities) {
    console.warn('No se pudieron decodificar las autoridades del token');
    return [];
  }

  return decoded.authorities;
};

/**
 * Imprime todos los permisos del usuario actual en la consola
 */
export const logUserPermissions = (): void => {
  const permissions = getUserPermissions();
  
  console.group('Permisos del usuario actual');
  if (permissions.length === 0) {
    console.warn('El usuario no tiene permisos');
  } else {
    permissions.forEach(permission => {
      console.log(`- ${permission}`);
    });
    
    // Verificar permisos comunes
    console.log('Tiene READ_USERS:', permissions.includes('READ_USERS'));
    console.log('Tiene WRITE_USERS:', permissions.includes('WRITE_USERS'));
    console.log('Tiene DELETE_USERS:', permissions.includes('DELETE_USERS'));
    console.log('Es ADMIN:', permissions.includes('ROLE_ADMIN'));
  }
  console.groupEnd();
};

// Exportar funciones de utilidad
const permissionChecker = {
  hasPermission,
  hasRole,
  getUserPermissions,
  logUserPermissions
};

export default permissionChecker;

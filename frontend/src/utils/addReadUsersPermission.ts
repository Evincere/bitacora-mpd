/**
 * @file addReadUsersPermission.ts
 * @description Script para añadir el permiso READ_USERS al usuario actual
 */

import tokenService from '@/core/utils/tokenService';
import tokenDebugger from './tokenDebugger';
import permissionChecker from './permissionChecker';

/**
 * Añade el permiso READ_USERS al usuario actual en localStorage
 * @returns true si se añadió el permiso, false en caso contrario
 */
export const addReadUsersPermission = (): boolean => {
  try {
    // Verificar si ya tiene el permiso
    if (permissionChecker.hasPermission('READ_USERS')) {
      console.log('El usuario ya tiene el permiso READ_USERS');
      return false;
    }

    // Obtener el usuario del localStorage
    const userStr = localStorage.getItem('bitacora_user');
    if (!userStr) {
      console.error('No hay usuario en localStorage');
      return false;
    }

    // Parsear el usuario
    const user = JSON.parse(userStr);
    
    // Añadir el permiso READ_USERS
    if (!user.permissions) {
      user.permissions = [];
    }
    
    if (!user.permissions.includes('READ_USERS')) {
      user.permissions.push('READ_USERS');
      
      // Guardar el usuario actualizado
      localStorage.setItem('bitacora_user', JSON.stringify(user));
      
      console.log('Permiso READ_USERS añadido correctamente');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error al añadir el permiso READ_USERS:', error);
    return false;
  }
};

/**
 * Añade el permiso READ_USERS al token JWT (solo para depuración)
 * @returns true si se añadió el permiso, false en caso contrario
 */
export const addReadUsersPermissionToToken = (): boolean => {
  try {
    // Obtener el token
    const token = tokenService.getToken();
    if (!token) {
      console.error('No hay token en localStorage');
      return false;
    }
    
    // Decodificar el token
    const decoded = tokenDebugger.decodeToken(token);
    if (!decoded) {
      console.error('No se pudo decodificar el token');
      return false;
    }
    
    // Verificar si ya tiene el permiso
    if (decoded.authorities && decoded.authorities.includes('READ_USERS')) {
      console.log('El token ya tiene el permiso READ_USERS');
      return false;
    }
    
    // No podemos modificar el token directamente, ya que está firmado por el servidor
    console.warn('No es posible modificar el token JWT directamente. Debes obtener un nuevo token del servidor.');
    
    return false;
  } catch (error) {
    console.error('Error al añadir el permiso READ_USERS al token:', error);
    return false;
  }
};

export default {
  addReadUsersPermission,
  addReadUsersPermissionToToken
};

/**
 * @file apiTestService.ts
 * @description Servicio para probar diferentes rutas de la API
 */

import tokenService from '@/core/utils/tokenService';

export interface ApiResponse {
  status: number;
  statusText: string;
  body: any;
  headers: Record<string, string>;
  success: boolean;
  error?: string;
}

/**
 * Realiza una petición a la API con diferentes configuraciones
 * @param url URL de la petición
 * @param method Método HTTP
 * @param useBearer Usar el token como Bearer
 * @param useCustomHeader Usar un header personalizado para el token
 * @param addPermissions Añadir permisos explícitos en los headers
 * @returns Respuesta de la API
 */
export const testApiEndpoint = async (
  url: string,
  method: string = 'GET',
  useBearer: boolean = true,
  useCustomHeader: boolean = false,
  addPermissions: boolean = false
): Promise<ApiResponse> => {
  try {
    // Obtener el token
    const token = tokenService.getToken();
    
    // Construir headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      if (useBearer) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      if (useCustomHeader) {
        headers['X-Auth-Token'] = token;
      }
      
      if (addPermissions) {
        headers['X-User-Permissions'] = 'READ_USERS,WRITE_USERS,DELETE_USERS';
      }
    }
    
    console.log(`Realizando petición ${method} a ${url} con headers:`, headers);
    
    // Realizar la petición
    const response = await fetch(url, {
      method,
      headers,
      credentials: 'include'
    });
    
    // Convertir headers a objeto
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    
    // Intentar parsear el cuerpo de la respuesta
    let responseBody;
    let responseText;
    try {
      responseText = await response.text();
      console.log('Respuesta en texto:', responseText);
      responseBody = responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      console.error('Error al parsear la respuesta como JSON:', error);
      responseBody = responseText || 'No se pudo obtener el cuerpo de la respuesta';
    }
    
    return {
      status: response.status,
      statusText: response.statusText,
      body: responseBody,
      headers: responseHeaders,
      success: response.ok
    };
  } catch (error) {
    console.error('Error al realizar la petición:', error);
    return {
      status: 0,
      statusText: 'Error de red',
      body: null,
      headers: {},
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

/**
 * Prueba múltiples configuraciones para un endpoint
 * @param url URL de la petición
 * @returns Resultados de las pruebas
 */
export const testEndpointWithMultipleConfigs = async (url: string): Promise<ApiResponse[]> => {
  const results: ApiResponse[] = [];
  
  // Prueba 1: Configuración estándar con Bearer token
  results.push(await testApiEndpoint(url, 'GET', true, false, false));
  
  // Prueba 2: Sin Bearer, solo token en header personalizado
  results.push(await testApiEndpoint(url, 'GET', false, true, false));
  
  // Prueba 3: Con Bearer y permisos explícitos
  results.push(await testApiEndpoint(url, 'GET', true, false, true));
  
  // Prueba 4: Con Bearer, header personalizado y permisos explícitos
  results.push(await testApiEndpoint(url, 'GET', true, true, true));
  
  return results;
};

export default {
  testApiEndpoint,
  testEndpointWithMultipleConfigs
};

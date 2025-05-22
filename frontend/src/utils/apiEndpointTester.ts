/**
 * @file apiEndpointTester.ts
 * @description Script para probar diferentes endpoints de la API
 */

import { testApiEndpoint, ApiResponse } from './apiTestService';

export interface EndpointTestResult {
  url: string;
  response: ApiResponse;
}

/**
 * Lista de endpoints comunes para probar
 */
export const commonEndpoints = [
  '/api/users',
  '/api/users/me',
  '/api/activities',
  '/api/task-requests',
  '/api/auth/test',
  '/api/actuator/health',
  '/api/actuator/info'
];

/**
 * Prueba múltiples endpoints de la API
 * @param endpoints Lista de endpoints a probar
 * @returns Resultados de las pruebas
 */
export const testMultipleEndpoints = async (endpoints: string[] = commonEndpoints): Promise<EndpointTestResult[]> => {
  const results: EndpointTestResult[] = [];
  
  for (const endpoint of endpoints) {
    console.log(`Probando endpoint: ${endpoint}`);
    const response = await testApiEndpoint(endpoint);
    results.push({
      url: endpoint,
      response
    });
  }
  
  return results;
};

/**
 * Analiza los resultados de las pruebas para identificar patrones
 * @param results Resultados de las pruebas
 * @returns Análisis de los resultados
 */
export const analyzeResults = (results: EndpointTestResult[]): string => {
  const successfulEndpoints = results.filter(result => result.response.success);
  const failedEndpoints = results.filter(result => !result.response.success);
  
  let analysis = `Análisis de ${results.length} endpoints:\n`;
  analysis += `- ${successfulEndpoints.length} endpoints exitosos\n`;
  analysis += `- ${failedEndpoints.length} endpoints fallidos\n\n`;
  
  if (successfulEndpoints.length > 0) {
    analysis += 'Endpoints exitosos:\n';
    successfulEndpoints.forEach(result => {
      analysis += `- ${result.url} (${result.response.status})\n`;
    });
    analysis += '\n';
  }
  
  if (failedEndpoints.length > 0) {
    analysis += 'Endpoints fallidos:\n';
    failedEndpoints.forEach(result => {
      analysis += `- ${result.url} (${result.response.status}): ${result.response.statusText}\n`;
    });
    analysis += '\n';
  }
  
  // Buscar patrones en los errores
  const error403Endpoints = failedEndpoints.filter(result => result.response.status === 403);
  const error404Endpoints = failedEndpoints.filter(result => result.response.status === 404);
  const error401Endpoints = failedEndpoints.filter(result => result.response.status === 401);
  
  if (error403Endpoints.length > 0) {
    analysis += `Endpoints con error 403 Forbidden (${error403Endpoints.length}):\n`;
    error403Endpoints.forEach(result => {
      analysis += `- ${result.url}\n`;
    });
    analysis += '\n';
  }
  
  if (error404Endpoints.length > 0) {
    analysis += `Endpoints con error 404 Not Found (${error404Endpoints.length}):\n`;
    error404Endpoints.forEach(result => {
      analysis += `- ${result.url}\n`;
    });
    analysis += '\n';
  }
  
  if (error401Endpoints.length > 0) {
    analysis += `Endpoints con error 401 Unauthorized (${error401Endpoints.length}):\n`;
    error401Endpoints.forEach(result => {
      analysis += `- ${result.url}\n`;
    });
    analysis += '\n';
  }
  
  // Conclusiones
  analysis += 'Conclusiones:\n';
  
  if (error403Endpoints.length > 0 && error403Endpoints.length === failedEndpoints.length) {
    analysis += '- Todos los errores son 403 Forbidden, lo que sugiere un problema de permisos.\n';
  } else if (error404Endpoints.length > 0 && error404Endpoints.length === failedEndpoints.length) {
    analysis += '- Todos los errores son 404 Not Found, lo que sugiere que las rutas no existen.\n';
  } else if (error401Endpoints.length > 0 && error401Endpoints.length === failedEndpoints.length) {
    analysis += '- Todos los errores son 401 Unauthorized, lo que sugiere un problema con el token.\n';
  }
  
  if (successfulEndpoints.length > 0 && failedEndpoints.length > 0) {
    analysis += '- Algunos endpoints funcionan y otros no, lo que sugiere un problema específico de permisos o configuración.\n';
  }
  
  return analysis;
};

export default {
  testMultipleEndpoints,
  analyzeResults,
  commonEndpoints
};

import { useQuery } from '@tanstack/react-query';
import solicitudesService from '../services/solicitudesService';
import { TaskRequestRequesterStats } from '../services/solicitudesService';

// Clave para la consulta
export const REQUESTER_STATS_KEY = ['requesterStats'];

/**
 * Hook personalizado para obtener estadísticas del solicitante
 * @param forceRefresh Indica si se debe forzar la actualización de los datos
 * @returns Objeto con datos, estado de carga y error
 */
export const useRequesterStats = (forceRefresh: boolean = false) => {
  return useQuery<TaskRequestRequesterStats>({
    queryKey: REQUESTER_STATS_KEY,
    queryFn: async () => {
      console.log('Ejecutando queryFn de useRequesterStats...');
      try {
        // Forzar una espera para asegurar que la petición se realice
        await new Promise(resolve => setTimeout(resolve, 100));

        // Realizar la petición
        const result = await solicitudesService.getRequesterStats();
        console.log('Resultado de getRequesterStats:', result);

        // Verificar si el resultado es válido
        if (!result) {
          console.warn('Resultado de getRequesterStats es nulo o indefinido');
          throw new Error('No se pudieron obtener las estadísticas');
        }

        return result;
      } catch (error) {
        console.error('Error en queryFn de useRequesterStats:', error);
        throw error;
      }
    },
    staleTime: 0, // Siempre forzar actualización
    refetchOnWindowFocus: true, // Actualizar cuando la ventana recupera el foco
    refetchOnMount: true, // Siempre actualizar al montar el componente
    refetchInterval: forceRefresh ? 5000 : false, // Actualizar cada 5 segundos si se fuerza la actualización
    retry: 3, // Reintentar hasta 3 veces en caso de error
    retryDelay: 1000, // Esperar 1 segundo entre reintentos
  });
};

export default useRequesterStats;

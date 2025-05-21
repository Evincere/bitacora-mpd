import { useQuery } from '@tanstack/react-query';
import priorityService from '../services/priorityService';

/**
 * Hook para obtener todas las prioridades
 */
export const usePriorities = () => {
  return useQuery({
    queryKey: ['priorities'],
    queryFn: () => priorityService.getAllPriorities(),
    staleTime: 30 * 60 * 1000, // 30 minutos (las prioridades cambian con menos frecuencia)
  });
};

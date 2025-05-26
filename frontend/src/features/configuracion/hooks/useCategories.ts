import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import categoryService, {
  TaskCategory,
  CreateCategoryDto,
  UpdateCategoryDto
} from '../services/categoryService';
import { useToast } from '@/shared/components/ui/Toast/ToastProvider';

/**
 * Hook para obtener todas las categorías
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAllCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener una categoría por su ID
 */
export const useCategory = (id: number) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoryService.getCategoryById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para buscar categorías por nombre
 */
export const useSearchCategories = (name: string) => {
  return useQuery({
    queryKey: ['categories', 'search', name],
    queryFn: () => categoryService.searchCategories(name),
    enabled: !!name && name.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para crear una nueva categoría
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (categoryData: CreateCategoryDto) => categoryService.createCategory(categoryData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoría creada correctamente');
      return data;
    },
    onError: (error: Error) => {
      toast.error(`Error al crear categoría: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para actualizar una categoría existente
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, categoryData }: { id: number; categoryData: UpdateCategoryDto }) =>
      categoryService.updateCategory(id, categoryData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', data.id] });
      toast.success('Categoría actualizada correctamente');
      return data;
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar categoría: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para eliminar una categoría
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoría eliminada correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar categoría: ${error.message}`);
      throw error;
    },
  });
};

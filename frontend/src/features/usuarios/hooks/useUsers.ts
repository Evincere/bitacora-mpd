import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService, { UserCreateDto, UserUpdateDto } from '../services/userService';
import { User, UserRole } from '@/core/types/models';
import { useToastContext } from '@/components/ui';

/**
 * Hook para obtener una lista paginada de usuarios
 */
export const useUsers = (
  page: number = 0,
  size: number = 10,
  role?: string,
  active?: boolean,
  search?: string
) => {
  return useQuery({
    queryKey: ['users', page, size, role, active, search],
    queryFn: () => userService.getUsers(page, size, role, active, search),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener un usuario por su ID
 */
export const useUser = (id: number) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener usuarios por rol
 */
export const useUsersByRole = (role: UserRole, page: number = 0, size: number = 100) => {
  return useQuery({
    queryKey: ['usersByRole', role, page, size],
    queryFn: () => userService.getUsersByRole(role, page, size),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para crear un nuevo usuario
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastContext();

  return useMutation({
    mutationFn: (userData: UserCreateDto) => userService.createUser(userData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showSuccess('Usuario creado correctamente');
      return data;
    },
    onError: (error: Error) => {
      showError(`Error al crear usuario: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para actualizar un usuario existente
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastContext();

  return useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: UserUpdateDto }) => 
      userService.updateUser(id, userData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', data.id] });
      showSuccess('Usuario actualizado correctamente');
      return data;
    },
    onError: (error: Error) => {
      showError(`Error al actualizar usuario: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para eliminar un usuario
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastContext();

  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showSuccess('Usuario eliminado correctamente');
    },
    onError: (error: Error) => {
      showError(`Error al eliminar usuario: ${error.message}`);
      throw error;
    },
  });
};

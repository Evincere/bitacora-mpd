/**
 * Hook personalizado para gestionar la autenticación de usuarios.
 * Este hook es un wrapper alrededor del hook principal en core/hooks/useAuth
 * para mantener la compatibilidad con los componentes existentes.
 */

import { useAppSelector } from '@/core/store';
import { useAuth as useCoreAuth } from '@/core/hooks/useAuth';
import { getUser } from '@/core/utils/auth';

/**
 * Hook personalizado para gestionar la autenticación de usuarios.
 * 
 * @returns Objeto con funciones y estados de autenticación
 */
export const useAuth = () => {
  const coreAuth = useCoreAuth();
  const { user } = useAppSelector(state => state.auth);
  
  // Obtener el usuario actual del localStorage si no está en el estado
  const currentUser = user || getUser();

  return {
    ...coreAuth,
    currentUser
  };
};

export default useAuth;

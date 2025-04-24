import { useState, useEffect } from 'react';

/**
 * Hook personalizado para usar localStorage con estado de React
 * @param key Clave para localStorage
 * @param initialValue Valor inicial
 * @returns [storedValue, setValue] - Valor almacenado y función para actualizarlo
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Estado para almacenar el valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Obtener del localStorage por clave
      const item = window.localStorage.getItem(key);
      // Analizar el JSON almacenado o devolver el valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si hay un error, devolver el valor inicial
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Función para actualizar el valor en localStorage y estado
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que el valor sea una función (como en useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Guardar en el estado
      setStoredValue(valueToStore);
      // Guardar en localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Escuchar cambios en localStorage de otras pestañas/ventanas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    // Agregar event listener
    window.addEventListener('storage', handleStorageChange);
    
    // Limpiar event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}

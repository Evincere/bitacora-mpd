import { useState, useEffect } from 'react';

/**
 * Hook personalizado para usar localStorage con soporte para TypeScript
 * @param key Clave para almacenar en localStorage
 * @param initialValue Valor inicial si no existe en localStorage
 * @returns [storedValue, setValue] - Valor almacenado y función para actualizarlo
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Estado para almacenar nuestro valor
  // Pasa la función de inicialización a useState para que la lógica se ejecute solo una vez
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      // Obtener del localStorage por clave
      const item = window.localStorage.getItem(key);
      // Analizar JSON almacenado o devolver initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si hay error, devolver initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  // Devolver una versión envuelta de la función setter de useState que persiste el nuevo valor en localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que el valor sea una función para que tengamos la misma API que useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Guardar estado
      setStoredValue(valueToStore);
      
      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Un error más avanzado manejaría mejor esto
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };
  
  // Escuchar cambios en localStorage para mantener sincronizados múltiples componentes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };
    
    // Suscribirse al evento storage
    window.addEventListener('storage', handleStorageChange);
    
    // Limpiar suscripción al desmontar
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);
  
  return [storedValue, setValue];
}

export default useLocalStorage;

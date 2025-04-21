import { useState, useEffect } from 'react';

/**
 * Hook para implementar debounce en valores
 * @param value Valor a debounce
 * @param delay Tiempo de espera en ms
 * @returns Valor con debounce
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Actualizar el valor después del tiempo de espera
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancelar el timeout si el valor cambia o el componente se desmonta
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;

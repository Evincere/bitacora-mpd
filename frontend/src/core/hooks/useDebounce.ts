import { useState, useEffect } from 'react';

/**
 * Hook personalizado para debounce de valores
 * @param value Valor a debounce
 * @param delay Tiempo de espera en ms (por defecto 500ms)
 * @returns Valor con debounce
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Establecer un temporizador para actualizar el valor con debounce
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el temporizador si el valor cambia antes del tiempo de espera
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

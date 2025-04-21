import { useState, useEffect } from 'react';

/**
 * Hook para debounce de valores
 * @param {any} value - Valor a debounce
 * @param {number} delay - Tiempo de espera en ms
 * @returns {any} Valor con debounce
 */
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Actualizar el valor debounced después del delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancelar el timeout si el valor cambia (o el componente se desmonta)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;

import { useEffect, RefObject } from 'react';

/**
 * Hook personalizado para detectar clics fuera de un elemento
 * @param ref Referencia al elemento
 * @param callback Función a ejecutar cuando se detecta un clic fuera
 */
export function useOutsideClick<T extends HTMLElement>(
  ref: RefObject<T>,
  callback: () => void
): void {
  useEffect(() => {
    // Función para manejar el clic
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Agregar event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Limpiar event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
}

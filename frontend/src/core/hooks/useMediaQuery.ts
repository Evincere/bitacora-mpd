import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar media queries
 * @param query Media query a evaluar (ej: '(max-width: 768px)')
 * @returns boolean - True si la media query coincide
 */
export function useMediaQuery(query: string): boolean {
  // Estado para almacenar si la media query coincide
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Crear media query
    const mediaQuery = window.matchMedia(query);
    
    // Establecer el valor inicial
    setMatches(mediaQuery.matches);

    // Función para manejar cambios en la media query
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Agregar listener para cambios
    mediaQuery.addEventListener('change', handleChange);
    
    // Limpiar listener
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';

/**
 * Hook para manejar el timeout de sesión por inactividad
 * @param {number} timeoutInMinutes - Tiempo de inactividad en minutos antes de cerrar sesión
 */
export const useSessionTimeout = (timeoutInMinutes = 30) => {
  const { logout } = useAuth();
  const timeoutRef = useRef(null);
  const timeoutInMs = timeoutInMinutes * 60 * 1000;

  // Función para reiniciar el temporizador
  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      // Mostrar una alerta antes de cerrar sesión
      const confirmLogout = window.confirm(
        `Tu sesión está a punto de expirar por inactividad. ¿Deseas continuar conectado?`
      );
      
      if (!confirmLogout) {
        logout();
      } else {
        // Si el usuario quiere continuar, reiniciamos el temporizador
        resetTimer();
      }
    }, timeoutInMs);
  };

  // Iniciar el temporizador cuando el componente se monta
  useEffect(() => {
    // Eventos que reinician el temporizador
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];
    
    // Iniciar el temporizador
    resetTimer();
    
    // Agregar event listeners para reiniciar el temporizador
    const resetTimerOnEvent = () => resetTimer();
    events.forEach(event => {
      window.addEventListener(event, resetTimerOnEvent);
    });
    
    // Limpiar event listeners y temporizador cuando el componente se desmonta
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      events.forEach(event => {
        window.removeEventListener(event, resetTimerOnEvent);
      });
    };
  }, [timeoutInMs, logout]);

  return { resetTimer };
};

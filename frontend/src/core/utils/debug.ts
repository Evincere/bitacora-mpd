/**
 * Utilidades para depuración de componentes y aplicación
 */
import { useEffect, useRef } from 'react';

// Determinar si estamos en modo de desarrollo
const isDevelopment = import.meta.env.DEV;

// Determinar si el modo de depuración está habilitado
const isDebugEnabled = isDevelopment && (
  localStorage.getItem('debug_mode') === 'true' ||
  new URLSearchParams(window.location.search).has('debug')
);

/**
 * Registrar un mensaje de depuración en la consola
 * @param component Nombre del componente
 * @param message Mensaje de depuración
 * @param data Datos adicionales (opcional)
 */
export const debugLog = (component: string, message: string, data?: any): void => {
  if (!isDebugEnabled) return;

  console.group(`🔍 DEBUG: ${component}`);
  console.log(`📝 ${message}`);
  if (data !== undefined) {
    console.log('📊 Data:', data);
  }
  console.groupEnd();
};

/**
 * Registrar el montaje de un componente
 * @param component Nombre del componente
 * @param props Props del componente (opcional)
 */
export const debugMount = (component: string, props?: any): void => {
  if (!isDebugEnabled) return;

  console.group(`🔍 DEBUG: ${component}`);
  console.log(`🟢 Componente montado`);
  if (props !== undefined) {
    console.log('📊 Props:', props);
  }
  console.groupEnd();
};

/**
 * Registrar el desmontaje de un componente
 * @param component Nombre del componente
 */
export const debugUnmount = (component: string): void => {
  if (!isDebugEnabled) return;

  console.group(`🔍 DEBUG: ${component}`);
  console.log(`🔴 Componente desmontado`);
  console.groupEnd();
};

/**
 * Registrar una actualización de un componente
 * @param component Nombre del componente
 * @param prevProps Props anteriores (opcional)
 * @param nextProps Props nuevos (opcional)
 */
export const debugUpdate = (component: string, prevProps?: any, nextProps?: any): void => {
  if (!isDebugEnabled) return;

  console.group(`🔍 DEBUG: ${component}`);
  console.log(`🔄 Componente actualizado`);

  if (prevProps !== undefined && nextProps !== undefined) {
    console.log('📊 Props anteriores:', prevProps);
    console.log('📊 Props nuevos:', nextProps);

    // Mostrar diferencias entre props
    const allKeys = new Set([...Object.keys(prevProps), ...Object.keys(nextProps)]);
    const changes: Record<string, { prev: any, next: any }> = {};

    allKeys.forEach(key => {
      if (prevProps[key] !== nextProps[key]) {
        changes[key] = {
          prev: prevProps[key],
          next: nextProps[key]
        };
      }
    });

    if (Object.keys(changes).length > 0) {
      console.log('📊 Cambios en props:', changes);
    } else {
      console.log('📊 No hay cambios en props');
    }
  }

  console.groupEnd();
};

/**
 * Registrar un error en un componente
 * @param component Nombre del componente
 * @param error Error ocurrido
 * @param info Información adicional (opcional)
 */
export const debugError = (component: string, error: Error, info?: any): void => {
  if (!isDebugEnabled) return;

  console.group(`🔍 DEBUG ERROR: ${component}`);
  console.error(`❌ Error:`, error);
  if (info !== undefined) {
    console.error('📊 Info:', info);
  }
  console.groupEnd();
};

/**
 * Habilitar o deshabilitar el modo de depuración
 * @param enabled Indica si se debe habilitar el modo de depuración
 */
export const setDebugMode = (enabled: boolean): void => {
  if (enabled) {
    localStorage.setItem('debug_mode', 'true');
    console.log('🔍 Modo de depuración habilitado');
  } else {
    localStorage.removeItem('debug_mode');
    console.log('🔍 Modo de depuración deshabilitado');
  }

  // Recargar la página para aplicar los cambios
  window.location.reload();
};

/**
 * Verificar si el modo de depuración está habilitado
 * @returns true si el modo de depuración está habilitado
 */
export const isDebugMode = (): boolean => {
  return isDebugEnabled;
};

/**
 * Hook de depuración para componentes funcionales
 * @param componentName Nombre del componente
 * @param props Props del componente
 */
export const useDebug = (componentName: string, props: any): void => {
  if (!isDebugEnabled) return;

  // Usamos los hooks importados en la parte superior del archivo

  // Referencia a los props anteriores
  const prevPropsRef = useRef(props);

  // Registrar montaje
  useEffect(() => {
    debugMount(componentName, props);

    // Registrar desmontaje
    return () => {
      debugUnmount(componentName);
    };
  }, []);

  // Registrar actualizaciones
  useEffect(() => {
    const prevProps = prevPropsRef.current;

    if (prevProps !== props) {
      debugUpdate(componentName, prevProps, props);
      prevPropsRef.current = props;
    }
  });
};

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  containerId?: string;
}

/**
 * Componente Portal que renderiza su contenido fuera de la jerarquía del DOM actual.
 * Útil para menús desplegables, modales, tooltips, etc. que necesitan evitar problemas
 * de recorte debido a contenedores con overflow: hidden.
 */
const Portal = ({ children, containerId = 'portal-root' }: PortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Asegurarse de que el contenedor exista
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.style.position = 'fixed';
      container.style.left = '0';
      container.style.top = '0';
      container.style.width = '0';
      container.style.height = '0';
      container.style.zIndex = '9999';
      container.style.pointerEvents = 'none';
      document.body.appendChild(container);
    }

    return () => {
      // Limpiar el contenedor si está vacío al desmontar
      const portalRoot = document.getElementById(containerId);
      if (portalRoot && portalRoot.childNodes.length === 0) {
        document.body.removeChild(portalRoot);
      }
    };
  }, [containerId]);

  // No renderizar nada en el servidor o antes de montar
  if (!mounted) return null;

  // Obtener el contenedor (debería existir después del efecto)
  const portalRoot = document.getElementById(containerId);
  if (!portalRoot) return null;

  // Renderizar el contenido en el portal
  return createPortal(children, portalRoot);
};

export default Portal;

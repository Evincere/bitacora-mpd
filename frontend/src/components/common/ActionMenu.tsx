import React, { useRef, useEffect, useState, ReactNode } from 'react';
import styled from 'styled-components';
import Portal from './Portal';

interface ActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  triggerRef: React.RefObject<HTMLElement>;
  className?: string;
}

const MenuContainer = styled.div<{ $top: number; $left: number; $right: number }>`
  position: fixed;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  right: auto;
  width: 160px;
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  pointer-events: auto;
  
  /* Ajustar posición si está demasiado a la derecha */
  @media (max-width: 768px) {
    right: ${props => props.$right}px;
    left: auto;
    width: 150px;
  }
`;

/**
 * Componente de menú de acciones que se renderiza en un portal
 * para evitar problemas de recorte y posicionamiento.
 */
const ActionMenu: React.FC<ActionMenuProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  triggerRef,
  className
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, right: 0 });

  // Calcular la posición del menú basado en el elemento trigger
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      
      // Calcular posición
      const top = rect.bottom + 5;
      const left = rect.left;
      const right = windowWidth - rect.right;
      
      // Ajustar posición si está demasiado a la derecha
      const isOverflowing = left + 160 > windowWidth;
      
      setPosition({
        top,
        left: isOverflowing ? Math.max(windowWidth - 170, 10) : left,
        right: isOverflowing ? 10 : right
      });
    }
  }, [isOpen, triggerRef]);

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current && 
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  // No renderizar nada si el menú está cerrado
  if (!isOpen) return null;

  return (
    <Portal>
      <MenuContainer 
        ref={menuRef} 
        $top={position.top} 
        $left={position.left} 
        $right={position.right}
        className={className}
      >
        {children}
      </MenuContainer>
    </Portal>
  );
};

export default ActionMenu;

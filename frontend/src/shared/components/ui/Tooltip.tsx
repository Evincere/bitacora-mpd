import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface TooltipProps {
  title: React.ReactNode;
  children: React.ReactElement;
  arrow?: boolean;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const TooltipContainer = styled.div`
  position: relative;
  display: inline-flex;
`;

const TooltipContent = styled.div<{ 
  $visible: boolean; 
  $placement: string;
  $hasArrow: boolean;
}>`
  position: absolute;
  background-color: ${({ theme }) => theme.backgroundAlt || '#333'};
  color: ${({ theme }) => theme.text || '#fff'};
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1000;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transition: opacity 0.2s, visibility 0.2s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  max-width: 300px;
  word-wrap: break-word;
  
  ${({ $placement, $hasArrow }) => {
    switch ($placement) {
      case 'top':
        return `
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-8px);
          margin-bottom: ${$hasArrow ? '10px' : '0'};
        `;
      case 'bottom':
        return `
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(8px);
          margin-top: ${$hasArrow ? '10px' : '0'};
        `;
      case 'left':
        return `
          right: 100%;
          top: 50%;
          transform: translateY(-50%) translateX(-8px);
          margin-right: ${$hasArrow ? '10px' : '0'};
        `;
      case 'right':
        return `
          left: 100%;
          top: 50%;
          transform: translateY(-50%) translateX(8px);
          margin-left: ${$hasArrow ? '10px' : '0'};
        `;
      default:
        return `
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-8px);
          margin-bottom: ${$hasArrow ? '10px' : '0'};
        `;
    }
  }}
`;

const Arrow = styled.div<{ $placement: string }>`
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  
  ${({ $placement }) => {
    switch ($placement) {
      case 'top':
        return `
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 8px 8px 0 8px;
          border-color: #333 transparent transparent transparent;
        `;
      case 'bottom':
        return `
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 0 8px 8px 8px;
          border-color: transparent transparent #333 transparent;
        `;
      case 'left':
        return `
          right: -8px;
          top: 50%;
          transform: translateY(-50%);
          border-width: 8px 0 8px 8px;
          border-color: transparent transparent transparent #333;
        `;
      case 'right':
        return `
          left: -8px;
          top: 50%;
          transform: translateY(-50%);
          border-width: 8px 8px 8px 0;
          border-color: transparent #333 transparent transparent;
        `;
      default:
        return `
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 8px 8px 0 8px;
          border-color: #333 transparent transparent transparent;
        `;
    }
  }}
`;

const Tooltip: React.FC<TooltipProps> = ({ 
  title, 
  children, 
  arrow = false, 
  placement = 'top' 
}) => {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setVisible(true);
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  // Clonar el elemento hijo para agregar los eventos
  const childWithProps = React.cloneElement(children, {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleMouseEnter,
    onBlur: handleMouseLeave,
  });

  return (
    <TooltipContainer ref={containerRef}>
      {childWithProps}
      <TooltipContent 
        $visible={visible} 
        $placement={placement}
        $hasArrow={arrow}
      >
        {title}
        {arrow && <Arrow $placement={placement} />}
      </TooltipContent>
    </TooltipContainer>
  );
};

export default Tooltip;

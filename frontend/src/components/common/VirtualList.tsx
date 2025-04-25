import React, { ReactNode, useRef, useEffect, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import styled from 'styled-components';

interface VirtualListProps<T> {
  items: T[];
  height: number | string;
  width?: string | number;
  estimateSize?: number;
  dynamicSize?: boolean;
  renderItem: (item: T, index: number) => ReactNode;
  overscan?: number;
  className?: string;
  onItemsRendered?: (startIndex: number, endIndex: number) => void;
  scrollToIndex?: number;
  scrollToAlignment?: 'start' | 'center' | 'end' | 'auto';
  onScroll?: (scrollOffset: number) => void;
  itemKey?: (index: number) => string | number;
}

const ListContainer = styled.div`
  overflow: auto;
  will-change: transform;
  position: relative;
`;

const ListItem = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

/**
 * Componente de lista virtual optimizado para renderizar grandes cantidades de datos
 * de manera eficiente. Utiliza @tanstack/react-virtual para la virtualización.
 *
 * @template T - Tipo de los elementos de la lista
 */
function VirtualList<T>({
  items,
  height,
  width = '100%',
  estimateSize = 50,
  dynamicSize = false,
  renderItem,
  overscan = 10,
  className,
  onItemsRendered,
  scrollToIndex,
  scrollToAlignment = 'auto',
  onScroll,
  itemKey
}: VirtualListProps<T>) {
  // Referencia al contenedor de la lista
  const parentRef = useRef<HTMLDivElement>(null);
  const [measurementCache] = useState(new Map<number, number>());

  // Función para medir elementos si dynamicSize está activado
  const measureElement = dynamicSize
    ? (element: Element) => {
        const height = element.getBoundingClientRect().height;
        const index = Number(element.getAttribute('data-index'));
        if (!isNaN(index)) {
          measurementCache.set(index, height);
        }
        return height;
      }
    : undefined;

  // Función para generar claves únicas para los elementos
  const getItemKey = itemKey || ((index: number) => {
    const item = items[index];
    // Intentar usar id si existe, de lo contrario usar índice
    return (item && typeof item === 'object' && 'id' in item)
      ? (item as any).id
      : index;
  });

  // Configurar el virtualizador
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      // Usar el tamaño medido si está disponible, de lo contrario usar estimateSize
      return measurementCache.get(index) ?? estimateSize;
    },
    overscan,
    getItemKey,
    measureElement
  });

  // Manejar el evento de scroll
  useEffect(() => {
    if (parentRef.current && onScroll) {
      const handleScroll = () => {
        if (parentRef.current) {
          onScroll(parentRef.current.scrollTop);
        }
      };

      parentRef.current.addEventListener('scroll', handleScroll);
      return () => {
        if (parentRef.current) {
          parentRef.current.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, [onScroll]);

  // Efecto para desplazarse a un elemento específico
  useEffect(() => {
    if (scrollToIndex !== undefined) {
      virtualizer.scrollToIndex(scrollToIndex, { align: scrollToAlignment });
    }
  }, [scrollToIndex, scrollToAlignment, virtualizer]);

  // Efecto para notificar sobre elementos renderizados
  useEffect(() => {
    if (onItemsRendered && virtualizer.getVirtualItems().length > 0) {
      const items = virtualizer.getVirtualItems();
      onItemsRendered(items[0].index, items[items.length - 1].index);
    }
  }, [virtualizer.getVirtualItems(), onItemsRendered]);

  // Calcular el tamaño total de la lista
  const totalHeight = virtualizer.getTotalSize();

  // Obtener los elementos virtuales
  const virtualItems = virtualizer.getVirtualItems();

  // Agregar logs para depuración
  console.log('VirtualList: Renderizando lista con', items.length, 'elementos');
  console.log('VirtualList: Elementos virtuales:', virtualItems.length);

  return (
    <ListContainer
      ref={parentRef}
      style={{ height, width }}
      className={className}
      data-testid="virtual-list-container"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {virtualItems.map(virtualItem => {
          // Verificar que el índice sea válido
          if (virtualItem.index >= items.length) {
            console.error('Índice fuera de rango:', virtualItem.index, 'para array de tamaño', items.length);
            return null;
          }

          return (
            <ListItem
              key={virtualItem.key}
              data-index={virtualItem.index}
              style={{
                height: dynamicSize ? 'auto' : `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`
              }}
            >
              {renderItem(items[virtualItem.index], virtualItem.index)}
            </ListItem>
          );
        })}
      </div>
    </ListContainer>
  );
}

export default VirtualList;

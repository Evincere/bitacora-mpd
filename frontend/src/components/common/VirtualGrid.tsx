import React, { ReactNode, useRef, useEffect, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import styled from 'styled-components';

interface VirtualGridProps<T> {
  items: T[];
  height: number | string;
  width?: string | number;
  columnWidth: number;
  rowHeight?: number;
  dynamicHeight?: boolean;
  gap?: number;
  renderItem: (item: T, index: number) => ReactNode;
  overscan?: number;
  className?: string;
  onItemsRendered?: (startIndex: number, endIndex: number) => void;
  scrollToIndex?: number;
  scrollToAlignment?: 'start' | 'center' | 'end' | 'auto';
  onScroll?: (scrollOffset: number) => void;
  itemKey?: (index: number) => string | number;
}

const GridContainer = styled.div`
  overflow: auto;
  will-change: transform;
  position: relative;
`;

const GridItem = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;

/**
 * Componente de cuadrícula virtual optimizado para renderizar grandes cantidades de datos
 * en formato de grid. Utiliza @tanstack/react-virtual para la virtualización.
 *
 * @template T - Tipo de los elementos de la cuadrícula
 */
function VirtualGrid<T>({
  items,
  height,
  width = '100%',
  columnWidth,
  rowHeight,
  dynamicHeight = false,
  gap = 20,
  renderItem,
  overscan = 10,
  className,
  onItemsRendered,
  scrollToIndex,
  scrollToAlignment = 'auto',
  onScroll,
  itemKey
}: VirtualGridProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(1);
  const [rowCount, setRowCount] = useState(items.length);
  const [measurementCache] = useState(new Map<number, number>());
  const [resizeObserver, setResizeObserver] = useState<ResizeObserver | null>(null);

  // Función para medir elementos si dynamicHeight está activado
  const measureElement = dynamicHeight
    ? (element: Element) => {
        const height = element.getBoundingClientRect().height;
        const rowIndex = Number(element.getAttribute('data-row-index'));
        if (!isNaN(rowIndex)) {
          measurementCache.set(rowIndex, height);
        }
        return height;
      }
    : undefined;

  // Función para generar claves únicas para los elementos
  const getItemKey = itemKey || ((index: number) => {
    // Para grids, usamos el índice de fila como clave
    return index;
  });

  // Calcular el número de columnas y filas cuando cambia el tamaño del contenedor
  useEffect(() => {
    if (parentRef.current) {
      // Crear un ResizeObserver para detectar cambios en el tamaño del contenedor
      const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
          const containerWidth = entry.contentRect.width;
          const columns = Math.floor((containerWidth + gap) / (columnWidth + gap));
          const newColumnCount = Math.max(1, columns);
          setColumnCount(newColumnCount);
          setRowCount(Math.ceil(items.length / newColumnCount));
        }
      });

      observer.observe(parentRef.current);
      setResizeObserver(observer);

      return () => {
        observer.disconnect();
      };
    }
  }, [columnWidth, gap, items.length]);

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

  // Configurar el virtualizador para las filas
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      // Usar el tamaño medido si está disponible, de lo contrario usar estimateSize
      return measurementCache.get(index) ?? (rowHeight || columnWidth + gap);
    },
    overscan,
    getItemKey,
    measureElement
  });

  // Efecto para desplazarse a un elemento específico
  useEffect(() => {
    if (scrollToIndex !== undefined) {
      // Convertir el índice de elemento a índice de fila
      const rowIndex = Math.floor(scrollToIndex / columnCount);
      rowVirtualizer.scrollToIndex(rowIndex, { align: scrollToAlignment });
    }
  }, [scrollToIndex, scrollToAlignment, rowVirtualizer, columnCount]);

  // Efecto para notificar sobre elementos renderizados
  useEffect(() => {
    if (onItemsRendered && rowVirtualizer.getVirtualItems().length > 0) {
      const rows = rowVirtualizer.getVirtualItems();
      const startIndex = rows[0].index * columnCount;
      const endIndex = Math.min(
        items.length - 1,
        (rows[rows.length - 1].index + 1) * columnCount - 1
      );
      onItemsRendered(startIndex, endIndex);
    }
  }, [rowVirtualizer.getVirtualItems(), onItemsRendered, columnCount, items.length]);

  // Calcular el tamaño total de la cuadrícula
  const totalHeight = rowVirtualizer.getTotalSize();

  // Obtener las filas virtuales
  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <GridContainer
      ref={parentRef}
      style={{ height, width }}
      className={className}
      data-testid="virtual-grid-container"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {virtualRows.map(virtualRow => {
          const rowStartIndex = virtualRow.index * columnCount;

          // Crear las celdas para esta fila
          return Array.from({ length: columnCount }).map((_, columnIndex) => {
            const itemIndex = rowStartIndex + columnIndex;

            // Asegurarse de que el índice es válido
            if (itemIndex >= items.length) return null;

            return (
              <GridItem
                key={`${virtualRow.index}-${columnIndex}`}
                data-index={itemIndex}
                data-row-index={virtualRow.index}
                style={{
                  transform: `translateY(${virtualRow.start}px) translateX(${columnIndex * (columnWidth + gap)}px)`,
                  width: columnWidth,
                  height: dynamicHeight ? 'auto' : (rowHeight || columnWidth)
                }}
              >
                {renderItem(items[itemIndex], itemIndex)}
              </GridItem>
            );
          });
        })}
      </div>
    </GridContainer>
  );
}

export default VirtualGrid;

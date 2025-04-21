import React, { ReactNode } from 'react';
import VirtualList from './VirtualList';
import styled from 'styled-components';

interface InfiniteVirtualListProps<T> {
  items: T[];
  height: number | string;
  width?: number | string;
  estimateSize?: number;
  dynamicSize?: boolean;
  renderItem: (item: T, index: number) => ReactNode;
  overscan?: number;
  className?: string;
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  loadNextPage: () => void;
  loadingIndicator?: ReactNode;
  threshold?: number;
  scrollToIndex?: number;
  scrollToAlignment?: 'start' | 'center' | 'end' | 'auto';
  onScroll?: (scrollOffset: number) => void;
  itemKey?: (index: number) => string | number;
}

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 100%;
`;

const DefaultLoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
  
  &::after {
    content: '';
    width: 20px;
    height: 20px;
    margin-left: 10px;
    border: 2px solid ${({ theme }) => theme.borderColor};
    border-top-color: ${({ theme }) => theme.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

/**
 * Componente de lista virtual con carga infinita para renderizar grandes cantidades de datos
 * con paginación bajo demanda.
 *
 * @template T - Tipo de los elementos de la lista
 */
function InfiniteVirtualList<T>({
  items,
  height,
  width,
  estimateSize = 50,
  dynamicSize = false,
  renderItem,
  overscan = 10,
  className,
  hasNextPage,
  isNextPageLoading,
  loadNextPage,
  loadingIndicator,
  threshold = 5,
  scrollToIndex,
  scrollToAlignment,
  onScroll,
  itemKey
}: InfiniteVirtualListProps<T>) {
  // Función para manejar cuando se renderizan elementos
  const handleItemsRendered = (startIndex: number, endIndex: number) => {
    // Si estamos cerca del final de la lista y hay más páginas, cargar la siguiente
    if (endIndex >= items.length - threshold && hasNextPage && !isNextPageLoading) {
      loadNextPage();
    }
  };

  // Renderizar el indicador de carga
  const renderLoadingIndicator = () => {
    if (isNextPageLoading) {
      return loadingIndicator || (
        <DefaultLoadingIndicator>
          Cargando más elementos...
        </DefaultLoadingIndicator>
      );
    }
    return null;
  };

  // Renderizar elementos con indicador de carga
  const renderItemWithLoading = (item: T | null, index: number) => {
    // Si es el último elemento y estamos cargando más, mostrar indicador
    if (index === items.length && hasNextPage) {
      return (
        <LoadingContainer>
          {renderLoadingIndicator()}
        </LoadingContainer>
      );
    }
    
    // Renderizar elemento normal
    return renderItem(item as T, index);
  };

  // Calcular elementos totales (incluyendo indicador de carga)
  const totalItems = hasNextPage ? [...items, null as any] : items;

  return (
    <VirtualList
      items={totalItems}
      height={height}
      width={width}
      estimateSize={estimateSize}
      dynamicSize={dynamicSize}
      renderItem={renderItemWithLoading}
      overscan={overscan}
      className={className}
      onItemsRendered={handleItemsRendered}
      scrollToIndex={scrollToIndex}
      scrollToAlignment={scrollToAlignment}
      onScroll={onScroll}
      itemKey={itemKey}
    />
  );
}

export default InfiniteVirtualList;

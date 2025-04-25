import React from 'react';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.5rem;
  border: 1px solid ${({ theme, $active }) =>
    $active ? theme.primary : theme.borderColor};
  border-radius: 4px;
  background: ${({ theme, $active }) =>
    $active ? theme.primary : theme.background};
  color: ${({ theme, $active }) =>
    $active ? '#fff' : theme.text};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.primaryHover : theme.backgroundHover};
    border-color: ${({ theme, $active }) =>
      $active ? theme.primaryHover : theme.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: ${({ theme }) => theme.backgroundDisabled};
    border-color: ${({ theme }) => theme.borderColor};
    color: ${({ theme }) => theme.textDisabled};
  }
`;

const Ellipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  color: ${({ theme }) => theme.textSecondary};
`;

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5
}) => {
  // Si no hay páginas, no mostrar nada
  if (totalPages <= 1) {
    return null;
  }

  // Calcular rango de páginas a mostrar
  const getPageRange = () => {
    // Si hay menos páginas que el máximo visible, mostrar todas
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    // Calcular páginas a mostrar
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    // Ajustar si estamos cerca del final
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const pageRange = getPageRange();

  return (
    <Container>
      {/* Botón anterior */}
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        aria-label="Página anterior"
      >
        <FaChevronLeft />
      </PageButton>

      {/* Primera página si no está en el rango */}
      {pageRange[0] > 0 && (
        <>
          <PageButton
            onClick={() => onPageChange(0)}
            $active={currentPage === 0}
          >
            1
          </PageButton>
          {pageRange[0] > 1 && <Ellipsis>...</Ellipsis>}
        </>
      )}

      {/* Páginas visibles */}
      {pageRange.map(page => (
        <PageButton
          key={page}
          onClick={() => onPageChange(page)}
          $active={currentPage === page}
        >
          {page + 1}
        </PageButton>
      ))}

      {/* Última página si no está en el rango */}
      {pageRange[pageRange.length - 1] < totalPages - 1 && (
        <>
          {pageRange[pageRange.length - 1] < totalPages - 2 && <Ellipsis>...</Ellipsis>}
          <PageButton
            onClick={() => onPageChange(totalPages - 1)}
            $active={currentPage === totalPages - 1}
          >
            {totalPages}
          </PageButton>
        </>
      )}

      {/* Botón siguiente */}
      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        aria-label="Página siguiente"
      >
        <FaChevronRight />
      </PageButton>
    </Container>
  );
};

export default Pagination;

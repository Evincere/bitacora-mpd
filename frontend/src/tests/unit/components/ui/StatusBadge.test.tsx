import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import StatusBadge from '@/shared/components/ui/StatusBadge';
import { ActivityStatus } from '@/core/types/models';
import { lightTheme } from '@/shared/styles';

// Mock para getStatusDisplay
jest.mock('@/core/utils/enumTranslations', () => ({
  getStatusDisplay: (status: string) => {
    const translations: Record<string, string> = {
      'PENDIENTE': 'Pendiente',
      'EN_PROGRESO': 'En progreso',
      'COMPLETADA': 'Completado',
      'CANCELADA': 'Cancelado',
      'ARCHIVADA': 'Archivado'
    };
    return translations[status] || status;
  }
}));

// Componente wrapper para proporcionar el tema
const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={lightTheme}>
      {ui}
    </ThemeProvider>
  );
};

describe('StatusBadge component', () => {
  test('renders with string status', () => {
    renderWithTheme(<StatusBadge status="PENDIENTE">Pendiente</StatusBadge>);

    const badge = screen.getByText('Pendiente');
    expect(badge).toBeInTheDocument();
  });

  test('renders with enum status', () => {
    renderWithTheme(<StatusBadge status={ActivityStatus.COMPLETADA}>Completado</StatusBadge>);

    const badge = screen.getByText('Completado');
    expect(badge).toBeInTheDocument();
  });

  test('renders with children text', () => {
    renderWithTheme(<StatusBadge status="PENDIENTE">Texto personalizado</StatusBadge>);

    const badge = screen.getByText('Texto personalizado');
    expect(badge).toBeInTheDocument();
  });

  test('renders with default status when no status is provided', () => {
    renderWithTheme(<StatusBadge>Sin estado</StatusBadge>);

    const badge = screen.getByText('Sin estado');
    expect(badge).toBeInTheDocument();
  });

  test('normalizes different status formats correctly', () => {
    // Probar con formato de enumeración
    const { rerender } = renderWithTheme(
      <StatusBadge status={ActivityStatus.EN_PROGRESO}>En progreso</StatusBadge>
    );
    expect(screen.getByText('En progreso')).toBeInTheDocument();

    // Probar con formato de string
    rerender(
      <ThemeProvider theme={lightTheme}>
        <StatusBadge status="EN_PROGRESO">En progreso</StatusBadge>
      </ThemeProvider>
    );
    expect(screen.getByText('En progreso')).toBeInTheDocument();

    // Probar con formato en minúsculas
    rerender(
      <ThemeProvider theme={lightTheme}>
        <StatusBadge status="en_progreso">En progreso</StatusBadge>
      </ThemeProvider>
    );
    expect(screen.getByText('En progreso')).toBeInTheDocument();
  });
});

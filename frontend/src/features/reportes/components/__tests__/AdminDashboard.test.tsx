import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import React from 'react';
import AdminDashboard from '../AdminDashboard';
import dashboardService from '../../services/dashboardService';

// Mock del servicio
vi.mock('../../services/dashboardService');
const mockDashboardService = vi.mocked(dashboardService);

// Mock de los componentes de gráficos
vi.mock('../BarChart', () => ({
  default: ({ title }: { title: string }) => <div data-testid="bar-chart">{title}</div>
}));

vi.mock('../LineChart', () => ({
  default: ({ title }: { title: string }) => <div data-testid="line-chart">{title}</div>
}));

vi.mock('../PieChart', () => ({
  default: ({ title }: { title: string }) => <div data-testid="pie-chart">{title}</div>
}));

vi.mock('../DataTable', () => ({
  default: ({ title }: { title: string }) => <div data-testid="data-table">{title}</div>,
  Badge: ({ children }: { children: React.ReactNode }) => <span data-testid="badge">{children}</span>
}));

vi.mock('../MetricCard', () => ({
  default: ({ title, value }: { title: string; value: number }) => (
    <div data-testid="metric-card">
      <span>{title}</span>
      <span>{value}</span>
    </div>
  )
}));

vi.mock('../DashboardFilters', () => ({
  default: ({ onApplyFilters }: { onApplyFilters: (filters: any) => void }) => (
    <div data-testid="dashboard-filters">
      <button onClick={() => onApplyFilters({ startDate: '2024-01-01', endDate: '2024-01-31' })}>
        Apply Filters
      </button>
    </div>
  )
}));

vi.mock('../DashboardSkeleton', () => ({
  default: () => <div data-testid="dashboard-skeleton">Loading...</div>
}));

// Theme mock
const mockTheme = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  text: '#1F2937',
  cardBackground: '#FFFFFF',
  border: '#E5E7EB',
  hoverBackground: '#F9FAFB'
};

// Wrapper para providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0
      }
    }
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={mockTheme}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock de datos por defecto
    mockDashboardService.getDashboardMetrics.mockResolvedValue({
      totalTasks: 1000,
      completedTasks: 750,
      pendingTasks: 250,
      overdueTasksCount: 5,
      averageCompletionTime: 24.5,
      activeUsers: 35,
      taskCompletionRate: 87.5,
      taskCreationRate: 15
    });

    mockDashboardService.getTaskStatusMetrics.mockResolvedValue({
      statusDistribution: [
        { status: 'COMPLETED', statusName: 'Completadas', count: 300, percentage: 60.0, color: '#10B981' },
        { status: 'IN_PROGRESS', statusName: 'En Progreso', count: 150, percentage: 30.0, color: '#3B82F6' }
      ],
      statusByCategory: [],
      statusByPriority: [],
      totalTasks: 450
    });

    mockDashboardService.getUserActivityMetrics.mockResolvedValue({
      topActiveUsers: [
        {
          userId: 1,
          username: 'juan.perez',
          fullName: 'Juan Pérez',
          tasksAssigned: 25,
          tasksCompleted: 22,
          completionRate: 88.0
        }
      ],
      userActivityTimeline: [],
      userRoleDistribution: [],
      totalActiveUsers: 45
    });

    mockDashboardService.getCategoryDistribution.mockResolvedValue({
      categories: [
        {
          id: 1,
          name: 'Desarrollo',
          count: 150,
          percentage: 50.0,
          color: '#3B82F6'
        }
      ],
      categoryTrends: [],
      totalTasks: 300
    });

    mockDashboardService.getPriorityDistribution.mockResolvedValue({
      priorities: [
        {
          name: 'HIGH',
          displayName: 'Alta',
          count: 85,
          percentage: 28.3,
          color: '#EF4444'
        }
      ],
      priorityTrends: [],
      totalTasks: 300
    });

    mockDashboardService.getTimelineMetrics.mockResolvedValue({
      taskCreationTimeline: [],
      taskCompletionTimeline: []
    });

    mockDashboardService.getPerformanceMetrics.mockResolvedValue({
      averageResponseTime: 2.3,
      averageResolutionTime: 3.5,
      completionRateByUser: [],
      completionRateByCategory: [],
      completionRateByPriority: []
    });
  });

  it('should show skeleton loader during initial loading', async () => {
    // Arrange
    mockDashboardService.getDashboardMetrics.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );

    // Act
    render(<AdminDashboard />, { wrapper: createWrapper() });

    // Assert
    expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();
  });

  it('should render dashboard content after loading', async () => {
    // Act
    render(<AdminDashboard />, { wrapper: createWrapper() });

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Dashboard Administrativo')).toBeInTheDocument();
    });

    expect(screen.getByTestId('dashboard-filters')).toBeInTheDocument();
    expect(screen.getAllByTestId('metric-card')).toHaveLength(8);
  });

  it('should display metric cards with correct data', async () => {
    // Act
    render(<AdminDashboard />, { wrapper: createWrapper() });

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Total de Tareas')).toBeInTheDocument();
    });

    expect(screen.getByText('1000')).toBeInTheDocument(); // totalTasks
    expect(screen.getByText('750')).toBeInTheDocument();  // completedTasks
    expect(screen.getByText('250')).toBeInTheDocument();  // pendingTasks
    expect(screen.getByText('5')).toBeInTheDocument();    // overdueTasksCount
  });

  it('should render charts when data is available', async () => {
    // Act
    render(<AdminDashboard />, { wrapper: createWrapper() });

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Distribución de Estados de Tareas')).toBeInTheDocument();
    });

    expect(screen.getByText('Distribución de Categorías')).toBeInTheDocument();
    expect(screen.getByText('Distribución de Prioridades')).toBeInTheDocument();
  });

  it('should handle refresh button click', async () => {
    // Act
    render(<AdminDashboard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Dashboard Administrativo')).toBeInTheDocument();
    });

    const refreshButton = screen.getByText('Actualizar');
    fireEvent.click(refreshButton);

    // Assert
    await waitFor(() => {
      expect(mockDashboardService.getDashboardMetrics).toHaveBeenCalledTimes(2);
    });
  });

  it('should handle filter changes', async () => {
    // Act
    render(<AdminDashboard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-filters')).toBeInTheDocument();
    });

    const applyFiltersButton = screen.getByText('Apply Filters');
    fireEvent.click(applyFiltersButton);

    // Assert
    await waitFor(() => {
      expect(mockDashboardService.getTaskStatusMetrics).toHaveBeenCalledWith(
        '2024-01-01T00:00:00',
        '2024-01-31T23:59:59'
      );
    });
  });

  it('should show loading state in refresh button when loading', async () => {
    // Arrange
    mockDashboardService.getDashboardMetrics.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        totalTasks: 1000,
        completedTasks: 750,
        pendingTasks: 250,
        overdueTasksCount: 5,
        averageCompletionTime: 24.5,
        activeUsers: 35,
        taskCompletionRate: 87.5,
        taskCreationRate: 15
      }), 100))
    );

    // Act
    render(<AdminDashboard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Dashboard Administrativo')).toBeInTheDocument();
    });

    const refreshButton = screen.getByText('Actualizar');
    fireEvent.click(refreshButton);

    // Assert - Verificar que el botón muestra estado de carga
    await waitFor(() => {
      expect(refreshButton).toBeDisabled();
    });
  });

  it('should handle export button click', async () => {
    // Arrange
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Act
    render(<AdminDashboard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Dashboard Administrativo')).toBeInTheDocument();
    });

    const exportButton = screen.getByText('Exportar');
    fireEvent.click(exportButton);

    // Assert
    expect(alertSpy).toHaveBeenCalledWith('Funcionalidad de exportación en desarrollo');

    alertSpy.mockRestore();
  });

  it('should render users table when user activity data is available', async () => {
    // Act
    render(<AdminDashboard />, { wrapper: createWrapper() });

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Usuarios Más Activos')).toBeInTheDocument();
    });

    expect(screen.getByTestId('data-table')).toBeInTheDocument();
  });

  it('should pass correct date parameters to service calls', async () => {
    // Act
    render(<AdminDashboard />, { wrapper: createWrapper() });

    // Assert
    await waitFor(() => {
      expect(mockDashboardService.getTaskStatusMetrics).toHaveBeenCalledWith(
        expect.stringMatching(/\d{4}-\d{2}-\d{2}T00:00:00/),
        expect.stringMatching(/\d{4}-\d{2}-\d{2}T23:59:59/)
      );
    });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import React from 'react';
import AdminDashboard from '../components/AdminDashboard';
import api from '@/utils/api-ky';

// Mock del módulo api
vi.mock('@/utils/api-ky', () => ({
  default: {
    get: vi.fn()
  }
}));

const mockApi = vi.mocked(api);

// Mock de los componentes de gráficos para simplificar las pruebas
vi.mock('../components/BarChart', () => ({
  default: ({ title, labels, datasets }: any) => (
    <div data-testid="bar-chart">
      <h3>{title}</h3>
      <div data-testid="chart-labels">{labels?.join(', ')}</div>
      <div data-testid="chart-data">{datasets?.[0]?.data?.join(', ')}</div>
    </div>
  )
}));

vi.mock('../components/PieChart', () => ({
  default: ({ title, labels, data }: any) => (
    <div data-testid="pie-chart">
      <h3>{title}</h3>
      <div data-testid="chart-labels">{labels?.join(', ')}</div>
      <div data-testid="chart-data">{data?.join(', ')}</div>
    </div>
  )
}));

vi.mock('../components/LineChart', () => ({
  default: ({ title }: any) => (
    <div data-testid="line-chart">
      <h3>{title}</h3>
    </div>
  )
}));

vi.mock('../components/DataTable', () => ({
  default: ({ title, data }: any) => (
    <div data-testid="data-table">
      <h3>{title}</h3>
      <div data-testid="table-data">
        {data?.map((item: any, index: number) => (
          <div key={index} data-testid="table-row">
            {item.fullName} - {item.tasksCompleted}
          </div>
        ))}
      </div>
    </div>
  ),
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="badge">{children}</span>
  )
}));

vi.mock('../components/DashboardFilters', () => ({
  default: ({ onApplyFilters }: { onApplyFilters: (filters: any) => void }) => (
    <div data-testid="dashboard-filters">
      <button 
        onClick={() => onApplyFilters({ 
          startDate: '2024-01-01', 
          endDate: '2024-01-31' 
        })}
        data-testid="apply-filters-btn"
      >
        Aplicar Filtros
      </button>
    </div>
  )
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

describe('Dashboard Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should complete full dashboard loading flow with real API responses', async () => {
    // Arrange - Mock de respuestas del backend
    const mockOverviewResponse = {
      totalTasks: 1250,
      activeTasks: 320,
      completedTasks: 930,
      overdueTasks: 12,
      averageResolutionTimeHours: 28.5,
      activeUsers: 67,
      onTimeCompletionRate: 89.2,
      tasksCreatedToday: 18
    };

    const mockTaskStatusResponse = {
      statusDistribution: [
        { status: 'COMPLETED', statusName: 'Completadas', count: 930, percentage: 74.4, color: '#10B981' },
        { status: 'IN_PROGRESS', statusName: 'En Progreso', count: 180, percentage: 14.4, color: '#3B82F6' },
        { status: 'ASSIGNED', statusName: 'Asignadas', count: 140, percentage: 11.2, color: '#F59E0B' }
      ],
      totalTasks: 1250,
      periodStart: '2024-01-01T00:00:00',
      periodEnd: '2024-01-31T23:59:59',
      generatedAt: '2024-01-31T12:00:00'
    };

    const mockUserActivityResponse = {
      topActiveUsers: [
        {
          userId: 1,
          userName: 'Juan Pérez',
          userEmail: 'juan.perez@empresa.com',
          tasksAssigned: 45,
          tasksCompleted: 42,
          completionRate: 93.3,
          averageResolutionTimeHours: 22.1,
          lastActivity: '2024-01-31T10:30:00'
        },
        {
          userId: 2,
          userName: 'María García',
          userEmail: 'maria.garcia@empresa.com',
          tasksAssigned: 38,
          tasksCompleted: 36,
          completionRate: 94.7,
          averageResolutionTimeHours: 19.8,
          lastActivity: '2024-01-31T09:15:00'
        }
      ],
      totalActiveUsers: 67,
      averageTasksPerUser: 12.8,
      averageCompletionRate: 89.2,
      periodStart: '2024-01-01T00:00:00',
      periodEnd: '2024-01-31T23:59:59',
      generatedAt: '2024-01-31T12:00:00'
    };

    const mockCategoryResponse = {
      categoryDistribution: [
        {
          categoryId: 1,
          categoryName: 'Desarrollo',
          categoryDescription: 'Tareas de desarrollo de software',
          count: 450,
          percentage: 36.0,
          completedCount: 380,
          completionRate: 84.4,
          averageResolutionTimeHours: 32.5,
          color: '#3B82F6'
        },
        {
          categoryId: 2,
          categoryName: 'Soporte',
          categoryDescription: 'Tareas de soporte técnico',
          count: 350,
          percentage: 28.0,
          completedCount: 320,
          completionRate: 91.4,
          averageResolutionTimeHours: 18.2,
          color: '#10B981'
        }
      ],
      totalTasks: 1250,
      periodStart: '2024-01-01T00:00:00',
      periodEnd: '2024-01-31T23:59:59',
      generatedAt: '2024-01-31T12:00:00'
    };

    const mockPriorityResponse = {
      priorityDistribution: [
        {
          priority: 'HIGH',
          priorityName: 'Alta',
          priorityOrder: 1,
          count: 285,
          percentage: 22.8,
          completedCount: 260,
          completionRate: 91.2,
          averageResolutionTimeHours: 16.5,
          overdueCount: 8,
          color: '#EF4444'
        },
        {
          priority: 'MEDIUM',
          priorityName: 'Media',
          priorityOrder: 2,
          count: 650,
          percentage: 52.0,
          completedCount: 580,
          completionRate: 89.2,
          averageResolutionTimeHours: 28.3,
          overdueCount: 3,
          color: '#F59E0B'
        }
      ],
      totalTasks: 1250,
      periodStart: '2024-01-01T00:00:00',
      periodEnd: '2024-01-31T23:59:59',
      generatedAt: '2024-01-31T12:00:00'
    };

    // Configurar mocks de API
    mockApi.get.mockImplementation((url: string) => {
      const mockResponse = (data: any) => ({
        json: vi.fn().mockResolvedValue(data)
      });

      if (url === 'admin/dashboard/metrics/overview') {
        return mockResponse(mockOverviewResponse) as any;
      }
      if (url.startsWith('admin/dashboard/metrics/task-status')) {
        return mockResponse(mockTaskStatusResponse) as any;
      }
      if (url.startsWith('admin/dashboard/metrics/user-activity')) {
        return mockResponse(mockUserActivityResponse) as any;
      }
      if (url.startsWith('admin/dashboard/metrics/category-distribution')) {
        return mockResponse(mockCategoryResponse) as any;
      }
      if (url.startsWith('admin/dashboard/metrics/priority-distribution')) {
        return mockResponse(mockPriorityResponse) as any;
      }
      
      return mockResponse({}) as any;
    });

    // Act
    render(<AdminDashboard />, { wrapper: createWrapper() });

    // Assert - Verificar carga inicial
    expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();

    // Esperar a que se carguen los datos
    await waitFor(() => {
      expect(screen.getByText('Dashboard Administrativo')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Verificar métricas principales
    expect(screen.getByText('1250')).toBeInTheDocument(); // totalTasks
    expect(screen.getByText('930')).toBeInTheDocument();  // completedTasks
    expect(screen.getByText('320')).toBeInTheDocument();  // activeTasks
    expect(screen.getByText('12')).toBeInTheDocument();   // overdueTasks

    // Verificar gráficos de estado de tareas
    const pieChart = screen.getByTestId('pie-chart');
    expect(within(pieChart).getByText('Distribución de Estados de Tareas')).toBeInTheDocument();
    expect(within(pieChart).getByTestId('chart-labels')).toHaveTextContent('COMPLETED, IN_PROGRESS, ASSIGNED');
    expect(within(pieChart).getByTestId('chart-data')).toHaveTextContent('930, 180, 140');

    // Verificar tabla de usuarios activos
    const dataTable = screen.getByTestId('data-table');
    expect(within(dataTable).getByText('Usuarios Más Activos')).toBeInTheDocument();
    expect(within(dataTable).getByText('Juan Pérez - 42')).toBeInTheDocument();
    expect(within(dataTable).getByText('María García - 36')).toBeInTheDocument();

    // Verificar gráficos de distribución
    const categoryChart = screen.getByText('Distribución de Categorías').closest('[data-testid="bar-chart"]');
    expect(categoryChart).toBeInTheDocument();
    expect(within(categoryChart!).getByTestId('chart-labels')).toHaveTextContent('Desarrollo, Soporte');
    expect(within(categoryChart!).getByTestId('chart-data')).toHaveTextContent('450, 350');

    const priorityChart = screen.getByText('Distribución de Prioridades').closest('[data-testid="bar-chart"]');
    expect(priorityChart).toBeInTheDocument();
    expect(within(priorityChart!).getByTestId('chart-labels')).toHaveTextContent('HIGH, MEDIUM');
    expect(within(priorityChart!).getByTestId('chart-data')).toHaveTextContent('285, 650');
  });

  it('should handle filter changes and refresh data', async () => {
    // Arrange
    const mockResponse = {
      statusDistribution: [
        { status: 'COMPLETED', statusName: 'Completadas', count: 100, percentage: 50.0, color: '#10B981' }
      ],
      totalTasks: 200
    };

    mockApi.get.mockReturnValue({
      json: vi.fn().mockResolvedValue(mockResponse)
    } as any);

    // Act
    render(<AdminDashboard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Dashboard Administrativo')).toBeInTheDocument();
    });

    // Aplicar filtros
    const applyFiltersBtn = screen.getByTestId('apply-filters-btn');
    fireEvent.click(applyFiltersBtn);

    // Assert
    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith(
        expect.stringContaining('admin/dashboard/metrics/task-status?startDate=2024-01-01T00%3A00%3A00&endDate=2024-01-31T23%3A59%3A59')
      );
    });
  });

  it('should handle refresh functionality', async () => {
    // Arrange
    const mockResponse = { totalTasks: 1000, activeTasks: 200, completedTasks: 800 };
    mockApi.get.mockReturnValue({
      json: vi.fn().mockResolvedValue(mockResponse)
    } as any);

    // Act
    render(<AdminDashboard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Dashboard Administrativo')).toBeInTheDocument();
    });

    const refreshBtn = screen.getByText('Actualizar');
    fireEvent.click(refreshBtn);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });

    // Verificar que se llamaron todos los endpoints nuevamente
    expect(mockApi.get).toHaveBeenCalledWith('admin/dashboard/metrics/overview');
    expect(mockApi.get).toHaveBeenCalledWith(expect.stringContaining('admin/dashboard/metrics/task-status'));
    expect(mockApi.get).toHaveBeenCalledWith(expect.stringContaining('admin/dashboard/metrics/user-activity'));
  });

  it('should handle API errors gracefully', async () => {
    // Arrange
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockApi.get.mockReturnValue({
      json: vi.fn().mockRejectedValue(new Error('API Error'))
    } as any);

    // Act
    render(<AdminDashboard />, { wrapper: createWrapper() });

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();
    });

    // El skeleton debería permanecer visible cuando hay errores
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});

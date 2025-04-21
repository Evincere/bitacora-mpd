import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiPlus,
  FiFilter,
  FiSearch,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiList,
  FiGrid,
  FiCalendar
} from 'react-icons/fi';
// Importar con aserción de tipo para evitar errores
import authService from '../../services/authService.js';
import { useActivities } from '@/hooks/useActivities';
import ActivityListSkeleton from './components/ActivityListSkeleton';
import ActivityGridSkeleton from './components/ActivityGridSkeleton';
import ActivityFormSkeleton from './components/ActivityFormSkeleton';
import ActivityFilters from './components/ActivityFilters';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { ServerErrorState, ConnectionErrorState, NoDataErrorState, AuthErrorState } from '@/components/common/ErrorStates';
import MockDataBanner from '@/components/common/MockDataBanner';
import ErrorBanner from '@/components/common/ErrorBanner';
import useDebounce from '@/hooks/useDebounce';
import { ActivityQueryParams } from '@/types/api';
import { Activity } from '@/types/models';
import { ApiError } from '@/types/error';

// Lazy load components
const ActivityList = lazy(() => import('./components/ActivityList'));
const ActivityGrid = lazy(() => import('./components/ActivityGrid'));
const ActivityForm = lazy(() => import('./components/ActivityForm'));

// Estilos (mantener los existentes)
const ActivitiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Button = styled.button<{ primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: ${({ primary, theme }) => primary ? theme.primary : theme.backgroundSecondary};
  color: ${({ primary, theme }) => primary ? 'white' : theme.text};
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s, opacity 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ primary, theme }) => primary ? theme.buttonHover : theme.inputBackground};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    flex: ${({ primary }) => primary ? '1' : 'initial'};
  }
`;

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px 8px 36px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.textSecondary};
`;

const ClearButton = styled.button<{ show: boolean }>`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.textSecondary};
  display: ${({ show }) => show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

const ViewToggle = styled.div`
  display: flex;
  border-radius: 4px;
  overflow: hidden;
`;

const ViewButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: ${({ active, theme }) => active ? theme.primary : theme.backgroundSecondary};
  color: ${({ active, theme }) => active ? 'white' : theme.textSecondary};
  transition: background-color 0.2s, color 0.2s, opacity 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ active, theme }) => active ? theme.buttonHover : theme.inputBackground};
    color: ${({ active, theme }) => active ? 'white' : theme.text};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const PaginationInfo = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};

  span {
    font-weight: 500;
    color: ${({ theme }) => theme.text};
  }
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;



const PageButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background-color: ${({ active, theme }) => active ? theme.primary : theme.backgroundSecondary};
  color: ${({ active, theme }) => active ? 'white' : theme.text};
  font-weight: ${({ active }) => active ? '600' : '400'};

  &:hover {
    background-color: ${({ active, theme }) => active ? theme.buttonHover : theme.inputBackground};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.backgroundSecondary};
    color: ${({ theme }) => theme.textSecondary};
    cursor: not-allowed;
  }
`;

const Activities = () => {
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState<ActivityQueryParams>({
    page: 0,
    size: 10,
    type: '',
    status: '',
    startDate: '',
    endDate: '',
    search: ''
  });

  const { data, isLoading, isError, error, refetch, isFetching } = useActivities(queryParams);
  const isLoadingData = isLoading || isFetching;

  // Tipado para el error
  const apiError = error as ApiError;

  // Agregar log para ver la estructura exacta de los datos recibidos
  useEffect(() => {
    if (data) {
      console.log('Datos recibidos del backend:', data);
      console.log('Estructura JSON:', JSON.stringify(data, null, 2));

      // Tipado seguro para data
      const typedData = data as ActivityResponse;

      // Verificar si data.activities existe y es un array
      if (typedData.activities && Array.isArray(typedData.activities)) {
        console.log('data.activities es un array con', typedData.activities.length, 'elementos');
        if (typedData.activities.length > 0) {
          console.log('Primer elemento de data.activities:', typedData.activities[0]);
        }
      } else {
        console.warn('data.activities no es un array o no existe');
        console.log('Tipo de data:', typeof data);

        // Si data es un array directamente
        if (Array.isArray(data)) {
          console.log('data es un array con', data.length, 'elementos');
          if (data.length > 0) {
            console.log('Primer elemento de data:', data[0]);
          }
        }

        // Si data tiene una propiedad content (formato Spring)
        if (typedData.content && Array.isArray(typedData.content)) {
          console.log('data.content es un array con', typedData.content.length, 'elementos');
          if (typedData.content.length > 0) {
            console.log('Primer elemento de data.content:', typedData.content[0]);
          }
        }
      }
    } else {
      console.warn('No se recibieron datos del backend');
    }
  }, [data]);

  // Usar datos en caché si están disponibles y no hay datos del backend
  const getCachedData = () => {
    try {
      const cachedData = localStorage.getItem('activities-data');
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    } catch (e) {
      console.error('Error al leer datos en caché:', e);
    }
    return null;
  };

  // Definir interfaces para los diferentes formatos de datos
  interface ActivityResponse {
    activities?: Activity[];
    totalCount?: number;
    content?: Activity[];
    totalElements?: number;
  }

  // Simplificar el adaptador de datos para reducir re-renderizados
  const adaptData = React.useMemo(() => {
    // Si no hay datos del backend, intentar usar datos en caché
    const dataToUse = data as ActivityResponse || getCachedData() as ActivityResponse;

    if (!dataToUse) {
      console.warn('No hay datos disponibles');
      return { activities: [] as Activity[], totalCount: 0 };
    }

    // Extraer actividades y totalCount
    let activities: Activity[] = [];
    let totalCount = 0;

    // Si ya tiene el formato esperado
    if (dataToUse.activities && Array.isArray(dataToUse.activities)) {
      activities = dataToUse.activities;
      totalCount = dataToUse.totalCount || activities.length;
    }
    // Si es un array directamente
    else if (Array.isArray(dataToUse)) {
      activities = dataToUse as unknown as Activity[];
      totalCount = activities.length;
    }
    // Si es una respuesta paginada de Spring
    else if (dataToUse.content && Array.isArray(dataToUse.content)) {
      activities = dataToUse.content;
      totalCount = dataToUse.totalElements || activities.length;
    }
    // Si no se puede adaptar
    else {
      console.warn('Formato de datos no reconocido');
      return { activities: [] as Activity[], totalCount: 0 };
    }

    return {
      activities,
      totalCount
    };
  }, [data]);

  const activities = adaptData.activities;
  const totalCount = adaptData.totalCount;

  // Agregar log para ver si las actividades se están extrayendo correctamente
  useEffect(() => {
    console.log('Actividades extraídas (adaptadas):', activities);
    if (activities.length > 0) {
      console.log('Primera actividad (adaptada):', activities[0]);
    }
  }, [activities]);

  // Detectar si estamos usando datos simulados y manejar errores
  const [usingMockData, setUsingMockData] = useState(false);
  const [errorInfo, setErrorInfo] = useState<{ message: string; type: string } | null>(null);

  // Usar una referencia para evitar múltiples ejecuciones del efecto
  const dataRef = React.useRef(data);
  const errorRef = React.useRef(error);
  const isErrorRef = React.useRef(isError);

  // Efecto para manejar errores (simplificado para reducir re-renderizados)
  useEffect(() => {
    // Solo procesar errores si hay un cambio real y no hay datos
    if (isError && error && !data && (error !== errorRef.current || isError !== isErrorRef.current)) {
      // Actualizar referencias
      errorRef.current = error;
      isErrorRef.current = isError;

      // Manejar errores específicos
      let errorMessage = 'Error al cargar actividades';
      let errorType = 'error';

      if (apiError.status === 404) {
        errorMessage = 'No se encontraron actividades. Puede que no haya actividades registradas.';
        errorType = 'info';
      } else if (apiError.status === 500) {
        errorMessage = 'Error interno del servidor al cargar actividades. Por favor, intenta nuevamente más tarde.';
        errorType = 'error';
      } else if (apiError.status === 401 || apiError.status === 403) {
        errorMessage = 'No tienes permisos para acceder a las actividades. Por favor, inicia sesión nuevamente.';
        errorType = 'warning';
      } else if (apiError.message?.includes('Failed to fetch') || apiError.message?.includes('Network Error')) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet o que el servidor esté en funcionamiento.';
        errorType = 'error';
      } else {
        // Error genérico
        errorMessage = apiError.message || 'Error desconocido al cargar actividades';
        errorType = 'error';
      }

      setErrorInfo({ message: errorMessage, type: errorType });
    } else if (!isError && data && data !== dataRef.current) {
      // Si tenemos datos nuevos y no hay error, limpiar cualquier error previo
      dataRef.current = data;
      setErrorInfo(null);

      // Guardar datos en localStorage para uso futuro
      try {
        localStorage.setItem('activities-data', JSON.stringify(data));
      } catch (e) {
        console.error('Error al guardar datos en localStorage:', e);
      }
    }
  }, [data, isError, error]);

  // Efecto simplificado para detectar datos simulados (se ejecuta solo una vez)
  useEffect(() => {
    // Establecer un valor fijo para usingMockData basado en localStorage
    const mockDataFlag = localStorage.getItem('using-mock-data');
    if (mockDataFlag === 'true') {
      setUsingMockData(true);
    } else if (data) {
      const typedData = data as ActivityResponse;
      if (typedData.activities && typedData.activities.length > 0) {
        // Si tenemos datos reales, no estamos usando datos simulados
        setUsingMockData(false);
        localStorage.setItem('using-mock-data', 'false');
      }
    }
  }, [data]);

  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // Debounce de 500ms
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);

      if (!isAuth) {
        console.warn('Usuario no autenticado. Redirigiendo a login...');
      }
    };

    checkAuth();
  }, []);

  // Efecto para aplicar la búsqueda con debounce
  useEffect(() => {
    // Solo actualizar si el valor de búsqueda ha cambiado realmente
    if (debouncedSearchQuery !== queryParams.search) {
      // Usar un timeout para evitar múltiples actualizaciones en un ciclo de renderizado
      const timeoutId = setTimeout(() => {
        setQueryParams(prev => ({ ...prev, search: debouncedSearchQuery, page: 0 }));
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [debouncedSearchQuery, queryParams.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // No es necesario actualizar queryParams aquí, ya que el efecto lo hará automáticamente
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setQueryParams(prev => ({ ...prev, search: '', page: 0 }));
  };

  const handlePageChange = (newPage: number) => {
    setQueryParams(prev => ({ ...prev, page: newPage - 1 })); // Ajustar para API Spring (0-based)
  };

  const handleApplyFilters = (filters: Partial<ActivityQueryParams>) => {
    setQueryParams(prev => ({ ...prev, ...filters, page: 0 }));
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setQueryParams({
      page: 0,
      size: 10,
      type: '',
      status: '',
      startDate: '',
      endDate: '',
      search: ''
    });
    setSearchQuery('');
  };

  const handleViewCalendar = () => {
    navigate('/app/activities/calendar');
  };

  const totalPages = Math.ceil(totalCount / (queryParams.size || 10));
  const currentPage = (queryParams.page || 0) + 1; // Ajustar desde API Spring (0-based)

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PageButton
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </PageButton>
      );
    }

    return (
      <PaginationControls>
        <PageButton
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <FiChevronLeft size={18} />
        </PageButton>

        {pages}

        <PageButton
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <FiChevronRight size={18} />
        </PageButton>
      </PaginationControls>
    );
  };

  // Forzar la visualización de actividades si hay datos disponibles
  const forceShowActivities = activities.length > 0;

  return (
    <ActivitiesContainer>
      {usingMockData && (
        <MockDataBanner message="Estás viendo datos simulados porque el backend no tiene implementado el endpoint de actividades." />
      )}
      {errorInfo && !isLoadingData && !forceShowActivities && (
        <ErrorBanner
          message={errorInfo.message}
          type={errorInfo.type as 'error' | 'warning' | 'info'}
          onClose={() => setErrorInfo(null)}
        />
      )}


      <PageHeader>
        <Title>Actividades</Title>
        <ActionButtons>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            disabled={isLoading || !isAuthenticated}
          >
            <FiFilter size={16} />
            Filtros
          </Button>
          <Button
            primary
            onClick={() => setShowForm(true)}
            disabled={isLoading || !isAuthenticated}
          >
            <FiPlus size={16} />
            Nueva Actividad
          </Button>
        </ActionButtons>
      </PageHeader>

      {showFilters && (
        <ActivityFilters
          onClose={() => setShowFilters(false)}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          initialFilters={queryParams}
        />
      )}

      <ToolbarContainer>
        <SearchContainer>
          <SearchIcon>
            <FiSearch size={16} />
          </SearchIcon>
          <form onSubmit={handleSearch}>
            <SearchInput
              placeholder="Buscar actividades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading || !isAuthenticated}
            />
          </form>
          <ClearButton
            show={searchQuery.length > 0}
            onClick={handleClearSearch}
          >
            <FiX size={16} />
          </ClearButton>
        </SearchContainer>

        <ViewToggle>
          <ViewButton
            active={viewMode === 'list'}
            onClick={() => setViewMode('list')}
            disabled={isLoading || !isAuthenticated}
          >
            <FiList size={18} />
          </ViewButton>
          <ViewButton
            active={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
            disabled={isLoading || !isAuthenticated}
          >
            <FiGrid size={18} />
          </ViewButton>
          <ViewButton
            active={false}
            onClick={handleViewCalendar}
            disabled={!isAuthenticated}
          >
            <FiCalendar size={18} />
          </ViewButton>
        </ViewToggle>
      </ToolbarContainer>

      <ErrorBoundary onReset={refetch}>
        {!isAuthenticated ? (
          <AuthErrorState onLogin={() => navigate('/login')} />
        ) : isLoadingData ? (
          viewMode === 'list' ? <ActivityListSkeleton /> : <ActivityGridSkeleton />
        ) : isError ? (
          apiError?.status === 500 ? (
            <ServerErrorState error={apiError} onRetry={() => refetch()} />
          ) : apiError?.message?.includes('Failed to fetch') || apiError?.message?.includes('Network Error') || apiError?.status === 404 ? (
            <ConnectionErrorState onRetry={() => refetch()} error={apiError} />
          ) : (
            <ServerErrorState error={apiError} onRetry={() => refetch()} />
          )
        ) : activities.length === 0 ? (
          <NoDataErrorState onClearFilters={handleClearFilters} />
        ) : viewMode === 'list' ? (
          <Suspense fallback={<ActivityListSkeleton />}>
            <ActivityList activities={activities} />
          </Suspense>
        ) : (
          <Suspense fallback={<ActivityGridSkeleton />}>
            <ActivityGrid activities={activities} />
          </Suspense>
        )}
      </ErrorBoundary>

      {!isLoadingData && !isError && activities.length > 0 && (
        <PaginationContainer>
          <PaginationInfo>
            Mostrando <span>{activities.length}</span> de <span>{totalCount}</span> actividades
          </PaginationInfo>

          {renderPagination()}
        </PaginationContainer>
      )}

      {showForm && (
        <Suspense fallback={<ActivityFormSkeleton />}>
          <ActivityForm onClose={() => setShowForm(false)} />
        </Suspense>
      )}
    </ActivitiesContainer>
  );
};

export default Activities;

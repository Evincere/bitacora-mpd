import React, { useEffect, useState, useMemo } from 'react';
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
  FiAlertCircle,
  FiLoader,
  FiInbox,
  FiLock
} from 'react-icons/fi';
import authService from '../../services/authService';
import {
  useActivitiesQuery,
  useCreateActivity,
  useUpdateActivity,
  useDeleteActivity
} from '../../hooks/useActivitiesQuery';
import ActivityList from './components/ActivityList';
import ActivityGrid from './components/ActivityGrid';
import ActivityFilters from './components/ActivityFilters';
import ActivityForm from './components/ActivityForm';
// Componente de prueba eliminado
import useDebounce from '../../hooks/useDebounce';

// Componentes estilizados (mantener los mismos que en el archivo original)
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

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: ${({ $primary, theme }) => $primary ? theme.primary : theme.backgroundSecondary};
  color: ${({ $primary, theme }) => $primary ? 'white' : theme.text};
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s, opacity 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ $primary, theme }) => $primary ? theme.buttonHover : theme.inputBackground};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    flex: ${({ $primary }) => $primary ? '1' : 'initial'};
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

const ClearButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.textSecondary};
  display: ${({ $show }) => $show ? 'flex' : 'none'};
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

const ViewButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: ${({ $active, theme }) => $active ? theme.primary : theme.backgroundSecondary};
  color: ${({ $active, theme }) => $active ? 'white' : theme.textSecondary};
  transition: background-color 0.2s, color 0.2s, opacity 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ $active, theme }) => $active ? theme.buttonHover : theme.inputBackground};
    color: ${({ $active, theme }) => $active ? 'white' : theme.text};
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

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};

  svg {
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
    color: ${({ theme }) => theme.primary};
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  p {
    font-size: 16px;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};

  svg {
    color: ${({ theme }) => theme.error};
    margin-bottom: 16px;
  }

  h3 {
    font-size: 18px;
    margin: 0 0 8px 0;
    color: ${({ theme }) => theme.error};
  }

  p {
    font-size: 14px;
    color: ${({ theme }) => theme.textSecondary};
    text-align: center;
    margin-bottom: 16px;
  }

  button {
    padding: 8px 16px;
    background-color: ${({ theme }) => theme.primary};
    color: white;
    border-radius: 4px;
    font-weight: 500;

    &:hover {
      background-color: ${({ theme }) => theme.buttonHover};
    }
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};

  svg {
    color: ${({ theme }) => theme.textSecondary};
    margin-bottom: 16px;
  }

  h3 {
    font-size: 18px;
    margin: 0 0 8px 0;
    color: ${({ theme }) => theme.text};
  }

  p {
    font-size: 14px;
    color: ${({ theme }) => theme.textSecondary};
    text-align: center;
    margin-bottom: 16px;
  }

  button {
    padding: 8px 16px;
    background-color: ${({ theme }) => theme.primary};
    color: white;
    border-radius: 4px;
    font-weight: 500;

    &:hover {
      background-color: ${({ theme }) => theme.buttonHover};
    }
  }
`;

const AuthErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};

  svg {
    color: ${({ theme }) => theme.error};
    margin-bottom: 16px;
  }

  h3 {
    font-size: 18px;
    margin: 0 0 8px 0;
    color: ${({ theme }) => theme.error};
  }

  p {
    font-size: 14px;
    color: ${({ theme }) => theme.textSecondary};
    text-align: center;
    margin-bottom: 16px;
  }

  button {
    padding: 8px 16px;
    background-color: ${({ theme }) => theme.primary};
    color: white;
    border-radius: 4px;
    font-weight: 500;

    &:hover {
      background-color: ${({ theme }) => theme.buttonHover};
    }
  }
`;

const PageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background-color: ${({ $active, theme }) => $active ? theme.primary : theme.backgroundSecondary};
  color: ${({ $active, theme }) => $active ? 'white' : theme.text};
  font-weight: ${({ $active }) => $active ? '600' : '400'};

  &:hover {
    background-color: ${({ $active, theme }) => $active ? theme.buttonHover : theme.inputBackground};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.backgroundSecondary};
    color: ${({ theme }) => theme.textSecondary};
    cursor: not-allowed;
  }
`;

const ActivitiesWithQuery = () => {
  const navigate = useNavigate();

  // Estado local
  const [queryParams, setQueryParams] = useState({
    page: 0, // La página comienza en 0 para la API, pero se muestra como 1 en la UI
    size: 10,
    sort: 'createdAt,desc',
    type: '',
    status: '',
    startDate: '',
    endDate: '',
    search: ''
  });

  // Validar que los parámetros de paginación sean válidos
  const validatedQueryParams = useMemo(() => {
    return {
      ...queryParams,
      // Asegurar que page nunca sea negativo
      page: Math.max(0, queryParams.page),
      // Asegurar que size esté entre 1 y 100
      size: Math.min(Math.max(1, queryParams.size), 100)
    };
  }, [queryParams]);
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Asumimos que está autenticado inicialmente
  const [errorInfo, setErrorInfo] = useState(null);

  // Debounce para la búsqueda
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Consulta de actividades con React Query
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useActivitiesQuery(validatedQueryParams, {
    enabled: isAuthenticated,
    onError: (error) => {
      console.error('Error al cargar actividades:', error);

      // Manejar errores específicos
      let errorMessage = 'Error al cargar actividades';
      let errorType = 'error';

      if (error.status === 404) {
        errorMessage = 'No se encontraron actividades. Puede que no haya actividades registradas.';
        errorType = 'info';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor al cargar actividades. Por favor, intenta nuevamente más tarde.';
        errorType = 'error';
      } else if (error.status === 401 || error.status === 403) {
        errorMessage = 'No tienes permisos para acceder a las actividades. Por favor, inicia sesión nuevamente.';
        errorType = 'warning';
      } else if (error.message?.includes('Failed to fetch') || error.message?.includes('Network Error')) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet o que el servidor esté en funcionamiento.';
        errorType = 'error';
      } else {
        // Error genérico
        errorMessage = error.message || 'Error desconocido al cargar actividades';
        errorType = 'error';
      }

      setErrorInfo({ message: errorMessage, type: errorType });
    }
  });

  // Mutaciones para operaciones CRUD
  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();
  const deleteActivity = useDeleteActivity();

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
    if (debouncedSearchQuery !== queryParams.search) {
      setQueryParams(prev => ({ ...prev, search: debouncedSearchQuery, page: 0 }));
    }
  }, [debouncedSearchQuery, queryParams.search]);

  // Efecto para guardar datos en localStorage para uso futuro
  useEffect(() => {
    if (data && data.activities && data.activities.length > 0) {
      try {
        localStorage.setItem('activities-data', JSON.stringify(data));
      } catch (e) {
        console.error('Error al guardar datos en localStorage:', e);
      }
    }
  }, [data]);

  // Adaptar los datos recibidos al formato esperado
  const adaptedData = useMemo(() => {
    if (!data) return { activities: [], totalCount: 0 };

    // Si ya tiene el formato esperado
    if (data.activities && Array.isArray(data.activities)) {
      return {
        activities: data.activities,
        totalCount: data.totalCount || data.activities.length
      };
    }

    // Si es un array directamente
    if (Array.isArray(data)) {
      return {
        activities: data,
        totalCount: data.length
      };
    }

    // Si es una respuesta paginada de Spring
    if (data.content && Array.isArray(data.content)) {
      return {
        activities: data.content,
        totalCount: data.totalElements || data.content.length
      };
    }

    // Si no se puede adaptar
    console.warn('Formato de datos no reconocido');
    return { activities: [], totalCount: 0 };
  }, [data]);

  const activities = adaptedData.activities;
  const totalCount = adaptedData.totalCount;
  const isLoadingData = isLoading || isFetching;

  // Handlers
  const handleSearch = (e) => {
    e.preventDefault();
    // No es necesario actualizar queryParams aquí, ya que el efecto lo hará automáticamente
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handlePageChange = (newPage) => {
    // Asegurar que newPage sea válido antes de actualizar el estado
    const validPage = Math.max(1, newPage);
    setQueryParams(prev => ({ ...prev, page: validPage - 1 })); // Ajustar para base 0
  };

  const handleClearFilters = () => {
    setQueryParams({
      page: 0,
      size: 10,
      sort: 'createdAt,desc',
      type: '',
      status: '',
      startDate: '',
      endDate: '',
      search: ''
    });
    setSearchQuery('');
  };

  const handleApplyFilters = (filters) => {
    setQueryParams(prev => ({
      ...prev,
      ...filters,
      page: 0 // Resetear a la primera página
    }));
  };

  // Calcular el número total de páginas
  const page = queryParams.page + 1; // Ajustar para base 1 en la UI
  const limit = queryParams.size;
  const totalPages = Math.ceil(totalCount / limit);

  // Renderizar paginación
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PageButton
          key={i}
          $active={i === page}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </PageButton>
      );
    }

    return (
      <PaginationControls>
        <PageButton
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          <FiChevronLeft size={18} />
        </PageButton>

        {pages}

        <PageButton
          disabled={page === totalPages || totalPages === 0}
          onClick={() => handlePageChange(page + 1)}
        >
          <FiChevronRight size={18} />
        </PageButton>
      </PaginationControls>
    );
  };

  // Verificar si hay actividades para mostrar
  const hasActivities = activities.length > 0;

  return (
    <ActivitiesContainer>
      <PageHeader>
        <Title>Actividades</Title>
        <ActionButtons>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            disabled={isLoadingData || !isAuthenticated}
          >
            <FiFilter size={16} />
            Filtros
          </Button>
          <Button
            $primary
            onClick={() => setShowForm(true)}
            disabled={isLoadingData || !isAuthenticated}
          >
            <FiPlus size={16} />
            Nueva Actividad
          </Button>
        </ActionButtons>
      </PageHeader>

      {showFilters && (
        <ActivityFilters
          onClose={() => setShowFilters(false)}
          onClearFilters={handleClearFilters}
          onApplyFilters={handleApplyFilters}
          initialFilters={{
            type: queryParams.type,
            status: queryParams.status,
            startDate: queryParams.startDate,
            endDate: queryParams.endDate
          }}
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
              disabled={isLoadingData || !isAuthenticated}
            />
          </form>
          <ClearButton
            $show={searchQuery.length > 0}
            onClick={handleClearSearch}
          >
            <FiX size={16} />
          </ClearButton>
        </SearchContainer>

        <ViewToggle>
          <ViewButton
            $active={viewMode === 'list'}
            onClick={() => setViewMode('list')}
            disabled={isLoadingData || !isAuthenticated}
          >
            <FiList size={18} />
          </ViewButton>
          <ViewButton
            $active={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
            disabled={isLoadingData || !isAuthenticated}
          >
            <FiGrid size={18} />
          </ViewButton>
        </ViewToggle>
      </ToolbarContainer>


      {errorInfo && !isLoadingData && !hasActivities && (
        <div style={{ padding: '10px', marginBottom: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
          {errorInfo.message}
        </div>
      )}

      {!isAuthenticated ? (
        <AuthErrorContainer>
          <FiLock size={40} />
          <h3>Acceso restringido</h3>
          <p>Debes iniciar sesión para ver las actividades.</p>
          <button onClick={() => navigate('/login')}>
            Iniciar sesión
          </button>
        </AuthErrorContainer>
      ) : isLoadingData && !hasActivities ? (
        <LoadingContainer>
          <FiLoader size={40} />
          <p>Cargando actividades...</p>
        </LoadingContainer>
      ) : isError && !hasActivities ? (
        <ErrorContainer>
          <FiAlertCircle size={40} />
          <h3>Error al cargar actividades</h3>
          <p>{error?.message || 'Ha ocurrido un error al cargar las actividades. Por favor, intenta nuevamente.'}</p>
          <button onClick={() => refetch()}>
            Reintentar
          </button>
        </ErrorContainer>
      ) : activities.length === 0 ? (
        <EmptyContainer>
          <FiInbox size={40} />
          <h3>No hay actividades</h3>
          <p>No se encontraron actividades que coincidan con los criterios de búsqueda.</p>
          <button onClick={handleClearFilters}>
            Limpiar filtros
          </button>
        </EmptyContainer>
      ) : viewMode === 'list' ? (
        <ActivityList
          activities={activities}
          onDelete={(id) => deleteActivity.mutate(id)}
          onEdit={(activity) => {
            // Lógica para editar actividad
            console.log('Editar actividad:', activity);
          }}
        />
      ) : (
        <ActivityGrid
          activities={activities}
          onDelete={(id) => deleteActivity.mutate(id)}
          onEdit={(activity) => {
            // Lógica para editar actividad
            console.log('Editar actividad:', activity);
          }}
        />
      )}

      {!isLoadingData && !isError && activities.length > 0 && (
        <PaginationContainer>
          <PaginationInfo>
            Mostrando <span>{activities.length}</span> de <span>{totalCount}</span> actividades
          </PaginationInfo>

          {renderPagination()}
        </PaginationContainer>
      )}

      {showForm && (
        <ActivityForm
          onClose={() => setShowForm(false)}
          onSubmit={(activityData) => {
            createActivity.mutate(activityData, {
              onSuccess: () => {
                setShowForm(false);
              }
            });
          }}
        />
      )}


    </ActivitiesContainer>
  );
};

export default ActivitiesWithQuery;

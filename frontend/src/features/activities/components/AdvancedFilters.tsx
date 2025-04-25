import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { FiFilter, FiSave, FiTrash2, FiClock, FiCalendar, FiUser, FiTag, FiList, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { AuthContext } from '@/contexts/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ActivityType, ActivityStatus } from '@/types/models';
import DateRangePicker from '@/components/common/DateRangePicker';
import MultiSelect from '@/components/common/MultiSelect';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export interface FilterConfig {
  id: string;
  name: string;
  dateRange?: [Date | null, Date | null];
  types?: ActivityType[];
  statuses?: ActivityStatus[];
  assignedTo?: number[];
  departments?: string[];
  tags?: string[];
}

export interface AdvancedFiltersProps {
  onApplyFilters: (filters: any) => void;
  initialFilters?: any;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ onApplyFilters, initialFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<ActivityStatus[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [savedFilters, setSavedFilters] = useLocalStorage<FilterConfig[]>('saved-filters', []);
  const [filterName, setFilterName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const toast = useToast();
  const { currentUser } = useContext(AuthContext);

  // Cargar filtros iniciales si existen
  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.dateFrom && initialFilters.dateTo) {
        setDateRange([new Date(initialFilters.dateFrom), new Date(initialFilters.dateTo)]);
      }
      if (initialFilters.types) {
        setSelectedTypes(Array.isArray(initialFilters.types)
          ? initialFilters.types
          : [initialFilters.types]);
      }
      if (initialFilters.statuses) {
        setSelectedStatuses(Array.isArray(initialFilters.statuses)
          ? initialFilters.statuses
          : [initialFilters.statuses]);
      }
      // Cargar otros filtros iniciales...
    }
  }, [initialFilters]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleApplyFilters = () => {
    const filters: any = {};

    if (dateRange[0]) filters.dateFrom = dateRange[0].toISOString();
    if (dateRange[1]) filters.dateTo = dateRange[1].toISOString();
    if (selectedTypes.length > 0) filters.types = selectedTypes;
    if (selectedStatuses.length > 0) filters.statuses = selectedStatuses;
    if (selectedUsers.length > 0) filters.assignedTo = selectedUsers;
    if (selectedDepartments.length > 0) filters.departments = selectedDepartments;
    if (selectedTags.length > 0) filters.tags = selectedTags;

    onApplyFilters(filters);
  };

  const handleClearFilters = () => {
    setDateRange([null, null]);
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setSelectedUsers([]);
    setSelectedDepartments([]);
    setSelectedTags([]);
    onApplyFilters({});
  };

  const handleSaveFilter = () => {
    if (!filterName.trim()) {
      toast.error('Por favor ingrese un nombre para el filtro');
      return;
    }

    const newFilter: FilterConfig = {
      id: Date.now().toString(),
      name: filterName,
      dateRange,
      types: selectedTypes.length > 0 ? selectedTypes : undefined,
      statuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      assignedTo: selectedUsers.length > 0 ? selectedUsers : undefined,
      departments: selectedDepartments.length > 0 ? selectedDepartments : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined
    };

    setSavedFilters([...savedFilters, newFilter]);
    setFilterName('');
    setShowSaveDialog(false);
    toast.success(`Filtro "${filterName}" guardado correctamente`);
  };

  const handleApplySavedFilter = (filter: FilterConfig) => {
    if (filter.dateRange) setDateRange(filter.dateRange);
    if (filter.types) setSelectedTypes(filter.types);
    if (filter.statuses) setSelectedStatuses(filter.statuses);
    if (filter.assignedTo) setSelectedUsers(filter.assignedTo);
    if (filter.departments) setSelectedDepartments(filter.departments);
    if (filter.tags) setSelectedTags(filter.tags);

    const filters: any = {};
    if (filter.dateRange && filter.dateRange[0]) filters.dateFrom = filter.dateRange[0].toISOString();
    if (filter.dateRange && filter.dateRange[1]) filters.dateTo = filter.dateRange[1].toISOString();
    if (filter.types) filters.types = filter.types;
    if (filter.statuses) filters.statuses = filter.statuses;
    if (filter.assignedTo) filters.assignedTo = filter.assignedTo;
    if (filter.departments) filters.departments = filter.departments;
    if (filter.tags) filters.tags = filter.tags;

    onApplyFilters(filters);
    toast.info(`Filtro "${filter.name}" aplicado`);
  };

  const handleDeleteSavedFilter = (id: string) => {
    setSavedFilters(savedFilters.filter(filter => filter.id !== id));
    toast.info('Filtro eliminado');
  };

  const handleApplyQuickFilter = (filterType: string) => {
    let filters: any = {};

    switch (filterType) {
      case 'myActivities':
        // Obtener el ID del usuario actual del contexto de autenticación
        const currentUserId = currentUser?.id || 1;
        filters = { assignedTo: [currentUserId] };
        setSelectedUsers([currentUserId]);
        toast.info('Mostrando solo mis actividades');
        break;
      case 'pendingToday':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        filters = {
          dateFrom: today.toISOString(),
          dateTo: tomorrow.toISOString(),
          statuses: [ActivityStatus.PENDIENTE]
        };
        setDateRange([today, tomorrow]);
        setSelectedStatuses([ActivityStatus.PENDIENTE]);
        toast.info('Mostrando actividades pendientes para hoy');
        break;
      case 'upcoming':
        const now = new Date();
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);

        filters = {
          dateFrom: now.toISOString(),
          dateTo: nextWeek.toISOString()
        };
        setDateRange([now, nextWeek]);
        toast.info('Mostrando actividades próximas a vencer (7 días)');
        break;
    }

    onApplyFilters(filters);
  };

  return (
    <FiltersContainer>
      <FiltersHeader>
        <FiltersTitle>
          <FiFilter />
          Filtros
        </FiltersTitle>
        <QuickFiltersRow>
          <QuickFilterPill
            $active={activeQuickFilter === 'myActivities'}
            onClick={() => handleApplyQuickFilter('myActivities')}
          >
            <FiUser /> Mis actividades
          </QuickFilterPill>
          <QuickFilterPill
            $active={activeQuickFilter === 'pendingToday'}
            onClick={() => handleApplyQuickFilter('pendingToday')}
          >
            <FiAlertCircle /> Pendientes hoy
          </QuickFilterPill>
          <QuickFilterPill
            $active={activeQuickFilter === 'upcoming'}
            onClick={() => handleApplyQuickFilter('upcoming')}
          >
            <FiClock /> Próximas a vencer
          </QuickFilterPill>
        </QuickFiltersRow>
        <ExpandButton onClick={handleToggleExpand}>
          {isExpanded ? 'Ocultar filtros avanzados' : 'Mostrar filtros avanzados'}
        </ExpandButton>
      </FiltersHeader>

      {isExpanded && (
        <ExpandedFilters>
          <FilterSection>
            <FilterSectionTitle>
              <FiCalendar />
              Rango de fechas
            </FilterSectionTitle>
            <DateRangePicker
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={setDateRange}
              startDatePlaceholder="Fecha inicio"
              endDatePlaceholder="Fecha fin"
            />
          </FilterSection>

          <FilterSection>
            <FilterSectionTitle>
              <FiList />
              Tipo de actividad
            </FilterSectionTitle>
            <MultiSelect
              options={Object.values(ActivityType).map(type => ({ value: type, label: type }))}
              value={selectedTypes.map(type => ({ value: type, label: type }))}
              onChange={(selected) => setSelectedTypes(selected.map(item => item.value as ActivityType))}
              placeholder="Seleccionar tipos..."
            />
          </FilterSection>

          <FilterSection>
            <FilterSectionTitle>
              <FiClock />
              Estado
            </FilterSectionTitle>
            <MultiSelect
              options={Object.values(ActivityStatus).map(status => ({ value: status, label: status }))}
              value={selectedStatuses.map(status => ({ value: status, label: status }))}
              onChange={(selected) => setSelectedStatuses(selected.map(item => item.value as ActivityStatus))}
              placeholder="Seleccionar estados..."
            />
          </FilterSection>

          {/* Aquí irían más secciones de filtros como usuarios, departamentos, etiquetas, etc. */}

          <FilterActions>
            <Button onClick={handleApplyFilters} variant="primary">
              Aplicar filtros
            </Button>
            <Button onClick={handleClearFilters} variant="secondary">
              Limpiar filtros
            </Button>
            <Button onClick={() => setShowSaveDialog(true)} variant="secondary">
              <FiSave /> Guardar filtro
            </Button>
          </FilterActions>

          {showSaveDialog && (
            <SaveFilterDialog>
              <h4>Guardar filtro actual</h4>
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Nombre del filtro"
              />
              <div>
                <Button onClick={handleSaveFilter} variant="primary">
                  Guardar
                </Button>
                <Button onClick={() => setShowSaveDialog(false)} variant="secondary">
                  Cancelar
                </Button>
              </div>
            </SaveFilterDialog>
          )}

          {/* Los filtros rápidos ahora están en el encabezado para mayor visibilidad */}

          {savedFilters.length > 0 && (
            <SavedFiltersSection>
              <FilterSectionTitle>Filtros guardados</FilterSectionTitle>
              <SavedFiltersList>
                {savedFilters.map(filter => (
                  <SavedFilterItem key={filter.id}>
                    <SavedFilterName onClick={() => handleApplySavedFilter(filter)}>
                      {filter.name}
                    </SavedFilterName>
                    <DeleteFilterButton onClick={() => handleDeleteSavedFilter(filter.id)}>
                      <FiTrash2 />
                    </DeleteFilterButton>
                  </SavedFilterItem>
                ))}
              </SavedFiltersList>
            </SavedFiltersSection>
          )}
        </ExpandedFilters>
      )}
    </FiltersContainer>
  );
};

const FiltersContainer = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  margin-bottom: 20px;
  overflow: hidden;
`;

const FiltersHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FiltersTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

const ExpandedFilters = styled.div`
  padding: 20px;
`;

const FilterSection = styled.div`
  margin-bottom: 20px;
`;

const FilterSectionTitle = styled.h4`
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const FilterActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const SaveFilterDialog = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: ${({ theme }) => theme.backgroundTertiary};
  border-radius: 8px;

  h4 {
    margin-top: 0;
    margin-bottom: 10px;
  }

  input {
    width: 100%;
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.borderColor};
    background-color: ${({ theme }) => theme.inputBackground};
    color: ${({ theme }) => theme.text};
    margin-bottom: 15px;
  }

  div {
    display: flex;
    gap: 10px;
  }
`;

const QuickFiltersRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-right: auto;
  margin-left: 20px;

  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 10px;
    margin-bottom: 10px;
  }
`;

const QuickFilterPill = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: ${({ theme, $active }) => $active ? theme.primary + '20' : theme.backgroundTertiary};
  border: 1px solid ${({ theme, $active }) => $active ? theme.primary : theme.borderColor};
  border-radius: 20px;
  color: ${({ theme, $active }) => $active ? theme.primary : theme.text};
  cursor: pointer;
  font-size: 13px;
  font-weight: ${({ $active }) => $active ? '500' : 'normal'};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.inputBackground};
  }

  svg {
    color: ${({ theme, $active }) => $active ? theme.primary : theme.textSecondary};
  }
`;

const SavedFiltersSection = styled.div`
  margin-top: 20px;
`;

const SavedFiltersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SavedFilterItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.backgroundTertiary};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.borderColor};
`;

const SavedFilterName = styled.div`
  cursor: pointer;
  flex: 1;

  &:hover {
    text-decoration: underline;
  }
`;

const DeleteFilterButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.danger};
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.dangerLight};
  }
`;

export default AdvancedFilters;

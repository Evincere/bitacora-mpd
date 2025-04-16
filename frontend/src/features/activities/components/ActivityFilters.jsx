import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { FiX, FiFilter, FiCalendar } from 'react-icons/fi'
import { setFilters } from '../activitiesSlice'

const FiltersContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: ${({ theme }) => theme.shadow};
`

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    color: ${({ theme }) => theme.primary};
  }
`

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  color: ${({ theme }) => theme.textSecondary};
  
  &:hover {
    background-color: ${({ theme }) => theme.inputBackground};
    color: ${({ theme }) => theme.text};
  }
`

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
`

const Select = styled.select`
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary};
  }
`

const DateInput = styled.input`
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary};
  }
  
  &::-webkit-calendar-picker-indicator {
    filter: invert(0.7);
  }
`

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &.cancel {
    background-color: ${({ theme }) => theme.backgroundSecondary};
    color: ${({ theme }) => theme.text};
    
    &:hover {
      background-color: ${({ theme }) => theme.inputBackground};
    }
  }
  
  &.apply {
    background-color: ${({ theme }) => theme.primary};
    color: white;
    
    &:hover {
      background-color: ${({ theme }) => theme.buttonHover};
    }
  }
`

const ActivityFilters = ({ onClose, onClearFilters }) => {
  const dispatch = useDispatch()
  const { filters } = useSelector(state => state.activities)
  
  const [localFilters, setLocalFilters] = useState({
    type: filters.type || '',
    status: filters.status || '',
    startDate: filters.startDate || '',
    endDate: filters.endDate || ''
  })
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleApplyFilters = () => {
    dispatch(setFilters(localFilters))
    onClose()
  }
  
  const handleClearFilters = () => {
    setLocalFilters({
      type: '',
      status: '',
      startDate: '',
      endDate: ''
    })
    onClearFilters()
    onClose()
  }
  
  return (
    <FiltersContainer>
      <FiltersHeader>
        <Title>
          <FiFilter size={18} />
          Filtros
        </Title>
        <CloseButton onClick={onClose}>
          <FiX size={20} />
        </CloseButton>
      </FiltersHeader>
      
      <FiltersGrid>
        <FilterGroup>
          <FilterLabel>Tipo de actividad</FilterLabel>
          <Select 
            name="type"
            value={localFilters.type}
            onChange={handleChange}
          >
            <option value="">Todos</option>
            <option value="Atención Personal">Atención Personal</option>
            <option value="Atención Telefónica">Atención Telefónica</option>
            <option value="Concursos">Concursos</option>
            <option value="Solicitud de info">Solicitud de info</option>
            <option value="Mails">Mails</option>
            <option value="Multitareas">Multitareas</option>
          </Select>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>Estado</FilterLabel>
          <Select 
            name="status"
            value={localFilters.status}
            onChange={handleChange}
          >
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En progreso">En progreso</option>
            <option value="Completado">Completado</option>
          </Select>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>Fecha desde</FilterLabel>
          <DateInput 
            type="date"
            name="startDate"
            value={localFilters.startDate}
            onChange={handleChange}
          />
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>Fecha hasta</FilterLabel>
          <DateInput 
            type="date"
            name="endDate"
            value={localFilters.endDate}
            onChange={handleChange}
          />
        </FilterGroup>
      </FiltersGrid>
      
      <ButtonsContainer>
        <Button className="cancel" onClick={handleClearFilters}>
          Limpiar filtros
        </Button>
        <Button className="apply" onClick={handleApplyFilters}>
          Aplicar filtros
        </Button>
      </ButtonsContainer>
    </FiltersContainer>
  )
}

export default ActivityFilters

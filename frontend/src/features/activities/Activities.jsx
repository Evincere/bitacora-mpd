import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { 
  FiPlus, 
  FiFilter, 
  FiSearch, 
  FiX, 
  FiChevronLeft, 
  FiChevronRight,
  FiList,
  FiGrid
} from 'react-icons/fi'
import { getActivities, setPage, setLimit, setFilters, clearFilters } from './activitiesSlice'
import ActivityList from './components/ActivityList'
import ActivityGrid from './components/ActivityGrid'
import ActivityFilters from './components/ActivityFilters'
import ActivityForm from './components/ActivityForm'

const ActivitiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

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
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: ${({ primary, theme }) => primary ? theme.primary : theme.backgroundSecondary};
  color: ${({ primary, theme }) => primary ? 'white' : theme.text};
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ primary, theme }) => primary ? theme.buttonHover : theme.inputBackground};
  }
  
  @media (max-width: 768px) {
    flex: ${({ primary }) => primary ? '1' : 'initial'};
  }
`

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
  
  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
  }
`

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
`

const SearchIcon = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.textSecondary};
`

const ClearButton = styled.button`
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
`

const ViewToggle = styled.div`
  display: flex;
  border-radius: 4px;
  overflow: hidden;
`

const ViewButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: ${({ active, theme }) => active ? theme.primary : theme.backgroundSecondary};
  color: ${({ active, theme }) => active ? 'white' : theme.textSecondary};
  
  &:hover {
    background-color: ${({ active, theme }) => active ? theme.buttonHover : theme.inputBackground};
    color: ${({ active, theme }) => active ? 'white' : theme.text};
  }
`

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`

const PaginationInfo = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  
  span {
    font-weight: 500;
    color: ${({ theme }) => theme.text};
  }
`

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const PageButton = styled.button`
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
`

const Activities = () => {
  const dispatch = useDispatch()
  const { activities, totalCount, page, limit, filters } = useSelector(state => state.activities)
  const [showFilters, setShowFilters] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'grid'
  const [searchQuery, setSearchQuery] = useState(filters.search || '')
  
  useEffect(() => {
    dispatch(getActivities({ page, limit, ...filters }))
  }, [dispatch, page, limit, filters])
  
  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(setFilters({ search: searchQuery }))
  }
  
  const handleClearSearch = () => {
    setSearchQuery('')
    dispatch(setFilters({ search: '' }))
  }
  
  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage))
  }
  
  const totalPages = Math.ceil(totalCount / limit)
  
  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5
    
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PageButton 
          key={i} 
          active={i === page}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </PageButton>
      )
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
    )
  }
  
  return (
    <ActivitiesContainer>
      <PageHeader>
        <Title>Actividades</Title>
        <ActionButtons>
          <Button onClick={() => setShowFilters(!showFilters)}>
            <FiFilter size={16} />
            Filtros
          </Button>
          <Button primary onClick={() => setShowForm(true)}>
            <FiPlus size={16} />
            Nueva Actividad
          </Button>
        </ActionButtons>
      </PageHeader>
      
      {showFilters && (
        <ActivityFilters 
          onClose={() => setShowFilters(false)}
          onClearFilters={() => dispatch(clearFilters())}
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
          >
            <FiList size={18} />
          </ViewButton>
          <ViewButton 
            active={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
          >
            <FiGrid size={18} />
          </ViewButton>
        </ViewToggle>
      </ToolbarContainer>
      
      {viewMode === 'list' ? (
        <ActivityList activities={activities} />
      ) : (
        <ActivityGrid activities={activities} />
      )}
      
      <PaginationContainer>
        <PaginationInfo>
          Mostrando <span>{activities.length}</span> de <span>{totalCount}</span> actividades
        </PaginationInfo>
        
        {renderPagination()}
      </PaginationContainer>
      
      {showForm && (
        <ActivityForm onClose={() => setShowForm(false)} />
      )}
    </ActivitiesContainer>
  )
}

export default Activities

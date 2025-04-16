import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { FiSearch, FiSettings, FiBell, FiUser, FiMenu } from 'react-icons/fi'
import { toggleSidebar } from '../../store/uiSlice'

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 500px;
  margin: 0 20px;

  @media (max-width: 768px) {
    display: none;
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

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
`

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-left: 10px;
  color: ${({ theme }) => theme.text};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.inputBackground};
  }
`

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  cursor: pointer;
`

const MobileMenuButton = styled(IconButton)`
  @media (min-width: 769px) {
    display: none;
  }
`

const Header = () => {
  const dispatch = useDispatch()
  const [searchQuery, setSearchQuery] = useState('')
  
  const handleToggleSidebar = () => {
    dispatch(toggleSidebar())
  }

  return (
    <HeaderContainer>
      <MobileMenuButton onClick={handleToggleSidebar}>
        <FiMenu size={20} />
      </MobileMenuButton>
      
      <SearchContainer>
        <SearchIcon>
          <FiSearch size={16} />
        </SearchIcon>
        <SearchInput 
          placeholder="Buscar actividades..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchContainer>
      
      <HeaderActions>
        <IconButton>
          <FiSettings size={20} />
        </IconButton>
        <IconButton>
          <FiBell size={20} />
        </IconButton>
        <UserAvatar>
          <FiUser size={20} />
        </UserAvatar>
      </HeaderActions>
    </HeaderContainer>
  )
}

export default Header

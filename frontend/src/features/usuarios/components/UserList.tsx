import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiMoreVertical,
  FiRefreshCw,
  FiCheck,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiUser
} from 'react-icons/fi';
import { useUsers, useDeleteUser } from '../hooks/useUsers';
import { User } from '@/core/types/models';
import {
  Badge,
  Pagination,
  EmptyState,
  useToastContext
} from '@/components/ui';
import VirtualList from '@/components/common/VirtualList';
import { ConfirmDialog } from '@/components/ui/Dialog';

// Estilos
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button<{ $primary?: boolean, $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, $primary, $danger }) =>
    $primary ? theme.primary :
    $danger ? theme.danger + '20' :
    theme.cardBackground};
  color: ${({ theme, $primary, $danger }) =>
    $primary ? '#fff' :
    $danger ? theme.danger :
    theme.text};
  border: 1px solid ${({ theme, $primary, $danger }) =>
    $primary ? theme.primary :
    $danger ? theme.danger :
    theme.border};

  &:hover {
    background-color: ${({ theme, $primary, $danger }) =>
      $primary ? theme.primaryDark :
      $danger ? theme.danger + '30' :
      theme.hoverBackground};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 16px 10px 40px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}20;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  color: ${({ theme }) => theme.textSecondary};
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const FilterSelect = styled.select`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}20;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.cardBackground};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.tableHeaderBackground};
  color: ${({ theme }) => theme.tableHeaderText};
  position: sticky;
  top: 0;
  z-index: 10;

  th {
    padding: 16px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
  }
`;

const VirtualTableContainer = styled.div`
  width: 100%;
  height: 500px;
  overflow: auto;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.cardBackground};
`;

const VirtualTableStyles = styled.div`
  .virtual-table-row {
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.border};
    transition: background-color 0.2s ease;

    &:hover {
      background-color: ${({ theme }) => theme.hoverBackground};
    }
  }

  .virtual-table-cell {
    padding: 16px;
    font-size: 14px;
    color: ${({ theme }) => theme.text};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const ActionsContainer = styled.div`
  position: relative;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.textSecondary};
  transition: color 0.2s ease;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    color: ${({ theme }) => theme.text};
    background-color: ${({ theme }) => theme.hoverBackground};
  }
`;

const ActionsMenu = styled.div<{ $show: boolean }>`
  position: absolute;
  right: 0;
  top: 100%;
  width: 160px;
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: ${({ $show }) => ($show ? 'block' : 'none')};
  overflow: hidden;
`;

const MenuItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: ${({ theme, $danger }) => ($danger ? theme.danger : theme.text)};

  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
  }
`;

const RoleBadge = styled(Badge)<{ $role: string }>`
  background-color: ${({ theme, $role }) => {
    switch ($role) {
      case 'ADMIN':
        return theme.danger + '20';
      case 'SUPERVISOR':
        return theme.warning + '20';
      case 'ASIGNADOR':
        return theme.info + '20';
      case 'EJECUTOR':
        return theme.success + '20';
      case 'SOLICITANTE':
        return theme.primary + '20';
      default:
        return theme.secondary + '20';
    }
  }};
  color: ${({ theme, $role }) => {
    switch ($role) {
      case 'ADMIN':
        return theme.danger;
      case 'SUPERVISOR':
        return theme.warning;
      case 'ASIGNADOR':
        return theme.info;
      case 'EJECUTOR':
        return theme.success;
      case 'SOLICITANTE':
        return theme.primary;
      default:
        return theme.secondary;
    }
  }};
  border: 1px solid ${({ theme, $role }) => {
    switch ($role) {
      case 'ADMIN':
        return theme.danger + '40';
      case 'SUPERVISOR':
        return theme.warning + '40';
      case 'ASIGNADOR':
        return theme.info + '40';
      case 'EJECUTOR':
        return theme.success + '40';
      case 'SOLICITANTE':
        return theme.primary + '40';
      default:
        return theme.secondary + '40';
    }
  }};
`;

const StatusBadge = styled(Badge)<{ $active: boolean }>`
  background-color: ${({ theme, $active }) =>
    $active ? theme.success + '20' : theme.danger + '20'};
  color: ${({ theme, $active }) =>
    $active ? theme.success : theme.danger};
  border: 1px solid ${({ theme, $active }) =>
    $active ? theme.success + '40' : theme.danger + '40'};
`;

interface UserListProps {
  onEdit?: (user: User) => void;
  onView?: (user: User) => void;
  onAdd?: () => void;
}

const UserList: React.FC<UserListProps> = ({ onEdit, onView, onAdd }) => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string | undefined>(undefined);
  const [active, setActive] = useState<boolean | undefined>(undefined);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const navigate = useNavigate();
  const { showSuccess, showError } = useToastContext();

  const { data, isLoading, isError, refetch } = useUsers(page, size, role, active, search);
  const deleteUserMutation = useDeleteUser();

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleMenuToggle = (userId: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setOpenMenuId(openMenuId === userId ? null : userId);
  };

  const handleEdit = (user: User, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setOpenMenuId(null);
    if (onEdit) {
      onEdit(user);
    } else {
      navigate(`/app/admin/usuarios/editar/${user.id}`);
    }
  };

  const handleView = (user: User, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setOpenMenuId(null);
    if (onView) {
      onView(user);
    } else {
      navigate(`/app/admin/usuarios/${user.id}`);
    }
  };

  const handleDelete = (user: User, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setOpenMenuId(null);
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUserMutation.mutateAsync(userToDelete.id);
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(0); // Resetear a la primera página al buscar
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setRole(value === 'all' ? undefined : value);
    setPage(0);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setActive(value === 'all' ? undefined : value === 'active');
    setPage(0);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const renderUserRow = (user: User) => {
    return (
      <div className="virtual-table-row" key={user.id}>
        <div className="virtual-table-cell" style={{ width: '5%' }}>{user.id}</div>
        <div className="virtual-table-cell" style={{ width: '15%' }}>{user.username}</div>
        <div className="virtual-table-cell" style={{ width: '20%' }}>{user.fullName}</div>
        <div className="virtual-table-cell" style={{ width: '20%' }}>{user.email}</div>
        <div className="virtual-table-cell" style={{ width: '15%' }}>
          <RoleBadge $role={user.role}>{user.role}</RoleBadge>
        </div>
        <div className="virtual-table-cell" style={{ width: '15%' }}>
          <StatusBadge $active={user.active}>
            {user.active ? <FiCheck size={14} /> : <FiX size={14} />}
            {user.active ? 'Activo' : 'Inactivo'}
          </StatusBadge>
        </div>
        <div className="virtual-table-cell" style={{ width: '10%' }}>
          <ActionsContainer>
            <ActionButton onClick={(e) => handleMenuToggle(user.id, e)}>
              <FiMoreVertical size={18} />
            </ActionButton>
            <ActionsMenu $show={openMenuId === user.id}>
              <MenuItem onClick={(e) => handleView(user, e)}>
                <FiEye size={16} />
                Ver detalle
              </MenuItem>
              <MenuItem onClick={(e) => handleEdit(user, e)}>
                <FiEdit2 size={16} />
                Editar
              </MenuItem>
              <MenuItem $danger onClick={(e) => handleDelete(user, e)}>
                <FiTrash2 size={16} />
                Eliminar
              </MenuItem>
            </ActionsMenu>
          </ActionsContainer>
        </div>
      </div>
    );
  };

  return (
    <Container>
      <Header>
        <Title>Gestión de Usuarios</Title>
        <ActionButtons>
          <Button onClick={() => refetch()}>
            <FiRefreshCw size={16} />
            Actualizar
          </Button>
          <Button $primary onClick={onAdd || (() => navigate('/app/admin/usuarios/nuevo'))}>
            <FiPlus size={16} />
            Nuevo Usuario
          </Button>
        </ActionButtons>
      </Header>

      <SearchContainer>
        <SearchWrapper>
          <SearchIcon>
            <FiSearch size={16} />
          </SearchIcon>
          <SearchInput
            placeholder="Buscar usuarios..."
            value={search}
            onChange={handleSearch}
          />
        </SearchWrapper>
        <FilterContainer>
          <FilterSelect value={role || 'all'} onChange={handleRoleChange}>
            <option value="all">Todos los roles</option>
            <option value="ADMIN">Administrador</option>
            <option value="SUPERVISOR">Supervisor</option>
            <option value="ASIGNADOR">Asignador</option>
            <option value="EJECUTOR">Ejecutor</option>
            <option value="SOLICITANTE">Solicitante</option>
            <option value="USUARIO">Usuario</option>
            <option value="CONSULTA">Consulta</option>
          </FilterSelect>
          <FilterSelect value={active === undefined ? 'all' : active ? 'active' : 'inactive'} onChange={handleStatusChange}>
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </FilterSelect>
        </FilterContainer>
      </SearchContainer>

      {isLoading ? (
        <div>Cargando usuarios...</div>
      ) : isError ? (
        <div>Error al cargar usuarios</div>
      ) : data?.users && data.users.length > 0 ? (
        <>
          <Table>
            <TableHead>
              <tr>
                <th style={{ width: '5%' }}>ID</th>
                <th style={{ width: '15%' }}>Usuario</th>
                <th style={{ width: '20%' }}>Nombre</th>
                <th style={{ width: '20%' }}>Email</th>
                <th style={{ width: '15%' }}>Rol</th>
                <th style={{ width: '15%' }}>Estado</th>
                <th style={{ width: '10%' }}>Acciones</th>
              </tr>
            </TableHead>
          </Table>

          <VirtualTableContainer>
            <VirtualTableStyles>
              <VirtualList
                items={data.users}
                height={500}
                estimateSize={60}
                renderItem={renderUserRow}
                overscan={5}
                itemKey={(index) => data.users[index]?.id || index}
              />
            </VirtualTableStyles>
          </VirtualTableContainer>

          <Pagination
            currentPage={data.currentPage}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <EmptyState
          icon={<FiUser size={48} />}
          title="No hay usuarios"
          description="No se encontraron usuarios con los filtros aplicados."
          actionText="Crear nuevo usuario"
          onAction={onAdd || (() => navigate('/app/admin/usuarios/nuevo'))}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Eliminar Usuario"
        message={`¿Estás seguro de que deseas eliminar al usuario ${userToDelete?.fullName}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setUserToDelete(null);
        }}
        isDanger
      />
    </Container>
  );
};

export default UserList;

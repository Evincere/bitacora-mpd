import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiCheck, FiX, FiHelpCircle, FiInfo } from 'react-icons/fi';

// Estilos
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.cardBackground};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const InfoText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PermissionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
`;

const PermissionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const PermissionLabel = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;

  .tooltip {
    position: relative;
    display: inline-flex;
    color: ${({ theme }) => theme.textSecondary};
    
    &:hover .tooltip-text {
      visibility: visible;
      opacity: 1;
    }
    
    .tooltip-text {
      visibility: hidden;
      width: 200px;
      background-color: ${({ theme }) => theme.tooltipBackground};
      color: ${({ theme }) => theme.tooltipText};
      text-align: center;
      border-radius: 6px;
      padding: 8px;
      position: absolute;
      z-index: 1;
      bottom: 125%;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0;
      transition: opacity 0.3s;
      font-weight: normal;
      font-size: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
  }
`;

const PermissionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const GroupTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0 0 8px 0;
  padding-bottom: 4px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.cardBackground};
  color: ${({ theme, $primary }) => 
    $primary ? '#fff' : theme.text};
  border: 1px solid ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.border};

  &:hover {
    background-color: ${({ theme, $primary }) => 
      $primary ? theme.primaryDark : theme.hoverBackground};
  }
`;

// Definición de permisos disponibles con descripciones
const availablePermissions = {
  'Actividades': [
    { id: 'READ_ACTIVITIES', label: 'Ver actividades', description: 'Permite ver actividades en el sistema' },
    { id: 'WRITE_ACTIVITIES', label: 'Crear/Editar actividades', description: 'Permite crear y editar actividades' },
    { id: 'DELETE_ACTIVITIES', label: 'Eliminar actividades', description: 'Permite eliminar actividades' },
    { id: 'APPROVE_ACTIVITIES', label: 'Aprobar actividades', description: 'Permite aprobar actividades' },
  ],
  'Usuarios': [
    { id: 'READ_USERS', label: 'Ver usuarios', description: 'Permite ver información de usuarios' },
    { id: 'WRITE_USERS', label: 'Crear/Editar usuarios', description: 'Permite crear y editar usuarios' },
    { id: 'DELETE_USERS', label: 'Eliminar usuarios', description: 'Permite eliminar usuarios' },
  ],
  'Reportes': [
    { id: 'GENERATE_REPORTS', label: 'Generar reportes', description: 'Permite generar reportes y estadísticas' },
  ],
  'Flujo de trabajo': [
    { id: 'REQUEST_ACTIVITIES', label: 'Solicitar actividades', description: 'Permite solicitar nuevas actividades' },
    { id: 'ASSIGN_ACTIVITIES', label: 'Asignar actividades', description: 'Permite asignar actividades a ejecutores' },
    { id: 'EXECUTE_ACTIVITIES', label: 'Ejecutar actividades', description: 'Permite ejecutar actividades asignadas' },
  ]
};

// Permisos por defecto para cada rol
const roleDefaultPermissions = {
  'ADMIN': [
    'READ_ACTIVITIES', 'WRITE_ACTIVITIES', 'DELETE_ACTIVITIES', 
    'READ_USERS', 'WRITE_USERS', 'DELETE_USERS', 
    'GENERATE_REPORTS', 'REQUEST_ACTIVITIES', 'ASSIGN_ACTIVITIES', 
    'EXECUTE_ACTIVITIES', 'APPROVE_ACTIVITIES'
  ],
  'SUPERVISOR': [
    'READ_ACTIVITIES', 'WRITE_ACTIVITIES', 'READ_USERS', 'GENERATE_REPORTS', 'APPROVE_ACTIVITIES'
  ],
  'ASIGNADOR': [
    'READ_ACTIVITIES', 'WRITE_ACTIVITIES', 'READ_USERS', 'GENERATE_REPORTS', 'ASSIGN_ACTIVITIES'
  ],
  'EJECUTOR': [
    'READ_ACTIVITIES', 'WRITE_ACTIVITIES', 'EXECUTE_ACTIVITIES'
  ],
  'SOLICITANTE': [
    'READ_ACTIVITIES', 'WRITE_ACTIVITIES', 'REQUEST_ACTIVITIES'
  ],
  'USUARIO': [
    'READ_ACTIVITIES', 'WRITE_ACTIVITIES'
  ],
  'CONSULTA': [
    'READ_ACTIVITIES'
  ]
};

interface PermissionsManagerProps {
  selectedRole: string;
  selectedPermissions: string[];
  onChange: (permissions: string[]) => void;
}

const PermissionsManager: React.FC<PermissionsManagerProps> = ({ 
  selectedRole, 
  selectedPermissions, 
  onChange 
}) => {
  const [permissions, setPermissions] = useState<string[]>(selectedPermissions || []);

  // Actualizar permisos cuando cambia el rol seleccionado
  useEffect(() => {
    if (selectedRole) {
      // No sobrescribir los permisos personalizados si ya existen
      if (!selectedPermissions || selectedPermissions.length === 0) {
        setPermissions(roleDefaultPermissions[selectedRole as keyof typeof roleDefaultPermissions] || []);
        onChange(roleDefaultPermissions[selectedRole as keyof typeof roleDefaultPermissions] || []);
      }
    }
  }, [selectedRole]);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    let updatedPermissions;
    
    if (checked) {
      updatedPermissions = [...permissions, permissionId];
    } else {
      updatedPermissions = permissions.filter(p => p !== permissionId);
    }
    
    setPermissions(updatedPermissions);
    onChange(updatedPermissions);
  };

  const selectAll = () => {
    const allPermissions = Object.values(availablePermissions)
      .flat()
      .map(p => p.id);
    
    setPermissions(allPermissions);
    onChange(allPermissions);
  };

  const resetToDefault = () => {
    const defaultPerms = roleDefaultPermissions[selectedRole as keyof typeof roleDefaultPermissions] || [];
    setPermissions(defaultPerms);
    onChange(defaultPerms);
  };

  return (
    <Container>
      <Header>
        <Title>Permisos</Title>
        <ActionButtons>
          <Button onClick={resetToDefault}>
            <FiCheck size={12} />
            Restaurar por defecto
          </Button>
          <Button $primary onClick={selectAll}>
            <FiCheck size={12} />
            Seleccionar todos
          </Button>
        </ActionButtons>
      </Header>
      
      <InfoText>
        <FiInfo size={16} />
        Los permisos determinan qué acciones puede realizar el usuario en el sistema
      </InfoText>
      
      {Object.entries(availablePermissions).map(([group, perms]) => (
        <PermissionGroup key={group}>
          <GroupTitle>{group}</GroupTitle>
          <PermissionGrid>
            {perms.map(permission => (
              <PermissionItem key={permission.id}>
                <Checkbox
                  type="checkbox"
                  id={permission.id}
                  checked={permissions.includes(permission.id)}
                  onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                />
                <PermissionLabel htmlFor={permission.id}>
                  {permission.label}
                  <div className="tooltip">
                    <FiHelpCircle size={14} />
                    <span className="tooltip-text">{permission.description}</span>
                  </div>
                </PermissionLabel>
              </PermissionItem>
            ))}
          </PermissionGrid>
        </PermissionGroup>
      ))}
    </Container>
  );
};

export default PermissionsManager;

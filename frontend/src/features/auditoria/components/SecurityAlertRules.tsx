import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiShield, 
  FiPlus, 
  FiEdit, 
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiAlertTriangle,
  FiInfo,
  FiX,
  FiCheck,
  FiClock,
  FiMail,
  FiLock,
  FiKey,
  FiRefreshCw
} from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  SecurityAlertRule, 
  SecurityAlertRuleType, 
  SecurityAlertRuleAction,
  SecurityAlertSeverity
} from '../types/securityAlertTypes';
import { 
  useSecurityAlertRules, 
  useToggleAlertRule, 
  useDeleteAlertRule 
} from '../hooks/useSecurityAlerts';

// Estilos
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.cardBackground};
  color: ${({ theme, $primary }) => 
    $primary ? '#fff' : theme.text};
  border: 1px solid ${({ theme, $primary }) => 
    $primary ? theme.primary : theme.border};
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme, $primary }) => 
      $primary ? theme.primaryDark : theme.hoverBackground};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RulesTable = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.backgroundSecondary};
`;

const TableHeadCell = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.backgroundSecondary + '30'};
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const StatusBadge = styled.div<{ $enabled: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ theme, $enabled }) => 
    $enabled ? theme.success + '20' : theme.textTertiary + '20'};
  color: ${({ theme, $enabled }) => 
    $enabled ? theme.success : theme.textTertiary};
`;

const ActionBadge = styled.div<{ $action: SecurityAlertRuleAction }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ theme, $action }) => 
    $action === SecurityAlertRuleAction.CREATE_ALERT ? '#3b82f6' + '20' :
    $action === SecurityAlertRuleAction.SEND_EMAIL ? '#8b5cf6' + '20' :
    $action === SecurityAlertRuleAction.BLOCK_USER ? '#ef4444' + '20' :
    $action === SecurityAlertRuleAction.LOCK_ACCOUNT ? '#f97316' + '20' :
    $action === SecurityAlertRuleAction.REQUIRE_PASSWORD_CHANGE ? '#10b981' + '20' :
    theme.textTertiary + '20'};
  color: ${({ theme, $action }) => 
    $action === SecurityAlertRuleAction.CREATE_ALERT ? '#3b82f6' :
    $action === SecurityAlertRuleAction.SEND_EMAIL ? '#8b5cf6' :
    $action === SecurityAlertRuleAction.BLOCK_USER ? '#ef4444' :
    $action === SecurityAlertRuleAction.LOCK_ACCOUNT ? '#f97316' :
    $action === SecurityAlertRuleAction.REQUIRE_PASSWORD_CHANGE ? '#10b981' :
    theme.textTertiary};
`;

const ActionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: ${({ theme }) => theme.cardBackground};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
  }
`;

const DeleteButton = styled(ActionButton)`
  &:hover {
    background-color: ${({ theme }) => theme.error + '20'};
    color: ${({ theme }) => theme.error};
    border-color: ${({ theme }) => theme.error};
  }
`;

const ToggleButton = styled(ActionButton)<{ $enabled: boolean }>`
  color: ${({ theme, $enabled }) => 
    $enabled ? theme.success : theme.textTertiary};
  
  &:hover {
    background-color: ${({ theme, $enabled }) => 
      $enabled ? theme.error + '20' : theme.success + '20'};
    color: ${({ theme, $enabled }) => 
      $enabled ? theme.error : theme.success};
  }
`;

const ConfirmDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  padding: 24px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const DialogTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const DialogMessage = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin: 0 0 24px 0;
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 12px;
  border: 1px dashed ${({ theme }) => theme.border};
`;

const LoadingSpinner = styled(FiRefreshCw)`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

interface SecurityAlertRulesProps {
  onCreateRule: () => void;
  onEditRule: (rule: SecurityAlertRule) => void;
}

/**
 * Componente para mostrar y gestionar las reglas de alertas de seguridad
 */
const SecurityAlertRules: React.FC<SecurityAlertRulesProps> = ({
  onCreateRule,
  onEditRule
}) => {
  // Estado para el diálogo de confirmación
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    ruleId: string;
    ruleName: string;
    action: 'delete' | 'toggle';
    enabled?: boolean;
  }>({
    show: false,
    ruleId: '',
    ruleName: '',
    action: 'delete'
  });
  
  // Consultas
  const { data: rules, isLoading, isError } = useSecurityAlertRules();
  const toggleRule = useToggleAlertRule();
  const deleteRule = useDeleteAlertRule();
  
  // Función para eliminar una regla
  const handleDeleteRule = () => {
    if (confirmDialog.ruleId) {
      deleteRule.mutate(confirmDialog.ruleId);
      setConfirmDialog({
        show: false,
        ruleId: '',
        ruleName: '',
        action: 'delete'
      });
    }
  };
  
  // Función para activar/desactivar una regla
  const handleToggleRule = () => {
    if (confirmDialog.ruleId && confirmDialog.action === 'toggle') {
      toggleRule.mutate({
        id: confirmDialog.ruleId,
        enabled: !confirmDialog.enabled
      });
      setConfirmDialog({
        show: false,
        ruleId: '',
        ruleName: '',
        action: 'delete'
      });
    }
  };
  
  // Función para mostrar el diálogo de confirmación para eliminar
  const showDeleteConfirm = (rule: SecurityAlertRule) => {
    setConfirmDialog({
      show: true,
      ruleId: rule.id,
      ruleName: rule.name,
      action: 'delete'
    });
  };
  
  // Función para mostrar el diálogo de confirmación para activar/desactivar
  const showToggleConfirm = (rule: SecurityAlertRule) => {
    setConfirmDialog({
      show: true,
      ruleId: rule.id,
      ruleName: rule.name,
      action: 'toggle',
      enabled: rule.enabled
    });
  };
  
  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: es });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };
  
  // Función para obtener el nombre del tipo de regla
  const getRuleTypeName = (type: SecurityAlertRuleType) => {
    switch (type) {
      case SecurityAlertRuleType.FAILED_LOGIN_DETECTION:
        return 'Detección de inicio de sesión fallido';
      case SecurityAlertRuleType.UNUSUAL_ACCESS_TIME_DETECTION:
        return 'Detección de acceso en horario inusual';
      case SecurityAlertRuleType.UNUSUAL_LOCATION_DETECTION:
        return 'Detección de acceso desde ubicación inusual';
      case SecurityAlertRuleType.PERMISSION_CHANGE_DETECTION:
        return 'Detección de cambio de permisos';
      case SecurityAlertRuleType.MASS_DELETION_DETECTION:
        return 'Detección de eliminación masiva';
      case SecurityAlertRuleType.SUSPICIOUS_ACTIVITY_DETECTION:
        return 'Detección de actividad sospechosa';
      case SecurityAlertRuleType.BRUTE_FORCE_DETECTION:
        return 'Detección de ataque de fuerza bruta';
      case SecurityAlertRuleType.CUSTOM:
        return 'Personalizada';
      default:
        return type;
    }
  };
  
  // Función para obtener el nombre de la acción
  const getActionName = (action: SecurityAlertRuleAction) => {
    switch (action) {
      case SecurityAlertRuleAction.CREATE_ALERT:
        return 'Crear alerta';
      case SecurityAlertRuleAction.SEND_EMAIL:
        return 'Enviar email';
      case SecurityAlertRuleAction.BLOCK_USER:
        return 'Bloquear usuario';
      case SecurityAlertRuleAction.LOCK_ACCOUNT:
        return 'Bloquear cuenta';
      case SecurityAlertRuleAction.REQUIRE_PASSWORD_CHANGE:
        return 'Requerir cambio de contraseña';
      case SecurityAlertRuleAction.CUSTOM_ACTION:
        return 'Acción personalizada';
      default:
        return action;
    }
  };
  
  // Función para obtener el icono de la acción
  const getActionIcon = (action: SecurityAlertRuleAction) => {
    switch (action) {
      case SecurityAlertRuleAction.CREATE_ALERT:
        return <FiAlertTriangle size={12} />;
      case SecurityAlertRuleAction.SEND_EMAIL:
        return <FiMail size={12} />;
      case SecurityAlertRuleAction.BLOCK_USER:
        return <FiX size={12} />;
      case SecurityAlertRuleAction.LOCK_ACCOUNT:
        return <FiLock size={12} />;
      case SecurityAlertRuleAction.REQUIRE_PASSWORD_CHANGE:
        return <FiKey size={12} />;
      default:
        return null;
    }
  };
  
  // Función para obtener la severidad de una regla
  const getRuleSeverity = (rule: SecurityAlertRule): SecurityAlertSeverity | undefined => {
    const createAlertAction = rule.actions.find(
      action => action.type === SecurityAlertRuleAction.CREATE_ALERT
    );
    
    if (createAlertAction && 'severity' in createAlertAction) {
      return createAlertAction.severity;
    }
    
    return undefined;
  };
  
  return (
    <Container>
      <Header>
        <Title>
          <FiShield size={24} />
          Reglas de Alertas
        </Title>
        
        <Button $primary onClick={onCreateRule}>
          <FiPlus size={16} />
          Nueva Regla
        </Button>
      </Header>
      
      {isLoading ? (
        <EmptyState>
          <LoadingSpinner size={48} style={{ marginBottom: '16px' }} />
          <div>Cargando reglas de alertas...</div>
        </EmptyState>
      ) : isError ? (
        <EmptyState>
          <FiAlertTriangle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <div>Error al cargar las reglas de alertas.</div>
          <div style={{ marginTop: '8px', fontSize: '13px' }}>
            Por favor, intenta recargar la página.
          </div>
        </EmptyState>
      ) : !rules || rules.length === 0 ? (
        <EmptyState>
          <FiInfo size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <div>No hay reglas de alertas configuradas.</div>
          <div style={{ marginTop: '8px', fontSize: '13px' }}>
            Haz clic en "Nueva Regla" para crear una.
          </div>
        </EmptyState>
      ) : (
        <RulesTable>
          <Table>
            <TableHead>
              <tr>
                <TableHeadCell>Nombre</TableHeadCell>
                <TableHeadCell>Tipo</TableHeadCell>
                <TableHeadCell>Acciones</TableHeadCell>
                <TableHeadCell>Última Actualización</TableHeadCell>
                <TableHeadCell>Estado</TableHeadCell>
                <TableHeadCell>Opciones</TableHeadCell>
              </tr>
            </TableHead>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>{rule.name}</TableCell>
                  <TableCell>{getRuleTypeName(rule.type)}</TableCell>
                  <TableCell>
                    <ActionsList>
                      {rule.actions.map((action, index) => (
                        <ActionBadge key={index} $action={action.type}>
                          {getActionIcon(action.type)}
                          {getActionName(action.type)}
                        </ActionBadge>
                      ))}
                    </ActionsList>
                  </TableCell>
                  <TableCell>{formatDate(rule.updatedAt)}</TableCell>
                  <TableCell>
                    <StatusBadge $enabled={rule.enabled}>
                      {rule.enabled ? (
                        <>
                          <FiToggleRight size={14} />
                          Activa
                        </>
                      ) : (
                        <>
                          <FiToggleLeft size={14} />
                          Inactiva
                        </>
                      )}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <ActionsContainer>
                      <ToggleButton 
                        $enabled={rule.enabled}
                        onClick={() => showToggleConfirm(rule)}
                        title={rule.enabled ? 'Desactivar' : 'Activar'}
                      >
                        {rule.enabled ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                      </ToggleButton>
                      <ActionButton 
                        onClick={() => onEditRule(rule)}
                        title="Editar regla"
                      >
                        <FiEdit size={16} />
                      </ActionButton>
                      <DeleteButton 
                        onClick={() => showDeleteConfirm(rule)}
                        title="Eliminar regla"
                      >
                        <FiTrash2 size={16} />
                      </DeleteButton>
                    </ActionsContainer>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </RulesTable>
      )}
      
      {/* Diálogo de confirmación */}
      {confirmDialog.show && (
        <ConfirmDialog onClick={() => setConfirmDialog({ ...confirmDialog, show: false })}>
          <DialogContent onClick={(e) => e.stopPropagation()}>
            <DialogHeader>
              <FiAlertTriangle size={24} color="#f59e0b" />
              <DialogTitle>
                {confirmDialog.action === 'delete' 
                  ? 'Eliminar Regla' 
                  : confirmDialog.enabled 
                    ? 'Desactivar Regla' 
                    : 'Activar Regla'}
              </DialogTitle>
            </DialogHeader>
            
            <DialogMessage>
              {confirmDialog.action === 'delete' 
                ? `¿Estás seguro de que deseas eliminar la regla "${confirmDialog.ruleName}"? Esta acción no se puede deshacer.`
                : confirmDialog.enabled 
                  ? `¿Estás seguro de que deseas desactivar la regla "${confirmDialog.ruleName}"? No se generarán alertas hasta que la actives nuevamente.`
                  : `¿Estás seguro de que deseas activar la regla "${confirmDialog.ruleName}"? Comenzará a generar alertas según las condiciones configuradas.`}
            </DialogMessage>
            
            <DialogActions>
              <Button onClick={() => setConfirmDialog({ ...confirmDialog, show: false })}>
                Cancelar
              </Button>
              {confirmDialog.action === 'delete' ? (
                <Button 
                  style={{ backgroundColor: '#ef4444', borderColor: '#ef4444', color: '#fff' }}
                  onClick={handleDeleteRule}
                >
                  <FiTrash2 size={16} />
                  Eliminar
                </Button>
              ) : (
                <Button 
                  $primary
                  onClick={handleToggleRule}
                >
                  {confirmDialog.enabled ? (
                    <>
                      <FiToggleLeft size={16} />
                      Desactivar
                    </>
                  ) : (
                    <>
                      <FiToggleRight size={16} />
                      Activar
                    </>
                  )}
                </Button>
              )}
            </DialogActions>
          </DialogContent>
        </ConfirmDialog>
      )}
    </Container>
  );
};

export default SecurityAlertRules;

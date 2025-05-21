import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiAlertTriangle, 
  FiClock, 
  FiUser, 
  FiMapPin, 
  FiInfo,
  FiCheck,
  FiX,
  FiEye,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiAlertCircle,
  FiCrosshair
} from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  SecurityAlert, 
  SecurityAlertType, 
  SecurityAlertSeverity, 
  SecurityAlertStatus 
} from '../types/securityAlertTypes';
import { useUpdateAlertStatus } from '../hooks/useSecurityAlerts';

// Estilos
const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  transition: box-shadow 0.2s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div<{ $severity: SecurityAlertSeverity }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: ${({ theme, $severity }) => 
    $severity === SecurityAlertSeverity.CRITICAL ? '#ef4444' + '20' :
    $severity === SecurityAlertSeverity.HIGH ? '#f97316' + '20' :
    $severity === SecurityAlertSeverity.MEDIUM ? '#f59e0b' + '20' :
    $severity === SecurityAlertSeverity.LOW ? '#10b981' + '20' :
    theme.backgroundSecondary};
  border-bottom: 1px solid ${({ theme, $severity }) => 
    $severity === SecurityAlertSeverity.CRITICAL ? '#ef4444' + '50' :
    $severity === SecurityAlertSeverity.HIGH ? '#f97316' + '50' :
    $severity === SecurityAlertSeverity.MEDIUM ? '#f59e0b' + '50' :
    $severity === SecurityAlertSeverity.LOW ? '#10b981' + '50' :
    theme.border};
`;

const AlertTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const SeverityBadge = styled.div<{ $severity: SecurityAlertSeverity }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ $severity }) => 
    $severity === SecurityAlertSeverity.CRITICAL ? '#ef4444' + '20' :
    $severity === SecurityAlertSeverity.HIGH ? '#f97316' + '20' :
    $severity === SecurityAlertSeverity.MEDIUM ? '#f59e0b' + '20' :
    $severity === SecurityAlertSeverity.LOW ? '#10b981' + '20' :
    '#94a3b8' + '20'};
  color: ${({ $severity }) => 
    $severity === SecurityAlertSeverity.CRITICAL ? '#ef4444' :
    $severity === SecurityAlertSeverity.HIGH ? '#f97316' :
    $severity === SecurityAlertSeverity.MEDIUM ? '#f59e0b' :
    $severity === SecurityAlertSeverity.LOW ? '#10b981' :
    '#94a3b8'};
  border: 1px solid ${({ $severity }) => 
    $severity === SecurityAlertSeverity.CRITICAL ? '#ef4444' + '50' :
    $severity === SecurityAlertSeverity.HIGH ? '#f97316' + '50' :
    $severity === SecurityAlertSeverity.MEDIUM ? '#f59e0b' + '50' :
    $severity === SecurityAlertSeverity.LOW ? '#10b981' + '50' :
    '#94a3b8' + '50'};
`;

const StatusBadge = styled.div<{ $status: SecurityAlertStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ $status }) => 
    $status === SecurityAlertStatus.NEW ? '#3b82f6' + '20' :
    $status === SecurityAlertStatus.ACKNOWLEDGED ? '#8b5cf6' + '20' :
    $status === SecurityAlertStatus.RESOLVED ? '#10b981' + '20' :
    $status === SecurityAlertStatus.FALSE_POSITIVE ? '#94a3b8' + '20' :
    '#94a3b8' + '20'};
  color: ${({ $status }) => 
    $status === SecurityAlertStatus.NEW ? '#3b82f6' :
    $status === SecurityAlertStatus.ACKNOWLEDGED ? '#8b5cf6' :
    $status === SecurityAlertStatus.RESOLVED ? '#10b981' :
    $status === SecurityAlertStatus.FALSE_POSITIVE ? '#94a3b8' :
    '#94a3b8'};
  border: 1px solid ${({ $status }) => 
    $status === SecurityAlertStatus.NEW ? '#3b82f6' + '50' :
    $status === SecurityAlertStatus.ACKNOWLEDGED ? '#8b5cf6' + '50' :
    $status === SecurityAlertStatus.RESOLVED ? '#10b981' + '50' :
    $status === SecurityAlertStatus.FALSE_POSITIVE ? '#94a3b8' + '50' :
    '#94a3b8' + '50'};
`;

const CardContent = styled.div`
  padding: 16px;
`;

const AlertDetails = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  margin: 0 0 16px 0;
`;

const MetadataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
`;

const MetadataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MetadataLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const MetadataValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`;

const ExpandableSection = styled.div`
  margin-top: 16px;
`;

const ExpandHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  cursor: pointer;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const ExpandContent = styled.div<{ $expanded: boolean }>`
  display: ${({ $expanded }) => ($expanded ? 'block' : 'none')};
  padding: 8px 0;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const RelatedLogsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RelatedLogItem = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  padding: 8px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
  }
`;

const ResolutionInfo = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 6px;
  padding: 12px;
  margin-top: 16px;
`;

const ResolutionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin-bottom: 8px;
`;

const ResolutionDetails = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const Button = styled.button<{ $primary?: boolean; $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: ${({ theme, $primary, $danger }) => 
    $primary ? theme.primary : 
    $danger ? theme.error : 
    theme.cardBackground};
  color: ${({ theme, $primary, $danger }) => 
    $primary || $danger ? '#fff' : theme.text};
  border: 1px solid ${({ theme, $primary, $danger }) => 
    $primary ? theme.primary : 
    $danger ? theme.error : 
    theme.border};
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme, $primary, $danger }) => 
      $primary ? theme.primaryDark : 
      $danger ? theme.error + 'dd' : 
      theme.hoverBackground};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResolutionModal = styled.div`
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

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  padding: 24px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Textarea = styled.textarea`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

interface SecurityAlertCardProps {
  alert: SecurityAlert;
  onViewAuditLog?: (logId: string) => void;
}

/**
 * Componente para mostrar una alerta de seguridad
 */
const SecurityAlertCard: React.FC<SecurityAlertCardProps> = ({
  alert,
  onViewAuditLog
}) => {
  // Estado para secciones expandibles
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    relatedLogs: false
  });
  
  // Estado para el modal de resolución
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [resolutionStatus, setResolutionStatus] = useState<SecurityAlertStatus>(SecurityAlertStatus.RESOLVED);
  const [resolutionNote, setResolutionNote] = useState('');
  
  // Mutación para actualizar el estado de la alerta
  const updateAlertStatus = useUpdateAlertStatus();
  
  // Función para alternar una sección expandible
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm:ss', { locale: es });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };
  
  // Función para obtener el icono del tipo de alerta
  const getAlertTypeIcon = (type: SecurityAlertType) => {
    switch (type) {
      case SecurityAlertType.FAILED_LOGIN:
        return <FiX size={16} />;
      case SecurityAlertType.UNUSUAL_ACCESS_TIME:
        return <FiClock size={16} />;
      case SecurityAlertType.UNUSUAL_LOCATION:
        return <FiMapPin size={16} />;
      case SecurityAlertType.PERMISSION_CHANGE:
        return <FiUser size={16} />;
      case SecurityAlertType.MASS_DELETION:
        return <FiAlertTriangle size={16} />;
      default:
        return <FiAlertTriangle size={16} />;
    }
  };
  
  // Función para obtener el nombre del tipo de alerta
  const getAlertTypeName = (type: SecurityAlertType) => {
    switch (type) {
      case SecurityAlertType.FAILED_LOGIN:
        return 'Inicio de sesión fallido';
      case SecurityAlertType.UNUSUAL_ACCESS_TIME:
        return 'Acceso en horario inusual';
      case SecurityAlertType.UNUSUAL_LOCATION:
        return 'Acceso desde ubicación inusual';
      case SecurityAlertType.PERMISSION_CHANGE:
        return 'Cambio de permisos';
      case SecurityAlertType.MASS_DELETION:
        return 'Eliminación masiva';
      case SecurityAlertType.SUSPICIOUS_ACTIVITY:
        return 'Actividad sospechosa';
      case SecurityAlertType.BRUTE_FORCE_ATTACK:
        return 'Ataque de fuerza bruta';
      case SecurityAlertType.ACCOUNT_LOCKOUT:
        return 'Bloqueo de cuenta';
      case SecurityAlertType.PASSWORD_CHANGE:
        return 'Cambio de contraseña';
      case SecurityAlertType.ADMIN_ACTION:
        return 'Acción administrativa';
      default:
        return type;
    }
  };
  
  // Función para obtener el nombre de la severidad
  const getSeverityName = (severity: SecurityAlertSeverity) => {
    switch (severity) {
      case SecurityAlertSeverity.CRITICAL:
        return 'Crítica';
      case SecurityAlertSeverity.HIGH:
        return 'Alta';
      case SecurityAlertSeverity.MEDIUM:
        return 'Media';
      case SecurityAlertSeverity.LOW:
        return 'Baja';
      default:
        return severity;
    }
  };
  
  // Función para obtener el nombre del estado
  const getStatusName = (status: SecurityAlertStatus) => {
    switch (status) {
      case SecurityAlertStatus.NEW:
        return 'Nueva';
      case SecurityAlertStatus.ACKNOWLEDGED:
        return 'Reconocida';
      case SecurityAlertStatus.RESOLVED:
        return 'Resuelta';
      case SecurityAlertStatus.FALSE_POSITIVE:
        return 'Falso positivo';
      default:
        return status;
    }
  };
  
  // Función para obtener el icono del estado
  const getStatusIcon = (status: SecurityAlertStatus) => {
    switch (status) {
      case SecurityAlertStatus.NEW:
        return <FiAlertCircle size={14} />;
      case SecurityAlertStatus.ACKNOWLEDGED:
        return <FiEye size={14} />;
      case SecurityAlertStatus.RESOLVED:
        return <FiCheckCircle size={14} />;
      case SecurityAlertStatus.FALSE_POSITIVE:
        return <FiX size={14} />;
      default:
        return <FiInfo size={14} />;
    }
  };
  
  // Función para reconocer una alerta
  const acknowledgeAlert = () => {
    updateAlertStatus.mutate({
      id: alert.id,
      status: SecurityAlertStatus.ACKNOWLEDGED
    });
  };
  
  // Función para abrir el modal de resolución
  const openResolutionModal = (status: SecurityAlertStatus) => {
    setResolutionStatus(status);
    setResolutionNote('');
    setShowResolutionModal(true);
  };
  
  // Función para resolver una alerta
  const resolveAlert = () => {
    updateAlertStatus.mutate({
      id: alert.id,
      status: resolutionStatus,
      note: resolutionNote
    });
    setShowResolutionModal(false);
  };
  
  return (
    <>
      <Card>
        <CardHeader $severity={alert.severity}>
          <AlertTitle>
            {getAlertTypeIcon(alert.type)}
            <Title>{alert.message}</Title>
          </AlertTitle>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <SeverityBadge $severity={alert.severity}>
              <FiAlertTriangle size={14} />
              {getSeverityName(alert.severity)}
            </SeverityBadge>
            
            <StatusBadge $status={alert.status}>
              {getStatusIcon(alert.status)}
              {getStatusName(alert.status)}
            </StatusBadge>
          </div>
        </CardHeader>
        
        <CardContent>
          <AlertDetails>{alert.details}</AlertDetails>
          
          <MetadataGrid>
            <MetadataItem>
              <MetadataLabel>
                <FiInfo size={14} />
                Tipo
              </MetadataLabel>
              <MetadataValue>{getAlertTypeName(alert.type)}</MetadataValue>
            </MetadataItem>
            
            <MetadataItem>
              <MetadataLabel>
                <FiClock size={14} />
                Fecha
              </MetadataLabel>
              <MetadataValue>{formatDate(alert.timestamp)}</MetadataValue>
            </MetadataItem>
            
            <MetadataItem>
              <MetadataLabel>
                <FiUser size={14} />
                Usuario
              </MetadataLabel>
              <MetadataValue>{alert.userName}</MetadataValue>
            </MetadataItem>
            
            {alert.ipAddress && (
              <MetadataItem>
                <MetadataLabel>
                  <FiCrosshair size={14} />
                  Dirección IP
                </MetadataLabel>
                <MetadataValue>{alert.ipAddress}</MetadataValue>
              </MetadataItem>
            )}
            
            {alert.performedBy && (
              <MetadataItem>
                <MetadataLabel>
                  <FiUser size={14} />
                  Realizado por
                </MetadataLabel>
                <MetadataValue>{alert.performedBy.userName}</MetadataValue>
              </MetadataItem>
            )}
          </MetadataGrid>
          
          {alert.relatedAuditLogIds && alert.relatedAuditLogIds.length > 0 && (
            <ExpandableSection>
              <ExpandHeader onClick={() => toggleSection('relatedLogs')}>
                {expandedSections.relatedLogs ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                Registros de auditoría relacionados ({alert.relatedAuditLogIds.length})
              </ExpandHeader>
              
              <ExpandContent $expanded={expandedSections.relatedLogs}>
                <RelatedLogsList>
                  {alert.relatedAuditLogIds.map((logId) => (
                    <RelatedLogItem 
                      key={logId}
                      onClick={() => onViewAuditLog && onViewAuditLog(logId)}
                    >
                      ID: {logId}
                    </RelatedLogItem>
                  ))}
                </RelatedLogsList>
              </ExpandContent>
            </ExpandableSection>
          )}
          
          {alert.resolution && (
            <ResolutionInfo>
              <ResolutionHeader>
                <FiCheckCircle size={16} />
                Resolución
              </ResolutionHeader>
              
              <ResolutionDetails>
                <div>Resuelto por: {alert.resolution.resolvedBy}</div>
                <div>Fecha: {formatDate(alert.resolution.resolvedAt)}</div>
                {alert.resolution.resolutionNote && (
                  <div>Nota: {alert.resolution.resolutionNote}</div>
                )}
              </ResolutionDetails>
            </ResolutionInfo>
          )}
        </CardContent>
        
        <CardFooter>
          {alert.status === SecurityAlertStatus.NEW && (
            <>
              <Button onClick={acknowledgeAlert}>
                <FiEye size={14} />
                Reconocer
              </Button>
              <Button $primary onClick={() => openResolutionModal(SecurityAlertStatus.RESOLVED)}>
                <FiCheck size={14} />
                Resolver
              </Button>
              <Button $danger onClick={() => openResolutionModal(SecurityAlertStatus.FALSE_POSITIVE)}>
                <FiX size={14} />
                Falso Positivo
              </Button>
            </>
          )}
          
          {alert.status === SecurityAlertStatus.ACKNOWLEDGED && (
            <>
              <Button $primary onClick={() => openResolutionModal(SecurityAlertStatus.RESOLVED)}>
                <FiCheck size={14} />
                Resolver
              </Button>
              <Button $danger onClick={() => openResolutionModal(SecurityAlertStatus.FALSE_POSITIVE)}>
                <FiX size={14} />
                Falso Positivo
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
      
      {/* Modal de resolución */}
      {showResolutionModal && (
        <ResolutionModal onClick={() => setShowResolutionModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {resolutionStatus === SecurityAlertStatus.RESOLVED ? (
                  <>
                    <FiCheck size={18} />
                    Resolver Alerta
                  </>
                ) : (
                  <>
                    <FiX size={18} />
                    Marcar como Falso Positivo
                  </>
                )}
              </ModalTitle>
              <CloseButton onClick={() => setShowResolutionModal(false)}>
                <FiX size={20} />
              </CloseButton>
            </ModalHeader>
            
            <FormGroup>
              <Label htmlFor="resolutionNote">Nota de resolución</Label>
              <Textarea 
                id="resolutionNote"
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder={resolutionStatus === SecurityAlertStatus.RESOLVED 
                  ? "Describe cómo se resolvió esta alerta..." 
                  : "Explica por qué esta alerta es un falso positivo..."}
              />
            </FormGroup>
            
            <ModalActions>
              <Button onClick={() => setShowResolutionModal(false)}>
                Cancelar
              </Button>
              <Button 
                $primary={resolutionStatus === SecurityAlertStatus.RESOLVED}
                $danger={resolutionStatus === SecurityAlertStatus.FALSE_POSITIVE}
                onClick={resolveAlert}
                disabled={updateAlertStatus.isPending}
              >
                {updateAlertStatus.isPending ? (
                  <>Procesando...</>
                ) : resolutionStatus === SecurityAlertStatus.RESOLVED ? (
                  <>
                    <FiCheck size={14} />
                    Resolver
                  </>
                ) : (
                  <>
                    <FiX size={14} />
                    Marcar como Falso Positivo
                  </>
                )}
              </Button>
            </ModalActions>
          </ModalContent>
        </ResolutionModal>
      )}
    </>
  );
};

export default SecurityAlertCard;

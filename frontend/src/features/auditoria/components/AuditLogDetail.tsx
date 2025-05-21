import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiX, 
  FiUser, 
  FiActivity, 
  FiDatabase,
  FiCalendar,
  FiTag,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiGlobe,
  FiMonitor,
  FiKey,
  FiEdit,
  FiFlag
} from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AuditResult, UserAuditLog } from '../types';
import { useMarkAsSuspicious } from '../hooks/useAuditLogs';

// Estilos
const Overlay = styled.div`
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

const Modal = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
    color: ${({ theme }) => theme.text};
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const InfoValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  word-break: break-word;
`;

const StatusBadge = styled.span<{ $success?: boolean; $error?: boolean; $warning?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ theme, $success, $error, $warning }) => 
    $success ? theme.success + '20' : 
    $error ? theme.error + '20' : 
    $warning ? theme.warning + '20' : 
    theme.backgroundSecondary};
  color: ${({ theme, $success, $error, $warning }) => 
    $success ? theme.success : 
    $error ? theme.error : 
    $warning ? theme.warning : 
    theme.textSecondary};
  border: 1px solid ${({ theme, $success, $error, $warning }) => 
    $success ? theme.success + '30' : 
    $error ? theme.error + '30' : 
    $warning ? theme.warning + '30' : 
    theme.border};
`;

const JsonViewer = styled.pre`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  padding: 12px;
  font-family: monospace;
  font-size: 12px;
  color: ${({ theme }) => theme.text};
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
`;

const ChangesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const ChangesTableHead = styled.thead`
  background-color: ${({ theme }) => theme.backgroundSecondary};
`;

const ChangesTableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  &:hover {
    background-color: ${({ theme }) => theme.hoverBackground};
  }
`;

const ChangesTableCell = styled.td`
  padding: 8px 12px;
  color: ${({ theme }) => theme.text};
`;

const ChangesTableHeader = styled.th`
  padding: 8px 12px;
  text-align: left;
  color: ${({ theme }) => theme.text};
  font-weight: 600;
`;

const OldValue = styled.span`
  text-decoration: line-through;
  color: ${({ theme }) => theme.error};
  background-color: ${({ theme }) => theme.error + '10'};
  padding: 2px 4px;
  border-radius: 4px;
`;

const NewValue = styled.span`
  color: ${({ theme }) => theme.success};
  background-color: ${({ theme }) => theme.success + '10'};
  padding: 2px 4px;
  border-radius: 4px;
`;

const MarkSuspiciousContainer = styled.div`
  margin-top: 16px;
  padding: 16px;
  background-color: ${({ theme }) => theme.warning + '10'};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.warning + '30'};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MarkSuspiciousTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundInput};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
  }
`;

const Button = styled.button<{ $primary?: boolean; $warning?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, $primary, $warning }) => 
    $primary ? theme.primary : 
    $warning ? theme.warning : 
    theme.cardBackground};
  color: ${({ theme, $primary, $warning }) => 
    $primary ? '#fff' : 
    $warning ? '#fff' : 
    theme.text};
  border: 1px solid ${({ theme, $primary, $warning }) => 
    $primary ? theme.primary : 
    $warning ? theme.warning : 
    theme.border};

  &:hover {
    background-color: ${({ theme, $primary, $warning }) => 
      $primary ? theme.primaryDark : 
      $warning ? theme.warningDark : 
      theme.hoverBackground};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface AuditLogDetailProps {
  log: UserAuditLog;
  onClose: () => void;
}

const AuditLogDetail: React.FC<AuditLogDetailProps> = ({ log, onClose }) => {
  const [suspiciousReason, setSuspiciousReason] = useState('');
  const markAsSuspicious = useMarkAsSuspicious();
  
  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm:ss', { locale: es });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };
  
  // Función para obtener el color del resultado
  const getResultColor = (result: AuditResult) => {
    switch (result) {
      case AuditResult.SUCCESS:
        return { success: true };
      case AuditResult.ERROR:
      case AuditResult.DENIED:
      case AuditResult.TIMEOUT:
        return { error: true };
      case AuditResult.CANCELLED:
      case AuditResult.PARTIAL:
      case AuditResult.IN_PROGRESS:
        return { warning: true };
      default:
        return {};
    }
  };
  
  // Función para marcar como sospechoso
  const handleMarkAsSuspicious = () => {
    if (suspiciousReason.trim()) {
      markAsSuspicious.mutate({ id: log.id, reason: suspiciousReason });
      onClose();
    }
  };
  
  // Renderizar cambios (oldValues vs newValues)
  const renderChanges = () => {
    if (!log.oldValues || !log.newValues || Object.keys(log.oldValues).length === 0) {
      return (
        <div>No hay información de cambios disponible</div>
      );
    }
    
    const allKeys = new Set([
      ...Object.keys(log.oldValues),
      ...Object.keys(log.newValues)
    ]);
    
    return (
      <ChangesTable>
        <ChangesTableHead>
          <ChangesTableRow>
            <ChangesTableHeader>Campo</ChangesTableHeader>
            <ChangesTableHeader>Valor anterior</ChangesTableHeader>
            <ChangesTableHeader>Nuevo valor</ChangesTableHeader>
          </ChangesTableRow>
        </ChangesTableHead>
        <tbody>
          {Array.from(allKeys).map(key => (
            <ChangesTableRow key={key}>
              <ChangesTableCell>{key}</ChangesTableCell>
              <ChangesTableCell>
                {log.oldValues[key] ? (
                  <OldValue>{log.oldValues[key]}</OldValue>
                ) : (
                  <span>-</span>
                )}
              </ChangesTableCell>
              <ChangesTableCell>
                {log.newValues[key] ? (
                  <NewValue>{log.newValues[key]}</NewValue>
                ) : (
                  <span>-</span>
                )}
              </ChangesTableCell>
            </ChangesTableRow>
          ))}
        </tbody>
      </ChangesTable>
    );
  };
  
  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <FiActivity size={18} />
            Detalle de Registro de Auditoría
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <Section>
            <SectionTitle>
              <FiInfo size={16} />
              Información General
            </SectionTitle>
            
            <InfoGrid>
              <InfoItem>
                <InfoLabel>
                  <FiUser size={12} />
                  Usuario
                </InfoLabel>
                <InfoValue>{log.username}</InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>
                  <FiUser size={12} />
                  Nombre completo
                </InfoLabel>
                <InfoValue>{log.userFullName || '-'}</InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>
                  <FiActivity size={12} />
                  Acción
                </InfoLabel>
                <InfoValue>{log.actionTypeDisplay}</InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>
                  <FiCalendar size={12} />
                  Fecha y hora
                </InfoLabel>
                <InfoValue>{formatDate(log.timestamp)}</InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>
                  <FiCheckCircle size={12} />
                  Resultado
                </InfoLabel>
                <InfoValue>
                  <StatusBadge {...getResultColor(log.result)}>
                    {log.result === AuditResult.SUCCESS ? (
                      <FiCheckCircle size={12} />
                    ) : log.result === AuditResult.ERROR || log.result === AuditResult.DENIED ? (
                      <FiXCircle size={12} />
                    ) : (
                      <FiInfo size={12} />
                    )}
                    {log.resultDisplay}
                  </StatusBadge>
                </InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>
                  <FiDatabase size={12} />
                  Tipo de entidad
                </InfoLabel>
                <InfoValue>{log.entityType || '-'}</InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>
                  <FiTag size={12} />
                  ID de entidad
                </InfoLabel>
                <InfoValue>{log.entityId || '-'}</InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>
                  <FiGlobe size={12} />
                  Dirección IP
                </InfoLabel>
                <InfoValue>{log.ipAddress || '-'}</InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>
                  <FiMonitor size={12} />
                  Agente de usuario
                </InfoLabel>
                <InfoValue>{log.userAgent || '-'}</InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>
                  <FiKey size={12} />
                  ID de sesión
                </InfoLabel>
                <InfoValue>{log.sessionId || '-'}</InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>
                  <FiDatabase size={12} />
                  Módulo
                </InfoLabel>
                <InfoValue>{log.module || '-'}</InfoValue>
              </InfoItem>
            </InfoGrid>
            
            {log.description && (
              <InfoItem>
                <InfoLabel>
                  <FiInfo size={12} />
                  Descripción
                </InfoLabel>
                <InfoValue>{log.description}</InfoValue>
              </InfoItem>
            )}
          </Section>
          
          {(log.oldValues || log.newValues) && (
            <Section>
              <SectionTitle>
                <FiEdit size={16} />
                Cambios Realizados
              </SectionTitle>
              {renderChanges()}
            </Section>
          )}
          
          {log.details && Object.keys(log.details).length > 0 && (
            <Section>
              <SectionTitle>
                <FiInfo size={16} />
                Detalles Adicionales
              </SectionTitle>
              <JsonViewer>
                {JSON.stringify(log.details, null, 2)}
              </JsonViewer>
            </Section>
          )}
          
          {log.suspicious && (
            <Section>
              <SectionTitle>
                <FiAlertTriangle size={16} color="#f59e0b" />
                Información de Actividad Sospechosa
              </SectionTitle>
              <InfoItem>
                <InfoLabel>
                  <FiFlag size={12} />
                  Razón
                </InfoLabel>
                <InfoValue>{log.suspiciousReason || 'No se especificó una razón'}</InfoValue>
              </InfoItem>
            </Section>
          )}
          
          {!log.suspicious && (
            <MarkSuspiciousContainer>
              <MarkSuspiciousTitle>
                <FiAlertTriangle size={16} color="#f59e0b" />
                Marcar como actividad sospechosa
              </MarkSuspiciousTitle>
              <TextArea
                placeholder="Ingrese la razón por la que considera esta actividad como sospechosa..."
                value={suspiciousReason}
                onChange={(e) => setSuspiciousReason(e.target.value)}
              />
              <Button 
                $warning 
                onClick={handleMarkAsSuspicious}
                disabled={!suspiciousReason.trim() || markAsSuspicious.isPending}
              >
                <FiAlertTriangle size={16} />
                {markAsSuspicious.isPending ? 'Marcando...' : 'Marcar como sospechoso'}
              </Button>
            </MarkSuspiciousContainer>
          )}
        </ModalBody>
      </Modal>
    </Overlay>
  );
};

export default AuditLogDetail;

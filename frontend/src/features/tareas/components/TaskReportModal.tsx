import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  FiX,
  FiFileText,
  FiUser,
  FiCalendar,
  FiClock,
  FiTag,
  FiMessageSquare,
  FiPaperclip,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiDownload,
  FiArrowRight
} from 'react-icons/fi';
import { StatusBadge, PriorityBadge, CategoryBadge } from '@/shared/components/ui';

// Interfaces
interface TaskHistory {
  id: number;
  date: string;
  previousStatus: string;
  newStatus: string;
  userId: number;
  userName: string;
  notes?: string;
}

interface TaskComment {
  id: number;
  userId: number;
  userName: string;
  content: string;
  createdAt: string;
}

interface TaskAttachment {
  id: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  downloadUrl: string;
  uploadedBy: string;
}

interface TaskReportData {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  dueDate: string;
  requestDate: string;
  completionDate?: string;
  requesterName: string;
  assignerName: string;
  executorName: string;
  timeSpent?: number; // en días
  approvalComment?: string;
  rejectionReason?: string;
  history: TaskHistory[];
  comments: TaskComment[];
  attachments: TaskAttachment[];
}

interface TaskReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskData: TaskReportData;
}

// Estilos
const ModalOverlay = styled.div`
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
  backdrop-filter: blur(5px);
`;

const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.backgroundPrimary};
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.border};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundSecondary};
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.text};
    transform: scale(1.1);
  }
`;

const ModalContent = styled.div`
  padding: 24px;
  overflow-y: auto;
  max-height: calc(90vh - 120px);
`;

const ReportSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 500;
`;

const InfoValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`;

const Description = styled.div`
  background-color: ${({ theme }) => theme.backgroundTertiary};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  line-height: 1.5;
  border: 1px solid ${({ theme }) => theme.border};
`;

const BadgesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HistoryItem = styled.div`
  display: flex;
  gap: 16px;
  padding: 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.backgroundTertiary};
  border: 1px solid ${({ theme }) => theme.border};
`;

const HistoryIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.textSecondary};
  flex-shrink: 0;
`;

const HistoryContent = styled.div`
  flex: 1;
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const HistoryUser = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
`;

const HistoryDate = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 12px;
`;

const HistoryStatusChange = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 13px;
`;

const HistoryNotes = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
  background-color: ${({ theme }) => theme.backgroundSecondary};
  padding: 8px;
  border-radius: 4px;
  margin-top: 8px;
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CommentItem = styled.div`
  padding: 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.backgroundTertiary};
  border: 1px solid ${({ theme }) => theme.border};
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const CommentUser = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CommentDate = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 12px;
`;

const CommentContent = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  line-height: 1.5;
`;

const AttachmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AttachmentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.backgroundTertiary};
  border: 1px solid ${({ theme }) => theme.border};
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const AttachmentIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.textSecondary};
  flex-shrink: 0;
`;

const AttachmentInfo = styled.div`
  flex: 1;
`;

const AttachmentName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  margin-bottom: 2px;
`;

const AttachmentMeta = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 12px;
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.primaryLight};
  }
`;

// Función para formatear fechas
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy', { locale: es });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Fecha inválida';
  }
};

// Función para formatear fechas con hora
const formatDateTime = (dateString: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
  } catch (error) {
    console.error('Error al formatear fecha y hora:', error);
    return 'Fecha inválida';
  }
};

// Función para formatear tamaño de archivo
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const TaskReportModal: React.FC<TaskReportModalProps> = ({ isOpen, onClose, taskData }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <FiFileText size={20} />
            Informe Detallado de Tarea
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX size={24} />
          </CloseButton>
        </ModalHeader>
        <ModalContent>
          {/* Sección de información general */}
          <ReportSection>
            <SectionTitle>
              <FiFileText size={18} />
              Información General
            </SectionTitle>

            <Description>{taskData.description}</Description>

            <BadgesContainer>
              <StatusBadge status={taskData.status}>
                {taskData.status === 'APPROVED' ? <FiCheckCircle size={14} /> :
                 taskData.status === 'REJECTED' ? <FiXCircle size={14} /> :
                 <FiAlertCircle size={14} />}
                {taskData.status}
              </StatusBadge>
              <PriorityBadge priority={taskData.priority}>
                {taskData.priority}
              </PriorityBadge>
              <CategoryBadge category={taskData.category}>
                {taskData.category}
              </CategoryBadge>
            </BadgesContainer>

            <InfoGrid>
              <InfoItem>
                <InfoLabel>Título</InfoLabel>
                <InfoValue>{taskData.title}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Categoría</InfoLabel>
                <InfoValue>{taskData.category}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Prioridad</InfoLabel>
                <InfoValue>{taskData.priority}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Estado</InfoLabel>
                <InfoValue>{taskData.status}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Fecha de solicitud</InfoLabel>
                <InfoValue>{formatDateTime(taskData.requestDate)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Fecha límite</InfoLabel>
                <InfoValue>{formatDate(taskData.dueDate)}</InfoValue>
              </InfoItem>
              {taskData.completionDate && (
                <InfoItem>
                  <InfoLabel>Fecha de completado</InfoLabel>
                  <InfoValue>{formatDateTime(taskData.completionDate)}</InfoValue>
                </InfoItem>
              )}
              {taskData.timeSpent !== undefined && (
                <InfoItem>
                  <InfoLabel>Tiempo dedicado</InfoLabel>
                  <InfoValue>{taskData.timeSpent} días</InfoValue>
                </InfoItem>
              )}
            </InfoGrid>

            <InfoGrid>
              <InfoItem>
                <InfoLabel>Solicitante</InfoLabel>
                <InfoValue>
                  <FiUser size={14} style={{ marginRight: '4px' }} />
                  {taskData.requesterName}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Asignador</InfoLabel>
                <InfoValue>
                  <FiUser size={14} style={{ marginRight: '4px' }} />
                  {taskData.assignerName}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Ejecutor</InfoLabel>
                <InfoValue>
                  <FiUser size={14} style={{ marginRight: '4px' }} />
                  {taskData.executorName}
                </InfoValue>
              </InfoItem>
            </InfoGrid>

            {taskData.approvalComment && (
              <ReportSection>
                <SectionTitle>
                  <FiCheckCircle size={18} />
                  Comentario de Aprobación
                </SectionTitle>
                <Description>{taskData.approvalComment}</Description>
              </ReportSection>
            )}

            {taskData.rejectionReason && (
              <ReportSection>
                <SectionTitle>
                  <FiXCircle size={18} />
                  Motivo de Rechazo
                </SectionTitle>
                <Description>{taskData.rejectionReason}</Description>
              </ReportSection>
            )}
          </ReportSection>

          {/* Sección de historial */}
          <ReportSection>
            <SectionTitle>
              <FiClock size={18} />
              Historial de Cambios
            </SectionTitle>

            <HistoryList>
              {taskData.history.length > 0 ? (
                taskData.history.map((item) => (
                  <HistoryItem key={item.id}>
                    <HistoryIcon>
                      <FiClock size={16} />
                    </HistoryIcon>
                    <HistoryContent>
                      <HistoryHeader>
                        <HistoryUser>{item.userName}</HistoryUser>
                        <HistoryDate>{formatDateTime(item.date)}</HistoryDate>
                      </HistoryHeader>
                      <HistoryStatusChange>
                        Cambio de estado: <StatusBadge status={item.previousStatus}>{item.previousStatus}</StatusBadge>
                        <FiArrowRight size={14} />
                        <StatusBadge status={item.newStatus}>{item.newStatus}</StatusBadge>
                      </HistoryStatusChange>
                      {item.notes && <HistoryNotes>{item.notes}</HistoryNotes>}
                    </HistoryContent>
                  </HistoryItem>
                ))
              ) : (
                <div>No hay registros de historial disponibles.</div>
              )}
            </HistoryList>
          </ReportSection>

          {/* Sección de comentarios */}
          <ReportSection>
            <SectionTitle>
              <FiMessageSquare size={18} />
              Comentarios
            </SectionTitle>

            <CommentsList>
              {taskData.comments.length > 0 ? (
                taskData.comments.map((comment) => (
                  <CommentItem key={comment.id}>
                    <CommentHeader>
                      <CommentUser>
                        <FiUser size={14} />
                        {comment.userName}
                      </CommentUser>
                      <CommentDate>{formatDateTime(comment.createdAt)}</CommentDate>
                    </CommentHeader>
                    <CommentContent>{comment.content}</CommentContent>
                  </CommentItem>
                ))
              ) : (
                <div>No hay comentarios disponibles.</div>
              )}
            </CommentsList>
          </ReportSection>

          {/* Sección de archivos adjuntos */}
          <ReportSection>
            <SectionTitle>
              <FiPaperclip size={18} />
              Archivos Adjuntos
            </SectionTitle>

            <AttachmentsList>
              {taskData.attachments.length > 0 ? (
                taskData.attachments.map((attachment) => (
                  <AttachmentItem key={attachment.id}>
                    <AttachmentIcon>
                      <FiPaperclip size={20} />
                    </AttachmentIcon>
                    <AttachmentInfo>
                      <AttachmentName>{attachment.fileName}</AttachmentName>
                      <AttachmentMeta>
                        {formatFileSize(attachment.fileSize)} • Subido por {attachment.uploadedBy} • {formatDate(attachment.uploadDate)}
                      </AttachmentMeta>
                    </AttachmentInfo>
                    <DownloadButton onClick={() => window.open(attachment.downloadUrl, '_blank')}>
                      <FiDownload size={18} />
                    </DownloadButton>
                  </AttachmentItem>
                ))
              ) : (
                <div>No hay archivos adjuntos disponibles.</div>
              )}
            </AttachmentsList>
          </ReportSection>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default TaskReportModal;

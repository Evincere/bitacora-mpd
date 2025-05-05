import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import {
  FiArrowLeft,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiUser,
  FiCalendar,
  FiTag,
  FiFileText,
  FiMessageSquare,
  FiSend,
  FiPaperclip,
  FiLoader,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiEye,
  FiRefreshCw,
  FiAtSign
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import solicitudesService, { TaskRequest, TaskRequestHistory } from '../services/solicitudesService';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ErrorMessage, Tooltip, CategoryBadge } from '@/shared/components/ui';
import { priorityColors, normalizePriority } from '@/shared/styles';
import useAuth from '@/features/auth/hooks/useAuth';
import UserMentionSuggestions from '../components/UserMentionSuggestions';
import CommentTextWithMentions from '../components/CommentText';
import userSearchService, { User as UserType } from '@/features/usuarios/services/userSearchService';

// Animación de rotación para el loader
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Componente estilizado para el icono de carga con animación
const SpinningLoader = styled(FiLoader)`
  animation: ${spin} 1s linear infinite;
`;

// Datos de ejemplo para comentarios
// El historial ahora se cargará desde el backend

const MOCK_COMENTARIOS = [
  {
    id: 1,
    fecha: '2025-05-01T14:30:00',
    usuario: 'Adriana Sánchez',
    mensaje: '¿Podría proporcionar más detalles sobre el caso?'
  },
  {
    id: 2,
    fecha: '2025-05-01T15:45:00',
    usuario: 'Juan Pérez',
    mensaje: 'Es para el expediente 12345, necesito que se realice antes del viernes.'
  }
];

const PageContainer = styled.div`
  padding: 0;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 8px;
  margin-right: 16px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SideContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CardContent = styled.div`
  padding: 16px;
`;

const DetailItem = styled.div`
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: ${({ theme }) => theme.textSecondary};
  flex-shrink: 0;
`;

const DetailContent = styled.div`
  flex: 1;
`;

const DetailLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 4px;
`;

const DetailValue = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.7px;

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  ${({ $status }) => {
    switch ($status) {
      case 'SUBMITTED':
        return `
          background-color: rgba(10, 132, 255, 0.2);
          color: #0055cc;
          border: 1.5px solid rgba(10, 132, 255, 0.6);
          &:hover {
            background-color: rgba(10, 132, 255, 0.3);
            box-shadow: 0 5px 10px rgba(10, 132, 255, 0.4);
            transform: translateY(-1px);
          }
        `;
      case 'REQUESTED':
        return `
          background-color: rgba(10, 132, 255, 0.2);
          color: #0055cc;
          border: 1.5px solid rgba(10, 132, 255, 0.6);
          &:hover {
            background-color: rgba(10, 132, 255, 0.3);
            box-shadow: 0 5px 10px rgba(10, 132, 255, 0.4);
            transform: translateY(-1px);
          }
        `;
      case 'ASSIGNED':
        return `
          background-color: rgba(255, 165, 2, 0.2);
          color: #cc7700;
          border: 1.5px solid rgba(255, 165, 2, 0.6);
          &:hover {
            background-color: rgba(255, 165, 2, 0.3);
            box-shadow: 0 5px 10px rgba(255, 165, 2, 0.4);
            transform: translateY(-1px);
          }
        `;
      case 'IN_PROGRESS':
        return `
          background-color: rgba(139, 92, 246, 0.2);
          color: #5b21b6;
          border: 1.5px solid rgba(139, 92, 246, 0.6);
          &:hover {
            background-color: rgba(139, 92, 246, 0.3);
            box-shadow: 0 5px 10px rgba(139, 92, 246, 0.4);
            transform: translateY(-1px);
          }
        `;
      case 'COMPLETED':
        return `
          background-color: rgba(46, 213, 115, 0.2);
          color: #0e8c3c;
          border: 1.5px solid rgba(46, 213, 115, 0.6);
          &:hover {
            background-color: rgba(46, 213, 115, 0.3);
            box-shadow: 0 5px 10px rgba(46, 213, 115, 0.4);
            transform: translateY(-1px);
          }
        `;
      case 'APPROVED':
        return `
          background-color: rgba(16, 185, 129, 0.2);
          color: #065f46;
          border: 1.5px solid rgba(16, 185, 129, 0.6);
          &:hover {
            background-color: rgba(16, 185, 129, 0.3);
            box-shadow: 0 5px 10px rgba(16, 185, 129, 0.4);
            transform: translateY(-1px);
          }
        `;
      case 'REJECTED':
        return `
          background-color: rgba(239, 68, 68, 0.2);
          color: #991b1b;
          border: 1.5px solid rgba(239, 68, 68, 0.6);
          &:hover {
            background-color: rgba(239, 68, 68, 0.3);
            box-shadow: 0 5px 10px rgba(239, 68, 68, 0.4);
            transform: translateY(-1px);
          }
        `;
      default:
        return `
          background-color: rgba(156, 163, 175, 0.2);
          color: #4b5563;
          border: 1.5px solid rgba(156, 163, 175, 0.6);
          &:hover {
            background-color: rgba(156, 163, 175, 0.3);
            box-shadow: 0 5px 10px rgba(156, 163, 175, 0.4);
            transform: translateY(-1px);
          }
        `;
    }
  }}
`;

const PriorityBadge = styled.span<{ $priority: string }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.7px;

  background-color: ${({ $priority }) => {
    const normalizedPriority = normalizePriority($priority);
    return priorityColors[normalizedPriority].background;
  }};

  color: ${({ $priority }) => {
    const normalizedPriority = normalizePriority($priority);
    return priorityColors[normalizedPriority].text;
  }};

  border: 1.5px solid ${({ $priority }) => {
    const normalizedPriority = normalizePriority($priority);
    return priorityColors[normalizedPriority].border;
  }};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 5px 10px ${({ $priority }) => {
      const normalizedPriority = normalizePriority($priority);
      return priorityColors[normalizedPriority].shadow;
    }};
    background-color: ${({ $priority }) => {
      const normalizedPriority = normalizePriority($priority);
      return priorityColors[normalizedPriority].hover;
    }};
  }
`;

const Timeline = styled.div`
  position: relative;
  padding-left: 24px;

  &::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: ${({ theme }) => theme.border};
  }
`;

const TimelineItem = styled.div`
  position: relative;
  padding-bottom: 24px;

  &:last-child {
    padding-bottom: 0;
  }
`;

const TimelineDot = styled.div<{ $status: string }>`
  position: absolute;
  left: -24px;
  top: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $status, theme }) => {
    switch ($status) {
      case 'REQUESTED':
        return `
          background-color: ${theme.info};
          color: white;
        `;
      case 'ASSIGNED':
        return `
          background-color: ${theme.warning};
          color: white;
        `;
      case 'IN_PROGRESS':
        return `
          background-color: ${theme.primary};
          color: white;
        `;
      case 'COMPLETED':
        return `
          background-color: ${theme.success};
          color: white;
        `;
      case 'APPROVED':
        return `
          background-color: ${theme.success};
          color: white;
        `;
      case 'REJECTED':
        return `
          background-color: ${theme.error};
          color: white;
        `;
      default:
        return `
          background-color: ${theme.textSecondary};
          color: white;
        `;
    }
  }}
`;

const TimelineContent = styled.div`
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-radius: 8px;
  padding: 12px 16px;
`;

const TimelineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const TimelineTitle = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const TimelineDate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const TimelineBody = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const CommentGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CommentDateDivider = styled.div`
  position: relative;
  text-align: center;
  margin: 8px 0;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.border};
    z-index: 1;
  }
`;

const CommentDateLabel = styled.span`
  position: relative;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  padding: 0 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 500;
  z-index: 2;
`;

const CommentItem = styled.div`
  display: flex;
  gap: 12px;
`;

const CommentAvatar = styled.div<{ $userInitial?: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${({ theme, $userInitial }) => {
    // Generar un color basado en la inicial del usuario
    if ($userInitial) {
      const colors = [
        theme.primary,
        theme.success,
        theme.info,
        theme.warning,
        theme.error
      ];
      // Usar el código ASCII de la inicial para seleccionar un color
      const charCode = $userInitial.charCodeAt(0);
      const colorIndex = charCode % colors.length;
      return `${colors[colorIndex]}30`;
    }
    return `${theme.primary}20`;
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, $userInitial }) => {
    // Generar un color basado en la inicial del usuario
    if ($userInitial) {
      const colors = [
        theme.primary,
        theme.success,
        theme.info,
        theme.warning,
        theme.error
      ];
      // Usar el código ASCII de la inicial para seleccionar un color
      const charCode = $userInitial.charCodeAt(0);
      const colorIndex = charCode % colors.length;
      return colors[colorIndex];
    }
    return theme.primary;
  }};
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
  text-transform: uppercase;
`;

const CommentContent = styled.div`
  flex: 1;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const CommentAuthor = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
`;

const CommentDate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const CommentText = styled.div<{ $isRead?: boolean }>`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme, $isRead }) => $isRead ? theme.backgroundSecondary : theme.backgroundHover};
  padding: 12px;
  border-radius: 8px;
  position: relative;
  border-left: 3px solid ${({ theme, $isRead }) => $isRead ? 'transparent' : theme.primary};
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${({ theme }) => theme.backgroundAlt};
  }
`;

const ReadIndicator = styled.div<{ $isRead: boolean }>`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ theme, $isRead }) => $isRead ? 'transparent' : theme.primary};
  display: ${({ $isRead }) => $isRead ? 'none' : 'block'};
`;

const CommentActions = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;

  ${CommentText}:hover & {
    opacity: 1;
  }
`;

const CommentActionButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }
`;

const CommentEditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;

const CommentForm = styled.form`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CommentInput = styled.textarea`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundTertiary};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.primary}30`};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AttachButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
  }
`;

const SendButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.primaryDark};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.border};
    cursor: not-allowed;
  }
`;

// Función para formatear fechas
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Función para formatear fechas con hora
const formatDateTime = (dateString: string) => {
  if (!dateString) return 'No especificada';

  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Función para formatear solo la hora
const formatTime = (dateString: string) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Función para formatear fecha para agrupación
const formatDateForGroup = (dateString: string) => {
  if (!dateString) return '';

  const date = parseISO(dateString);

  if (isToday(date)) {
    return 'Hoy';
  } else if (isYesterday(date)) {
    return 'Ayer';
  } else {
    return format(date, "EEEE, d 'de' MMMM", { locale: es });
  }
};

// Función para agrupar comentarios por fecha
const groupCommentsByDate = (comments: any[]) => {
  const groups: { date: string; comments: any[] }[] = [];

  comments.forEach(comment => {
    const commentDate = comment.fecha.split('T')[0]; // Extraer solo la fecha (YYYY-MM-DD)

    // Buscar si ya existe un grupo para esta fecha
    const existingGroup = groups.find(group => {
      const groupDate = group.date.split('T')[0];
      return groupDate === commentDate;
    });

    if (existingGroup) {
      existingGroup.comments.push(comment);
    } else {
      groups.push({
        date: comment.fecha,
        comments: [comment]
      });
    }
  });

  // Ordenar grupos por fecha (más reciente primero)
  groups.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Ordenar comentarios dentro de cada grupo por fecha (más antiguo primero)
  groups.forEach(group => {
    group.comments.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  });

  return groups;
};

// Función para obtener el texto de estado
const getStatusText = (status: string) => {
  switch (status) {
    case 'REQUESTED':
      return 'Solicitada';
    case 'ASSIGNED':
      return 'Asignada';
    case 'IN_PROGRESS':
      return 'En Progreso';
    case 'COMPLETED':
      return 'Completada';
    case 'APPROVED':
      return 'Aprobada';
    case 'REJECTED':
      return 'Rechazada';
    default:
      return status;
  }
};

// Función para obtener el icono de estado
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'REQUESTED':
      return <FiClock size={14} />;
    case 'ASSIGNED':
      return <FiClock size={14} />;
    case 'IN_PROGRESS':
      return <FiClock size={14} />;
    case 'COMPLETED':
      return <FiCheckCircle size={14} />;
    case 'APPROVED':
      return <FiCheckCircle size={14} />;
    case 'REJECTED':
      return <FiXCircle size={14} />;
    default:
      return <FiAlertCircle size={14} />;
  }
};

// Función para obtener el texto de prioridad
const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'CRITICAL':
      return 'Crítica';
    case 'HIGH':
      return 'Alta';
    case 'MEDIUM':
      return 'Media';
    case 'LOW':
      return 'Baja';
    case 'TRIVIAL':
      return 'Trivial';
    default:
      return priority;
  }
};

// Función para obtener el texto de categoría
const getCategoryText = (category: string) => {
  switch (category) {
    case 'ADMINISTRATIVA':
      return 'Administrativa';
    case 'LEGAL':
      return 'Legal';
    case 'TECNICA':
      return 'Técnica';
    case 'FINANCIERA':
      return 'Financiera';
    case 'RECURSOS_HUMANOS':
      return 'Recursos Humanos';
    case 'OTRA':
      return 'Otra';
    default:
      return category;
  }
};

const SeguimientoSolicitud: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Obtener el usuario actual
  const [solicitud, setSolicitud] = useState<TaskRequest | null>(null);
  const [historial, setHistorial] = useState<TaskRequestHistory[]>([]);
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comentario, setComentario] = useState('');
  const [markingAsRead, setMarkingAsRead] = useState(false);

  // Estados para edición de comentarios
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedCommentText, setEditedCommentText] = useState('');
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState(false);

  // Estados para menciones de usuarios
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [mentionUsers, setMentionUsers] = useState<UserType[]>([]);
  const [activeMentionIndex, setActiveMentionIndex] = useState(0);
  const [loadingMentions, setLoadingMentions] = useState(false);
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  // Función para cargar los comentarios
  const fetchComments = async (taskRequestId: number) => {
    try {
      setLoadingComments(true);
      const comments = await solicitudesService.getCommentsWithReadStatus(taskRequestId);

      // Mapear los comentarios al formato esperado por el componente
      const mappedComments = comments.map((comment: any) => {
        // Si el comentario es del usuario actual, usar el nombre del usuario actual
        const isCurrentUserComment = currentUser && comment.userId === currentUser.id;

        // Priorizar userFullName o userName sobre username
        const userName = isCurrentUserComment && currentUser
          ? `${currentUser.firstName} ${currentUser.lastName}`.trim() || currentUser.username || currentUser.email
          : comment.userFullName || comment.userName || comment.userEmail || 'Usuario sin nombre';

        console.log('Datos del comentario:', {
          id: comment.id,
          userId: comment.userId,
          userName: comment.userName,
          userFullName: comment.userFullName,
          userEmail: comment.userEmail,
          content: comment.content
        });

        return {
          id: comment.id,
          fecha: comment.createdAt,
          usuario: userName,
          userId: comment.userId,
          mensaje: comment.content,
          readBy: comment.readBy || [],
          readByCurrentUser: comment.readByCurrentUser || false
        };
      });

      setComentarios(mappedComments);
      setLoadingComments(false);
    } catch (err) {
      console.error('Error al cargar comentarios:', err);
      setLoadingComments(false);
    }
  };

  // Función para cargar el historial
  const fetchHistory = async (taskRequestId: number) => {
    try {
      setLoadingHistory(true);
      const history = await solicitudesService.getTaskRequestHistory(taskRequestId);
      console.log('Historial obtenido:', history);
      setHistorial(history);
      setLoadingHistory(false);
    } catch (err) {
      console.error('Error al cargar historial:', err);
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    const fetchSolicitud = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const data = await solicitudesService.getTaskRequestById(Number(id));
        console.log('Datos de solicitud obtenidos:', data);
        setSolicitud(data);

        // Cargar los comentarios reales
        await fetchComments(Number(id));

        // Cargar el historial real
        await fetchHistory(Number(id));

        setLoading(false);
      } catch (err) {
        console.error('Error al cargar la solicitud:', err);
        setError('No se pudo cargar la solicitud. Por favor, inténtelo de nuevo.');
        setLoading(false);
      }
    };

    fetchSolicitud();
  }, [id]);

  // Efecto para marcar comentarios como leídos automáticamente
  useEffect(() => {
    // Solo ejecutar si hay comentarios y no estamos cargando
    if (comentarios.length > 0 && !loadingComments && !loading) {
      // Encontrar comentarios no leídos
      const unreadComments = comentarios.filter(comment => !comment.readByCurrentUser);

      // Marcar cada comentario no leído como leído
      unreadComments.forEach(comment => {
        // Pequeño retraso para evitar muchas solicitudes simultáneas
        setTimeout(() => {
          handleMarkAsRead(comment.id);
        }, 500 * unreadComments.indexOf(comment)); // Escalonar las solicitudes
      });
    }
  }, [comentarios, loadingComments, loading]);

  const handleSubmitComentario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comentario.trim() || !id || !solicitud) return;

    try {
      setSendingComment(true);

      // Enviar el comentario al backend con reintentos automáticos
      const response = await solicitudesService.addComment(Number(id), comentario);
      console.log('Comentario enviado:', response);

      // Recargar los comentarios para obtener la lista actualizada
      await fetchComments(Number(id));

      // Limpiamos el formulario
      setComentario('');

      // Mostramos notificación
      toast.success('Comentario enviado correctamente');

      // Procesar comentarios pendientes si hay alguno
      const pendingOperations = localStorage.getItem('pendingOperations');
      if (pendingOperations && Object.keys(JSON.parse(pendingOperations)).length > 0) {
        try {
          await solicitudesService.processPendingComments();
          // Recargar los comentarios nuevamente después de procesar los pendientes
          await fetchComments(Number(id));
        } catch (error) {
          console.error('Error al procesar comentarios pendientes:', error);
        }
      }
    } catch (error) {
      console.error('Error al enviar comentario:', error);

      // Mostrar mensaje de error con opción de reintento
      toast.error(
        <div>
          Error al enviar el comentario.
          <button
            onClick={() => handleSubmitComentario(e)}
            style={{
              marginLeft: '10px',
              background: 'none',
              border: 'none',
              color: 'white',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Reintentar
          </button>
        </div>
      );
    } finally {
      setSendingComment(false);
    }
  };

  // Función para iniciar la edición de un comentario
  const handleEditComment = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditedCommentText(comment.mensaje);
    setIsEditingComment(true);
  };

  // Función para cancelar la edición de un comentario
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedCommentText('');
    setIsEditingComment(false);
  };

  // Función para guardar la edición de un comentario
  const handleSaveEdit = async (e: React.FormEvent, commentId: number) => {
    e.preventDefault();
    if (!editedCommentText.trim() || !id) return;

    try {
      setIsEditingComment(true);

      // Aquí iría la llamada al backend para actualizar el comentario
      // Por ahora, actualizamos solo el estado local
      const updatedComments = comentarios.map(comment =>
        comment.id === commentId
          ? { ...comment, mensaje: editedCommentText }
          : comment
      );

      setComentarios(updatedComments);
      setEditingCommentId(null);
      setEditedCommentText('');

      toast.success('Comentario actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar comentario:', error);
      toast.error('Error al actualizar el comentario. Por favor, inténtelo de nuevo.');
    } finally {
      setIsEditingComment(false);
    }
  };

  // Función para eliminar un comentario
  const handleDeleteComment = async (commentId: number) => {
    if (!id) return;

    // Mostrar confirmación antes de eliminar
    if (!window.confirm('¿Está seguro de que desea eliminar este comentario?')) {
      return;
    }

    try {
      setIsDeletingComment(true);

      // Aquí iría la llamada al backend para eliminar el comentario
      // Por ahora, actualizamos solo el estado local
      const updatedComments = comentarios.filter(comment => comment.id !== commentId);

      setComentarios(updatedComments);

      toast.success('Comentario eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      toast.error('Error al eliminar el comentario. Por favor, inténtelo de nuevo.');
    } finally {
      setIsDeletingComment(false);
    }
  };

  // Función para marcar un comentario como leído
  const handleMarkAsRead = async (commentId: number) => {
    if (!id || markingAsRead) return;

    try {
      setMarkingAsRead(true);

      // Llamar al backend para marcar el comentario como leído
      await solicitudesService.markCommentAsRead(commentId);

      // Actualizar el estado local
      const updatedComments = comentarios.map(comment =>
        comment.id === commentId
          ? { ...comment, readByCurrentUser: true }
          : comment
      );

      setComentarios(updatedComments);
    } catch (error) {
      console.error('Error al marcar comentario como leído:', error);
      toast.error('Error al marcar el comentario como leído. Por favor, inténtelo de nuevo.');
    } finally {
      setMarkingAsRead(false);
    }
  };

  // Función para buscar usuarios para menciones
  const searchUsers = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setMentionUsers([]);
      return;
    }

    try {
      setLoadingMentions(true);
      // Pasar el ID de la solicitud para filtrar por permisos de menciones
      const users = await userSearchService.searchUsers(query, 5, id ? parseInt(id) : undefined);
      setMentionUsers(users);
      setActiveMentionIndex(0);
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
    } finally {
      setLoadingMentions(false);
    }
  }, [id]);

  // Función para manejar la selección de un usuario mencionado
  const handleSelectMention = useCallback((user: UserType) => {
    if (!commentInputRef.current) return;

    const textarea = commentInputRef.current;
    const text = textarea.value;

    // Reemplazar la mención parcial con la mención completa
    if (mentionStartIndex >= 0) {
      const beforeMention = text.substring(0, mentionStartIndex);
      const afterMention = text.substring(textarea.selectionStart);
      const newText = `${beforeMention}@${user.username} ${afterMention}`;

      setComentario(newText);

      // Colocar el cursor después de la mención
      const newCursorPosition = mentionStartIndex + user.username.length + 2; // +2 por @ y espacio

      // Usar setTimeout para asegurar que el texto se actualice antes de mover el cursor
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    }

    // Ocultar las sugerencias
    setShowMentionSuggestions(false);
    setMentionQuery('');
    setMentionStartIndex(-1);
  }, [mentionStartIndex]);

  // Función para manejar cambios en el input de comentario
  const handleCommentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setComentario(text);

    // Verificar si estamos escribiendo una mención
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = text.substring(0, cursorPosition);

    // Buscar la última @ antes del cursor
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex >= 0) {
      // Verificar que @ esté al inicio o después de un espacio
      const charBeforeAt = lastAtIndex > 0 ? textBeforeCursor[lastAtIndex - 1] : ' ';

      if (charBeforeAt === ' ' || charBeforeAt === '\n' || lastAtIndex === 0) {
        // Extraer el texto después de @ hasta el cursor
        const query = textBeforeCursor.substring(lastAtIndex + 1);

        // Si hay un espacio después de @, no es una mención
        if (!query.includes(' ')) {
          setMentionQuery(query);
          setMentionStartIndex(lastAtIndex);

          // Calcular la posición para mostrar las sugerencias
          if (commentInputRef.current) {
            const { offsetLeft, offsetTop, scrollTop } = commentInputRef.current;

            // Crear un elemento temporal para medir el ancho del texto
            const span = document.createElement('span');
            span.style.visibility = 'hidden';
            span.style.position = 'absolute';
            span.style.whiteSpace = 'pre';
            span.style.font = window.getComputedStyle(commentInputRef.current).font;
            span.textContent = textBeforeCursor;
            document.body.appendChild(span);

            // Calcular la posición
            const left = offsetLeft + span.offsetWidth;
            const lineHeight = parseInt(window.getComputedStyle(commentInputRef.current).lineHeight);
            const lines = textBeforeCursor.split('\n').length;
            const top = offsetTop + (lines * lineHeight) - scrollTop;

            document.body.removeChild(span);

            setMentionPosition({ top, left });
            setShowMentionSuggestions(true);

            // Buscar usuarios que coincidan con la consulta
            searchUsers(query);
            return;
          }
        }
      }
    }

    // Si llegamos aquí, no estamos escribiendo una mención
    setShowMentionSuggestions(false);
    setMentionQuery('');
    setMentionStartIndex(-1);
  }, [searchUsers]);

  // Función para manejar teclas especiales en el input de comentario
  const handleCommentKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Solo procesar si se están mostrando sugerencias
    if (!showMentionSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveMentionIndex(prev =>
          prev < mentionUsers.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setActiveMentionIndex(prev =>
          prev > 0 ? prev - 1 : 0
        );
        break;

      case 'Enter':
      case 'Tab':
        if (mentionUsers.length > 0) {
          e.preventDefault();
          handleSelectMention(mentionUsers[activeMentionIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setShowMentionSuggestions(false);
        break;

      default:
        break;
    }
  }, [showMentionSuggestions, mentionUsers, activeMentionIndex, handleSelectMention]);

  if (loading) {
    return (
      <PageContainer>
        <PageHeader>
          <BackButton onClick={() => navigate('/app/solicitudes')}>
            <FiArrowLeft size={20} />
          </BackButton>
          <PageTitle>Cargando solicitud...</PageTitle>
        </PageHeader>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          Cargando detalles de la solicitud...
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader>
          <BackButton onClick={() => navigate('/app/solicitudes')}>
            <FiArrowLeft size={20} />
          </BackButton>
          <PageTitle>Error al cargar la solicitud</PageTitle>
        </PageHeader>
        <ErrorMessage
          message="Error al cargar la solicitud"
          details={error}
          onRetry={() => {
            setLoading(true);
            setError(null);
            const fetchSolicitud = async () => {
              try {
                const data = await solicitudesService.getTaskRequestById(Number(id));
                setSolicitud(data);
                await fetchComments(Number(id));
                await fetchHistory(Number(id));
                setLoading(false);
              } catch (err) {
                console.error('Error al cargar la solicitud:', err);
                setError('No se pudo cargar la solicitud. Por favor, inténtelo de nuevo.');
                setLoading(false);
              }
            };
            fetchSolicitud();
          }}
        />
      </PageContainer>
    );
  }

  if (!solicitud) {
    return (
      <PageContainer>
        <PageHeader>
          <BackButton onClick={() => navigate('/app/solicitudes')}>
            <FiArrowLeft size={20} />
          </BackButton>
          <PageTitle>Solicitud no encontrada</PageTitle>
        </PageHeader>
        <div>No se encontró la solicitud con ID {id}</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <BackButton onClick={() => navigate('/app/solicitudes')}>
          <FiArrowLeft size={20} />
        </BackButton>
        <PageTitle>Seguimiento de Solicitud</PageTitle>
      </PageHeader>

      <ContentContainer>
        <MainContent>
          <Card>
            <CardHeader>
              <CardTitle>
                <FiFileText size={18} />
                Detalles de la Solicitud
              </CardTitle>
              <StatusBadge $status={solicitud.status}>
                {getStatusIcon(solicitud.status)}
                {getStatusText(solicitud.status)}
              </StatusBadge>
            </CardHeader>
            <CardContent>
              <h3 style={{ marginTop: 0 }}>{solicitud.title}</h3>
              <p>{solicitud.description}</p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
                <PriorityBadge $priority={solicitud.priority}>
                  {getPriorityText(solicitud.priority)}
                </PriorityBadge>
                <CategoryBadge category={solicitud.category?.name || 'GENERAL'}>
                  {getCategoryText(solicitud.category?.name || 'GENERAL')}
                </CategoryBadge>
              </div>

              <DetailItem>
                <DetailIcon>
                  <FiCalendar size={18} />
                </DetailIcon>
                <DetailContent>
                  <DetailLabel>Fecha de creación</DetailLabel>
                  <DetailValue>{formatDateTime(solicitud.requestDate)}</DetailValue>
                </DetailContent>
              </DetailItem>

              {solicitud.dueDate && (
                <DetailItem>
                  <DetailIcon>
                    <FiClock size={18} />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Fecha límite</DetailLabel>
                    <DetailValue>{formatDate(solicitud.dueDate)}</DetailValue>
                  </DetailContent>
                </DetailItem>
              )}

              {solicitud.assignerId && (
                <DetailItem>
                  <DetailIcon>
                    <FiUser size={18} />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Asignador</DetailLabel>
                    <DetailValue>{solicitud.assignerName || `ID: ${solicitud.assignerId}`}</DetailValue>
                  </DetailContent>
                </DetailItem>
              )}

              {solicitud.executorId && (
                <DetailItem>
                  <DetailIcon>
                    <FiUser size={18} />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Ejecutor</DetailLabel>
                    <DetailValue>{solicitud.executorName || `ID: ${solicitud.executorId}`}</DetailValue>
                  </DetailContent>
                </DetailItem>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <FiMessageSquare size={18} />
                Comentarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingComments ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <SpinningLoader size={24} />
                  <p>Cargando comentarios...</p>
                </div>
              ) : comentarios && comentarios.length > 0 ? (
                <CommentsList>
                  {groupCommentsByDate(comentarios).map((group) => (
                    <CommentGroup key={group.date}>
                      <CommentDateDivider>
                        <CommentDateLabel>{formatDateForGroup(group.date)}</CommentDateLabel>
                      </CommentDateDivider>
                      {group.comments.map((comment: any) => {
                        // Obtener la inicial del usuario
                        const userInitial = comment.usuario ? comment.usuario.charAt(0) : '';

                        // Verificar si este comentario está siendo editado
                        const isEditing = editingCommentId === comment.id;

                        // Verificar si el comentario es del usuario actual
                        const isCurrentUserComment = currentUser && comment.userId === currentUser.id;

                        return (
                          <CommentItem key={comment.id}>
                            <CommentAvatar $userInitial={userInitial}>
                              {userInitial || <FiUser size={18} />}
                            </CommentAvatar>
                            <CommentContent>
                              <CommentHeader>
                                <CommentAuthor>{comment.usuario}</CommentAuthor>
                                <CommentDate>{formatTime(comment.fecha)}</CommentDate>
                              </CommentHeader>

                              {isEditing ? (
                                <CommentEditForm onSubmit={(e) => handleSaveEdit(e, comment.id)}>
                                  <CommentInput
                                    value={editedCommentText}
                                    onChange={(e) => setEditedCommentText(e.target.value)}
                                    disabled={isEditingComment}
                                  />
                                  <ButtonGroup>
                                    <CommentActionButton
                                      type="button"
                                      onClick={handleCancelEdit}
                                      disabled={isEditingComment}
                                    >
                                      <FiX size={16} />
                                      Cancelar
                                    </CommentActionButton>
                                    <SendButton
                                      type="submit"
                                      disabled={!editedCommentText.trim() || isEditingComment}
                                    >
                                      {isEditingComment ? (
                                        <>
                                          <SpinningLoader size={16} />
                                          Guardando...
                                        </>
                                      ) : (
                                        <>
                                          <FiSave size={16} />
                                          Guardar
                                        </>
                                      )}
                                    </SendButton>
                                  </ButtonGroup>
                                </CommentEditForm>
                              ) : (
                                <CommentText $isRead={comment.readByCurrentUser}>
                                  <CommentTextWithMentions content={comment.mensaje} />
                                  <ReadIndicator $isRead={comment.readByCurrentUser} />

                                  <CommentActions>
                                    {comment.readBy && comment.readBy.length > 0 && (
                                      <Tooltip
                                        title={
                                          <div>
                                            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                              Leído por:
                                            </div>
                                            <ul style={{ margin: 0, paddingLeft: '16px' }}>
                                              {comment.readBy.map((userId: number) => (
                                                <li key={userId}>{userId === comment.userId ? `${comment.usuario} (autor)` : `Usuario ID: ${userId}`}</li>
                                              ))}
                                            </ul>
                                          </div>
                                        }
                                        arrow
                                      >
                                        <CommentActionButton>
                                          <FiEye size={14} />
                                          <span style={{ marginLeft: '4px', fontSize: '12px' }}>
                                            {comment.readBy.length}
                                          </span>
                                        </CommentActionButton>
                                      </Tooltip>
                                    )}

                                    {isCurrentUserComment && (
                                      <>
                                        <CommentActionButton
                                          onClick={() => handleEditComment(comment)}
                                          disabled={isDeletingComment}
                                        >
                                          <FiEdit2 size={14} />
                                        </CommentActionButton>
                                        <CommentActionButton
                                          onClick={() => handleDeleteComment(comment.id)}
                                          disabled={isDeletingComment}
                                        >
                                          <FiTrash2 size={14} />
                                        </CommentActionButton>
                                      </>
                                    )}
                                  </CommentActions>
                                </CommentText>
                              )}
                            </CommentContent>
                          </CommentItem>
                        );
                      })}
                    </CommentGroup>
                  ))}
                </CommentsList>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0', color: '#666' }}>
                  No hay comentarios aún
                </div>
              )}

              <CommentForm onSubmit={handleSubmitComentario}>
                <div style={{ position: 'relative' }}>
                  <CommentInput
                    ref={commentInputRef}
                    placeholder="Escribe un comentario... (usa @ para mencionar usuarios)"
                    value={comentario}
                    onChange={handleCommentChange}
                    onKeyDown={handleCommentKeyDown}
                    disabled={sendingComment}
                  />
                  <UserMentionSuggestions
                    users={mentionUsers.map(user => ({
                      id: user.id,
                      username: user.username,
                      name: user.fullName || `${user.firstName} ${user.lastName}`.trim()
                    }))}
                    isVisible={showMentionSuggestions && mentionUsers.length > 0}
                    position={mentionPosition}
                    onSelectUser={handleSelectMention}
                    activeIndex={activeMentionIndex}
                    query={mentionQuery}
                  />
                </div>
                <ButtonGroup>
                  <AttachButton type="button" disabled={sendingComment}>
                    <FiPaperclip size={16} />
                    Adjuntar archivo
                  </AttachButton>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Tooltip title="Mencionar usuario">
                      <AttachButton
                        type="button"
                        disabled={sendingComment}
                        onClick={() => {
                          if (commentInputRef.current) {
                            const textarea = commentInputRef.current;
                            const cursorPos = textarea.selectionStart;
                            const textBefore = comentario.substring(0, cursorPos);
                            const textAfter = comentario.substring(cursorPos);
                            setComentario(`${textBefore}@${textAfter}`);

                            // Colocar el cursor después del @
                            setTimeout(() => {
                              textarea.focus();
                              const newCursorPos = cursorPos + 1;
                              textarea.setSelectionRange(newCursorPos, newCursorPos);
                            }, 0);
                          }
                        }}
                      >
                        <FiAtSign size={16} />
                      </AttachButton>
                    </Tooltip>
                    <SendButton type="submit" disabled={!comentario.trim() || sendingComment}>
                      {sendingComment ? (
                        <>
                          <SpinningLoader size={16} />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <FiSend size={16} />
                          Enviar
                        </>
                      )}
                    </SendButton>
                  </div>
                </ButtonGroup>
              </CommentForm>
            </CardContent>
          </Card>
        </MainContent>

        <SideContent>
          <Card>
            <CardHeader>
              <CardTitle>
                <FiClock size={18} />
                Historial
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingHistory ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <SpinningLoader size={24} />
                  <p>Cargando historial...</p>
                </div>
              ) : historial && historial.length > 0 ? (
                <Timeline>
                  {historial.map((item: TaskRequestHistory, index: number) => (
                    <TimelineItem key={item.id || index}>
                      <TimelineDot $status={item.newStatus}>
                        {getStatusIcon(item.newStatus)}
                      </TimelineDot>
                      <TimelineContent>
                        <TimelineHeader>
                          <TimelineTitle>{getStatusText(item.newStatus)}</TimelineTitle>
                          <TimelineDate>{formatDateTime(item.changeDate)}</TimelineDate>
                        </TimelineHeader>
                        <TimelineBody>
                          <div style={{ marginBottom: '4px' }}>
                            <strong>{item.userName || `Usuario ID: ${item.userId}`}</strong>
                          </div>
                          {item.notes || `Cambio de estado: ${item.previousStatus ? getStatusText(item.previousStatus) : 'Nuevo'} → ${getStatusText(item.newStatus)}`}
                        </TimelineBody>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0', color: '#666' }}>
                  No hay registros de historial disponibles
                </div>
              )}
            </CardContent>
          </Card>
        </SideContent>
      </ContentContainer>
    </PageContainer>
  );
};

export default SeguimientoSolicitud;

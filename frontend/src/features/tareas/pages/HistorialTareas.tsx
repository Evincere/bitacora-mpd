import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FiFilter,
  FiSearch,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
  FiFileText,
  FiDownload,
  FiTag,
  FiEye
} from 'react-icons/fi';
import { StatusBadge, PriorityBadge, CategoryBadge } from '@/shared/components/ui';
import { toast } from 'react-toastify';
import TaskReportModal from '../components/TaskReportModal';
import taskReportService, { TaskReportData } from '../services/taskReportService';

// Datos de ejemplo para mostrar en la interfaz
const MOCK_HISTORIAL_TAREAS = [
  {
    id: 101,
    titulo: 'Revisión de contrato de arrendamiento',
    descripcion: 'Revisar el contrato de arrendamiento del caso #12345 para identificar posibles cláusulas abusivas.',
    categoria: 'LEGAL',
    prioridad: 'HIGH',
    fechaAsignacion: '2025-03-15T10:30:00',
    fechaCompletado: '2025-03-20T14:45:00',
    fechaLimite: '2025-03-25',
    estado: 'APPROVED',
    solicitante: 'Juan Pérez',
    asignador: 'Carlos Rodríguez',
    tiempoCompletado: 5, // días
    comentarioAprobacion: 'Excelente trabajo, muy detallado y completo.'
  },
  {
    id: 102,
    titulo: 'Análisis de documentación financiera',
    descripcion: 'Realizar un análisis detallado de la documentación financiera del caso #54321.',
    categoria: 'FINANCIERA',
    prioridad: 'MEDIUM',
    fechaAsignacion: '2025-03-10T09:15:00',
    fechaCompletado: '2025-03-18T11:30:00',
    fechaLimite: '2025-03-20',
    estado: 'APPROVED',
    solicitante: 'María López',
    asignador: 'Carlos Rodríguez',
    tiempoCompletado: 8, // días
    comentarioAprobacion: 'Buen trabajo, aunque podría haber sido más detallado en algunos aspectos.'
  },
  {
    id: 103,
    titulo: 'Preparación de informe pericial',
    descripcion: 'Elaborar un informe pericial sobre las evidencias del caso #67890.',
    categoria: 'TECNICA',
    prioridad: 'CRITICAL',
    fechaAsignacion: '2025-02-25T14:00:00',
    fechaCompletado: '2025-03-05T16:20:00',
    fechaLimite: '2025-03-10',
    estado: 'APPROVED',
    solicitante: 'Pedro Gómez',
    asignador: 'Carlos Rodríguez',
    tiempoCompletado: 8, // días
    comentarioAprobacion: 'Informe muy completo y bien estructurado. Excelente trabajo.'
  },
  {
    id: 104,
    titulo: 'Revisión de expediente administrativo',
    descripcion: 'Revisar el expediente administrativo del caso #13579 para verificar si hay inconsistencias.',
    categoria: 'ADMINISTRATIVA',
    prioridad: 'LOW',
    fechaAsignacion: '2025-02-20T11:45:00',
    fechaCompletado: '2025-02-22T10:15:00',
    fechaLimite: '2025-03-01',
    estado: 'APPROVED',
    solicitante: 'Ana Martínez',
    asignador: 'Carlos Rodríguez',
    tiempoCompletado: 2, // días
    comentarioAprobacion: 'Trabajo rápido y eficiente.'
  },
  {
    id: 105,
    titulo: 'Análisis de jurisprudencia',
    descripcion: 'Realizar un análisis de la jurisprudencia relacionada con el caso #97531.',
    categoria: 'LEGAL',
    prioridad: 'HIGH',
    fechaAsignacion: '2025-02-15T09:30:00',
    fechaCompletado: '2025-02-25T14:10:00',
    fechaLimite: '2025-02-28',
    estado: 'REJECTED',
    solicitante: 'Luis Sánchez',
    asignador: 'Carlos Rodríguez',
    tiempoCompletado: 10, // días
    comentarioRechazo: 'El análisis no incluye casos recientes importantes. Por favor, revisar y completar.'
  }
];

const PageContainer = styled.div`
  padding: 0;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  ${({ $primary, theme }) =>
    $primary
      ? `
    background-color: ${theme.primary};
    color: white;
    border: none;

    &:hover {
      background-color: ${theme.primaryDark};
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
  `
      : `
    background-color: ${theme.backgroundSecondary};
    color: ${theme.textSecondary};
    border: 1px solid ${theme.border};

    &:hover {
      background-color: ${theme.backgroundHover};
      color: ${theme.text};
      border-color: ${theme.borderHover};
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
  `}
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const SearchInput = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;

  input {
    width: 100%;
    padding: 12px 14px 12px 40px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.border};
    background-color: ${({ theme }) => theme.backgroundTertiary};
    color: ${({ theme }) => theme.text};
    font-size: 14px;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    &:focus {
      border-color: ${({ theme }) => theme.primary};
      outline: none;
      box-shadow: 0 0 0 3px ${({ theme }) => `${theme.primary}30`};
    }

    &:hover {
      border-color: ${({ theme }) => theme.borderHover};
    }
  }

  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.textSecondary};
    font-size: 16px;
  }
`;

const FilterSelect = styled.select`
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.backgroundTertiary};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: all 0.2s;
  min-width: 150px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.primary}30`};
  }

  &:hover {
    border-color: ${({ theme }) => theme.borderHover};
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 12px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.border};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadowHover};
    border-color: ${({ theme }) => theme.borderHover};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary});
    opacity: 0.7;
  }
`;

const StatTitle = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 8px;
  margin-left: 8px;
  font-weight: 500;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-left: 8px;
  background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

const StatFooter = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 8px;
  margin-left: 8px;
  font-weight: 500;
`;

const TareasList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TareaCard = styled.div`
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid ${({ theme }) => theme.border};
  position: relative;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadowHover};
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.borderHover};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary});
    opacity: 0.7;
  }
`;

const TareaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;
  background-color: ${({ theme }) => `${theme.backgroundSecondary}99`};
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
  }
`;

const TareaTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TareaMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TareaDate = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 13px;
`;

const BadgesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const TareaDetails = styled.div<{ $isOpen: boolean }>`
  padding: ${({ $isOpen }) => ($isOpen ? '20px' : '0')};
  max-height: ${({ $isOpen }) => ($isOpen ? '1000px' : '0')};
  overflow: hidden;
  transition: all 0.3s ease;
  border-top: ${({ $isOpen, theme }) => ($isOpen ? `1px solid ${theme.border}` : 'none')};
  background-color: ${({ theme }) => theme.backgroundTertiary};
  box-shadow: ${({ $isOpen }) => ($isOpen ? 'inset 0 2px 4px rgba(0, 0, 0, 0.05)' : 'none')};
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.div`
  width: 150px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
`;

const DetailValue = styled.div`
  flex: 1;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
`;

const FeedbackBox = styled.div<{ $isPositive: boolean }>`
  background-color: ${({ $isPositive, theme }) =>
    $isPositive ? `${theme.success}20` : `${theme.error}20`};
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  border: 1.5px solid ${({ $isPositive, theme }) =>
    $isPositive ? `${theme.success}70` : `${theme.error}70`};
  box-shadow: 0 3px 6px ${({ $isPositive, theme }) =>
    $isPositive ? `${theme.success}30` : `${theme.error}30`};
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 5px 10px ${({ $isPositive, theme }) =>
      $isPositive ? `${theme.success}40` : `${theme.error}40`};
  }

  h4 {
    margin: 0 0 10px;
    font-size: 14px;
    font-weight: 700;
    color: ${({ $isPositive, theme }) =>
      $isPositive ? theme.success : theme.error};
    display: flex;
    align-items: center;
    gap: 8px;
    text-transform: uppercase;
    letter-spacing: 0.7px;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: ${({ theme }) => theme.text};
    line-height: 1.5;
  }
`;

const ActionButton = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${({ theme }) => theme.backgroundAlt};
  color: ${({ theme }) => theme.textSecondary};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    background-color: ${({ theme }) => theme.backgroundHover};
    color: ${({ theme }) => theme.text};
    border-color: ${({ theme }) => theme.borderHover};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 12px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary});
    opacity: 0.5;
  }

  svg {
    color: ${({ theme }) => theme.textSecondary};
    margin-bottom: 20px;
    opacity: 0.7;
  }

  h3 {
    margin: 0 0 12px;
    color: ${({ theme }) => theme.text};
    font-size: 20px;
    font-weight: 600;
  }

  p {
    margin: 0 0 24px;
    color: ${({ theme }) => theme.textSecondary};
    font-size: 15px;
    max-width: 500px;
    line-height: 1.5;
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
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
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

const HistorialTareas: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Estado para el modal de informe detallado
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [reportData, setReportData] = useState<TaskReportData | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  // Calcular estadísticas
  const totalTareas = MOCK_HISTORIAL_TAREAS.length;
  const tareasAprobadas = MOCK_HISTORIAL_TAREAS.filter(t => t.estado === 'APPROVED').length;
  const tareasRechazadas = MOCK_HISTORIAL_TAREAS.filter(t => t.estado === 'REJECTED').length;
  const tiempoPromedioCompletado = MOCK_HISTORIAL_TAREAS.reduce((acc, t) => acc + t.tiempoCompletado, 0) / totalTareas;

  // Filtrar tareas según los criterios
  const filteredTareas = MOCK_HISTORIAL_TAREAS.filter(tarea => {
    const matchesSearch = searchTerm === '' ||
      tarea.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tarea.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === '' || tarea.estado === statusFilter;
    const matchesCategory = categoryFilter === '' || tarea.categoria === categoryFilter;

    // Filtro por fecha (simplificado para el ejemplo)
    let matchesDate = true;
    if (dateFilter === 'last-week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const completedDate = new Date(tarea.fechaCompletado);
      matchesDate = completedDate >= oneWeekAgo;
    } else if (dateFilter === 'last-month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const completedDate = new Date(tarea.fechaCompletado);
      matchesDate = completedDate >= oneMonthAgo;
    } else if (dateFilter === 'last-3-months') {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      const completedDate = new Date(tarea.fechaCompletado);
      matchesDate = completedDate >= threeMonthsAgo;
    }

    return matchesSearch && matchesStatus && matchesCategory && matchesDate;
  });

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDescargarInforme = async (id: number) => {
    try {
      setSelectedTaskId(id);
      setIsLoadingReport(true);

      // En un entorno real, obtendríamos los datos del servicio
      // const data = await taskReportService.getTaskReport(id);

      // Para este ejemplo, vamos a simular los datos con la información de MOCK_HISTORIAL_TAREAS
      const tarea = MOCK_HISTORIAL_TAREAS.find(t => t.id === id);

      if (!tarea) {
        toast.error('No se encontró la tarea seleccionada');
        setIsLoadingReport(false);
        return;
      }

      // Simular datos para el informe
      const mockReportData: TaskReportData = {
        id: tarea.id,
        title: tarea.titulo,
        description: tarea.descripcion,
        category: tarea.categoria,
        priority: tarea.prioridad,
        status: tarea.estado,
        dueDate: tarea.fechaLimite,
        requestDate: tarea.fechaAsignacion,
        completionDate: tarea.fechaCompletado,
        requesterName: tarea.solicitante,
        assignerName: tarea.asignador,
        executorName: 'Matías Silva',
        timeSpent: tarea.tiempoCompletado,
        approvalComment: tarea.comentarioAprobacion,
        rejectionReason: tarea.comentarioRechazo,

        // Datos simulados para el historial
        history: [
          {
            id: 1,
            date: tarea.fechaAsignacion,
            previousStatus: 'DRAFT',
            newStatus: 'SUBMITTED',
            userId: 1,
            userName: tarea.solicitante,
            notes: 'Solicitud enviada'
          },
          {
            id: 2,
            date: new Date(new Date(tarea.fechaAsignacion).getTime() + 86400000).toISOString(), // +1 día
            previousStatus: 'SUBMITTED',
            newStatus: 'ASSIGNED',
            userId: 2,
            userName: tarea.asignador,
            notes: 'Tarea asignada a ejecutor'
          },
          {
            id: 3,
            date: new Date(new Date(tarea.fechaAsignacion).getTime() + 172800000).toISOString(), // +2 días
            previousStatus: 'ASSIGNED',
            newStatus: 'IN_PROGRESS',
            userId: 3,
            userName: 'Matías Silva',
            notes: 'Tarea iniciada'
          },
          {
            id: 4,
            date: tarea.fechaCompletado,
            previousStatus: 'IN_PROGRESS',
            newStatus: 'COMPLETED',
            userId: 3,
            userName: 'Matías Silva',
            notes: 'Tarea completada'
          },
          {
            id: 5,
            date: new Date(new Date(tarea.fechaCompletado).getTime() + 86400000).toISOString(), // +1 día
            previousStatus: 'COMPLETED',
            newStatus: tarea.estado,
            userId: 2,
            userName: tarea.asignador,
            notes: tarea.comentarioAprobacion || tarea.comentarioRechazo || 'Tarea revisada'
          }
        ],

        // Datos simulados para los comentarios
        comments: [
          {
            id: 1,
            userId: 1,
            userName: tarea.solicitante,
            content: 'Por favor, completar esta tarea lo antes posible.',
            createdAt: tarea.fechaAsignacion
          },
          {
            id: 2,
            userId: 3,
            userName: 'Matías Silva',
            content: 'Estoy trabajando en ello, debería estar listo pronto.',
            createdAt: new Date(new Date(tarea.fechaAsignacion).getTime() + 259200000).toISOString() // +3 días
          },
          {
            id: 3,
            userId: 3,
            userName: 'Matías Silva',
            content: 'He completado la tarea según lo solicitado.',
            createdAt: tarea.fechaCompletado
          }
        ],

        // Datos simulados para los archivos adjuntos
        attachments: [
          {
            id: 1,
            fileName: `informe_${tarea.id}.pdf`,
            fileSize: 1024 * 1024 * 2.5, // 2.5 MB
            fileType: 'application/pdf',
            uploadDate: tarea.fechaCompletado,
            downloadUrl: '#',
            uploadedBy: 'Matías Silva'
          },
          {
            id: 2,
            fileName: `anexo_${tarea.id}.docx`,
            fileSize: 1024 * 512, // 512 KB
            fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            uploadDate: tarea.fechaCompletado,
            downloadUrl: '#',
            uploadedBy: 'Matías Silva'
          }
        ]
      };

      setReportData(mockReportData);
      setIsReportModalOpen(true);
    } catch (error) {
      console.error('Error al obtener el informe:', error);
      toast.error('Error al obtener el informe detallado');
    } finally {
      setIsLoadingReport(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Historial de Tareas</PageTitle>
        <HeaderActions>
          <Button>
            <FiDownload size={16} />
            Exportar Historial
          </Button>
        </HeaderActions>
      </PageHeader>

      <StatsContainer>
        <StatCard>
          <StatTitle>Total de Tareas</StatTitle>
          <StatValue>{totalTareas}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Tareas Aprobadas</StatTitle>
          <StatValue>{tareasAprobadas}</StatValue>
          <StatFooter>{((tareasAprobadas / totalTareas) * 100).toFixed(0)}% del total</StatFooter>
        </StatCard>
        <StatCard>
          <StatTitle>Tareas Rechazadas</StatTitle>
          <StatValue>{tareasRechazadas}</StatValue>
          <StatFooter>{((tareasRechazadas / totalTareas) * 100).toFixed(0)}% del total</StatFooter>
        </StatCard>
        <StatCard>
          <StatTitle>Tiempo Promedio</StatTitle>
          <StatValue>{tiempoPromedioCompletado.toFixed(1)}</StatValue>
          <StatFooter>días por tarea</StatFooter>
        </StatCard>
      </StatsContainer>

      <FiltersContainer>
        <SearchInput>
          <FiSearch size={16} />
          <input
            type="text"
            placeholder="Buscar en historial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="APPROVED">Aprobadas</option>
          <option value="REJECTED">Rechazadas</option>
        </FilterSelect>
        <FilterSelect
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          <option value="ADMINISTRATIVA">Administrativa</option>
          <option value="LEGAL">Legal</option>
          <option value="TECNICA">Técnica</option>
          <option value="FINANCIERA">Financiera</option>
          <option value="RECURSOS_HUMANOS">Recursos Humanos</option>
          <option value="OTRA">Otra</option>
        </FilterSelect>
        <FilterSelect
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="">Cualquier fecha</option>
          <option value="last-week">Última semana</option>
          <option value="last-month">Último mes</option>
          <option value="last-3-months">Últimos 3 meses</option>
        </FilterSelect>
        <Button>
          <FiFilter size={16} />
          Más filtros
        </Button>
      </FiltersContainer>

      {filteredTareas.length > 0 ? (
        <TareasList>
          {filteredTareas.map((tarea) => (
            <TareaCard key={tarea.id}>
              <TareaHeader onClick={() => toggleExpand(tarea.id)}>
                <div>
                  <TareaTitle>
                    {tarea.titulo}
                  </TareaTitle>
                  <BadgesContainer>
                    <StatusBadge status={tarea.estado}>
                      {getStatusIcon(tarea.estado)}
                      {getStatusText(tarea.estado)}
                    </StatusBadge>
                    <PriorityBadge priority={tarea.prioridad}>
                      {getPriorityText(tarea.prioridad)}
                    </PriorityBadge>
                    <CategoryBadge category={tarea.categoria}>
                      {getCategoryText(tarea.categoria)}
                    </CategoryBadge>
                  </BadgesContainer>
                </div>
                <TareaMeta>
                  <TareaDate>
                    <FiCalendar size={14} />
                    {formatDate(tarea.fechaCompletado)}
                  </TareaDate>
                  {expandedId === tarea.id ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                </TareaMeta>
              </TareaHeader>
              <TareaDetails $isOpen={expandedId === tarea.id}>
                <DetailRow>
                  <DetailLabel>Descripción:</DetailLabel>
                  <DetailValue>{tarea.descripcion}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Solicitante:</DetailLabel>
                  <DetailValue>{tarea.solicitante}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Asignador:</DetailLabel>
                  <DetailValue>{tarea.asignador}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Categoría:</DetailLabel>
                  <DetailValue>{getCategoryText(tarea.categoria)}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Fecha de asignación:</DetailLabel>
                  <DetailValue>{formatDateTime(tarea.fechaAsignacion)}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Fecha de completado:</DetailLabel>
                  <DetailValue>{formatDateTime(tarea.fechaCompletado)}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Tiempo completado:</DetailLabel>
                  <DetailValue>{tarea.tiempoCompletado} días</DetailValue>
                </DetailRow>

                {tarea.estado === 'APPROVED' && tarea.comentarioAprobacion && (
                  <FeedbackBox $isPositive={true}>
                    <h4>
                      <FiCheckCircle size={16} />
                      Comentario de aprobación
                    </h4>
                    <p>{tarea.comentarioAprobacion}</p>
                  </FeedbackBox>
                )}

                {tarea.estado === 'REJECTED' && tarea.comentarioRechazo && (
                  <FeedbackBox $isPositive={false}>
                    <h4>
                      <FiXCircle size={16} />
                      Motivo de rechazo
                    </h4>
                    <p>{tarea.comentarioRechazo}</p>
                  </FeedbackBox>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <ActionButton onClick={() => handleDescargarInforme(tarea.id)}>
                    <FiFileText size={14} />
                    Ver informe completo
                  </ActionButton>
                </div>
              </TareaDetails>
            </TareaCard>
          ))}
        </TareasList>
      ) : (
        <EmptyState>
          <FiAlertCircle size={48} />
          <h3>No se encontraron tareas</h3>
          <p>No hay tareas en el historial que coincidan con los criterios de búsqueda o filtros aplicados.</p>
        </EmptyState>
      )}

      {/* Modal de informe detallado */}
      {reportData && (
        <TaskReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          taskData={reportData}
        />
      )}
    </PageContainer>
  );
};

export default HistorialTareas;

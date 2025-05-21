import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiClock, 
  FiEdit, 
  FiTrash2, 
  FiPlay,
  FiSearch,
  FiCalendar,
  FiMail,
  FiToggleLeft,
  FiToggleRight,
  FiAlertTriangle,
  FiInfo,
  FiX
} from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  useScheduledReports, 
  useDeleteScheduledReport, 
  useUpdateScheduledReport 
} from '../hooks/useCustomReports';
import { ReportSchedule } from '../types/customReportTypes';

// Estilos
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.backgroundInput};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 0 12px;
  width: 300px;
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  padding: 10px 0;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  width: 100%;
  
  &:focus {
    outline: none;
  }
`;

const SchedulesTable = styled.div`
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

const StatusBadge = styled.div<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ theme, $active }) => 
    $active ? theme.success + '20' : theme.textTertiary + '20'};
  color: ${({ theme, $active }) => 
    $active ? theme.success : theme.textTertiary};
`;

const FormatBadge = styled.div<{ $format: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ theme, $format }) => 
    $format === 'PDF' ? '#f97316' + '20' : 
    $format === 'EXCEL' ? '#16a34a' + '20' : 
    $format === 'CSV' ? '#3b82f6' + '20' : 
    theme.textTertiary + '20'};
  color: ${({ theme, $format }) => 
    $format === 'PDF' ? '#f97316' : 
    $format === 'EXCEL' ? '#16a34a' : 
    $format === 'CSV' ? '#3b82f6' : 
    theme.textTertiary};
`;

const FrequencyBadge = styled.div<{ $frequency: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ theme, $frequency }) => 
    $frequency === 'DAILY' ? '#3b82f6' + '20' : 
    $frequency === 'WEEKLY' ? '#8b5cf6' + '20' : 
    $frequency === 'MONTHLY' ? '#ec4899' + '20' : 
    $frequency === 'QUARTERLY' ? '#f97316' + '20' : 
    $frequency === 'YEARLY' ? '#ef4444' + '20' : 
    theme.textTertiary + '20'};
  color: ${({ theme, $frequency }) => 
    $frequency === 'DAILY' ? '#3b82f6' : 
    $frequency === 'WEEKLY' ? '#8b5cf6' : 
    $frequency === 'MONTHLY' ? '#ec4899' : 
    $frequency === 'QUARTERLY' ? '#f97316' : 
    $frequency === 'YEARLY' ? '#ef4444' : 
    theme.textTertiary};
`;

const RecipientsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const Recipient = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  background-color: ${({ theme }) => theme.primary + '10'};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 4px;
  font-size: 12px;
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

const ToggleButton = styled(ActionButton)<{ $active: boolean }>`
  color: ${({ theme, $active }) => 
    $active ? theme.success : theme.textTertiary};
  
  &:hover {
    background-color: ${({ theme, $active }) => 
      $active ? theme.success + '20' : theme.error + '20'};
    color: ${({ theme, $active }) => 
      $active ? theme.success : theme.error};
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
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

const Button = styled.button<{ $primary?: boolean; $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
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
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme, $primary, $danger }) => 
      $primary ? theme.primaryDark : 
      $danger ? theme.error + 'dd' : 
      theme.hoverBackground};
  }
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

const LoadingSpinner = styled(FiClock)`
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

interface ScheduledReportsListProps {
  onEditSchedule: (schedule: ReportSchedule) => void;
}

/**
 * Componente para mostrar la lista de reportes programados
 */
const ScheduledReportsList: React.FC<ScheduledReportsListProps> = ({
  onEditSchedule
}) => {
  // Estado para la búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para el diálogo de confirmación
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    scheduleId: string;
    scheduleName: string;
    action: 'delete' | 'toggle';
    active?: boolean;
  }>({
    show: false,
    scheduleId: '',
    scheduleName: '',
    action: 'delete'
  });
  
  // Consultas
  const { data: schedules, isLoading, isError } = useScheduledReports();
  const deleteSchedule = useDeleteScheduledReport();
  const updateSchedule = useUpdateScheduledReport();
  
  // Función para eliminar una programación
  const handleDeleteSchedule = () => {
    if (confirmDialog.scheduleId) {
      deleteSchedule.mutate(confirmDialog.scheduleId);
      setConfirmDialog({
        show: false,
        scheduleId: '',
        scheduleName: '',
        action: 'delete'
      });
    }
  };
  
  // Función para activar/desactivar una programación
  const handleToggleSchedule = () => {
    if (confirmDialog.scheduleId && confirmDialog.action === 'toggle') {
      updateSchedule.mutate({
        id: confirmDialog.scheduleId,
        schedule: { active: !confirmDialog.active }
      });
      setConfirmDialog({
        show: false,
        scheduleId: '',
        scheduleName: '',
        action: 'delete'
      });
    }
  };
  
  // Función para mostrar el diálogo de confirmación para eliminar
  const showDeleteConfirm = (schedule: ReportSchedule) => {
    setConfirmDialog({
      show: true,
      scheduleId: schedule.id,
      scheduleName: schedule.name,
      action: 'delete'
    });
  };
  
  // Función para mostrar el diálogo de confirmación para activar/desactivar
  const showToggleConfirm = (schedule: ReportSchedule) => {
    setConfirmDialog({
      show: true,
      scheduleId: schedule.id,
      scheduleName: schedule.name,
      action: 'toggle',
      active: schedule.active
    });
  };
  
  // Filtrar programaciones por término de búsqueda
  const filteredSchedules = schedules
    ? schedules.filter(schedule => 
        schedule.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  
  // Función para formatear fecha
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: es });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };
  
  // Función para formatear frecuencia
  const formatFrequency = (frequency: string, dayOfWeek?: number, dayOfMonth?: number) => {
    switch (frequency) {
      case 'DAILY':
        return 'Diaria';
      case 'WEEKLY':
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return `Semanal (${days[dayOfWeek || 0]})`;
      case 'MONTHLY':
        return `Mensual (Día ${dayOfMonth})`;
      case 'QUARTERLY':
        return 'Trimestral';
      case 'YEARLY':
        return 'Anual';
      default:
        return frequency;
    }
  };
  
  return (
    <Container>
      <Header>
        <Title>
          <FiClock size={24} />
          Reportes Programados
        </Title>
        
        <ActionButtons>
          <SearchContainer>
            <FiSearch size={16} style={{ color: '#888', marginRight: '8px' }} />
            <SearchInput 
              placeholder="Buscar programaciones..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
        </ActionButtons>
      </Header>
      
      {isLoading ? (
        <EmptyState>
          <LoadingSpinner size={48} style={{ marginBottom: '16px' }} />
          <div>Cargando reportes programados...</div>
        </EmptyState>
      ) : isError ? (
        <EmptyState>
          <FiAlertTriangle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <div>Error al cargar los reportes programados.</div>
          <div style={{ marginTop: '8px', fontSize: '13px' }}>
            Por favor, intenta recargar la página.
          </div>
        </EmptyState>
      ) : filteredSchedules.length === 0 ? (
        <EmptyState>
          <FiInfo size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <div>No hay reportes programados.</div>
          <div style={{ marginTop: '8px', fontSize: '13px' }}>
            Puedes programar un reporte desde la página de reportes guardados.
          </div>
        </EmptyState>
      ) : (
        <SchedulesTable>
          <Table>
            <TableHead>
              <tr>
                <TableHeadCell>Nombre</TableHeadCell>
                <TableHeadCell>Frecuencia</TableHeadCell>
                <TableHeadCell>Próxima Ejecución</TableHeadCell>
                <TableHeadCell>Última Ejecución</TableHeadCell>
                <TableHeadCell>Formato</TableHeadCell>
                <TableHeadCell>Destinatarios</TableHeadCell>
                <TableHeadCell>Estado</TableHeadCell>
                <TableHeadCell>Acciones</TableHeadCell>
              </tr>
            </TableHead>
            <TableBody>
              {filteredSchedules.map(schedule => (
                <TableRow key={schedule.id}>
                  <TableCell>{schedule.name}</TableCell>
                  <TableCell>
                    <FrequencyBadge $frequency={schedule.frequency}>
                      <FiCalendar size={12} />
                      {formatFrequency(schedule.frequency, schedule.dayOfWeek, schedule.dayOfMonth)}
                    </FrequencyBadge>
                  </TableCell>
                  <TableCell>{formatDate(schedule.nextRunAt)}</TableCell>
                  <TableCell>{formatDate(schedule.lastRunAt)}</TableCell>
                  <TableCell>
                    <FormatBadge $format={schedule.exportFormat}>
                      {schedule.exportFormat}
                    </FormatBadge>
                  </TableCell>
                  <TableCell>
                    <RecipientsList>
                      {schedule.recipients.slice(0, 2).map((email, index) => (
                        <Recipient key={index}>
                          <FiMail size={10} style={{ marginRight: '4px' }} />
                          {email}
                        </Recipient>
                      ))}
                      {schedule.recipients.length > 2 && (
                        <Recipient>+{schedule.recipients.length - 2}</Recipient>
                      )}
                    </RecipientsList>
                  </TableCell>
                  <TableCell>
                    <StatusBadge $active={schedule.active}>
                      {schedule.active ? (
                        <>
                          <FiToggleRight size={14} />
                          Activo
                        </>
                      ) : (
                        <>
                          <FiToggleLeft size={14} />
                          Inactivo
                        </>
                      )}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <ActionsContainer>
                      <ToggleButton 
                        $active={schedule.active}
                        onClick={() => showToggleConfirm(schedule)}
                        title={schedule.active ? 'Desactivar' : 'Activar'}
                      >
                        {schedule.active ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                      </ToggleButton>
                      <ActionButton 
                        onClick={() => onEditSchedule(schedule)}
                        title="Editar programación"
                      >
                        <FiEdit size={16} />
                      </ActionButton>
                      <DeleteButton 
                        onClick={() => showDeleteConfirm(schedule)}
                        title="Eliminar programación"
                      >
                        <FiTrash2 size={16} />
                      </DeleteButton>
                    </ActionsContainer>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SchedulesTable>
      )}
      
      {/* Diálogo de confirmación */}
      {confirmDialog.show && (
        <ConfirmDialog onClick={() => setConfirmDialog({ ...confirmDialog, show: false })}>
          <DialogContent onClick={(e) => e.stopPropagation()}>
            <DialogHeader>
              <FiAlertTriangle size={24} color="#f59e0b" />
              <DialogTitle>
                {confirmDialog.action === 'delete' 
                  ? 'Eliminar Programación' 
                  : confirmDialog.active 
                    ? 'Desactivar Programación' 
                    : 'Activar Programación'}
              </DialogTitle>
            </DialogHeader>
            
            <DialogMessage>
              {confirmDialog.action === 'delete' 
                ? `¿Estás seguro de que deseas eliminar la programación "${confirmDialog.scheduleName}"? Esta acción no se puede deshacer.`
                : confirmDialog.active 
                  ? `¿Estás seguro de que deseas desactivar la programación "${confirmDialog.scheduleName}"? No se ejecutará hasta que la actives nuevamente.`
                  : `¿Estás seguro de que deseas activar la programación "${confirmDialog.scheduleName}"? Comenzará a ejecutarse según la frecuencia configurada.`}
            </DialogMessage>
            
            <DialogActions>
              <Button onClick={() => setConfirmDialog({ ...confirmDialog, show: false })}>
                Cancelar
              </Button>
              {confirmDialog.action === 'delete' ? (
                <Button 
                  $danger
                  onClick={handleDeleteSchedule}
                >
                  <FiTrash2 size={16} />
                  Eliminar
                </Button>
              ) : (
                <Button 
                  $primary
                  onClick={handleToggleSchedule}
                >
                  {confirmDialog.active ? (
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

export default ScheduledReportsList;

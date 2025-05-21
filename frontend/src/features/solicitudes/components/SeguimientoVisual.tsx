import React from 'react';
import styled from 'styled-components';
import {
  FiClock,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiFileText,
  FiCalendar
} from 'react-icons/fi';
import { TaskRequest, TaskRequestHistory } from '../services/solicitudesService';
import { format, formatDistance, differenceInDays, differenceInHours, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Definición de los estados posibles de una solicitud
const ESTADOS = {
  REQUESTED: { orden: 1, nombre: 'Solicitada', color: '#0A84FF', icono: <FiClock /> },
  SUBMITTED: { orden: 1, nombre: 'Enviada', color: '#0A84FF', icono: <FiClock /> },
  ASSIGNED: { orden: 2, nombre: 'Asignada', color: '#FF9500', icono: <FiUser /> },
  IN_PROGRESS: { orden: 3, nombre: 'En Progreso', color: '#8B5CF6', icono: <FiClock /> },
  COMPLETED: { orden: 4, nombre: 'Completada', color: '#2ED573', icono: <FiCheckCircle /> },
  APPROVED: { orden: 5, nombre: 'Aprobada', color: '#10B981', icono: <FiCheckCircle /> },
  REJECTED: { orden: 5, nombre: 'Rechazada', color: '#EF4444', icono: <FiXCircle /> },
  CANCELLED: { orden: 5, nombre: 'Cancelada', color: '#9CA3AF', icono: <FiXCircle /> }
};

// Componente contenedor principal
const TimelineContainer = styled.div`
  margin: 30px 0;
  position: relative;
`;

// Línea horizontal que conecta todos los pasos
const TimelineLine = styled.div`
  position: absolute;
  top: 30px;
  left: 0;
  right: 0;
  height: 4px;
  background-color: ${({ theme }) => theme.border};
  z-index: 1;
  opacity: 0.5;
`;

// Contenedor para los pasos de la línea de tiempo
const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 2;
`;

// Cada paso individual en la línea de tiempo
const Step = styled.div<{ $active: boolean; $completed: boolean; $color: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;

  &:before {
    content: '';
    width: ${({ $active, $completed }) => ($active || $completed) ? '100%' : '0%'};
    height: 4px;
    background-color: ${({ $color }) => $color};
    position: absolute;
    top: 30px;
    right: 50%;
    transition: width 0.5s ease;
  }

  &:after {
    content: '';
    width: ${({ $active, $completed }) => ($completed) ? '100%' : '0%'};
    height: 4px;
    background-color: ${({ $color }) => $color};
    position: absolute;
    top: 30px;
    left: 50%;
    transition: width 0.5s ease;
  }

  &:first-child:before {
    display: none;
  }

  &:last-child:after {
    display: none;
  }
`;

// Círculo que representa cada paso
const StepCircle = styled.div<{ $active: boolean; $completed: boolean; $color: string }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${({ $active, $completed, $color, theme }) =>
    $active || $completed ? $color : theme.backgroundSecondary};
  border: 3px solid ${({ $active, $completed, $color, theme }) =>
    $active || $completed ? $color : theme.border};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: ${({ $active, $completed, theme }) =>
    $active || $completed ? 'white' : theme.textSecondary};
  font-size: 20px;
  box-shadow: ${({ $active, $completed }) =>
    $active ? '0 0 15px rgba(0, 0, 0, 0.2)' : $completed ? '0 0 5px rgba(0, 0, 0, 0.1)' : 'none'};
  transition: all 0.3s ease;
  position: relative;
  z-index: 3;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

// Etiqueta para cada paso
const StepLabel = styled.div<{ $active: boolean; $completed: boolean }>`
  font-weight: ${({ $active, $completed }) => ($active || $completed) ? '600' : '400'};
  color: ${({ $active, $completed, theme }) =>
    $active ? theme.text : $completed ? theme.textSecondary : theme.textTertiary};
  text-align: center;
  font-size: 14px;
  margin-bottom: 4px;
  transition: all 0.3s ease;
`;

// Fecha para cada paso
const StepDate = styled.div<{ $active: boolean }>`
  font-size: 12px;
  color: ${({ $active, theme }) => $active ? theme.textSecondary : theme.textTertiary};
  text-align: center;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.3s ease;
`;

// Detalles adicionales que aparecen al hacer hover
const StepDetails = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 250px;
  z-index: 10;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
  margin-top: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid ${({ theme }) => theme.border};

  &:before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid ${({ theme }) => theme.border};
  }

  &:after {
    content: '';
    position: absolute;
    top: -7px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 7px solid ${({ theme }) => theme.backgroundSecondary};
  }
`;

// Detalle individual dentro del popup
const DetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  font-size: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailIcon = styled.div`
  margin-right: 8px;
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  align-items: center;
`;

const DetailText = styled.div`
  color: ${({ theme }) => theme.text};
  flex: 1;
`;

// Barra de progreso para mostrar el tiempo transcurrido
const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: ${({ theme }) => theme.border};
  border-radius: 3px;
  margin-top: 8px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number; $color: string }>`
  height: 100%;
  width: ${({ $percentage }) => `${Math.min($percentage, 100)}%`};
  background-color: ${({ $color }) => $color};
  border-radius: 3px;
  transition: width 0.5s ease;
`;

const TimeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 4px;
`;

const WarningText = styled.span<{ $isWarning: boolean }>`
  color: ${({ $isWarning }) => $isWarning ? '#EF4444' : 'inherit'};
  font-weight: ${({ $isWarning }) => $isWarning ? 'bold' : 'normal'};
`;

interface SeguimientoVisualProps {
  solicitud: TaskRequest;
  historial: TaskRequestHistory[];
}

/**
 * Componente que muestra visualmente el seguimiento de una solicitud
 */
const SeguimientoVisual: React.FC<SeguimientoVisualProps> = ({ solicitud, historial }) => {
  const [activeStep, setActiveStep] = React.useState<string | null>(null);

  // Formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
  };

  // Formatear hora
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'HH:mm', { locale: es });
  };

  // Calcular tiempo transcurrido entre dos fechas
  const calcularTiempoTranscurrido = (fechaInicio?: string, fechaFin?: string) => {
    if (!fechaInicio) return '';

    const inicio = new Date(fechaInicio);
    const fin = fechaFin ? new Date(fechaFin) : new Date();

    const dias = differenceInDays(fin, inicio);
    const horas = differenceInHours(fin, inicio) % 24;

    if (dias > 0) {
      return `${dias} día${dias !== 1 ? 's' : ''} ${horas > 0 ? `y ${horas} hora${horas !== 1 ? 's' : ''}` : ''}`;
    } else if (horas > 0) {
      return `${horas} hora${horas !== 1 ? 's' : ''}`;
    } else {
      return 'Menos de 1 hora';
    }
  };

  // Formatear tiempo transcurrido en formato legible
  const formatearTiempoTranscurrido = (fechaInicio?: string, fechaFin?: string) => {
    if (!fechaInicio) return '';

    try {
      const inicio = parseISO(fechaInicio);
      const fin = fechaFin ? parseISO(fechaFin) : new Date();

      return formatDistance(inicio, fin, {
        addSuffix: false,
        locale: es
      });
    } catch (error) {
      console.error('Error al formatear tiempo transcurrido:', error);
      return 'Tiempo desconocido';
    }
  };

  // Obtener el estado actual de la solicitud
  const estadoActual = solicitud.status;

  // Filtrar y ordenar el historial para mostrar solo los cambios de estado
  const historialOrdenado = React.useMemo(() => {
    if (!historial || historial.length === 0) return [];

    // Ordenar por fecha de cambio (más antiguo primero)
    return [...historial].sort((a, b) =>
      new Date(a.changeDate).getTime() - new Date(b.changeDate).getTime()
    );
  }, [historial]);

  // Determinar qué pasos mostrar basados en el flujo de trabajo
  const pasos = React.useMemo(() => {
    // Pasos básicos que siempre se muestran
    const pasosFijos = ['REQUESTED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'];

    // Si la solicitud está aprobada o rechazada, agregar ese paso final
    if (estadoActual === 'APPROVED' || estadoActual === 'REJECTED') {
      pasosFijos.push(estadoActual);
    }

    return pasosFijos;
  }, [estadoActual]);

  // Encontrar la fecha más reciente para cada estado en el historial
  const fechasPorEstado = React.useMemo(() => {
    const fechas: Record<string, string> = {};

    // Fecha de creación para el estado REQUESTED
    fechas['REQUESTED'] = solicitud.requestDate;

    // Si no hay historial pero hay fechas en la solicitud, usarlas
    if ((!historialOrdenado || historialOrdenado.length === 0) && solicitud) {
      // Usar fechas de la solicitud si están disponibles
      if (solicitud.assignmentDate) {
        fechas['ASSIGNED'] = solicitud.assignmentDate;
      }

      // Para los demás estados, si no hay fechas reales, crear fechas progresivas para visualización
      if (solicitud.status === 'IN_PROGRESS' || solicitud.status === 'COMPLETED' ||
          solicitud.status === 'APPROVED' || solicitud.status === 'REJECTED') {

        // Si no hay fecha de asignación pero el estado es posterior, crear una fecha estimada
        if (!fechas['ASSIGNED'] && solicitud.requestDate) {
          const requestDate = new Date(solicitud.requestDate);
          // Añadir 1 día a la fecha de solicitud para la asignación
          const assignmentDate = new Date(requestDate);
          assignmentDate.setDate(requestDate.getDate() + 1);
          fechas['ASSIGNED'] = assignmentDate.toISOString();
        }

        // Si el estado es IN_PROGRESS o posterior, crear fecha para IN_PROGRESS
        if (solicitud.status === 'IN_PROGRESS' || solicitud.status === 'COMPLETED' ||
            solicitud.status === 'APPROVED' || solicitud.status === 'REJECTED') {
          if (!fechas['IN_PROGRESS'] && fechas['ASSIGNED']) {
            const assignmentDate = new Date(fechas['ASSIGNED']);
            // Añadir 1 día a la fecha de asignación para el inicio de progreso
            const inProgressDate = new Date(assignmentDate);
            inProgressDate.setDate(assignmentDate.getDate() + 1);
            fechas['IN_PROGRESS'] = inProgressDate.toISOString();
          }
        }

        // Si el estado es COMPLETED o posterior, crear fecha para COMPLETED
        if (solicitud.status === 'COMPLETED' || solicitud.status === 'APPROVED' || solicitud.status === 'REJECTED') {
          if (!fechas['COMPLETED'] && fechas['IN_PROGRESS']) {
            const inProgressDate = new Date(fechas['IN_PROGRESS']);
            // Añadir 2 días a la fecha de inicio de progreso para la completitud
            const completedDate = new Date(inProgressDate);
            completedDate.setDate(inProgressDate.getDate() + 2);
            fechas['COMPLETED'] = completedDate.toISOString();
          }
        }

        // Si el estado es APPROVED o REJECTED, crear fecha para ese estado
        if (solicitud.status === 'APPROVED' || solicitud.status === 'REJECTED') {
          if (!fechas[solicitud.status] && fechas['COMPLETED']) {
            const completedDate = new Date(fechas['COMPLETED']);
            // Añadir 1 día a la fecha de completitud para la aprobación/rechazo
            const finalDate = new Date(completedDate);
            finalDate.setDate(completedDate.getDate() + 1);
            fechas[solicitud.status] = finalDate.toISOString();
          }
        }
      }
    } else {
      // Recorrer el historial para encontrar las fechas de los demás estados
      historialOrdenado.forEach(item => {
        fechas[item.newStatus] = item.changeDate;
      });
    }

    return fechas;
  }, [historialOrdenado, solicitud]);

  // Calcular tiempos transcurridos entre estados
  const tiemposTranscurridos = React.useMemo(() => {
    const tiempos: Record<string, { duracion: string, fechaInicio: string, fechaFin?: string }> = {};

    // Orden de los estados en el flujo
    const ordenEstados = ['REQUESTED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'APPROVED', 'REJECTED'];

    // Calcular tiempo para cada estado
    for (let i = 0; i < ordenEstados.length; i++) {
      const estadoActual = ordenEstados[i];
      const fechaInicio = fechasPorEstado[estadoActual];

      if (fechaInicio) {
        // Si hay un siguiente estado con fecha, usar esa como fin
        let fechaFin;
        for (let j = i + 1; j < ordenEstados.length; j++) {
          const siguienteEstado = ordenEstados[j];
          if (fechasPorEstado[siguienteEstado]) {
            fechaFin = fechasPorEstado[siguienteEstado];
            break;
          }
        }

        tiempos[estadoActual] = {
          duracion: calcularTiempoTranscurrido(fechaInicio, fechaFin),
          fechaInicio,
          fechaFin
        };
      }
    }

    return tiempos;
  }, [fechasPorEstado, calcularTiempoTranscurrido]);

  // Determinar si un paso está activo o completado
  const getStepStatus = (paso: string) => {
    const ordenPaso = ESTADOS[paso as keyof typeof ESTADOS]?.orden || 0;
    const ordenActual = ESTADOS[estadoActual as keyof typeof ESTADOS]?.orden || 0;

    const isActive = paso === estadoActual;
    const isCompleted = ordenPaso < ordenActual;

    return { isActive, isCompleted };
  };

  return (
    <TimelineContainer>
      <TimelineLine />
      <StepsContainer>
        {pasos.map((paso, index) => {
          const { isActive, isCompleted } = getStepStatus(paso);
          const estadoInfo = ESTADOS[paso as keyof typeof ESTADOS];
          const fecha = fechasPorEstado[paso];

          return (
            <Step
              key={paso}
              $active={isActive}
              $completed={isCompleted}
              $color={estadoInfo.color}
              onMouseEnter={() => setActiveStep(paso)}
              onMouseLeave={() => setActiveStep(null)}
            >
              <StepCircle
                $active={isActive}
                $completed={isCompleted}
                $color={estadoInfo.color}
              >
                {estadoInfo.icono}
              </StepCircle>
              <StepLabel $active={isActive} $completed={isCompleted}>
                {estadoInfo.nombre}
              </StepLabel>
              {fecha && (
                <StepDate $active={isActive}>
                  {formatDate(fecha)}
                </StepDate>
              )}

              {/* Detalles que aparecen al hacer hover */}
              <StepDetails $visible={activeStep === paso}>
                <DetailItem>
                  <DetailIcon><FiCalendar size={12} /></DetailIcon>
                  <DetailText>
                    <strong>Fecha:</strong> {fecha ? formatDate(fecha) : 'No disponible'}
                  </DetailText>
                </DetailItem>
                <DetailItem>
                  <DetailIcon><FiClock size={12} /></DetailIcon>
                  <DetailText>
                    <strong>Hora:</strong> {fecha ? formatTime(fecha) : 'No disponible'}
                  </DetailText>
                </DetailItem>

                {/* Información de tiempo transcurrido */}
                {tiemposTranscurridos[paso] && (
                  <>
                    <DetailItem>
                      <DetailIcon><FiClock size={12} /></DetailIcon>
                      <DetailText>
                        <strong>Duración en esta etapa:</strong> {tiemposTranscurridos[paso].duracion}
                      </DetailText>
                    </DetailItem>

                    {/* Barra de progreso para visualizar el tiempo */}
                    {paso !== 'COMPLETED' && paso !== 'APPROVED' && paso !== 'REJECTED' && (
                      <>
                        <ProgressBar>
                          <ProgressFill
                            $percentage={
                              paso === estadoActual ?
                                Math.min(
                                  differenceInHours(new Date(), new Date(tiemposTranscurridos[paso].fechaInicio)) / 24 * 100,
                                  100
                                ) : 100
                            }
                            $color={ESTADOS[paso as keyof typeof ESTADOS].color}
                          />
                        </ProgressBar>
                        <TimeInfo>
                          <span>Inicio: {formatTime(tiemposTranscurridos[paso].fechaInicio)}</span>
                          {tiemposTranscurridos[paso].fechaFin ? (
                            <span>Fin: {formatTime(tiemposTranscurridos[paso].fechaFin)}</span>
                          ) : (
                            <WarningText $isWarning={
                              paso === estadoActual &&
                              solicitud.dueDate &&
                              new Date(solicitud.dueDate) < new Date()
                            }>
                              {solicitud.dueDate && new Date(solicitud.dueDate) < new Date()
                                ? '¡Vencida!'
                                : 'En curso'}
                            </WarningText>
                          )}
                        </TimeInfo>
                      </>
                    )}
                  </>
                )}

                {paso === 'ASSIGNED' && solicitud.assignerName && (
                  <DetailItem>
                    <DetailIcon><FiUser size={12} /></DetailIcon>
                    <DetailText>
                      <strong>Asignador:</strong> {solicitud.assignerName}
                    </DetailText>
                  </DetailItem>
                )}
                {paso === 'IN_PROGRESS' && solicitud.executorName && (
                  <DetailItem>
                    <DetailIcon><FiUser size={12} /></DetailIcon>
                    <DetailText>
                      <strong>Ejecutor:</strong> {solicitud.executorName}
                    </DetailText>
                  </DetailItem>
                )}
                {paso === 'REJECTED' && solicitud.rejectionReason && (
                  <DetailItem>
                    <DetailIcon><FiFileText size={12} /></DetailIcon>
                    <DetailText>
                      <strong>Motivo:</strong> {solicitud.rejectionReason}
                    </DetailText>
                  </DetailItem>
                )}

                {/* Información de fecha límite */}
                {solicitud.dueDate && (paso === estadoActual || paso === 'REQUESTED') && (
                  <DetailItem>
                    <DetailIcon><FiCalendar size={12} /></DetailIcon>
                    <DetailText>
                      <strong>Fecha límite:</strong> {formatDate(solicitud.dueDate)}
                      {new Date(solicitud.dueDate) < new Date() && (
                        <WarningText $isWarning={true}> (¡Vencida!)</WarningText>
                      )}
                    </DetailText>
                  </DetailItem>
                )}
              </StepDetails>
            </Step>
          );
        })}
      </StepsContainer>
    </TimelineContainer>
  );
};

export default SeguimientoVisual;

package com.bitacora.application.taskrequest;

import com.bitacora.domain.event.taskrequest.TaskRequestStatusChangedEvent;
import com.bitacora.domain.model.activity.Activity;
import com.bitacora.domain.model.activity.ActivityExtended;
import com.bitacora.domain.model.activity.ActivityStatus;
import com.bitacora.domain.model.activity.ActivityType;
import com.bitacora.domain.model.taskrequest.TaskRequest;
import com.bitacora.domain.model.taskrequest.TaskRequestStatus;
import com.bitacora.domain.port.repository.ActivityRepository;
import com.bitacora.domain.port.repository.TaskRequestRepository;
import com.bitacora.application.activity.ActivityWorkflowService;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Servicio que escucha eventos de cambio de estado de solicitudes de tareas
 * y sincroniza las actividades correspondientes.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TaskRequestStatusChangedEventListener {

    private final TaskRequestRepository taskRequestRepository;
    private final ActivityRepository activityRepository;
    private final ActivityWorkflowService activityWorkflowService;

    /**
     * Maneja el evento de cambio de estado de solicitud de tarea.
     *
     * @param event El evento de cambio de estado
     */
    @EventListener
    public void handleTaskRequestStatusChangedEvent(TaskRequestStatusChangedEvent event) {
        log.info("Manejando evento de cambio de estado de solicitud de tarea: {}", event);

        try {
            // Obtener la solicitud de tarea
            Optional<TaskRequest> taskRequestOpt = taskRequestRepository.findById(event.getTaskRequestId());
            if (taskRequestOpt.isEmpty()) {
                log.warn("No se encontró la solicitud de tarea con ID: {}", event.getTaskRequestId());
                return;
            }

            TaskRequest taskRequest = taskRequestOpt.get();
            log.debug("Solicitud de tarea encontrada: {}", taskRequest);

            // Si la solicitud cambió a IN_PROGRESS
            if (event.getNewStatus() == TaskRequestStatus.IN_PROGRESS) {
                log.info("Procesando cambio a IN_PROGRESS para la solicitud con ID: {}", taskRequest.getId());

                processTaskRequestInProgress(taskRequest, event.getUserId());
            } else {
                log.debug("No se requiere acción para el estado: {}", event.getNewStatus());
            }
        } catch (Exception e) {
            log.error("Error al manejar evento de cambio de estado de solicitud de tarea: {}", e.getMessage(), e);
            // No re-lanzamos la excepción para evitar que afecte al flujo principal
            // pero registramos el error para poder diagnosticarlo
        }
    }

    /**
     * Procesa una solicitud de tarea que ha cambiado a estado IN_PROGRESS.
     * Este método se ejecuta en una transacción separada.
     *
     * @param taskRequest La solicitud de tarea
     * @param userId ID del usuario que realizó el cambio
     */
    @Transactional(propagation = org.springframework.transaction.annotation.Propagation.REQUIRES_NEW)
    public void processTaskRequestInProgress(TaskRequest taskRequest, Long userId) {
        try {
            // Buscar si ya existe una actividad para esta solicitud
            Optional<Activity> existingActivityOpt = findActivityForTaskRequest(taskRequest.getId());

            if (existingActivityOpt.isPresent()) {
                log.info("Se encontró una actividad existente con ID: {}", existingActivityOpt.get().getId());
                // Si ya existe una actividad, actualizarla a IN_PROGRESS
                try {
                    updateActivityToInProgress(existingActivityOpt.get(), taskRequest, userId);
                } catch (Exception e) {
                    log.error("Error al actualizar actividad a IN_PROGRESS: {}", e.getMessage(), e);
                    // No re-lanzamos la excepción para evitar que afecte al flujo principal
                }
            } else {
                log.info("No se encontró una actividad existente, creando una nueva para la solicitud con ID: {}", taskRequest.getId());
                // Si no existe, crear una nueva actividad en estado IN_PROGRESS
                try {
                    createActivityFromTaskRequest(taskRequest, userId);
                } catch (Exception e) {
                    log.error("Error al crear actividad a partir de solicitud de tarea: {}", e.getMessage(), e);
                    // No re-lanzamos la excepción para evitar que afecte al flujo principal
                }
            }
        } catch (Exception e) {
            log.error("Error al procesar solicitud de tarea en estado IN_PROGRESS: {}", e.getMessage(), e);
            // No re-lanzamos la excepción para evitar que afecte al flujo principal
        }
    }

    /**
     * Busca una actividad asociada a una solicitud de tarea.
     *
     * @param taskRequestId ID de la solicitud de tarea
     * @return La actividad si existe
     */
    private Optional<Activity> findActivityForTaskRequest(Long taskRequestId) {
        log.debug("Buscando actividad para la solicitud de tarea con ID: {}", taskRequestId);

        try {
            // Primero intentamos buscar por ID
            Optional<Activity> activityById = activityRepository.findById(taskRequestId);
            if (activityById.isPresent()) {
                log.debug("Actividad encontrada por ID: {}", activityById.get().getId());
                return activityById;
            }

            // Si no encontramos por ID, buscar por descripción que contenga el ID de la solicitud
            String searchTerm = "Tarea #" + taskRequestId;
            List<Activity> activities = activityRepository.search(searchTerm, 0, 10);

            if (!activities.isEmpty()) {
                Activity foundActivity = activities.get(0);
                log.debug("Actividad encontrada por búsqueda de texto: {}", foundActivity.getId());
                return Optional.of(foundActivity);
            }

            log.debug("No se encontró actividad para la solicitud de tarea con ID: {}", taskRequestId);
            return Optional.empty();
        } catch (Exception e) {
            log.error("Error al buscar actividad para la solicitud de tarea: {}", e.getMessage(), e);
            return Optional.empty();
        }
    }

    /**
     * Actualiza una actividad existente a estado IN_PROGRESS.
     *
     * @param activity La actividad a actualizar
     * @param taskRequest La solicitud de tarea asociada
     * @param userId ID del usuario que realiza el cambio
     */
    @Transactional(propagation = org.springframework.transaction.annotation.Propagation.REQUIRES_NEW)
    private void updateActivityToInProgress(Activity activity, TaskRequest taskRequest, Long userId) {
        log.debug("Actualizando actividad con ID: {} a estado IN_PROGRESS", activity.getId());

        try {
            // Convertir a ActivityExtended para poder usar los métodos de flujo de trabajo
            ActivityExtended activityExtended = convertToActivityExtended(activity);

            // Verificar si la actividad ya está en estado IN_PROGRESS
            if (activityExtended.getStatus() == ActivityStatus.EN_PROGRESO) {
                log.info("La actividad con ID: {} ya está en estado IN_PROGRESS, no se requiere actualización", activityExtended.getId());
                return;
            }

            // Actualizar campos relacionados con la tarea si es necesario
            boolean needsUpdate = false;

            if (activityExtended.getExecutorId() == null && taskRequest.getExecutorId() != null) {
                activityExtended.setExecutorId(taskRequest.getExecutorId());
                needsUpdate = true;
            }

            // Actualizar la descripción para incluir referencia a la tarea si no la tiene
            if (!activityExtended.getDescription().contains("Tarea #" + taskRequest.getId())) {
                activityExtended.setDescription(activityExtended.getDescription() + " (Tarea #" + taskRequest.getId() + ")");
                needsUpdate = true;
            }

            if (needsUpdate) {
                activityRepository.save(activityExtended);
                log.info("Campos de la actividad actualizados: {}", activityExtended.getId());
            }

            // Iniciar la actividad con notas detalladas
            String notes = "Iniciado automáticamente desde la solicitud de tarea #" + taskRequest.getId();
            if (taskRequest.getNotes() != null && !taskRequest.getNotes().isEmpty()) {
                notes += ": " + taskRequest.getNotes();
            }

            try {
                ActivityExtended startedActivity = activityWorkflowService.startActivity(activityExtended.getId(), notes);
                log.info("Actividad actualizada a IN_PROGRESS: {}", startedActivity.getId());
            } catch (IllegalStateException e) {
                // Si la actividad ya está en el estado correcto, esto es normal
                if (e.getMessage().contains("no se puede iniciar desde el estado actual")) {
                    log.info("La actividad ya está en un estado que no permite iniciarla: {}", e.getMessage());
                } else {
                    log.warn("Error al iniciar actividad: {}", e.getMessage());
                    // No re-lanzamos la excepción para evitar que afecte al flujo principal
                }
            }
        } catch (Exception e) {
            log.error("Error al actualizar actividad a IN_PROGRESS: {}", e.getMessage(), e);
            // No re-lanzamos la excepción para evitar que afecte al flujo principal
        }
    }

    /**
     * Crea una nueva actividad a partir de una solicitud de tarea.
     *
     * @param taskRequest La solicitud de tarea
     * @param userId ID del usuario que realiza el cambio
     * @return La actividad creada
     */
    @Transactional(propagation = org.springframework.transaction.annotation.Propagation.REQUIRES_NEW)
    private Activity createActivityFromTaskRequest(TaskRequest taskRequest, Long userId) {
        log.debug("Creando actividad a partir de solicitud de tarea con ID: {}", taskRequest.getId());

        try {
            // Crear una nueva actividad con los datos de la solicitud
            ActivityExtended activity = ActivityExtended.builder()
                    // No establecer ID para que se genere uno nuevo automáticamente
                    .date(LocalDateTime.now())
                    .type(ActivityType.OTRO) // Tipo por defecto
                    .description(taskRequest.getTitle() + " (Tarea #" + taskRequest.getId() + ")")
                    .situation(taskRequest.getDescription())
                    .status(ActivityStatus.ASSIGNED) // Inicialmente en ASSIGNED
                    .lastStatusChangeDate(LocalDateTime.now())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .userId(taskRequest.getExecutorId())
                    .executorId(taskRequest.getExecutorId())
                    .requesterId(taskRequest.getRequesterId())
                    .assignerId(taskRequest.getAssignerId())
                    // Añadir campos adicionales para el flujo de trabajo
                    .requestDate(taskRequest.getRequestDate())
                    .assignmentDate(taskRequest.getAssignmentDate())
                    // Añadir notas
                    .requestNotes("Creado a partir de la solicitud de tarea #" + taskRequest.getId())
                    .assignmentNotes(taskRequest.getNotes())
                    .build();

            // Guardar la actividad
            Activity savedActivity = activityRepository.save(activity);
            log.info("Actividad creada con ID: {}", savedActivity.getId());

            // Obtener la actividad guardada como ActivityExtended
            ActivityExtended activityExtended = convertToActivityExtended(savedActivity);

            // Iniciar la actividad (cambiar a IN_PROGRESS)
            String notes = "Iniciado automáticamente desde la solicitud de tarea #" + taskRequest.getId();
            if (taskRequest.getNotes() != null && !taskRequest.getNotes().isEmpty()) {
                notes += ": " + taskRequest.getNotes();
            }

            try {
                ActivityExtended startedActivity = activityWorkflowService.startActivity(activityExtended.getId(), notes);
                log.info("Actividad iniciada con ID: {}", startedActivity.getId());
                return startedActivity;
            } catch (Exception e) {
                log.error("Error al iniciar la actividad recién creada: {}", e.getMessage(), e);
                // Si falla al iniciar, devolvemos la actividad creada de todos modos
                return savedActivity;
            }
        } catch (Exception e) {
            log.error("Error al crear actividad a partir de solicitud de tarea: {}", e.getMessage(), e);
            // No re-lanzamos la excepción para evitar que afecte al flujo principal
            return null;
        }
    }

    /**
     * Convierte una Activity a ActivityExtended.
     *
     * @param activity La actividad a convertir
     * @return La actividad extendida
     */
    private ActivityExtended convertToActivityExtended(Activity activity) {
        // Buscar la actividad en el repositorio para obtener todos los campos
        return activityRepository.findById(activity.getId())
                .map(foundActivity -> {
                    // Si la actividad encontrada ya es una ActivityExtended, devolverla directamente
                    if (foundActivity instanceof ActivityExtended) {
                        return (ActivityExtended) foundActivity;
                    }

                    // Si no, crear una nueva ActivityExtended con los campos básicos
                    return ActivityExtended.builder()
                            .id(activity.getId())
                            .date(activity.getDate())
                            .type(activity.getType())
                            .description(activity.getDescription())
                            .person(activity.getPerson())
                            .role(activity.getRole())
                            .dependency(activity.getDependency())
                            .situation(activity.getSituation())
                            .result(activity.getResult())
                            .status(activity.getStatus())
                            .lastStatusChangeDate(activity.getLastStatusChangeDate())
                            .comments(activity.getComments())
                            .agent(activity.getAgent())
                            .createdAt(activity.getCreatedAt())
                            .updatedAt(activity.getUpdatedAt())
                            .userId(activity.getUserId())
                            .executorId(activity.getExecutorId())
                            // Campos adicionales para ActivityExtended
                            .requesterId(null)
                            .assignerId(null)
                            .requestDate(null)
                            .assignmentDate(null)
                            .startDate(null)
                            .completionDate(null)
                            .approvalDate(null)
                            .requestNotes(null)
                            .assignmentNotes(null)
                            .executionNotes(null)
                            .completionNotes(null)
                            .approvalNotes(null)
                            .estimatedHours(null)
                            .actualHours(null)
                            .build();
                })
                .orElseGet(() -> {
                    // Si no se encuentra la actividad, crear una nueva con los campos básicos
                    return ActivityExtended.builder()
                            .id(activity.getId())
                            .date(activity.getDate())
                            .type(activity.getType())
                            .description(activity.getDescription())
                            .person(activity.getPerson())
                            .role(activity.getRole())
                            .dependency(activity.getDependency())
                            .situation(activity.getSituation())
                            .result(activity.getResult())
                            .status(activity.getStatus())
                            .lastStatusChangeDate(activity.getLastStatusChangeDate())
                            .comments(activity.getComments())
                            .agent(activity.getAgent())
                            .createdAt(activity.getCreatedAt())
                            .updatedAt(activity.getUpdatedAt())
                            .userId(activity.getUserId())
                            .executorId(activity.getExecutorId())
                            .build();
                });
    }
}

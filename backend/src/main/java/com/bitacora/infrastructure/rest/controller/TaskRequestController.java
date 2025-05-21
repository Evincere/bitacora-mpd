package com.bitacora.infrastructure.rest.controller;

import com.bitacora.application.taskrequest.CreateTaskRequestUseCase;
import com.bitacora.application.taskrequest.TaskRequestHistoryService;
import com.bitacora.application.taskrequest.TaskRequestWorkflowService;
import com.bitacora.application.taskrequest.UpdateTaskRequestUseCase;
import com.bitacora.application.taskrequest.dto.CreateTaskRequestDto;
import com.bitacora.application.taskrequest.dto.TaskRequestCommentCreateDto;
import com.bitacora.application.taskrequest.dto.TaskRequestCommentWithReadStatusDto;
import com.bitacora.application.taskrequest.dto.TaskRequestDto;
import com.bitacora.application.taskrequest.dto.TaskRequestHistoryDto;
import com.bitacora.application.taskrequest.dto.TaskRequestPageDto;
import com.bitacora.application.taskrequest.dto.UpdateTaskRequestDto;
import com.bitacora.application.taskrequest.mapper.TaskRequestMapper;
import com.bitacora.domain.model.taskrequest.TaskRequest;
import com.bitacora.domain.model.taskrequest.TaskRequestComment;
import com.bitacora.domain.model.taskrequest.TaskRequestStatus;
import com.bitacora.infrastructure.rest.dto.workflow.RejectTaskRequestDto;
import com.bitacora.infrastructure.rest.dto.workflow.StartTaskRequestDto;
import com.bitacora.infrastructure.security.CurrentUser;
import com.bitacora.infrastructure.security.UserPrincipal;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controlador REST para gestionar solicitudes de tareas.
 */
@RestController
@RequestMapping("/api/task-requests")
@Tag(name = "Task Requests", description = "API para gestionar solicitudes de tareas")
public class TaskRequestController {

        private static final Logger logger = LoggerFactory.getLogger(TaskRequestController.class);

        private final CreateTaskRequestUseCase createTaskRequestUseCase;
        private final UpdateTaskRequestUseCase updateTaskRequestUseCase;
        private final TaskRequestWorkflowService taskRequestWorkflowService;
        private final TaskRequestHistoryService taskRequestHistoryService;
        private final TaskRequestMapper taskRequestMapper;
        private final com.bitacora.application.taskrequest.mapper.TaskRequestHistoryMapper historyMapper;

        /**
         * Constructor.
         *
         * @param createTaskRequestUseCase   Caso de uso para crear solicitudes
         * @param updateTaskRequestUseCase   Caso de uso para actualizar solicitudes
         * @param taskRequestWorkflowService Servicio de flujo de trabajo de solicitudes
         * @param taskRequestHistoryService  Servicio de historial de solicitudes
         * @param taskRequestMapper          Mapper para convertir entre entidades y
         *                                   DTOs
         * @param historyMapper              Mapper para convertir entre entidades y
         *                                   DTOs de historial
         */
        public TaskRequestController(
                        final CreateTaskRequestUseCase createTaskRequestUseCase,
                        final UpdateTaskRequestUseCase updateTaskRequestUseCase,
                        final TaskRequestWorkflowService taskRequestWorkflowService,
                        final TaskRequestHistoryService taskRequestHistoryService,
                        final TaskRequestMapper taskRequestMapper,
                        final com.bitacora.application.taskrequest.mapper.TaskRequestHistoryMapper historyMapper) {
                this.createTaskRequestUseCase = createTaskRequestUseCase;
                this.updateTaskRequestUseCase = updateTaskRequestUseCase;
                this.taskRequestWorkflowService = taskRequestWorkflowService;
                this.taskRequestHistoryService = taskRequestHistoryService;
                this.taskRequestMapper = taskRequestMapper;
                this.historyMapper = historyMapper;
        }

        /**
         * Crea una nueva solicitud de tarea.
         *
         * @param createDto   DTO con los datos de la solicitud
         * @param currentUser Usuario actual
         * @return La solicitud creada
         */
        @PostMapping
        @PreAuthorize("hasRole('SOLICITANTE') or hasRole('ADMIN')")
        @Operation(summary = "Crea una nueva solicitud de tarea", description = "Crea una nueva solicitud de tarea en estado DRAFT o SUBMITTED según el parámetro submitImmediately")
        public ResponseEntity<TaskRequestDto> createTaskRequest(
                        @Valid @RequestBody CreateTaskRequestDto createDto,
                        @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {

                logger.info("Creando solicitud de tarea para el usuario: {}", currentUser.getId());

                TaskRequest taskRequest;
                if (createDto.isSubmitImmediately()) {
                        taskRequest = createTaskRequestUseCase.createAndSubmit(
                                        createDto.getTitle(),
                                        createDto.getDescription(),
                                        createDto.getCategoryId(),
                                        taskRequestMapper.toPriorityEnum(createDto.getPriority()),
                                        createDto.getDueDate(),
                                        createDto.getNotes(),
                                        currentUser.getId());
                } else {
                        taskRequest = createTaskRequestUseCase.createDraft(
                                        createDto.getTitle(),
                                        createDto.getDescription(),
                                        createDto.getCategoryId(),
                                        taskRequestMapper.toPriorityEnum(createDto.getPriority()),
                                        createDto.getDueDate(),
                                        createDto.getNotes(),
                                        currentUser.getId());
                }

                return ResponseEntity.status(HttpStatus.CREATED).body(taskRequestMapper.toDto(taskRequest));
        }

        /**
         * Actualiza una solicitud de tarea existente.
         *
         * @param id          ID de la solicitud a actualizar
         * @param updateDto   DTO con los datos actualizados
         * @param currentUser Usuario actual
         * @return La solicitud actualizada
         */
        @PutMapping("/{id}")
        @PreAuthorize("hasAnyRole('SOLICITANTE', 'ASIGNADOR', 'ADMIN')")
        @Operation(summary = "Actualiza una solicitud de tarea", description = "Actualiza una solicitud de tarea existente. Los solicitantes solo pueden actualizar solicitudes en estado DRAFT. Los asignadores solo pueden actualizar solicitudes en estado SUBMITTED.")
        public ResponseEntity<TaskRequestDto> updateTaskRequest(
                        @PathVariable Long id,
                        @Valid @RequestBody UpdateTaskRequestDto updateDto,
                        @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {

                logger.info("Actualizando solicitud de tarea con ID: {} para el usuario: {}", id, currentUser.getId());

                // Obtener la solicitud actual para verificar su estado
                TaskRequest currentTaskRequest = taskRequestWorkflowService.findById(id);

                // Verificar si el usuario tiene permiso para actualizar la solicitud según su
                // rol y el estado de la solicitud
                boolean isAdmin = currentUser.getAuthorities().stream()
                                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
                boolean isAssigner = currentUser.getAuthorities().stream()
                                .anyMatch(a -> a.getAuthority().equals("ROLE_ASIGNADOR"));
                boolean isRequester = currentUser.getAuthorities().stream()
                                .anyMatch(a -> a.getAuthority().equals("ROLE_SOLICITANTE"));

                // Si es asignador, solo puede editar solicitudes en estado SUBMITTED
                if (isAssigner && !isAdmin && currentTaskRequest.getStatus() != TaskRequestStatus.SUBMITTED) {
                        logger.error("El asignador con ID: {} intentó actualizar una solicitud en estado: {}",
                                        currentUser.getId(), currentTaskRequest.getStatus());
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                        .body(null);
                }

                // Si es solicitante, solo puede editar solicitudes en estado DRAFT
                if (isRequester && !isAdmin && currentTaskRequest.getStatus() != TaskRequestStatus.DRAFT) {
                        logger.error("El solicitante con ID: {} intentó actualizar una solicitud en estado: {}",
                                        currentUser.getId(), currentTaskRequest.getStatus());
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                        .body(null);
                }

                TaskRequest taskRequest = updateTaskRequestUseCase.update(
                                id,
                                updateDto.getTitle(),
                                updateDto.getDescription(),
                                updateDto.getCategoryId(),
                                taskRequestMapper.toPriorityEnum(updateDto.getPriority()),
                                updateDto.getDueDate(),
                                updateDto.getNotes(),
                                currentUser.getId());

                if (updateDto.isSubmit()) {
                        taskRequest = taskRequestWorkflowService.submit(id, currentUser.getId());
                }

                return ResponseEntity.ok(taskRequestMapper.toDto(taskRequest));
        }

        /**
         * Obtiene una solicitud de tarea por su ID.
         *
         * @param id ID de la solicitud
         * @return La solicitud
         */
        @GetMapping("/{id}")
        @PreAuthorize("hasAnyRole('SOLICITANTE', 'ASIGNADOR', 'EJECUTOR', 'ADMIN')")
        @Operation(summary = "Obtiene una solicitud de tarea", description = "Obtiene una solicitud de tarea por su ID")
        public ResponseEntity<TaskRequestDto> getTaskRequest(@PathVariable Long id) {
                logger.info("Obteniendo solicitud de tarea con ID: {}", id);

                try {
                        TaskRequest taskRequest = taskRequestWorkflowService.findById(id);
                        TaskRequestDto taskRequestDto = taskRequestMapper.toDto(taskRequest);
                        return ResponseEntity.ok(taskRequestDto);
                } catch (Exception e) {
                        logger.error("Error al obtener la solicitud de tarea con ID: {}", id, e);
                        return ResponseEntity.notFound().build();
                }
        }

        /**
         * Obtiene todas las solicitudes de tarea.
         *
         * @param page Número de página (0-indexed)
         * @param size Tamaño de la página
         * @return Lista paginada de solicitudes
         */
        @GetMapping
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Obtiene todas las solicitudes de tarea", description = "Obtiene todas las solicitudes de tarea con paginación")
        public ResponseEntity<TaskRequestPageDto> getAllTaskRequests(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size) {

                logger.info("Obteniendo todas las solicitudes de tarea, página: {}, tamaño: {}", page, size);

                List<TaskRequest> taskRequests = taskRequestWorkflowService.findAll(page, size);
                long totalItems = taskRequestWorkflowService.count();
                int totalPages = (int) Math.ceil((double) totalItems / size);

                TaskRequestPageDto pageDto = taskRequestMapper.toPageDto(taskRequests, totalItems, totalPages, page);

                return ResponseEntity.ok(pageDto);
        }

        /**
         * Obtiene las solicitudes de tarea del usuario actual.
         *
         * @param page        Número de página (0-indexed)
         * @param size        Tamaño de la página
         * @param currentUser Usuario actual
         * @return Lista paginada de solicitudes
         */
        @GetMapping("/my-requests")
        @PreAuthorize("hasAnyRole('SOLICITANTE', 'ADMIN')")
        @Operation(summary = "Obtiene las solicitudes de tarea del usuario actual", description = "Obtiene las solicitudes de tarea creadas por el usuario actual con paginación")
        public ResponseEntity<TaskRequestPageDto> getMyTaskRequests(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {

                logger.info("Obteniendo solicitudes de tarea para el usuario: {}, página: {}, tamaño: {}",
                                currentUser.getId(),
                                page, size);

                List<TaskRequest> taskRequests = taskRequestWorkflowService.findByRequesterId(currentUser.getId(), page,
                                size);
                long totalItems = taskRequestWorkflowService.countByRequesterId(currentUser.getId());
                int totalPages = (int) Math.ceil((double) totalItems / size);

                TaskRequestPageDto pageDto = taskRequestMapper.toPageDto(taskRequests, totalItems, totalPages, page);

                return ResponseEntity.ok(pageDto);
        }

        /**
         * Obtiene las solicitudes de tarea asignadas al usuario actual.
         *
         * @param page        Número de página (0-indexed)
         * @param size        Tamaño de la página
         * @param currentUser Usuario actual
         * @return Lista paginada de solicitudes
         */
        @GetMapping("/assigned-to-me")
        @PreAuthorize("hasAnyRole('ASIGNADOR', 'ADMIN')")
        @Operation(summary = "Obtiene las solicitudes de tarea asignadas por el usuario actual", description = "Obtiene las solicitudes de tarea asignadas por el usuario actual con paginación")
        public ResponseEntity<TaskRequestPageDto> getAssignedTaskRequests(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {

                logger.info("Obteniendo solicitudes de tarea asignadas por el usuario: {}, página: {}, tamaño: {}",
                                currentUser.getId(), page, size);

                List<TaskRequest> taskRequests = taskRequestWorkflowService.findByAssignerId(currentUser.getId(), page,
                                size);
                long totalItems = taskRequestWorkflowService.countByAssignerId(currentUser.getId());
                int totalPages = (int) Math.ceil((double) totalItems / size);

                TaskRequestPageDto pageDto = taskRequestMapper.toPageDto(taskRequests, totalItems, totalPages, page);

                return ResponseEntity.ok(pageDto);
        }

        /**
         * Obtiene las solicitudes de tarea donde el usuario actual es el ejecutor.
         *
         * @param page        Número de página (0-indexed)
         * @param size        Tamaño de la página
         * @param currentUser Usuario actual
         * @return Lista paginada de solicitudes
         */
        @GetMapping("/assigned-to-executor")
        @PreAuthorize("hasAnyRole('EJECUTOR', 'ADMIN')")
        @Operation(summary = "Obtiene las solicitudes de tarea asignadas al ejecutor actual", description = "Obtiene las solicitudes de tarea donde el usuario actual es el ejecutor con paginación")
        public ResponseEntity<TaskRequestPageDto> getTasksAssignedToExecutor(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {

                logger.info("Obteniendo solicitudes de tarea asignadas al ejecutor: {}, página: {}, tamaño: {}",
                                currentUser.getId(), page, size);

                // Implementar la búsqueda por executorId
                List<TaskRequest> taskRequests = taskRequestWorkflowService.findByExecutorId(currentUser.getId(), page,
                                size);
                long totalItems = taskRequestWorkflowService.countByExecutorId(currentUser.getId());
                int totalPages = (int) Math.ceil((double) totalItems / size);

                TaskRequestPageDto pageDto = taskRequestMapper.toPageDto(taskRequests, totalItems, totalPages, page);

                return ResponseEntity.ok(pageDto);
        }

        /**
         * Obtiene las solicitudes de tarea por estado.
         *
         * @param status      Estado de las solicitudes
         * @param page        Número de página (0-indexed)
         * @param size        Tamaño de la página
         * @param currentUser Usuario actual
         * @return Lista paginada de solicitudes
         */
        @GetMapping("/by-status/{status}")
        @PreAuthorize("hasAnyRole('ASIGNADOR', 'EJECUTOR', 'ADMIN')")
        @Operation(summary = "Obtiene las solicitudes de tarea por estado", description = "Obtiene las solicitudes de tarea con un estado específico con paginación. Los usuarios con rol EJECUTOR solo ven sus propias tareas.")
        public ResponseEntity<TaskRequestPageDto> getTaskRequestsByStatus(
                        @PathVariable String status,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {

                logger.info("Obteniendo solicitudes de tarea con estado: {}, página: {}, tamaño: {}, usuario: {}",
                                status, page, size, currentUser.getId());

                TaskRequestStatus taskRequestStatus = taskRequestMapper.toStatusEnum(status);
                List<TaskRequest> taskRequests;
                long totalItems;

                // Si el usuario es EJECUTOR, filtrar por executorId
                if (currentUser.getAuthorities().stream()
                                .anyMatch(a -> a.getAuthority().equals("ROLE_EJECUTOR")) &&
                                !currentUser.getAuthorities().stream()
                                                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {

                        logger.info("Usuario con rol EJECUTOR: filtrando por executorId: {}", currentUser.getId());
                        taskRequests = taskRequestWorkflowService.findByStatusAndExecutorId(
                                        taskRequestStatus, currentUser.getId(), page, size);
                        totalItems = taskRequestWorkflowService.countByStatusAndExecutorId(
                                        taskRequestStatus, currentUser.getId());
                } else {
                        // Para ADMIN y ASIGNADOR, mostrar todas las tareas con ese estado
                        taskRequests = taskRequestWorkflowService.findByStatus(taskRequestStatus, page, size);
                        totalItems = taskRequestWorkflowService.countByStatus(taskRequestStatus);
                }

                int totalPages = (int) Math.ceil((double) totalItems / size);
                TaskRequestPageDto pageDto = taskRequestMapper.toPageDto(taskRequests, totalItems, totalPages, page);

                return ResponseEntity.ok(pageDto);
        }

        /**
         * Envía una solicitud de tarea.
         *
         * @param id          ID de la solicitud
         * @param currentUser Usuario actual
         * @return La solicitud actualizada
         */
        @PostMapping("/{id}/submit")
        @PreAuthorize("hasAnyRole('SOLICITANTE', 'ADMIN')")
        @Operation(summary = "Envía una solicitud de tarea", description = "Cambia el estado de una solicitud de tarea de DRAFT a SUBMITTED")
        public ResponseEntity<TaskRequestDto> submitTaskRequest(
                        @PathVariable Long id,
                        @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {

                logger.info("Enviando solicitud de tarea con ID: {} para el usuario: {}", id, currentUser.getId());

                TaskRequest taskRequest = taskRequestWorkflowService.submit(id, currentUser.getId());

                return ResponseEntity.ok(taskRequestMapper.toDto(taskRequest));
        }

        /**
         * Asigna una solicitud de tarea.
         *
         * @param id          ID de la solicitud
         * @param currentUser Usuario actual
         * @return La solicitud actualizada
         */
        @PostMapping("/{id}/assign")
        @PreAuthorize("hasAnyRole('ASIGNADOR', 'ADMIN')")
        @Operation(summary = "Asigna una solicitud de tarea", description = "Cambia el estado de una solicitud de tarea de SUBMITTED a ASSIGNED")
        public ResponseEntity<TaskRequestDto> assignTaskRequest(
                        @PathVariable Long id,
                        @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {

                logger.info("Asignando solicitud de tarea con ID: {} para el usuario: {}", id, currentUser.getId());

                TaskRequest taskRequest = taskRequestWorkflowService.assign(id, currentUser.getId());

                return ResponseEntity.ok(taskRequestMapper.toDto(taskRequest));
        }

        /**
         * Asigna un ejecutor a una solicitud de tarea.
         *
         * @param id                ID de la solicitud
         * @param assignExecutorDto DTO con los datos del ejecutor
         * @param currentUser       Usuario actual
         * @return La solicitud actualizada
         */
        @PostMapping("/{id}/assign-executor")
        @PreAuthorize("hasAnyRole('ASIGNADOR', 'ADMIN')")
        @Operation(summary = "Asigna un ejecutor a una solicitud de tarea", description = "Asigna un ejecutor a una solicitud de tarea en estado ASSIGNED")
        public ResponseEntity<TaskRequestDto> assignExecutorToTaskRequest(
                        @PathVariable Long id,
                        @Valid @RequestBody com.bitacora.infrastructure.rest.dto.workflow.AssignExecutorDto assignExecutorDto,
                        @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {

                logger.info("Asignando ejecutor a solicitud de tarea con ID: {} por el usuario: {}", id,
                                currentUser.getId());

                TaskRequest taskRequest = taskRequestWorkflowService.assignExecutor(
                                id,
                                assignExecutorDto.getExecutorId(),
                                assignExecutorDto.getNotes());

                return ResponseEntity.ok(taskRequestMapper.toDto(taskRequest));
        }

        /**
         * Reasigna un ejecutor a una solicitud de tarea.
         *
         * @param id                ID de la solicitud
         * @param assignExecutorDto DTO con los datos del ejecutor
         * @param currentUser       Usuario actual
         * @return La solicitud actualizada
         */
        @PostMapping("/{id}/reassign")
        @PreAuthorize("hasAnyRole('ASIGNADOR', 'ADMIN')")
        @Operation(summary = "Reasigna un ejecutor a una solicitud de tarea", description = "Reasigna un ejecutor a una solicitud de tarea en estado ASSIGNED")
        public ResponseEntity<TaskRequestDto> reassignExecutorToTaskRequest(
                        @PathVariable Long id,
                        @Valid @RequestBody com.bitacora.infrastructure.rest.dto.workflow.AssignExecutorDto assignExecutorDto,
                        @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {

                logger.info("Reasignando ejecutor a solicitud de tarea con ID: {} por el usuario: {}", id,
                                currentUser.getId());

                try {
                        // Verificar que la solicitud exista y esté en estado ASSIGNED
                        TaskRequest taskRequest = taskRequestWorkflowService.findById(id);

                        if (taskRequest.getStatus() != TaskRequestStatus.ASSIGNED) {
                                logger.warn("No se puede reasignar la solicitud con ID: {} porque está en estado: {}",
                                                id, taskRequest.getStatus());
                                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                                .body(null);
                        }

                        // Reasignar el ejecutor
                        TaskRequest updatedTaskRequest = taskRequestWorkflowService.reassignExecutor(
                                        id,
                                        assignExecutorDto.getExecutorId(),
                                        currentUser.getId(),
                                        assignExecutorDto.getNotes());

                        return ResponseEntity.ok(taskRequestMapper.toDto(updatedTaskRequest));
                } catch (IllegalStateException e) {
                        logger.error("Error al reasignar ejecutor: {}", e.getMessage());
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(null);
                } catch (Exception e) {
                        logger.error("Error inesperado al reasignar ejecutor: {}", e.getMessage());
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(null);
                }
        }

        /**
         * Inicia una solicitud de tarea.
         *
         * @param id          ID de la solicitud
         * @param currentUser Usuario actual
         * @return La solicitud actualizada
         */
        @PostMapping("/{id}/start")
        @PreAuthorize("hasAnyRole('EJECUTOR', 'ADMIN')")
        @Operation(summary = "Inicia una solicitud de tarea", description = "Cambia el estado de una solicitud de tarea de ASSIGNED a IN_PROGRESS")
        public ResponseEntity<TaskRequestDto> startTaskRequest(
                        @PathVariable Long id,
                        @Valid @RequestBody(required = false) StartTaskRequestDto startTaskRequestDto,
                        @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {
                logger.info("Iniciando solicitud de tarea con ID: {} por el usuario: {}", id, currentUser.getId());

                // Obtener las notas si se proporcionan
                String notes = (startTaskRequestDto != null) ? startTaskRequestDto.getNotes() : null;

                // Iniciar la tarea con las notas (si se proporcionan)
                TaskRequest taskRequest = taskRequestWorkflowService.start(id, currentUser.getId(), notes);

                return ResponseEntity.ok(taskRequestMapper.toDto(taskRequest));
        }

        /**
         * Completa una solicitud de tarea.
         *
         * @param id          ID de la solicitud
         * @param currentUser Usuario actual
         * @return La solicitud actualizada
         */
        @PostMapping("/{id}/complete")
        @PreAuthorize("hasAnyRole('EJECUTOR', 'ADMIN')")
        @Operation(summary = "Completa una solicitud de tarea", description = "Cambia el estado de una solicitud de tarea de ASSIGNED o IN_PROGRESS a COMPLETED")
        public ResponseEntity<TaskRequestDto> completeTaskRequest(
                        @PathVariable Long id,
                        @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {
                logger.info("Completando solicitud de tarea con ID: {} por el usuario: {}", id, currentUser.getId());

                TaskRequest taskRequest = taskRequestWorkflowService.complete(id, currentUser.getId());

                return ResponseEntity.ok(taskRequestMapper.toDto(taskRequest));
        }

        /**
         * Cancela una solicitud de tarea.
         *
         * @param id          ID de la solicitud
         * @param currentUser Usuario actual
         * @return La solicitud actualizada
         */
        @PostMapping("/{id}/cancel")
        @PreAuthorize("hasAnyRole('SOLICITANTE', 'ADMIN')")
        @Operation(summary = "Cancela una solicitud de tarea", description = "Cambia el estado de una solicitud de tarea a CANCELLED")
        public ResponseEntity<TaskRequestDto> cancelTaskRequest(
                        @PathVariable Long id,
                        @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {

                logger.info("Cancelando solicitud de tarea con ID: {} para el usuario: {}", id, currentUser.getId());

                TaskRequest taskRequest = taskRequestWorkflowService.cancel(id, currentUser.getId());

                return ResponseEntity.ok(taskRequestMapper.toDto(taskRequest));
        }

        /**
         * Rechaza una solicitud de tarea.
         *
         * @param id                   ID de la solicitud
         * @param rejectTaskRequestDto DTO con los datos del rechazo
         * @param currentUser          Usuario actual
         * @return La solicitud actualizada
         */
        @PostMapping("/{id}/reject")
        @PreAuthorize("hasAnyRole('ASIGNADOR', 'ADMIN')")
        @Operation(summary = "Rechaza una solicitud de tarea", description = "Rechaza una solicitud de tarea en estado SUBMITTED")
        public ResponseEntity<TaskRequestDto> rejectTaskRequest(
                        @PathVariable Long id,
                        @Valid @RequestBody RejectTaskRequestDto rejectTaskRequestDto,
                        @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {

                logger.info("Rechazando solicitud de tarea con ID: {} por el usuario: {}", id, currentUser.getId());

                // Construir el motivo de rechazo completo
                String rejectionReason = rejectTaskRequestDto.getReason();
                if (rejectTaskRequestDto.getNotes() != null && !rejectTaskRequestDto.getNotes().isEmpty()) {
                        rejectionReason += ": " + rejectTaskRequestDto.getNotes();
                }

                TaskRequest taskRequest = taskRequestWorkflowService.reject(id, currentUser.getId(), rejectionReason);

                return ResponseEntity.ok(taskRequestMapper.toDto(taskRequest));
        }

        /**
         * Reenvía una solicitud de tarea rechazada.
         *
         * @param id                     ID de la solicitud
         * @param resubmitTaskRequestDto DTO con los datos del reenvío
         * @param currentUser            Usuario actual
         * @return La solicitud actualizada
         */
        @PostMapping("/{id}/resubmit")
        @PreAuthorize("hasAnyRole('SOLICITANTE', 'ADMIN')")
        @Operation(summary = "Reenvía una solicitud de tarea rechazada", description = "Cambia el estado de una solicitud de tarea de REJECTED a SUBMITTED")
        public ResponseEntity<TaskRequestDto> resubmitTaskRequest(
                        @PathVariable Long id,
                        @Valid @RequestBody(required = false) com.bitacora.infrastructure.rest.dto.workflow.ResubmitTaskRequestDto resubmitTaskRequestDto,
                        @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {

                logger.info("Reenviando solicitud de tarea con ID: {} por el usuario: {}", id, currentUser.getId());

                // Obtener las notas si se proporcionan
                String notes = (resubmitTaskRequestDto != null) ? resubmitTaskRequestDto.getNotes() : null;

                TaskRequest taskRequest = taskRequestWorkflowService.resubmit(id, currentUser.getId(), notes);

                return ResponseEntity.ok(taskRequestMapper.toDto(taskRequest));
        }

        /**
         * Añade un comentario a una solicitud de tarea.
         *
         * @param commentDto  DTO con los datos del comentario
         * @param currentUser Usuario actual
         * @return La solicitud actualizada
         */
        @PostMapping("/comments")
        @PreAuthorize("hasAnyRole('SOLICITANTE', 'ASIGNADOR', 'EJECUTOR', 'ADMIN')")
        @Operation(summary = "Añade un comentario a una solicitud de tarea", description = "Añade un comentario a una solicitud de tarea existente")
        public ResponseEntity<TaskRequestDto> addComment(
                        @Valid @RequestBody TaskRequestCommentCreateDto commentDto,
                        @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {

                logger.info("Añadiendo comentario a la solicitud de tarea con ID: {} para el usuario: {}",
                                commentDto.getTaskRequestId(), currentUser.getId());

                TaskRequestComment comment = taskRequestMapper.toCommentEntity(
                                commentDto.getTaskRequestId(),
                                currentUser.getId(),
                                commentDto.getContent());

                TaskRequest taskRequest = taskRequestWorkflowService.addComment(commentDto.getTaskRequestId(), comment);

                return ResponseEntity.ok(taskRequestMapper.toDto(taskRequest));
        }

        /**
         * Elimina una solicitud de tarea.
         *
         * @param id          ID de la solicitud
         * @param currentUser Usuario actual
         * @return Respuesta vacía
         */
        @DeleteMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Elimina una solicitud de tarea", description = "Elimina una solicitud de tarea existente. Solo disponible para administradores.")
        public ResponseEntity<Void> deleteTaskRequest(
                        @PathVariable Long id,
                        @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {

                logger.info("Eliminando solicitud de tarea con ID: {} por el usuario: {}", id, currentUser.getId());

                taskRequestWorkflowService.deleteById(id);

                return ResponseEntity.noContent().build();
        }

        /**
         * Obtiene estadísticas de solicitudes por estado.
         *
         * @return Mapa con el número de solicitudes por estado
         */
        @GetMapping("/stats/by-status")
        @PreAuthorize("hasAnyRole('ASIGNADOR', 'ADMIN')")
        @Operation(summary = "Obtiene estadísticas de solicitudes por estado", description = "Obtiene el número de solicitudes para cada estado")
        public ResponseEntity<Map<String, Long>> getStatsByStatus() {
                logger.info("Obteniendo estadísticas de solicitudes por estado");

                Map<TaskRequestStatus, Long> stats = taskRequestWorkflowService.getStatsByStatus();

                Map<String, Long> result = stats.entrySet().stream()
                                .collect(Collectors.toMap(
                                                entry -> entry.getKey().name(),
                                                Map.Entry::getValue));

                return ResponseEntity.ok(result);
        }

        /**
         * Obtiene estadísticas detalladas para el usuario solicitante actual.
         *
         * @param currentUser Usuario actual
         * @return DTO con estadísticas detalladas
         */
        @GetMapping("/stats/requester")
        @PreAuthorize("hasAnyRole('SOLICITANTE', 'ADMIN')")
        @Operation(summary = "Obtiene estadísticas detalladas para el solicitante", description = "Obtiene estadísticas detalladas de solicitudes para el usuario solicitante actual")
        public ResponseEntity<com.bitacora.application.taskrequest.dto.TaskRequestRequesterStatsDto> getRequesterStats(
                        @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {

                logger.info("Obteniendo estadísticas detalladas para el solicitante con ID: {}", currentUser.getId());

                com.bitacora.application.taskrequest.dto.TaskRequestRequesterStatsDto stats = taskRequestWorkflowService
                                .getRequesterStats(currentUser.getId());

                return ResponseEntity.ok(stats);
        }

        /**
         * Obtiene los comentarios de una solicitud de tarea con información de lectura.
         *
         * @param taskRequestId ID de la solicitud
         * @param currentUser   Usuario actual
         * @return Lista de comentarios con información de lectura
         */
        @GetMapping("/{taskRequestId}/comments-with-read-status")
        @PreAuthorize("hasAnyRole('SOLICITANTE', 'ASIGNADOR', 'EJECUTOR', 'ADMIN')")
        @Operation(summary = "Obtiene los comentarios de una solicitud con estado de lectura", description = "Obtiene los comentarios de una solicitud de tarea con información de quién los ha leído")
        public ResponseEntity<List<TaskRequestCommentWithReadStatusDto>> getCommentsWithReadStatus(
                        @PathVariable Long taskRequestId,
                        @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {

                logger.info("Obteniendo comentarios con estado de lectura para la solicitud: {} y usuario: {}",
                                taskRequestId, currentUser.getId());

                List<TaskRequestComment> comments = taskRequestWorkflowService
                                .getCommentsByTaskRequestId(taskRequestId);
                List<TaskRequestCommentWithReadStatusDto> commentDtos = taskRequestMapper
                                .toCommentWithReadStatusDtoList(comments, currentUser.getId());

                return ResponseEntity.ok(commentDtos);
        }

        /**
         * Marca un comentario como leído por el usuario actual.
         *
         * @param commentId   ID del comentario
         * @param currentUser Usuario actual
         * @return El comentario actualizado
         */
        @PostMapping("/comments/{commentId}/mark-as-read")
        @PreAuthorize("hasAnyRole('SOLICITANTE', 'ASIGNADOR', 'EJECUTOR', 'ADMIN')")
        @Operation(summary = "Marca un comentario como leído", description = "Marca un comentario como leído por el usuario actual")
        public ResponseEntity<TaskRequestCommentWithReadStatusDto> markCommentAsRead(
                        @PathVariable Long commentId,
                        @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {

                logger.info("Marcando comentario con ID: {} como leído por el usuario: {}",
                                commentId, currentUser.getId());

                TaskRequestComment comment = taskRequestWorkflowService.markCommentAsRead(commentId,
                                currentUser.getId());
                TaskRequestCommentWithReadStatusDto commentDto = taskRequestMapper.toDtoWithReadStatus(comment,
                                currentUser.getId());

                return ResponseEntity.ok(commentDto);
        }

        /**
         * Obtiene el historial de cambios de estado de una solicitud de tarea.
         *
         * @param taskRequestId ID de la solicitud
         * @return Lista de registros de historial
         */
        @GetMapping("/{taskRequestId}/history")
        @PreAuthorize("hasAnyRole('SOLICITANTE', 'ASIGNADOR', 'EJECUTOR', 'ADMIN')")
        @Operation(summary = "Obtiene el historial de una solicitud", description = "Obtiene el historial de cambios de estado de una solicitud de tarea")
        public ResponseEntity<List<TaskRequestHistoryDto>> getTaskRequestHistory(@PathVariable Long taskRequestId) {
                logger.info("Obteniendo historial para la solicitud de tarea con ID: {}", taskRequestId);

                List<TaskRequestHistoryDto> historyDtos = historyMapper.toDtoList(
                                taskRequestHistoryService.getHistoryByTaskRequestId(taskRequestId));

                return ResponseEntity.ok(historyDtos);
        }
}

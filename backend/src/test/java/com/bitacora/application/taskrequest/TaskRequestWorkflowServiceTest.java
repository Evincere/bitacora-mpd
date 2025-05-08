package com.bitacora.application.taskrequest;

import com.bitacora.application.notification.MentionNotificationService;
import com.bitacora.domain.event.taskrequest.TaskRequestStatusChangedEvent;
import com.bitacora.domain.model.taskrequest.TaskRequest;
import com.bitacora.domain.model.taskrequest.TaskRequestCategory;
import com.bitacora.domain.model.taskrequest.TaskRequestComment;
import com.bitacora.domain.model.taskrequest.TaskRequestPriority;
import com.bitacora.domain.model.taskrequest.TaskRequestStatus;
import com.bitacora.domain.port.UserRepository;
import com.bitacora.domain.port.repository.TaskRequestRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * Pruebas unitarias para el servicio TaskRequestWorkflowService.
 */
@ExtendWith(MockitoExtension.class)
class TaskRequestWorkflowServiceTest {

    @Mock
    private TaskRequestRepository taskRequestRepository;

    @Mock
    private TaskRequestHistoryService historyService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MentionNotificationService mentionNotificationService;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    private TaskRequestWorkflowService taskRequestWorkflowService;

    @BeforeEach
    void setUp() {
        taskRequestWorkflowService = new TaskRequestWorkflowService(
                taskRequestRepository,
                historyService,
                userRepository,
                mentionNotificationService,
                eventPublisher);
    }

    @Test
    @DisplayName("Debería enviar una solicitud correctamente")
    void shouldSubmitTaskRequest() {
        // Arrange
        Long taskRequestId = 1L;
        Long requesterId = 1L;

        TaskRequest draftTaskRequest = createDraftTaskRequest(taskRequestId, requesterId);
        TaskRequest submittedTaskRequest = createSubmittedTaskRequest(taskRequestId, requesterId);

        when(taskRequestRepository.findById(taskRequestId)).thenReturn(Optional.of(draftTaskRequest));
        when(taskRequestRepository.save(any(TaskRequest.class))).thenReturn(submittedTaskRequest);

        // Act
        TaskRequest result = taskRequestWorkflowService.submit(taskRequestId, requesterId);

        // Assert
        assertNotNull(result);
        assertEquals(TaskRequestStatus.SUBMITTED, result.getStatus());

        verify(taskRequestRepository).findById(taskRequestId);

        ArgumentCaptor<TaskRequest> taskRequestCaptor = ArgumentCaptor.forClass(TaskRequest.class);
        verify(taskRequestRepository).save(taskRequestCaptor.capture());

        TaskRequest capturedTaskRequest = taskRequestCaptor.getValue();
        assertEquals(TaskRequestStatus.SUBMITTED, capturedTaskRequest.getStatus());
    }

    @Test
    @DisplayName("Debería lanzar excepción al enviar una solicitud con solicitante incorrecto")
    void shouldThrowExceptionWhenSubmittingWithWrongRequester() {
        // Arrange
        Long taskRequestId = 1L;
        Long requesterId = 1L;
        Long wrongRequesterId = 2L;

        TaskRequest draftTaskRequest = createDraftTaskRequest(taskRequestId, requesterId);

        when(taskRequestRepository.findById(taskRequestId)).thenReturn(Optional.of(draftTaskRequest));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            taskRequestWorkflowService.submit(taskRequestId, wrongRequesterId);
        });

        assertEquals("El solicitante no coincide con el de la solicitud", exception.getMessage());

        verify(taskRequestRepository).findById(taskRequestId);
        verify(taskRequestRepository, never()).save(any(TaskRequest.class));
    }

    @Test
    @DisplayName("Debería lanzar excepción al enviar una solicitud que no está en estado DRAFT")
    void shouldThrowExceptionWhenSubmittingNonDraftTaskRequest() {
        // Arrange
        Long taskRequestId = 1L;
        Long requesterId = 1L;

        TaskRequest submittedTaskRequest = createSubmittedTaskRequest(taskRequestId, requesterId);

        when(taskRequestRepository.findById(taskRequestId)).thenReturn(Optional.of(submittedTaskRequest));

        // Act & Assert
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            taskRequestWorkflowService.submit(taskRequestId, requesterId);
        });

        assertEquals("Solo se pueden enviar solicitudes en estado DRAFT", exception.getMessage());

        verify(taskRequestRepository).findById(taskRequestId);
        verify(taskRequestRepository, never()).save(any(TaskRequest.class));
    }

    @Test
    @DisplayName("Debería asignar una solicitud correctamente")
    void shouldAssignTaskRequest() {
        // Arrange
        Long taskRequestId = 1L;
        Long assignerId = 2L;

        TaskRequest submittedTaskRequest = createSubmittedTaskRequest(taskRequestId, 1L);
        TaskRequest assignedTaskRequest = createAssignedTaskRequest(taskRequestId, 1L, assignerId);

        when(taskRequestRepository.findById(taskRequestId)).thenReturn(Optional.of(submittedTaskRequest));
        when(taskRequestRepository.save(any(TaskRequest.class))).thenReturn(assignedTaskRequest);

        // Act
        TaskRequest result = taskRequestWorkflowService.assign(taskRequestId, assignerId);

        // Assert
        assertNotNull(result);
        assertEquals(TaskRequestStatus.ASSIGNED, result.getStatus());
        assertEquals(assignerId, result.getAssignerId());
        assertNotNull(result.getAssignmentDate());

        verify(taskRequestRepository).findById(taskRequestId);
        verify(taskRequestRepository).save(any(TaskRequest.class));
    }

    @Test
    @DisplayName("Debería completar una solicitud correctamente")
    void shouldCompleteTaskRequest() {
        // Arrange
        Long taskRequestId = 1L;
        Long executorId = 3L; // ID del ejecutor que completa la solicitud

        TaskRequest assignedTaskRequest = createAssignedTaskRequest(taskRequestId, 1L, 2L);
        TaskRequest completedTaskRequest = createCompletedTaskRequest(taskRequestId, 1L, 2L);

        when(taskRequestRepository.findById(taskRequestId)).thenReturn(Optional.of(assignedTaskRequest));
        when(taskRequestRepository.save(any(TaskRequest.class))).thenReturn(completedTaskRequest);

        // Act
        TaskRequest result = taskRequestWorkflowService.complete(taskRequestId, executorId);

        // Assert
        assertNotNull(result);
        assertEquals(TaskRequestStatus.COMPLETED, result.getStatus());

        verify(taskRequestRepository).findById(taskRequestId);
        verify(taskRequestRepository).save(any(TaskRequest.class));
    }

    @Test
    @DisplayName("Debería cancelar una solicitud correctamente")
    void shouldCancelTaskRequest() {
        // Arrange
        Long taskRequestId = 1L;
        Long requesterId = 1L;

        TaskRequest submittedTaskRequest = createSubmittedTaskRequest(taskRequestId, requesterId);
        TaskRequest cancelledTaskRequest = createCancelledTaskRequest(taskRequestId, requesterId);

        when(taskRequestRepository.findById(taskRequestId)).thenReturn(Optional.of(submittedTaskRequest));
        when(taskRequestRepository.save(any(TaskRequest.class))).thenReturn(cancelledTaskRequest);

        // Act
        TaskRequest result = taskRequestWorkflowService.cancel(taskRequestId, requesterId);

        // Assert
        assertNotNull(result);
        assertEquals(TaskRequestStatus.CANCELLED, result.getStatus());

        verify(taskRequestRepository).findById(taskRequestId);
        verify(taskRequestRepository).save(any(TaskRequest.class));
    }

    @Test
    @DisplayName("Debería añadir un comentario correctamente")
    void shouldAddComment() {
        // Arrange
        Long taskRequestId = 1L;

        TaskRequest taskRequest = createDraftTaskRequest(taskRequestId, 1L);
        TaskRequestComment comment = TaskRequestComment.builder()
                .id(1L)
                .taskRequestId(taskRequestId)
                .userId(1L)
                .content("Comentario de prueba")
                .createdAt(LocalDateTime.now())
                .build();

        TaskRequest updatedTaskRequest = TaskRequest.builder()
                .id(taskRequestId)
                .title(taskRequest.getTitle())
                .description(taskRequest.getDescription())
                .category(taskRequest.getCategory())
                .priority(taskRequest.getPriority())
                .status(taskRequest.getStatus())
                .requesterId(taskRequest.getRequesterId())
                .requestDate(taskRequest.getRequestDate())
                .comments(Arrays.asList(comment))
                .build();

        when(taskRequestRepository.findById(taskRequestId)).thenReturn(Optional.of(taskRequest));
        when(taskRequestRepository.save(any(TaskRequest.class))).thenReturn(updatedTaskRequest);

        // Act
        TaskRequest result = taskRequestWorkflowService.addComment(taskRequestId, comment);

        // Assert
        assertNotNull(result);
        assertNotNull(result.getComments());
        assertEquals(1, result.getComments().size());
        assertEquals(comment, result.getComments().get(0));

        verify(taskRequestRepository).findById(taskRequestId);
        verify(taskRequestRepository).save(any(TaskRequest.class));
    }

    @Test
    @DisplayName("Debería buscar solicitudes por ID del solicitante")
    void shouldFindByRequesterId() {
        // Arrange
        Long requesterId = 1L;
        int page = 0;
        int size = 10;

        List<TaskRequest> taskRequests = Arrays.asList(
                createDraftTaskRequest(1L, requesterId),
                createSubmittedTaskRequest(2L, requesterId));

        when(taskRequestRepository.findByRequesterId(eq(requesterId), eq(page), eq(size))).thenReturn(taskRequests);

        // Act
        List<TaskRequest> result = taskRequestWorkflowService.findByRequesterId(requesterId, page, size);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());

        verify(taskRequestRepository).findByRequesterId(requesterId, page, size);
    }

    @Test
    @DisplayName("Debería obtener estadísticas por estado")
    void shouldGetStatsByStatus() {
        // Arrange
        when(taskRequestRepository.countByStatus(TaskRequestStatus.DRAFT)).thenReturn(5L);
        when(taskRequestRepository.countByStatus(TaskRequestStatus.SUBMITTED)).thenReturn(3L);
        when(taskRequestRepository.countByStatus(TaskRequestStatus.ASSIGNED)).thenReturn(2L);
        when(taskRequestRepository.countByStatus(TaskRequestStatus.COMPLETED)).thenReturn(10L);
        when(taskRequestRepository.countByStatus(TaskRequestStatus.CANCELLED)).thenReturn(1L);

        // Act
        Map<TaskRequestStatus, Long> result = taskRequestWorkflowService.getStatsByStatus();

        // Assert
        assertNotNull(result);
        assertEquals(5, result.size());
        assertEquals(5L, result.get(TaskRequestStatus.DRAFT));
        assertEquals(3L, result.get(TaskRequestStatus.SUBMITTED));
        assertEquals(2L, result.get(TaskRequestStatus.ASSIGNED));
        assertEquals(10L, result.get(TaskRequestStatus.COMPLETED));
        assertEquals(1L, result.get(TaskRequestStatus.CANCELLED));

        verify(taskRequestRepository).countByStatus(TaskRequestStatus.DRAFT);
        verify(taskRequestRepository).countByStatus(TaskRequestStatus.SUBMITTED);
        verify(taskRequestRepository).countByStatus(TaskRequestStatus.ASSIGNED);
        verify(taskRequestRepository).countByStatus(TaskRequestStatus.COMPLETED);
        verify(taskRequestRepository).countByStatus(TaskRequestStatus.CANCELLED);
    }

    // Métodos auxiliares para crear solicitudes en diferentes estados

    private TaskRequest createDraftTaskRequest(Long id, Long requesterId) {
        return TaskRequest.builder()
                .id(id)
                .title("Solicitud de prueba")
                .description("Descripción de prueba")
                .category(TaskRequestCategory.builder().id(1L).name("General").build())
                .priority(TaskRequestPriority.MEDIUM)
                .status(TaskRequestStatus.DRAFT)
                .requesterId(requesterId)
                .requestDate(LocalDateTime.now())
                .build();
    }

    private TaskRequest createSubmittedTaskRequest(Long id, Long requesterId) {
        return TaskRequest.builder()
                .id(id)
                .title("Solicitud de prueba")
                .description("Descripción de prueba")
                .category(TaskRequestCategory.builder().id(1L).name("General").build())
                .priority(TaskRequestPriority.MEDIUM)
                .status(TaskRequestStatus.SUBMITTED)
                .requesterId(requesterId)
                .requestDate(LocalDateTime.now())
                .build();
    }

    private TaskRequest createAssignedTaskRequest(Long id, Long requesterId, Long assignerId) {
        return TaskRequest.builder()
                .id(id)
                .title("Solicitud de prueba")
                .description("Descripción de prueba")
                .category(TaskRequestCategory.builder().id(1L).name("General").build())
                .priority(TaskRequestPriority.MEDIUM)
                .status(TaskRequestStatus.ASSIGNED)
                .requesterId(requesterId)
                .assignerId(assignerId)
                .requestDate(LocalDateTime.now())
                .assignmentDate(LocalDateTime.now())
                .build();
    }

    private TaskRequest createCompletedTaskRequest(Long id, Long requesterId, Long assignerId) {
        return TaskRequest.builder()
                .id(id)
                .title("Solicitud de prueba")
                .description("Descripción de prueba")
                .category(TaskRequestCategory.builder().id(1L).name("General").build())
                .priority(TaskRequestPriority.MEDIUM)
                .status(TaskRequestStatus.COMPLETED)
                .requesterId(requesterId)
                .assignerId(assignerId)
                .requestDate(LocalDateTime.now())
                .assignmentDate(LocalDateTime.now())
                .build();
    }

    private TaskRequest createCancelledTaskRequest(Long id, Long requesterId) {
        return TaskRequest.builder()
                .id(id)
                .title("Solicitud de prueba")
                .description("Descripción de prueba")
                .category(TaskRequestCategory.builder().id(1L).name("General").build())
                .priority(TaskRequestPriority.MEDIUM)
                .status(TaskRequestStatus.CANCELLED)
                .requesterId(requesterId)
                .requestDate(LocalDateTime.now())
                .build();
    }

    private TaskRequest createRejectedTaskRequest(Long id, Long requesterId, Long assignerId, String rejectionReason) {
        return TaskRequest.builder()
                .id(id)
                .title("Solicitud de prueba")
                .description("Descripción de prueba")
                .category(TaskRequestCategory.builder().id(1L).name("General").build())
                .priority(TaskRequestPriority.MEDIUM)
                .status(TaskRequestStatus.CANCELLED)
                .requesterId(requesterId)
                .assignerId(assignerId)
                .requestDate(LocalDateTime.now())
                .assignmentDate(LocalDateTime.now())
                .notes(rejectionReason)
                .build();
    }

    @Test
    @DisplayName("Debería rechazar una solicitud correctamente")
    void shouldRejectTaskRequest() {
        // Arrange
        Long taskRequestId = 1L;
        Long requesterId = 1L;
        Long assignerId = 2L;
        String rejectionReason = "No cumple con los requisitos";

        TaskRequest submittedTaskRequest = createSubmittedTaskRequest(taskRequestId, requesterId);
        TaskRequest rejectedTaskRequest = createRejectedTaskRequest(taskRequestId, requesterId, assignerId, rejectionReason);

        when(taskRequestRepository.findById(taskRequestId)).thenReturn(Optional.of(submittedTaskRequest));
        when(taskRequestRepository.save(any(TaskRequest.class))).thenReturn(rejectedTaskRequest);

        // Act
        TaskRequest result = taskRequestWorkflowService.reject(taskRequestId, assignerId, rejectionReason);

        // Assert
        assertNotNull(result);
        assertEquals(TaskRequestStatus.CANCELLED, result.getStatus());
        assertEquals(rejectionReason, result.getNotes());
        assertEquals(assignerId, result.getAssignerId());

        verify(taskRequestRepository).findById(taskRequestId);
        verify(taskRequestRepository).save(any(TaskRequest.class));
        verify(historyService).recordStatusChange(
                eq(taskRequestId),
                eq(assignerId),
                isNull(),
                eq(TaskRequestStatus.SUBMITTED),
                eq(TaskRequestStatus.CANCELLED),
                contains(rejectionReason)
        );
    }

    @Test
    @DisplayName("Debería lanzar excepción al rechazar una solicitud que no está en estado SUBMITTED")
    void shouldThrowExceptionWhenRejectingNonSubmittedTaskRequest() {
        // Arrange
        Long taskRequestId = 1L;
        Long assignerId = 2L;
        String rejectionReason = "No cumple con los requisitos";

        TaskRequest draftTaskRequest = createDraftTaskRequest(taskRequestId, 1L);

        when(taskRequestRepository.findById(taskRequestId)).thenReturn(Optional.of(draftTaskRequest));

        // Act & Assert
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            taskRequestWorkflowService.reject(taskRequestId, assignerId, rejectionReason);
        });

        assertEquals("Solo se pueden rechazar solicitudes en estado SUBMITTED", exception.getMessage());

        verify(taskRequestRepository).findById(taskRequestId);
        verify(taskRequestRepository, never()).save(any(TaskRequest.class));
    }

    @Test
    @DisplayName("Debería iniciar una tarea y publicar un evento de cambio de estado")
    void shouldStartTaskRequestAndPublishEvent() {
        // Arrange
        Long taskRequestId = 1L;
        Long requesterId = 1L;
        Long assignerId = 2L;
        Long executorId = 3L;
        String notes = "Iniciando tarea de prueba";

        TaskRequest assignedTaskRequest = createAssignedTaskRequest(taskRequestId, requesterId, assignerId);
        assignedTaskRequest.assignExecutor(executorId);

        TaskRequest inProgressTaskRequest = TaskRequest.builder()
                .id(taskRequestId)
                .title(assignedTaskRequest.getTitle())
                .description(assignedTaskRequest.getDescription())
                .category(assignedTaskRequest.getCategory())
                .priority(assignedTaskRequest.getPriority())
                .status(TaskRequestStatus.IN_PROGRESS)
                .requesterId(requesterId)
                .assignerId(assignerId)
                .executorId(executorId)
                .requestDate(assignedTaskRequest.getRequestDate())
                .assignmentDate(assignedTaskRequest.getAssignmentDate())
                .build();

        when(taskRequestRepository.findById(taskRequestId)).thenReturn(Optional.of(assignedTaskRequest));
        when(taskRequestRepository.save(any(TaskRequest.class))).thenReturn(inProgressTaskRequest);

        // Act
        TaskRequest result = taskRequestWorkflowService.start(taskRequestId, executorId, notes);

        // Assert
        assertNotNull(result);
        assertEquals(TaskRequestStatus.IN_PROGRESS, result.getStatus());

        verify(taskRequestRepository).findById(taskRequestId);
        verify(taskRequestRepository).save(any(TaskRequest.class));

        // Verificar que se registró el cambio de estado en el historial
        verify(historyService).recordStatusChange(
                eq(taskRequestId),
                eq(executorId),
                isNull(),
                eq(TaskRequestStatus.ASSIGNED),
                eq(TaskRequestStatus.IN_PROGRESS),
                contains(notes)
        );

        // Verificar que se publicó el evento de cambio de estado
        ArgumentCaptor<TaskRequestStatusChangedEvent> eventCaptor = ArgumentCaptor.forClass(TaskRequestStatusChangedEvent.class);
        verify(eventPublisher).publishEvent(eventCaptor.capture());

        TaskRequestStatusChangedEvent capturedEvent = eventCaptor.getValue();
        assertEquals(taskRequestId, capturedEvent.getTaskRequestId());
        assertEquals(TaskRequestStatus.ASSIGNED, capturedEvent.getOldStatus());
        assertEquals(TaskRequestStatus.IN_PROGRESS, capturedEvent.getNewStatus());
        assertEquals(executorId, capturedEvent.getUserId());
    }
}

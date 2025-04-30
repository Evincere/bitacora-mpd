package com.bitacora.domain.model.taskrequest;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pruebas unitarias para la entidad TaskRequest.
 */
class TaskRequestTest {

    @Test
    @DisplayName("Debería crear una solicitud con valores válidos")
    void shouldCreateTaskRequestWithValidValues() {
        // Arrange
        TaskRequestCategory category = TaskRequestCategory.builder()
                .id(1L)
                .name("General")
                .description("Categoría general")
                .color("#808080")
                .isDefault(true)
                .build();
        
        LocalDateTime now = LocalDateTime.now();
        
        // Act
        TaskRequest taskRequest = TaskRequest.builder()
                .id(1L)
                .title("Solicitud de prueba")
                .description("Descripción de prueba")
                .category(category)
                .priority(TaskRequestPriority.MEDIUM)
                .dueDate(now.plusDays(7))
                .status(TaskRequestStatus.DRAFT)
                .requesterId(1L)
                .requestDate(now)
                .notes("Notas de prueba")
                .build();
        
        // Assert
        assertNotNull(taskRequest);
        assertEquals(1L, taskRequest.getId());
        assertEquals("Solicitud de prueba", taskRequest.getTitle());
        assertEquals("Descripción de prueba", taskRequest.getDescription());
        assertEquals(category, taskRequest.getCategory());
        assertEquals(TaskRequestPriority.MEDIUM, taskRequest.getPriority());
        assertEquals(now.plusDays(7), taskRequest.getDueDate());
        assertEquals(TaskRequestStatus.DRAFT, taskRequest.getStatus());
        assertEquals(1L, taskRequest.getRequesterId());
        assertEquals(now, taskRequest.getRequestDate());
        assertEquals("Notas de prueba", taskRequest.getNotes());
        assertNotNull(taskRequest.getAttachments());
        assertTrue(taskRequest.getAttachments().isEmpty());
        assertNotNull(taskRequest.getComments());
        assertTrue(taskRequest.getComments().isEmpty());
    }

    @Test
    @DisplayName("Debería asignar una solicitud correctamente")
    void shouldAssignTaskRequest() {
        // Arrange
        TaskRequest taskRequest = createSubmittedTaskRequest();
        
        // Act
        TaskRequest assignedTaskRequest = taskRequest.assign(2L);
        
        // Assert
        assertEquals(TaskRequestStatus.ASSIGNED, assignedTaskRequest.getStatus());
        assertEquals(2L, assignedTaskRequest.getAssignerId());
        assertNotNull(assignedTaskRequest.getAssignmentDate());
    }

    @Test
    @DisplayName("Debería lanzar excepción al asignar una solicitud que no está en estado SUBMITTED")
    void shouldThrowExceptionWhenAssigningNonSubmittedTaskRequest() {
        // Arrange
        TaskRequest draftTaskRequest = createDraftTaskRequest();
        
        // Act & Assert
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            draftTaskRequest.assign(2L);
        });
        
        assertEquals("Solo se pueden asignar solicitudes en estado SUBMITTED", exception.getMessage());
    }

    @Test
    @DisplayName("Debería completar una solicitud correctamente")
    void shouldCompleteTaskRequest() {
        // Arrange
        TaskRequest taskRequest = createAssignedTaskRequest();
        
        // Act
        TaskRequest completedTaskRequest = taskRequest.complete();
        
        // Assert
        assertEquals(TaskRequestStatus.COMPLETED, completedTaskRequest.getStatus());
    }

    @Test
    @DisplayName("Debería lanzar excepción al completar una solicitud que no está en estado ASSIGNED")
    void shouldThrowExceptionWhenCompletingNonAssignedTaskRequest() {
        // Arrange
        TaskRequest draftTaskRequest = createDraftTaskRequest();
        
        // Act & Assert
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            draftTaskRequest.complete();
        });
        
        assertEquals("Solo se pueden completar solicitudes en estado ASSIGNED", exception.getMessage());
    }

    @Test
    @DisplayName("Debería cancelar una solicitud correctamente")
    void shouldCancelTaskRequest() {
        // Arrange
        TaskRequest taskRequest = createSubmittedTaskRequest();
        
        // Act
        TaskRequest cancelledTaskRequest = taskRequest.cancel();
        
        // Assert
        assertEquals(TaskRequestStatus.CANCELLED, cancelledTaskRequest.getStatus());
    }

    @Test
    @DisplayName("Debería lanzar excepción al cancelar una solicitud que ya está completada")
    void shouldThrowExceptionWhenCancellingCompletedTaskRequest() {
        // Arrange
        TaskRequest completedTaskRequest = createCompletedTaskRequest();
        
        // Act & Assert
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            completedTaskRequest.cancel();
        });
        
        assertEquals("No se pueden cancelar solicitudes en estado COMPLETED o CANCELLED", exception.getMessage());
    }

    @Test
    @DisplayName("Debería añadir un comentario correctamente")
    void shouldAddComment() {
        // Arrange
        TaskRequest taskRequest = createDraftTaskRequest();
        TaskRequestComment comment = TaskRequestComment.builder()
                .id(1L)
                .taskRequestId(taskRequest.getId())
                .userId(1L)
                .content("Comentario de prueba")
                .createdAt(LocalDateTime.now())
                .build();
        
        // Act
        TaskRequest updatedTaskRequest = taskRequest.addComment(comment);
        
        // Assert
        assertNotNull(updatedTaskRequest.getComments());
        assertEquals(1, updatedTaskRequest.getComments().size());
        assertEquals(comment, updatedTaskRequest.getComments().get(0));
    }

    @Test
    @DisplayName("Debería añadir un archivo adjunto correctamente")
    void shouldAddAttachment() {
        // Arrange
        TaskRequest taskRequest = createDraftTaskRequest();
        TaskRequestAttachment attachment = TaskRequestAttachment.builder()
                .id(1L)
                .taskRequestId(taskRequest.getId())
                .userId(1L)
                .fileName("archivo.pdf")
                .fileType("application/pdf")
                .filePath("/uploads/archivo.pdf")
                .fileSize(1024L)
                .uploadedAt(LocalDateTime.now())
                .build();
        
        // Act
        TaskRequest updatedTaskRequest = taskRequest.addAttachment(attachment);
        
        // Assert
        assertNotNull(updatedTaskRequest.getAttachments());
        assertEquals(1, updatedTaskRequest.getAttachments().size());
        assertEquals(attachment, updatedTaskRequest.getAttachments().get(0));
    }

    // Métodos auxiliares para crear solicitudes en diferentes estados

    private TaskRequest createDraftTaskRequest() {
        return TaskRequest.builder()
                .id(1L)
                .title("Solicitud de prueba")
                .description("Descripción de prueba")
                .category(TaskRequestCategory.builder().id(1L).name("General").build())
                .priority(TaskRequestPriority.MEDIUM)
                .status(TaskRequestStatus.DRAFT)
                .requesterId(1L)
                .requestDate(LocalDateTime.now())
                .build();
    }

    private TaskRequest createSubmittedTaskRequest() {
        return TaskRequest.builder()
                .id(1L)
                .title("Solicitud de prueba")
                .description("Descripción de prueba")
                .category(TaskRequestCategory.builder().id(1L).name("General").build())
                .priority(TaskRequestPriority.MEDIUM)
                .status(TaskRequestStatus.SUBMITTED)
                .requesterId(1L)
                .requestDate(LocalDateTime.now())
                .build();
    }

    private TaskRequest createAssignedTaskRequest() {
        return TaskRequest.builder()
                .id(1L)
                .title("Solicitud de prueba")
                .description("Descripción de prueba")
                .category(TaskRequestCategory.builder().id(1L).name("General").build())
                .priority(TaskRequestPriority.MEDIUM)
                .status(TaskRequestStatus.ASSIGNED)
                .requesterId(1L)
                .assignerId(2L)
                .requestDate(LocalDateTime.now())
                .assignmentDate(LocalDateTime.now())
                .build();
    }

    private TaskRequest createCompletedTaskRequest() {
        return TaskRequest.builder()
                .id(1L)
                .title("Solicitud de prueba")
                .description("Descripción de prueba")
                .category(TaskRequestCategory.builder().id(1L).name("General").build())
                .priority(TaskRequestPriority.MEDIUM)
                .status(TaskRequestStatus.COMPLETED)
                .requesterId(1L)
                .assignerId(2L)
                .requestDate(LocalDateTime.now())
                .assignmentDate(LocalDateTime.now())
                .build();
    }
}

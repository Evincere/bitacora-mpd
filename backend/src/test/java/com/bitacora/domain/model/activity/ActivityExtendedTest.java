package com.bitacora.domain.model.activity;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests unitarios para la clase ActivityExtended.
 */
class ActivityExtendedTest {

    @Test
    void testRequest() {
        // Arrange
        ActivityExtended activity = createBaseActivity();
        Long requesterId = 1L;
        String notes = "Solicitud de actividad de prueba";

        // Act
        activity.request(requesterId, notes);

        // Assert
        assertEquals(requesterId, activity.getRequesterId());
        assertEquals(notes, activity.getRequestNotes());
        assertNotNull(activity.getRequestDate());
        assertEquals(ActivityStatus.PENDIENTE, activity.getStatus()); // Asumiendo que REQUESTED se mapea a PENDIENTE
        assertNotNull(activity.getLastStatusChangeDate());
    }

    @Test
    void testAssign() {
        // Arrange
        ActivityExtended activity = createBaseActivity();
        activity.request(1L, "Solicitud inicial");

        Long assignerId = 2L;
        Long executorId = 3L;
        String notes = "Asignación de actividad de prueba";

        // Act
        activity.assign(assignerId, executorId, notes);

        // Assert
        assertEquals(assignerId, activity.getAssignerId());
        assertEquals(executorId, activity.getExecutorId());
        assertEquals(notes, activity.getAssignmentNotes());
        assertNotNull(activity.getAssignmentDate());
        assertEquals(ActivityStatus.EN_PROGRESO, activity.getStatus()); // ASSIGNED se mapea a EN_PROGRESO
        assertNotNull(activity.getLastStatusChangeDate());
    }

    @Test
    void testStart() {
        // Arrange
        ActivityExtended activity = createBaseActivity();
        activity.request(1L, "Solicitud inicial");
        activity.assign(2L, 3L, "Asignación inicial");

        String notes = "Inicio de actividad de prueba";

        // Act
        activity.start(notes);

        // Assert
        assertEquals(notes, activity.getExecutionNotes());
        assertNotNull(activity.getStartDate());
        assertEquals(ActivityStatus.EN_PROGRESO, activity.getStatus()); // Asumiendo que IN_PROGRESS se mapea a EN_PROGRESO
        assertNotNull(activity.getLastStatusChangeDate());
    }

    @Test
    void testComplete() {
        // Arrange
        ActivityExtended activity = createBaseActivity();
        activity.request(1L, "Solicitud inicial");
        activity.assign(2L, 3L, "Asignación inicial");
        activity.start("Inicio inicial");

        String notes = "Finalización de actividad de prueba";
        Integer actualHours = 8;

        // Act
        activity.complete(notes, actualHours);

        // Assert
        assertEquals(notes, activity.getCompletionNotes());
        assertEquals(actualHours, activity.getActualHours());
        assertNotNull(activity.getCompletionDate());
        assertEquals(ActivityStatus.COMPLETADA, activity.getStatus()); // Asumiendo que COMPLETED se mapea a COMPLETADA
        assertNotNull(activity.getLastStatusChangeDate());
    }

    @Test
    void testApprove() {
        // Arrange
        ActivityExtended activity = createBaseActivity();
        activity.request(1L, "Solicitud inicial");
        activity.assign(2L, 3L, "Asignación inicial");
        activity.start("Inicio inicial");
        activity.complete("Finalización inicial", 8);

        String notes = "Aprobación de actividad de prueba";

        // Act
        activity.approve(notes);

        // Assert
        assertEquals(notes, activity.getApprovalNotes());
        assertNotNull(activity.getApprovalDate());
        assertEquals(ActivityStatus.COMPLETADA, activity.getStatus()); // Asumiendo que APPROVED se mapea a COMPLETADA
        assertNotNull(activity.getLastStatusChangeDate());
    }

    @Test
    void testReject() {
        // Arrange
        ActivityExtended activity = createBaseActivity();
        activity.request(1L, "Solicitud inicial");
        activity.assign(2L, 3L, "Asignación inicial");
        activity.start("Inicio inicial");
        activity.complete("Finalización inicial", 8);

        String notes = "Rechazo de actividad de prueba";

        // Act
        activity.reject(notes);

        // Assert
        assertEquals(notes, activity.getApprovalNotes());
        assertNotNull(activity.getApprovalDate());
        assertEquals(ActivityStatus.CANCELADA, activity.getStatus()); // Asumiendo que REJECTED se mapea a CANCELADA
        assertNotNull(activity.getLastStatusChangeDate());
    }

    @Test
    void testCancel() {
        // Arrange
        ActivityExtended activity = createBaseActivity();
        activity.request(1L, "Solicitud inicial");

        String notes = "Cancelación de actividad de prueba";

        // Act
        activity.cancel(notes);

        // Assert
        assertEquals(notes, activity.getApprovalNotes());
        assertEquals(ActivityStatus.CANCELADA, activity.getStatus()); // Asumiendo que CANCELLED se mapea a CANCELADA
        assertNotNull(activity.getLastStatusChangeDate());
    }

    @Test
    void testBuilder() {
        // Arrange
        LocalDateTime now = LocalDateTime.now();

        // Act
        ActivityExtended activity = ActivityExtended.builder()
                .id(1L)
                .date(now)
                .type(ActivityType.REUNION)
                .description("Test Activity")
                .person("John Doe")
                .role("Manager")
                .dependency("IT Department")
                .situation("Planning meeting")
                .result("Tasks assigned")
                .status(ActivityStatus.COMPLETADA)
                .lastStatusChangeDate(now)
                .comments("Good meeting")
                .agent("Jane Smith")
                .createdAt(now)
                .updatedAt(now)
                .userId(2L)
                .requesterId(3L)
                .assignerId(4L)
                .executorId(5L)
                .requestDate(now)
                .assignmentDate(now)
                .startDate(now)
                .completionDate(now)
                .approvalDate(now)
                .requestNotes("Request notes")
                .assignmentNotes("Assignment notes")
                .executionNotes("Execution notes")
                .completionNotes("Completion notes")
                .approvalNotes("Approval notes")
                .estimatedHours(10)
                .actualHours(8)
                .priority(ActivityPriority.HIGH)
                .build();

        // Assert
        assertEquals(1L, activity.getId());
        assertEquals(now, activity.getDate());
        assertEquals(ActivityType.REUNION, activity.getType());
        assertEquals("Test Activity", activity.getDescription());
        assertEquals("John Doe", activity.getPerson());
        assertEquals("Manager", activity.getRole());
        assertEquals("IT Department", activity.getDependency());
        assertEquals("Planning meeting", activity.getSituation());
        assertEquals("Tasks assigned", activity.getResult());
        assertEquals(ActivityStatus.COMPLETADA, activity.getStatus());
        assertEquals(now, activity.getLastStatusChangeDate());
        assertEquals("Good meeting", activity.getComments());
        assertEquals("Jane Smith", activity.getAgent());
        assertEquals(now, activity.getCreatedAt());
        assertEquals(now, activity.getUpdatedAt());
        assertEquals(2L, activity.getUserId());
        assertEquals(3L, activity.getRequesterId());
        assertEquals(4L, activity.getAssignerId());
        assertEquals(5L, activity.getExecutorId());
        assertEquals(now, activity.getRequestDate());
        assertEquals(now, activity.getAssignmentDate());
        assertEquals(now, activity.getStartDate());
        assertEquals(now, activity.getCompletionDate());
        assertEquals(now, activity.getApprovalDate());
        assertEquals("Request notes", activity.getRequestNotes());
        assertEquals("Assignment notes", activity.getAssignmentNotes());
        assertEquals("Execution notes", activity.getExecutionNotes());
        assertEquals("Completion notes", activity.getCompletionNotes());
        assertEquals("Approval notes", activity.getApprovalNotes());
        assertEquals(10, activity.getEstimatedHours());
        assertEquals(8, activity.getActualHours());
        assertEquals(ActivityPriority.HIGH, activity.getPriority());
    }

    /**
     * Crea una actividad extendida base para pruebas.
     *
     * @return La actividad extendida base
     */
    private ActivityExtended createBaseActivity() {
        return ActivityExtended.builder()
                .id(1L)
                .date(LocalDateTime.now())
                .type(ActivityType.REUNION)
                .description("Test Activity")
                .person("John Doe")
                .role("Manager")
                .dependency("IT Department")
                .situation("Planning meeting")
                .status(ActivityStatus.PENDIENTE)
                .build();
    }
}

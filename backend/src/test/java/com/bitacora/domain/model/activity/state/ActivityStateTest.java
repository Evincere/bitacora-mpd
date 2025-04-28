package com.bitacora.domain.model.activity.state;

import com.bitacora.domain.model.activity.ActivityExtended;
import com.bitacora.domain.model.activity.ActivityStatus;
import com.bitacora.domain.model.activity.ActivityStatusNew;
import com.bitacora.domain.model.activity.ActivityType;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests unitarios para las clases de estado de actividad.
 */
class ActivityStateTest {

    @Test
    void testRequestedStateAssign() {
        // Arrange
        ActivityExtended activity = createBaseActivity();
        ActivityState state = new RequestedState();

        // Act
        ActivityState newState = state.assign(activity, 2L, 3L, "Asignación de prueba");

        // Assert
        assertTrue(newState instanceof AssignedState);
        assertEquals(ActivityStatusNew.ASSIGNED, newState.getStatus());
        assertEquals(2L, activity.getAssignerId());
        assertEquals(3L, activity.getExecutorId());
        assertEquals("Asignación de prueba", activity.getAssignmentNotes());
    }

    @Test
    void testRequestedStateInvalidTransitions() {
        // Arrange
        ActivityExtended activity = createBaseActivity();
        ActivityState state = new RequestedState();

        // Act & Assert - Ahora permitimos start desde REQUESTED
        // assertThrows(IllegalStateException.class, () -> state.start(activity,
        // "Notas"));
        assertThrows(IllegalStateException.class, () -> state.complete(activity, "Notas", 8));
        assertThrows(IllegalStateException.class, () -> state.approve(activity, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.reject(activity, "Notas"));
    }

    @Test
    void testRequestedStateStart() {
        // Arrange
        ActivityExtended activity = createBaseActivity();
        activity.request(1L, "Solicitud inicial");
        ActivityState state = new RequestedState();

        // Act
        ActivityState newState = state.start(activity, "Inicio de prueba");

        // Assert
        assertTrue(newState instanceof InProgressState);
        assertEquals(ActivityStatusNew.IN_PROGRESS, newState.getStatus());
        assertEquals("Inicio de prueba", activity.getExecutionNotes());
    }

    @Test
    void testAssignedStateStart() {
        // Arrange
        ActivityExtended activity = createBaseActivity();
        activity.assign(2L, 3L, "Asignación inicial");
        ActivityState state = new AssignedState();

        // Act
        ActivityState newState = state.start(activity, "Inicio de prueba");

        // Assert
        assertTrue(newState instanceof InProgressState);
        assertEquals(ActivityStatusNew.IN_PROGRESS, newState.getStatus());
        assertEquals("Inicio de prueba", activity.getExecutionNotes());
    }

    @Test
    void testAssignedStateInvalidTransitions() {
        // Arrange
        ActivityExtended activity = createBaseActivity();
        ActivityState state = new AssignedState();

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> state.request(activity, 1L, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.assign(activity, 2L, 3L, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.complete(activity, "Notas", 8));
        assertThrows(IllegalStateException.class, () -> state.approve(activity, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.reject(activity, "Notas"));
    }

    @Test
    void testInProgressStateComplete() {
        // Arrange
        ActivityExtended activity = createBaseActivity();
        activity.start("Inicio inicial");
        ActivityState state = new InProgressState();

        // Act
        ActivityState newState = state.complete(activity, "Finalización de prueba", 8);

        // Assert
        assertTrue(newState instanceof CompletedState);
        assertEquals(ActivityStatusNew.COMPLETED, newState.getStatus());
        assertEquals("Finalización de prueba", activity.getCompletionNotes());
        assertEquals(8, activity.getActualHours());
    }

    @Test
    void testInProgressStateInvalidTransitions() {
        // Arrange
        ActivityExtended activity = createBaseActivity();
        ActivityState state = new InProgressState();

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> state.request(activity, 1L, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.assign(activity, 2L, 3L, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.start(activity, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.approve(activity, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.reject(activity, "Notas"));
    }

    @Test
    void testCompletedStateApprove() {
        // Arrange
        ActivityExtended activity = createBaseActivity();
        activity.complete("Finalización inicial", 8);
        ActivityState state = new CompletedState();

        // Act
        ActivityState newState = state.approve(activity, "Aprobación de prueba");

        // Assert
        assertTrue(newState instanceof ApprovedState);
        assertEquals(ActivityStatusNew.APPROVED, newState.getStatus());
        assertEquals("Aprobación de prueba", activity.getApprovalNotes());
    }

    @Test
    void testCompletedStateReject() {
        // Arrange
        ActivityExtended activity = createBaseActivity();
        activity.complete("Finalización inicial", 8);
        ActivityState state = new CompletedState();

        // Act
        ActivityState newState = state.reject(activity, "Rechazo de prueba");

        // Assert
        assertTrue(newState instanceof RejectedState);
        assertEquals(ActivityStatusNew.REJECTED, newState.getStatus());
        assertEquals("Rechazo de prueba", activity.getApprovalNotes());
    }

    @Test
    void testCompletedStateInvalidTransitions() {
        // Arrange
        ActivityExtended activity = createBaseActivity();
        ActivityState state = new CompletedState();

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> state.request(activity, 1L, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.assign(activity, 2L, 3L, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.start(activity, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.complete(activity, "Notas", 8));
        assertThrows(IllegalStateException.class, () -> state.cancel(activity, "Notas"));
    }

    @Test
    void testApprovedStateInvalidTransitions() {
        // Arrange
        ActivityExtended activity = createBaseActivity();
        ActivityState state = new ApprovedState();

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> state.request(activity, 1L, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.assign(activity, 2L, 3L, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.start(activity, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.complete(activity, "Notas", 8));
        assertThrows(IllegalStateException.class, () -> state.approve(activity, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.reject(activity, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.cancel(activity, "Notas"));
    }

    @Test
    void testRejectedStateInvalidTransitions() {
        // Arrange
        ActivityExtended activity = createBaseActivity();
        ActivityState state = new RejectedState();

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> state.request(activity, 1L, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.assign(activity, 2L, 3L, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.start(activity, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.complete(activity, "Notas", 8));
        assertThrows(IllegalStateException.class, () -> state.approve(activity, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.reject(activity, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.cancel(activity, "Notas"));
    }

    @Test
    void testCancelledStateInvalidTransitions() {
        // Arrange
        ActivityExtended activity = createBaseActivity();
        ActivityState state = new CancelledState();

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> state.request(activity, 1L, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.assign(activity, 2L, 3L, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.start(activity, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.complete(activity, "Notas", 8));
        assertThrows(IllegalStateException.class, () -> state.approve(activity, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.reject(activity, "Notas"));
        assertThrows(IllegalStateException.class, () -> state.cancel(activity, "Notas"));
    }

    @Test
    void testCancelFromValidStates() {
        // Arrange
        ActivityExtended activity = createBaseActivity();

        // Act & Assert - Cancelar desde REQUESTED
        ActivityState requestedState = new RequestedState();
        ActivityState cancelledState1 = requestedState.cancel(activity, "Cancelación desde REQUESTED");
        assertTrue(cancelledState1 instanceof CancelledState);

        // Act & Assert - Cancelar desde ASSIGNED
        activity = createBaseActivity(); // Reset
        ActivityState assignedState = new AssignedState();
        ActivityState cancelledState2 = assignedState.cancel(activity, "Cancelación desde ASSIGNED");
        assertTrue(cancelledState2 instanceof CancelledState);

        // Act & Assert - Cancelar desde IN_PROGRESS
        activity = createBaseActivity(); // Reset
        ActivityState inProgressState = new InProgressState();
        ActivityState cancelledState3 = inProgressState.cancel(activity, "Cancelación desde IN_PROGRESS");
        assertTrue(cancelledState3 instanceof CancelledState);
    }

    @Test
    void testActivityStateFactory() {
        // Act & Assert
        assertTrue(ActivityStateFactory.createState(ActivityStatusNew.REQUESTED) instanceof RequestedState);
        assertTrue(ActivityStateFactory.createState(ActivityStatusNew.ASSIGNED) instanceof AssignedState);
        assertTrue(ActivityStateFactory.createState(ActivityStatusNew.IN_PROGRESS) instanceof InProgressState);
        assertTrue(ActivityStateFactory.createState(ActivityStatusNew.COMPLETED) instanceof CompletedState);
        assertTrue(ActivityStateFactory.createState(ActivityStatusNew.APPROVED) instanceof ApprovedState);
        assertTrue(ActivityStateFactory.createState(ActivityStatusNew.REJECTED) instanceof RejectedState);
        assertTrue(ActivityStateFactory.createState(ActivityStatusNew.CANCELLED) instanceof CancelledState);

        assertThrows(IllegalArgumentException.class, () -> ActivityStateFactory.createState(null));
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

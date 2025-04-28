package com.bitacora.integration;

import com.bitacora.application.activity.ActivityWorkflowService;
import com.bitacora.domain.model.activity.*;
import com.bitacora.domain.port.repository.ActivityRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Prueba de integración para el flujo de trabajo de actividades.
 * Verifica el flujo completo desde la solicitud hasta la aprobación.
 */
@SpringBootTest(properties = {
        "spring.flyway.enabled=false",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
@ActiveProfiles("test")
@Transactional
@Import(TestConfig.class)
class ActivityWorkflowIntegrationTest {

    @Autowired
    private ActivityWorkflowService activityWorkflowService;

    @Autowired
    private ActivityRepository activityRepository;

    @Test
    void testCompleteWorkflow() {
        // 1. Crear actividad
        ActivityExtended activity = ActivityExtended.builder()
                .date(LocalDateTime.now())
                .type(ActivityType.REUNION)
                .description("Actividad de prueba para flujo completo")
                .person("John Doe")
                .role("Manager")
                .dependency("IT Department")
                .situation("Planning meeting")
                .build();

        // 2. Solicitar actividad (REQUESTED)
        Long requesterId = 1L;
        ActivityExtended requestedActivity = activityWorkflowService.requestActivity(activity, requesterId,
                "Solicitud inicial");

        assertNotNull(requestedActivity.getId());
        assertEquals(requesterId, requestedActivity.getRequesterId());
        assertNotNull(requestedActivity.getRequestDate());
        assertEquals(ActivityStatus.PENDIENTE, requestedActivity.getStatus()); // Asumiendo que REQUESTED se mapea a
                                                                               // PENDIENTE

        // 3. Asignar actividad (ASSIGNED)
        Long assignerId = 2L;
        Long executorId = 3L;
        ActivityExtended assignedActivity = activityWorkflowService.assignActivity(requestedActivity.getId(),
                assignerId, executorId, "Asignación de prueba");

        assertEquals(assignerId, assignedActivity.getAssignerId());
        assertEquals(executorId, assignedActivity.getExecutorId());
        assertNotNull(assignedActivity.getAssignmentDate());
        assertEquals(ActivityStatus.EN_PROGRESO, assignedActivity.getStatus()); // Asumiendo que ASSIGNED se mapea a
                                                                                // EN_PROGRESO

        // 4. Iniciar actividad (IN_PROGRESS)
        ActivityExtended startedActivity = activityWorkflowService.startActivity(assignedActivity.getId(),
                "Inicio de prueba");

        assertNotNull(startedActivity.getStartDate());
        assertEquals(ActivityStatus.EN_PROGRESO, startedActivity.getStatus()); // Asumiendo que IN_PROGRESS se mapea a
                                                                               // EN_PROGRESO

        // 5. Completar actividad (COMPLETED)
        ActivityExtended completedActivity = activityWorkflowService.completeActivity(startedActivity.getId(),
                "Finalización de prueba", 8);

        assertNotNull(completedActivity.getCompletionDate());
        assertEquals(Integer.valueOf(8), completedActivity.getActualHours());
        assertEquals(ActivityStatus.COMPLETADA, completedActivity.getStatus()); // Asumiendo que COMPLETED se mapea a
                                                                                // COMPLETADA

        // 6. Aprobar actividad (APPROVED)
        ActivityExtended approvedActivity = activityWorkflowService.approveActivity(completedActivity.getId(),
                "Aprobación de prueba");

        assertNotNull(approvedActivity.getApprovalDate());
        assertEquals(ActivityStatus.COMPLETADA, approvedActivity.getStatus()); // Asumiendo que APPROVED se mapea a
                                                                               // COMPLETADA

        // Verificar que la actividad se ha guardado correctamente en la base de datos
        ActivityExtended savedActivity = (ActivityExtended) activityRepository.findById(approvedActivity.getId())
                .orElse(null);
        assertNotNull(savedActivity);
        assertEquals(approvedActivity.getId(), savedActivity.getId());
        assertEquals(approvedActivity.getStatus(), savedActivity.getStatus());
    }

    @Test
    void testRejectionWorkflow() {
        // 1. Crear actividad
        ActivityExtended activity = ActivityExtended.builder()
                .date(LocalDateTime.now())
                .type(ActivityType.REUNION)
                .description("Actividad de prueba para flujo de rechazo")
                .person("John Doe")
                .role("Manager")
                .dependency("IT Department")
                .situation("Planning meeting")
                .build();

        // 2. Solicitar actividad (REQUESTED)
        ActivityExtended requestedActivity = activityWorkflowService.requestActivity(activity, 1L, "Solicitud inicial");

        // 3. Asignar actividad (ASSIGNED)
        ActivityExtended assignedActivity = activityWorkflowService.assignActivity(requestedActivity.getId(), 2L, 3L,
                "Asignación de prueba");

        // 4. Iniciar actividad (IN_PROGRESS)
        ActivityExtended startedActivity = activityWorkflowService.startActivity(assignedActivity.getId(),
                "Inicio de prueba");

        // 5. Completar actividad (COMPLETED)
        ActivityExtended completedActivity = activityWorkflowService.completeActivity(startedActivity.getId(),
                "Finalización de prueba", 8);

        // 6. Rechazar actividad (REJECTED)
        ActivityExtended rejectedActivity = activityWorkflowService.rejectActivity(completedActivity.getId(),
                "Rechazo de prueba");

        assertNotNull(rejectedActivity.getApprovalDate());
        assertEquals(ActivityStatus.CANCELADA, rejectedActivity.getStatus()); // Asumiendo que REJECTED se mapea a
                                                                              // CANCELADA

        // Verificar que la actividad se ha guardado correctamente en la base de datos
        ActivityExtended savedActivity = (ActivityExtended) activityRepository.findById(rejectedActivity.getId())
                .orElse(null);
        assertNotNull(savedActivity);
        assertEquals(rejectedActivity.getId(), savedActivity.getId());
        assertEquals(rejectedActivity.getStatus(), savedActivity.getStatus());
    }

    @Test
    void testCancellationWorkflow() {
        // 1. Crear actividad
        ActivityExtended activity = ActivityExtended.builder()
                .date(LocalDateTime.now())
                .type(ActivityType.REUNION)
                .description("Actividad de prueba para flujo de cancelación")
                .person("John Doe")
                .role("Manager")
                .dependency("IT Department")
                .situation("Planning meeting")
                .build();

        // 2. Solicitar actividad (REQUESTED)
        ActivityExtended requestedActivity = activityWorkflowService.requestActivity(activity, 1L, "Solicitud inicial");

        // 3. Cancelar actividad (CANCELLED)
        ActivityExtended cancelledActivity = activityWorkflowService.cancelActivity(requestedActivity.getId(),
                "Cancelación de prueba");

        assertEquals(ActivityStatus.CANCELADA, cancelledActivity.getStatus()); // Asumiendo que CANCELLED se mapea a
                                                                               // CANCELADA

        // Verificar que la actividad se ha guardado correctamente en la base de datos
        ActivityExtended savedActivity = (ActivityExtended) activityRepository.findById(cancelledActivity.getId())
                .orElse(null);
        assertNotNull(savedActivity);
        assertEquals(cancelledActivity.getId(), savedActivity.getId());
        assertEquals(cancelledActivity.getStatus(), savedActivity.getStatus());
    }

    @Test
    void testInvalidTransitions() {
        // 1. Crear actividad
        ActivityExtended activity = ActivityExtended.builder()
                .date(LocalDateTime.now())
                .type(ActivityType.REUNION)
                .description("Actividad de prueba para transiciones inválidas")
                .person("John Doe")
                .role("Manager")
                .dependency("IT Department")
                .situation("Planning meeting")
                .build();

        // 2. Solicitar actividad (REQUESTED)
        ActivityExtended requestedActivity = activityWorkflowService.requestActivity(activity, 1L, "Solicitud inicial");

        // 3. Intentar completar actividad sin asignar ni iniciar (debe fallar)
        assertThrows(IllegalStateException.class,
                () -> activityWorkflowService.completeActivity(requestedActivity.getId(), "Finalización inválida", 8));

        // 4. Asignar actividad (ASSIGNED)
        ActivityExtended assignedActivity = activityWorkflowService.assignActivity(requestedActivity.getId(), 2L, 3L,
                "Asignación de prueba");

        // 5. Intentar aprobar actividad sin completar (debe fallar)
        assertThrows(IllegalStateException.class,
                () -> activityWorkflowService.approveActivity(assignedActivity.getId(), "Aprobación inválida"));

        // 6. Iniciar actividad (IN_PROGRESS)
        ActivityExtended startedActivity = activityWorkflowService.startActivity(assignedActivity.getId(),
                "Inicio de prueba");

        // 7. Completar actividad (COMPLETED)
        ActivityExtended completedActivity = activityWorkflowService.completeActivity(startedActivity.getId(),
                "Finalización de prueba", 8);

        // 8. Intentar iniciar actividad ya completada (debe fallar)
        assertThrows(IllegalStateException.class,
                () -> activityWorkflowService.startActivity(completedActivity.getId(), "Inicio inválido"));

        // 9. Aprobar actividad (APPROVED)
        ActivityExtended approvedActivity = activityWorkflowService.approveActivity(completedActivity.getId(),
                "Aprobación de prueba");

        // 10. Intentar cancelar actividad ya aprobada (debe fallar)
        assertThrows(IllegalStateException.class,
                () -> activityWorkflowService.cancelActivity(approvedActivity.getId(), "Cancelación inválida"));
    }
}

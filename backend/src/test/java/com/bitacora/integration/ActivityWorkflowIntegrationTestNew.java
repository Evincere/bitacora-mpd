package com.bitacora.integration;

import com.bitacora.application.activity.ActivityWorkflowService;
import com.bitacora.domain.model.activity.*;
import com.bitacora.domain.port.repository.ActivityRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Prueba de integración para el flujo de trabajo de actividades.
 * Verifica el flujo completo desde la solicitud hasta la aprobación.
 *
 * Esta versión usa @DataJpaTest para evitar problemas con Flyway.
 */
@SpringBootTest(classes = { ActivityWorkflowService.class, ActivityRepositoryMock.class })
@ActiveProfiles("test")
class ActivityWorkflowIntegrationTestNew {

        @Autowired
        private ActivityWorkflowService activityWorkflowService;

        @Autowired
        private ActivityRepository activityRepository;

        @Test
        void testCompleteWorkflow() {
                // 1. Solicitar actividad
                ActivityExtended activity = ActivityExtended.builder()
                                .date(LocalDateTime.now())
                                .type(ActivityType.REUNION)
                                .description("Reunión de planificación")
                                .person("Juan Pérez")
                                .role("Gerente")
                                .dependency("Departamento de IT")
                                .situation("Planificación de sprint")
                                .build();

                ActivityExtended requestedActivity = activityWorkflowService.requestActivity(activity, 1L,
                                "Solicitud inicial");
                assertNotNull(requestedActivity.getId());
                Long activityId = requestedActivity.getId();

                // 2. Asignar actividad
                ActivityExtended assignedActivity = activityWorkflowService.assignActivity(activityId, 2L, 1L,
                                "Asignación de prueba");
                assertEquals(ActivityStatus.EN_PROGRESO, assignedActivity.getStatus());
                assertEquals(1L, assignedActivity.getExecutorId());

                // 3. Iniciar actividad
                ActivityExtended startedActivity = activityWorkflowService.startActivity(activityId,
                                "Inicio de prueba");
                assertEquals(ActivityStatus.EN_PROGRESO, startedActivity.getStatus());
                assertNotNull(startedActivity.getStartDate());

                // 4. Completar actividad
                ActivityExtended completedActivity = activityWorkflowService.completeActivity(activityId,
                                "Finalización de prueba", 4);
                assertEquals(ActivityStatus.COMPLETADA, completedActivity.getStatus());
                assertNotNull(completedActivity.getCompletionDate());
                assertEquals(Integer.valueOf(4), completedActivity.getActualHours());

                // 5. Aprobar actividad
                ActivityExtended approvedActivity = activityWorkflowService.approveActivity(activityId,
                                "Aprobación de prueba");
                assertEquals(ActivityStatus.COMPLETADA, approvedActivity.getStatus());
                assertNotNull(approvedActivity.getApprovalDate());
        }

        @Test
        void testRejectionWorkflow() {
                // 1. Solicitar actividad
                ActivityExtended activity = ActivityExtended.builder()
                                .date(LocalDateTime.now())
                                .type(ActivityType.REUNION)
                                .description("Reunión de planificación")
                                .person("Juan Pérez")
                                .role("Gerente")
                                .dependency("Departamento de IT")
                                .situation("Planificación de sprint")
                                .build();

                ActivityExtended requestedActivity = activityWorkflowService.requestActivity(activity, 1L,
                                "Solicitud inicial");
                Long activityId = requestedActivity.getId();

                // 2. Asignar actividad
                ActivityExtended assignedActivity = activityWorkflowService.assignActivity(activityId, 2L, 1L,
                                "Asignación de prueba");

                // 3. Iniciar actividad
                ActivityExtended startedActivity = activityWorkflowService.startActivity(activityId,
                                "Inicio de prueba");

                // 4. Completar actividad
                ActivityExtended completedActivity = activityWorkflowService.completeActivity(activityId,
                                "Finalización de prueba", 4);

                // 5. Rechazar actividad
                ActivityExtended rejectedActivity = activityWorkflowService.rejectActivity(activityId,
                                "Falta información");
                assertEquals(ActivityStatus.CANCELADA, rejectedActivity.getStatus());
        }

        @Test
        void testCancellationWorkflow() {
                // 1. Solicitar actividad
                ActivityExtended activity = ActivityExtended.builder()
                                .date(LocalDateTime.now())
                                .type(ActivityType.REUNION)
                                .description("Reunión de planificación")
                                .person("Juan Pérez")
                                .role("Gerente")
                                .dependency("Departamento de IT")
                                .situation("Planificación de sprint")
                                .build();

                ActivityExtended requestedActivity = activityWorkflowService.requestActivity(activity, 1L,
                                "Solicitud inicial");
                Long activityId = requestedActivity.getId();

                // 2. Cancelar actividad
                ActivityExtended cancelledActivity = activityWorkflowService.cancelActivity(activityId,
                                "Ya no es necesaria");
                assertEquals(ActivityStatus.CANCELADA, cancelledActivity.getStatus());
        }

        @Test
        void testInvalidTransitions() {
                // 1. Solicitar actividad
                ActivityExtended activity = ActivityExtended.builder()
                                .date(LocalDateTime.now())
                                .type(ActivityType.REUNION)
                                .description("Reunión de planificación")
                                .person("Juan Pérez")
                                .role("Gerente")
                                .dependency("Departamento de IT")
                                .situation("Planificación de sprint")
                                .build();

                ActivityExtended requestedActivity = activityWorkflowService.requestActivity(activity, 1L,
                                "Solicitud inicial");
                Long activityId = requestedActivity.getId();

                // No se puede aprobar una actividad pendiente
                Exception exception = assertThrows(IllegalStateException.class, () -> {
                        activityWorkflowService.approveActivity(activityId, "Aprobación inválida");
                });
                assertTrue(exception.getMessage().contains("No se puede aprobar"));

                // No se puede completar una actividad pendiente
                exception = assertThrows(IllegalStateException.class, () -> {
                        activityWorkflowService.completeActivity(activityId, "Finalización inválida", 4);
                });
                assertTrue(exception.getMessage().contains("No se puede completar"));
        }
}

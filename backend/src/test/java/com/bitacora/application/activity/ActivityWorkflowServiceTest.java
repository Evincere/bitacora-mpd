package com.bitacora.application.activity;

import com.bitacora.domain.model.activity.*;
import com.bitacora.domain.port.repository.ActivityRepository;
import com.bitacora.infrastructure.persistence.mapper.ActivityExtendedMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.lenient;

/**
 * Tests unitarios para el servicio ActivityWorkflowService.
 */
@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class ActivityWorkflowServiceTest {

    @Mock
    private ActivityRepository activityRepository;

    @Mock
    private ActivityExtendedMapper activityExtendedMapper;

    @InjectMocks
    private ActivityWorkflowService activityWorkflowService;

    private ActivityExtended testActivity;

    @BeforeEach
    void setUp() {
        testActivity = ActivityExtended.builder()
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

        // Configurar el comportamiento del mapper para que devuelva la misma actividad
        // Usar lenient() para evitar el error de UnnecessaryStubbingException
        lenient().when(activityExtendedMapper.fromActivity(any(Activity.class))).thenAnswer(invocation -> {
            Activity activity = invocation.getArgument(0);
            return activity instanceof ActivityExtended ? (ActivityExtended) activity : testActivity;
        });
    }

    @Test
    void testRequestActivity() {
        // Arrange
        Long requesterId = 1L;
        String notes = "Solicitud de actividad de prueba";

        when(activityRepository.save(any(ActivityExtended.class))).thenReturn(testActivity);

        // Act
        ActivityExtended result = activityWorkflowService.requestActivity(testActivity, requesterId, notes);

        // Assert
        assertNotNull(result);
        assertEquals(requesterId, testActivity.getRequesterId());
        assertEquals(notes, testActivity.getRequestNotes());
        assertNotNull(testActivity.getRequestDate());

        verify(activityRepository, times(1)).save(testActivity);
    }

    @Test
    void testAssignActivity() {
        // Arrange
        Long activityId = 1L;
        Long assignerId = 2L;
        Long executorId = 3L;
        String notes = "Asignación de actividad de prueba";

        // Configurar el estado inicial de la actividad
        testActivity.request(1L, "Solicitud inicial");

        when(activityRepository.findById(activityId)).thenReturn(Optional.of(testActivity));
        when(activityRepository.save(any(ActivityExtended.class))).thenReturn(testActivity);

        // Act
        ActivityExtended result = activityWorkflowService.assignActivity(activityId, assignerId, executorId, notes);

        // Assert
        assertNotNull(result);
        assertEquals(assignerId, testActivity.getAssignerId());
        assertEquals(executorId, testActivity.getExecutorId());
        assertEquals(notes, testActivity.getAssignmentNotes());
        assertNotNull(testActivity.getAssignmentDate());

        verify(activityRepository, times(1)).findById(activityId);
        verify(activityRepository, times(1)).save(testActivity);
    }

    @Test
    void testStartActivity() {
        // Arrange
        Long activityId = 1L;
        String notes = "Inicio de actividad de prueba";

        // Configurar el estado inicial de la actividad
        testActivity.request(1L, "Solicitud inicial");
        testActivity.assign(2L, 3L, "Asignación inicial");

        when(activityRepository.findById(activityId)).thenReturn(Optional.of(testActivity));
        when(activityRepository.save(any(ActivityExtended.class))).thenReturn(testActivity);

        // Act
        ActivityExtended result = activityWorkflowService.startActivity(activityId, notes);

        // Assert
        assertNotNull(result);
        assertEquals(notes, testActivity.getExecutionNotes());
        assertNotNull(testActivity.getStartDate());

        verify(activityRepository, times(1)).findById(activityId);
        verify(activityRepository, times(1)).save(testActivity);
    }

    @Test
    void testCompleteActivity() {
        // Arrange
        Long activityId = 1L;
        String notes = "Finalización de actividad de prueba";
        Integer actualHours = 8;

        // Configurar el estado inicial de la actividad
        testActivity.request(1L, "Solicitud inicial");
        testActivity.assign(2L, 3L, "Asignación inicial");
        testActivity.start("Inicio inicial");

        when(activityRepository.findById(activityId)).thenReturn(Optional.of(testActivity));
        when(activityRepository.save(any(ActivityExtended.class))).thenReturn(testActivity);

        // Act
        ActivityExtended result = activityWorkflowService.completeActivity(activityId, notes, actualHours);

        // Assert
        assertNotNull(result);
        assertEquals(notes, testActivity.getCompletionNotes());
        assertEquals(actualHours, testActivity.getActualHours());
        assertNotNull(testActivity.getCompletionDate());

        verify(activityRepository, times(1)).findById(activityId);
        verify(activityRepository, times(1)).save(testActivity);
    }

    @Test
    void testApproveActivity() {
        // Arrange
        Long activityId = 1L;
        String notes = "Aprobación de actividad de prueba";

        // Configurar el estado inicial de la actividad
        testActivity.request(1L, "Solicitud inicial");
        testActivity.assign(2L, 3L, "Asignación inicial");
        testActivity.start("Inicio inicial");
        testActivity.complete("Finalización inicial", 8);

        when(activityRepository.findById(activityId)).thenReturn(Optional.of(testActivity));
        when(activityRepository.save(any(ActivityExtended.class))).thenReturn(testActivity);

        // Act
        ActivityExtended result = activityWorkflowService.approveActivity(activityId, notes);

        // Assert
        assertNotNull(result);
        assertEquals(notes, testActivity.getApprovalNotes());
        assertNotNull(testActivity.getApprovalDate());

        verify(activityRepository, times(1)).findById(activityId);
        verify(activityRepository, times(1)).save(testActivity);
    }

    @Test
    void testRejectActivity() {
        // Arrange
        Long activityId = 1L;
        String notes = "Rechazo de actividad de prueba";

        // Configurar el estado inicial de la actividad
        testActivity.request(1L, "Solicitud inicial");
        testActivity.assign(2L, 3L, "Asignación inicial");
        testActivity.start("Inicio inicial");
        testActivity.complete("Finalización inicial", 8);

        when(activityRepository.findById(activityId)).thenReturn(Optional.of(testActivity));
        when(activityRepository.save(any(ActivityExtended.class))).thenReturn(testActivity);

        // Act
        ActivityExtended result = activityWorkflowService.rejectActivity(activityId, notes);

        // Assert
        assertNotNull(result);
        assertEquals(notes, testActivity.getApprovalNotes());
        assertNotNull(testActivity.getApprovalDate());

        verify(activityRepository, times(1)).findById(activityId);
        verify(activityRepository, times(1)).save(testActivity);
    }

    @Test
    void testCancelActivity() {
        // Arrange
        Long activityId = 1L;
        String notes = "Cancelación de actividad de prueba";

        // Configurar el estado inicial de la actividad
        testActivity.request(1L, "Solicitud inicial");

        when(activityRepository.findById(activityId)).thenReturn(Optional.of(testActivity));
        when(activityRepository.save(any(ActivityExtended.class))).thenReturn(testActivity);

        // Act
        ActivityExtended result = activityWorkflowService.cancelActivity(activityId, notes);

        // Assert
        assertNotNull(result);
        assertEquals(notes, testActivity.getApprovalNotes());

        verify(activityRepository, times(1)).findById(activityId);
        verify(activityRepository, times(1)).save(testActivity);
    }

    @Test
    void testActivityNotFound() {
        // Arrange
        Long activityId = 1L;

        when(activityRepository.findById(activityId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class,
                () -> activityWorkflowService.assignActivity(activityId, 2L, 3L, "Notas"));
        assertThrows(IllegalArgumentException.class, () -> activityWorkflowService.startActivity(activityId, "Notas"));
        assertThrows(IllegalArgumentException.class,
                () -> activityWorkflowService.completeActivity(activityId, "Notas", 8));
        assertThrows(IllegalArgumentException.class,
                () -> activityWorkflowService.approveActivity(activityId, "Notas"));
        assertThrows(IllegalArgumentException.class, () -> activityWorkflowService.rejectActivity(activityId, "Notas"));
        assertThrows(IllegalArgumentException.class, () -> activityWorkflowService.cancelActivity(activityId, "Notas"));
    }

    @Test
    void testInvalidStateTransition() {
        // Arrange
        Long activityId = 1L;

        // Actividad en estado PENDIENTE (sin solicitar)
        testActivity.setStatus(ActivityStatus.PENDIENTE);

        when(activityRepository.findById(activityId)).thenReturn(Optional.of(testActivity));

        // Act & Assert - No se puede iniciar una actividad en estado PENDIENTE sin
        // solicitar
        assertThrows(IllegalStateException.class, () -> activityWorkflowService.startActivity(activityId, "Notas"));

        // Actividad en estado COMPLETED
        testActivity = ActivityExtended.builder()
                .id(1L)
                .status(ActivityStatus.COMPLETADA)
                .build();

        when(activityRepository.findById(activityId)).thenReturn(Optional.of(testActivity));

        // Act & Assert - No se puede cancelar una actividad en estado COMPLETED
        assertThrows(IllegalStateException.class, () -> activityWorkflowService.cancelActivity(activityId, "Notas"));
    }
}

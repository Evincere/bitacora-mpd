package com.bitacora.application.taskrequest;

import com.bitacora.application.activity.ActivityWorkflowService;
import com.bitacora.domain.event.taskrequest.TaskRequestStatusChangedEvent;
import com.bitacora.domain.model.activity.Activity;
import com.bitacora.domain.model.activity.ActivityExtended;
import com.bitacora.domain.model.activity.ActivityStatus;
import com.bitacora.domain.model.taskrequest.TaskRequest;
import com.bitacora.domain.model.taskrequest.TaskRequestStatus;
import com.bitacora.domain.port.repository.ActivityRepository;
import com.bitacora.domain.port.repository.TaskRequestRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaskRequestStatusChangedEventListenerTest {

    @Mock
    private TaskRequestRepository taskRequestRepository;

    @Mock
    private ActivityRepository activityRepository;

    @Mock
    private ActivityWorkflowService activityWorkflowService;

    @InjectMocks
    private TaskRequestStatusChangedEventListener listener;

    private TaskRequest taskRequest;
    private Activity activity;
    private ActivityExtended activityExtended;
    private TaskRequestStatusChangedEvent event;

    @BeforeEach
    void setUp() {
        // Configurar una solicitud de tarea
        taskRequest = TaskRequest.builder()
                .id(1L)
                .title("Solicitud de prueba")
                .description("Descripción de prueba")
                .status(TaskRequestStatus.IN_PROGRESS)
                .requesterId(2L)
                .assignerId(3L)
                .executorId(4L)
                .requestDate(LocalDateTime.now())
                .assignmentDate(LocalDateTime.now())
                .build();

        // Configurar una actividad
        activity = Activity.builder()
                .id(1L)
                .description("Actividad de prueba")
                .status(ActivityStatus.ASSIGNED)
                .userId(4L)
                .executorId(4L)
                .build();

        // Configurar una actividad extendida
        activityExtended = ActivityExtended.builder()
                .id(1L)
                .description("Actividad de prueba")
                .status(ActivityStatus.EN_PROGRESO)
                .userId(4L)
                .executorId(4L)
                .requesterId(2L)
                .assignerId(3L)
                .build();

        // Configurar el evento
        event = new TaskRequestStatusChangedEvent(taskRequest, TaskRequestStatus.ASSIGNED, 4L);
    }

    @Test
    @DisplayName("Debería actualizar una actividad existente cuando cambia el estado de la solicitud a IN_PROGRESS")
    void shouldUpdateExistingActivityWhenTaskRequestStatusChangesToInProgress() {
        // Arrange
        when(taskRequestRepository.findById(anyLong())).thenReturn(Optional.of(taskRequest));
        when(activityRepository.findById(anyLong())).thenReturn(Optional.of(activity));
        when(activityRepository.save(any(Activity.class))).thenReturn(activity);
        when(activityWorkflowService.startActivity(anyLong(), anyString())).thenReturn(activityExtended);

        // Act
        listener.handleTaskRequestStatusChangedEvent(event);

        // Assert
        verify(taskRequestRepository).findById(1L);
        verify(activityRepository).findById(1L);
        verify(listener).processTaskRequestInProgress(any(TaskRequest.class), anyLong());
    }

    @Test
    @DisplayName("Debería crear una nueva actividad cuando no existe una para la solicitud")
    void shouldCreateNewActivityWhenNoActivityExistsForTaskRequest() {
        // Arrange
        when(taskRequestRepository.findById(anyLong())).thenReturn(Optional.of(taskRequest));
        when(activityRepository.findById(anyLong())).thenReturn(Optional.empty());
        when(activityRepository.search(anyString(), anyInt(), anyInt())).thenReturn(new ArrayList<>());
        when(activityRepository.save(any(ActivityExtended.class))).thenReturn(activity);
        when(activityWorkflowService.startActivity(anyLong(), anyString())).thenReturn(activityExtended);

        // Act
        listener.handleTaskRequestStatusChangedEvent(event);

        // Assert
        verify(taskRequestRepository).findById(1L);
        verify(activityRepository).findById(1L);
        verify(listener).processTaskRequestInProgress(any(TaskRequest.class), anyLong());
    }

    @Test
    @DisplayName("No debería hacer nada cuando no se encuentra la solicitud de tarea")
    void shouldDoNothingWhenTaskRequestNotFound() {
        // Arrange
        when(taskRequestRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act
        listener.handleTaskRequestStatusChangedEvent(event);

        // Assert
        verify(taskRequestRepository).findById(1L);
        verify(activityRepository, never()).findById(anyLong());
        verify(activityRepository, never()).save(any(Activity.class));
        verify(activityWorkflowService, never()).startActivity(anyLong(), anyString());
    }

    @Test
    @DisplayName("No debería hacer nada cuando el estado de la solicitud no es IN_PROGRESS")
    void shouldDoNothingWhenTaskRequestStatusIsNotInProgress() {
        // Arrange
        TaskRequest completedTaskRequest = TaskRequest.builder()
                .id(1L)
                .status(TaskRequestStatus.COMPLETED)
                .build();

        TaskRequestStatusChangedEvent completedEvent = new TaskRequestStatusChangedEvent(
                completedTaskRequest, TaskRequestStatus.IN_PROGRESS, 4L);

        when(taskRequestRepository.findById(anyLong())).thenReturn(Optional.of(completedTaskRequest));

        // Act
        listener.handleTaskRequestStatusChangedEvent(completedEvent);

        // Assert
        verify(taskRequestRepository).findById(1L);
        verify(activityRepository, never()).findById(anyLong());
        verify(activityRepository, never()).save(any(Activity.class));
        verify(activityWorkflowService, never()).startActivity(anyLong(), anyString());
    }

    @Test
    @DisplayName("Debería manejar excepciones sin propagarlas")
    void shouldHandleExceptionsWithoutPropagating() {
        // Arrange
        when(taskRequestRepository.findById(anyLong())).thenReturn(Optional.of(taskRequest));
        when(activityRepository.findById(anyLong())).thenReturn(Optional.of(activity));
        when(activityWorkflowService.startActivity(anyLong(), anyString())).thenThrow(new RuntimeException("Error de prueba"));

        // Act - No debería lanzar excepción
        listener.handleTaskRequestStatusChangedEvent(event);

        // Assert
        verify(taskRequestRepository).findById(1L);
        verify(activityRepository).findById(1L);
        verify(activityWorkflowService).startActivity(anyLong(), anyString());
    }
}

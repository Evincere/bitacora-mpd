package com.bitacora.application.taskrequest;

import com.bitacora.domain.event.taskrequest.TaskRequestCreatedEvent;
import com.bitacora.domain.model.taskrequest.TaskRequest;
import com.bitacora.domain.model.taskrequest.TaskRequestCategory;
import com.bitacora.domain.model.taskrequest.TaskRequestPriority;
import com.bitacora.domain.model.taskrequest.TaskRequestStatus;
import com.bitacora.domain.port.repository.TaskRequestCategoryRepository;
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
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Pruebas unitarias para el caso de uso CreateTaskRequestUseCase.
 */
@ExtendWith(MockitoExtension.class)
class CreateTaskRequestUseCaseTest {

    @Mock
    private TaskRequestRepository taskRequestRepository;

    @Mock
    private TaskRequestCategoryRepository categoryRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    private CreateTaskRequestUseCase createTaskRequestUseCase;

    @BeforeEach
    void setUp() {
        createTaskRequestUseCase = new CreateTaskRequestUseCase(taskRequestRepository, categoryRepository, eventPublisher);
    }

    @Test
    @DisplayName("Debería crear un borrador de solicitud con categoría especificada")
    void shouldCreateDraftWithSpecifiedCategory() {
        // Arrange
        String title = "Solicitud de prueba";
        String description = "Descripción de prueba";
        Long categoryId = 1L;
        TaskRequestPriority priority = TaskRequestPriority.HIGH;
        LocalDateTime dueDate = LocalDateTime.now().plusDays(7);
        String notes = "Notas de prueba";
        Long requesterId = 1L;

        TaskRequestCategory category = TaskRequestCategory.builder()
                .id(categoryId)
                .name("General")
                .description("Categoría general")
                .color("#808080")
                .isDefault(false)
                .build();

        TaskRequest savedTaskRequest = TaskRequest.builder()
                .id(1L)
                .title(title)
                .description(description)
                .category(category)
                .priority(priority)
                .dueDate(dueDate)
                .status(TaskRequestStatus.DRAFT)
                .requesterId(requesterId)
                .requestDate(LocalDateTime.now())
                .notes(notes)
                .build();

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        when(taskRequestRepository.save(any(TaskRequest.class))).thenReturn(savedTaskRequest);

        // Act
        TaskRequest result = createTaskRequestUseCase.createDraft(title, description, categoryId, priority, dueDate, notes, requesterId);

        // Assert
        assertNotNull(result);
        assertEquals(title, result.getTitle());
        assertEquals(description, result.getDescription());
        assertEquals(category, result.getCategory());
        assertEquals(priority, result.getPriority());
        assertEquals(dueDate, result.getDueDate());
        assertEquals(TaskRequestStatus.DRAFT, result.getStatus());
        assertEquals(requesterId, result.getRequesterId());
        assertEquals(notes, result.getNotes());

        verify(categoryRepository).findById(categoryId);
        verify(taskRequestRepository).save(any(TaskRequest.class));
    }

    @Test
    @DisplayName("Debería crear un borrador de solicitud con categoría por defecto cuando no se especifica categoría")
    void shouldCreateDraftWithDefaultCategoryWhenNoCategorySpecified() {
        // Arrange
        String title = "Solicitud de prueba";
        String description = "Descripción de prueba";
        TaskRequestPriority priority = TaskRequestPriority.MEDIUM;
        LocalDateTime dueDate = LocalDateTime.now().plusDays(7);
        String notes = "Notas de prueba";
        Long requesterId = 1L;

        TaskRequestCategory defaultCategory = TaskRequestCategory.builder()
                .id(1L)
                .name("General")
                .description("Categoría general")
                .color("#808080")
                .isDefault(true)
                .build();

        TaskRequest savedTaskRequest = TaskRequest.builder()
                .id(1L)
                .title(title)
                .description(description)
                .category(defaultCategory)
                .priority(priority)
                .dueDate(dueDate)
                .status(TaskRequestStatus.DRAFT)
                .requesterId(requesterId)
                .requestDate(LocalDateTime.now())
                .notes(notes)
                .build();

        when(categoryRepository.findDefault()).thenReturn(Optional.of(defaultCategory));
        when(taskRequestRepository.save(any(TaskRequest.class))).thenReturn(savedTaskRequest);

        // Act
        TaskRequest result = createTaskRequestUseCase.createDraft(title, description, null, priority, dueDate, notes, requesterId);

        // Assert
        assertNotNull(result);
        assertEquals(title, result.getTitle());
        assertEquals(description, result.getDescription());
        assertEquals(defaultCategory, result.getCategory());
        assertEquals(priority, result.getPriority());
        assertEquals(dueDate, result.getDueDate());
        assertEquals(TaskRequestStatus.DRAFT, result.getStatus());
        assertEquals(requesterId, result.getRequesterId());
        assertEquals(notes, result.getNotes());

        verify(categoryRepository, never()).findById(any());
        verify(categoryRepository).findDefault();
        verify(taskRequestRepository).save(any(TaskRequest.class));
    }

    @Test
    @DisplayName("Debería crear y enviar una solicitud directamente")
    void shouldCreateAndSubmitTaskRequest() {
        // Arrange
        String title = "Solicitud de prueba";
        String description = "Descripción de prueba";
        Long categoryId = 1L;
        TaskRequestPriority priority = TaskRequestPriority.HIGH;
        LocalDateTime dueDate = LocalDateTime.now().plusDays(7);
        String notes = "Notas de prueba";
        Long requesterId = 1L;

        TaskRequestCategory category = TaskRequestCategory.builder()
                .id(categoryId)
                .name("General")
                .description("Categoría general")
                .color("#808080")
                .isDefault(false)
                .build();

        TaskRequest savedTaskRequest = TaskRequest.builder()
                .id(1L)
                .title(title)
                .description(description)
                .category(category)
                .priority(priority)
                .dueDate(dueDate)
                .status(TaskRequestStatus.SUBMITTED)
                .requesterId(requesterId)
                .requestDate(LocalDateTime.now())
                .notes(notes)
                .build();

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        when(taskRequestRepository.save(any(TaskRequest.class))).thenReturn(savedTaskRequest);

        // Act
        TaskRequest result = createTaskRequestUseCase.createAndSubmit(title, description, categoryId, priority, dueDate, notes, requesterId);

        // Assert
        assertNotNull(result);
        assertEquals(title, result.getTitle());
        assertEquals(description, result.getDescription());
        assertEquals(category, result.getCategory());
        assertEquals(priority, result.getPriority());
        assertEquals(dueDate, result.getDueDate());
        assertEquals(TaskRequestStatus.SUBMITTED, result.getStatus());
        assertEquals(requesterId, result.getRequesterId());
        assertEquals(notes, result.getNotes());

        verify(categoryRepository).findById(categoryId);

        ArgumentCaptor<TaskRequest> taskRequestCaptor = ArgumentCaptor.forClass(TaskRequest.class);
        verify(taskRequestRepository).save(taskRequestCaptor.capture());

        TaskRequest capturedTaskRequest = taskRequestCaptor.getValue();
        assertEquals(TaskRequestStatus.SUBMITTED, capturedTaskRequest.getStatus());

        // No podemos verificar directamente la publicación del evento porque se hace después de la transacción
        // en un callback de TransactionSynchronization, pero podemos verificar que el evento se publicará
        // indirectamente verificando que el método save se llamó correctamente
    }

    @Test
    @DisplayName("Debería usar prioridad MEDIUM cuando no se especifica prioridad")
    void shouldUseDefaultPriorityWhenNoPrioritySpecified() {
        // Arrange
        String title = "Solicitud de prueba";
        String description = "Descripción de prueba";
        Long categoryId = 1L;
        LocalDateTime dueDate = LocalDateTime.now().plusDays(7);
        String notes = "Notas de prueba";
        Long requesterId = 1L;

        TaskRequestCategory category = TaskRequestCategory.builder()
                .id(categoryId)
                .name("General")
                .description("Categoría general")
                .color("#808080")
                .isDefault(false)
                .build();

        TaskRequest savedTaskRequest = TaskRequest.builder()
                .id(1L)
                .title(title)
                .description(description)
                .category(category)
                .priority(TaskRequestPriority.MEDIUM)
                .dueDate(dueDate)
                .status(TaskRequestStatus.DRAFT)
                .requesterId(requesterId)
                .requestDate(LocalDateTime.now())
                .notes(notes)
                .build();

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        when(taskRequestRepository.save(any(TaskRequest.class))).thenReturn(savedTaskRequest);

        // Act
        TaskRequest result = createTaskRequestUseCase.createDraft(title, description, categoryId, null, dueDate, notes, requesterId);

        // Assert
        assertNotNull(result);
        assertEquals(TaskRequestPriority.MEDIUM, result.getPriority());

        ArgumentCaptor<TaskRequest> taskRequestCaptor = ArgumentCaptor.forClass(TaskRequest.class);
        verify(taskRequestRepository).save(taskRequestCaptor.capture());

        TaskRequest capturedTaskRequest = taskRequestCaptor.getValue();
        assertEquals(TaskRequestPriority.MEDIUM, capturedTaskRequest.getPriority());
    }

    @Test
    @DisplayName("Debería lanzar excepción cuando no hay categoría por defecto")
    void shouldThrowExceptionWhenNoDefaultCategoryExists() {
        // Arrange
        String title = "Solicitud de prueba";
        String description = "Descripción de prueba";
        TaskRequestPriority priority = TaskRequestPriority.MEDIUM;
        LocalDateTime dueDate = LocalDateTime.now().plusDays(7);
        String notes = "Notas de prueba";
        Long requesterId = 1L;

        when(categoryRepository.findDefault()).thenReturn(Optional.empty());

        // Act & Assert
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            createTaskRequestUseCase.createDraft(title, description, null, priority, dueDate, notes, requesterId);
        });

        assertEquals("No se encontró una categoría por defecto", exception.getMessage());

        verify(categoryRepository).findDefault();
        verify(taskRequestRepository, never()).save(any(TaskRequest.class));
    }
}

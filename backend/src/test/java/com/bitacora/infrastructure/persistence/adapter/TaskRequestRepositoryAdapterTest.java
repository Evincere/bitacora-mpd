package com.bitacora.infrastructure.persistence.adapter;

import com.bitacora.domain.model.taskrequest.TaskRequest;
import com.bitacora.domain.model.taskrequest.TaskRequestCategory;
import com.bitacora.domain.model.taskrequest.TaskRequestPriority;
import com.bitacora.domain.model.taskrequest.TaskRequestStatus;
import com.bitacora.infrastructure.persistence.entity.TaskRequestCategoryEntity;
import com.bitacora.infrastructure.persistence.entity.TaskRequestEntity;
import com.bitacora.infrastructure.persistence.entity.TaskRequestPriorityEntity;
import com.bitacora.infrastructure.persistence.entity.TaskRequestStatusEntity;
import com.bitacora.infrastructure.persistence.mapper.TaskRequestEntityMapper;
import com.bitacora.infrastructure.persistence.repository.TaskRequestJpaRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * Pruebas unitarias para TaskRequestRepositoryAdapter.
 */
@ExtendWith(MockitoExtension.class)
class TaskRequestRepositoryAdapterTest {

    @Mock
    private TaskRequestJpaRepository jpaRepository;

    @Mock
    private TaskRequestEntityMapper mapper;

    private TaskRequestRepositoryAdapter adapter;

    @BeforeEach
    void setUp() {
        adapter = new TaskRequestRepositoryAdapter(jpaRepository, mapper);
    }

    @Test
    @DisplayName("Debería guardar una solicitud de tarea")
    void shouldSaveTaskRequest() {
        // Arrange
        TaskRequest taskRequest = createTaskRequest();
        TaskRequestEntity taskRequestEntity = createTaskRequestEntity();
        
        when(mapper.toEntity(taskRequest)).thenReturn(taskRequestEntity);
        when(jpaRepository.save(taskRequestEntity)).thenReturn(taskRequestEntity);
        when(mapper.toDomain(taskRequestEntity)).thenReturn(taskRequest);
        
        // Act
        TaskRequest result = adapter.save(taskRequest);
        
        // Assert
        assertNotNull(result);
        assertEquals(taskRequest, result);
        
        verify(mapper).toEntity(taskRequest);
        verify(jpaRepository).save(taskRequestEntity);
        verify(mapper).toDomain(taskRequestEntity);
    }

    @Test
    @DisplayName("Debería buscar una solicitud por su ID")
    void shouldFindById() {
        // Arrange
        Long taskRequestId = 1L;
        TaskRequest taskRequest = createTaskRequest();
        TaskRequestEntity taskRequestEntity = createTaskRequestEntity();
        
        when(jpaRepository.findById(taskRequestId)).thenReturn(Optional.of(taskRequestEntity));
        when(mapper.toDomain(taskRequestEntity)).thenReturn(taskRequest);
        
        // Act
        Optional<TaskRequest> result = adapter.findById(taskRequestId);
        
        // Assert
        assertTrue(result.isPresent());
        assertEquals(taskRequest, result.get());
        
        verify(jpaRepository).findById(taskRequestId);
        verify(mapper).toDomain(taskRequestEntity);
    }

    @Test
    @DisplayName("Debería devolver Optional vacío cuando no se encuentra la solicitud")
    void shouldReturnEmptyOptionalWhenTaskRequestNotFound() {
        // Arrange
        Long taskRequestId = 1L;
        
        when(jpaRepository.findById(taskRequestId)).thenReturn(Optional.empty());
        
        // Act
        Optional<TaskRequest> result = adapter.findById(taskRequestId);
        
        // Assert
        assertFalse(result.isPresent());
        
        verify(jpaRepository).findById(taskRequestId);
        verify(mapper, never()).toDomain(any(TaskRequestEntity.class));
    }

    @Test
    @DisplayName("Debería buscar todas las solicitudes")
    void shouldFindAll() {
        // Arrange
        int page = 0;
        int size = 10;
        
        List<TaskRequestEntity> taskRequestEntities = Arrays.asList(
                createTaskRequestEntity(),
                createTaskRequestEntity()
        );
        
        List<TaskRequest> taskRequests = Arrays.asList(
                createTaskRequest(),
                createTaskRequest()
        );
        
        Page<TaskRequestEntity> taskRequestEntityPage = new PageImpl<>(taskRequestEntities);
        
        when(jpaRepository.findAll(any(Pageable.class))).thenReturn(taskRequestEntityPage);
        when(mapper.toDomain(any(TaskRequestEntity.class))).thenReturn(taskRequests.get(0), taskRequests.get(1));
        
        // Act
        List<TaskRequest> result = adapter.findAll(page, size);
        
        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        
        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(jpaRepository).findAll(pageableCaptor.capture());
        
        Pageable pageable = pageableCaptor.getValue();
        assertEquals(page, pageable.getPageNumber());
        assertEquals(size, pageable.getPageSize());
        assertEquals(Sort.Direction.DESC, pageable.getSort().getOrderFor("requestDate").getDirection());
        
        verify(mapper, times(2)).toDomain(any(TaskRequestEntity.class));
    }

    @Test
    @DisplayName("Debería buscar solicitudes por el ID del solicitante")
    void shouldFindByRequesterId() {
        // Arrange
        Long requesterId = 1L;
        int page = 0;
        int size = 10;
        
        List<TaskRequestEntity> taskRequestEntities = Arrays.asList(
                createTaskRequestEntity(),
                createTaskRequestEntity()
        );
        
        List<TaskRequest> taskRequests = Arrays.asList(
                createTaskRequest(),
                createTaskRequest()
        );
        
        Page<TaskRequestEntity> taskRequestEntityPage = new PageImpl<>(taskRequestEntities);
        
        when(jpaRepository.findByRequesterId(eq(requesterId), any(Pageable.class))).thenReturn(taskRequestEntityPage);
        when(mapper.toDomain(any(TaskRequestEntity.class))).thenReturn(taskRequests.get(0), taskRequests.get(1));
        
        // Act
        List<TaskRequest> result = adapter.findByRequesterId(requesterId, page, size);
        
        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        
        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(jpaRepository).findByRequesterId(eq(requesterId), pageableCaptor.capture());
        
        Pageable pageable = pageableCaptor.getValue();
        assertEquals(page, pageable.getPageNumber());
        assertEquals(size, pageable.getPageSize());
        assertEquals(Sort.Direction.DESC, pageable.getSort().getOrderFor("requestDate").getDirection());
        
        verify(mapper, times(2)).toDomain(any(TaskRequestEntity.class));
    }

    @Test
    @DisplayName("Debería buscar solicitudes por estado")
    void shouldFindByStatus() {
        // Arrange
        TaskRequestStatus status = TaskRequestStatus.SUBMITTED;
        TaskRequestStatusEntity statusEntity = TaskRequestStatusEntity.SUBMITTED;
        int page = 0;
        int size = 10;
        
        List<TaskRequestEntity> taskRequestEntities = Arrays.asList(
                createTaskRequestEntity(),
                createTaskRequestEntity()
        );
        
        List<TaskRequest> taskRequests = Arrays.asList(
                createTaskRequest(),
                createTaskRequest()
        );
        
        Page<TaskRequestEntity> taskRequestEntityPage = new PageImpl<>(taskRequestEntities);
        
        when(jpaRepository.findByStatus(eq(statusEntity), any(Pageable.class))).thenReturn(taskRequestEntityPage);
        when(mapper.toDomain(any(TaskRequestEntity.class))).thenReturn(taskRequests.get(0), taskRequests.get(1));
        
        // Act
        List<TaskRequest> result = adapter.findByStatus(status, page, size);
        
        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        
        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(jpaRepository).findByStatus(eq(statusEntity), pageableCaptor.capture());
        
        Pageable pageable = pageableCaptor.getValue();
        assertEquals(page, pageable.getPageNumber());
        assertEquals(size, pageable.getPageSize());
        assertEquals(Sort.Direction.DESC, pageable.getSort().getOrderFor("requestDate").getDirection());
        
        verify(mapper, times(2)).toDomain(any(TaskRequestEntity.class));
    }

    @Test
    @DisplayName("Debería contar el número de solicitudes")
    void shouldCount() {
        // Arrange
        long count = 5L;
        
        when(jpaRepository.count()).thenReturn(count);
        
        // Act
        long result = adapter.count();
        
        // Assert
        assertEquals(count, result);
        
        verify(jpaRepository).count();
    }

    @Test
    @DisplayName("Debería contar el número de solicitudes por el ID del solicitante")
    void shouldCountByRequesterId() {
        // Arrange
        Long requesterId = 1L;
        long count = 3L;
        
        when(jpaRepository.countByRequesterId(requesterId)).thenReturn(count);
        
        // Act
        long result = adapter.countByRequesterId(requesterId);
        
        // Assert
        assertEquals(count, result);
        
        verify(jpaRepository).countByRequesterId(requesterId);
    }

    @Test
    @DisplayName("Debería contar el número de solicitudes por estado")
    void shouldCountByStatus() {
        // Arrange
        TaskRequestStatus status = TaskRequestStatus.SUBMITTED;
        TaskRequestStatusEntity statusEntity = TaskRequestStatusEntity.SUBMITTED;
        long count = 2L;
        
        when(jpaRepository.countByStatus(statusEntity)).thenReturn(count);
        
        // Act
        long result = adapter.countByStatus(status);
        
        // Assert
        assertEquals(count, result);
        
        verify(jpaRepository).countByStatus(statusEntity);
    }

    @Test
    @DisplayName("Debería eliminar una solicitud por su ID")
    void shouldDeleteById() {
        // Arrange
        Long taskRequestId = 1L;
        
        // Act
        adapter.deleteById(taskRequestId);
        
        // Assert
        verify(jpaRepository).deleteById(taskRequestId);
    }

    // Métodos auxiliares para crear objetos de prueba

    private TaskRequest createTaskRequest() {
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

    private TaskRequestEntity createTaskRequestEntity() {
        return TaskRequestEntity.Builder.builder()
                .id(1L)
                .title("Solicitud de prueba")
                .description("Descripción de prueba")
                .category(TaskRequestCategoryEntity.Builder.builder().id(1L).name("General").build())
                .priority(TaskRequestPriorityEntity.MEDIUM)
                .status(TaskRequestStatusEntity.DRAFT)
                .requesterId(1L)
                .requestDate(LocalDateTime.now())
                .build();
    }
}

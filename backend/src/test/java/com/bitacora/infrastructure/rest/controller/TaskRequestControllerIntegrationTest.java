package com.bitacora.infrastructure.rest.controller;

import com.bitacora.application.taskrequest.CreateTaskRequestUseCase;
import com.bitacora.application.taskrequest.TaskRequestWorkflowService;
import com.bitacora.application.taskrequest.UpdateTaskRequestUseCase;
import com.bitacora.application.taskrequest.dto.CreateTaskRequestDto;
import com.bitacora.application.taskrequest.dto.TaskRequestDto;
import com.bitacora.application.taskrequest.mapper.TaskRequestMapper;
import com.bitacora.domain.model.taskrequest.TaskRequest;
import com.bitacora.domain.model.taskrequest.TaskRequestCategory;
import com.bitacora.domain.model.taskrequest.TaskRequestPriority;
import com.bitacora.domain.model.taskrequest.TaskRequestStatus;
import com.bitacora.infrastructure.security.UserPrincipal;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Pruebas de integración para TaskRequestController.
 */
@WebMvcTest(TaskRequestController.class)
class TaskRequestControllerIntegrationTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockBean
        private CreateTaskRequestUseCase createTaskRequestUseCase;

        @MockBean
        private UpdateTaskRequestUseCase updateTaskRequestUseCase;

        @MockBean
        private TaskRequestWorkflowService taskRequestWorkflowService;

        @MockBean
        private TaskRequestMapper taskRequestMapper;

        @Test
        @DisplayName("Debería crear una solicitud de tarea")
        @WithMockUser(roles = "SOLICITANTE")
        void shouldCreateTaskRequest() throws Exception {
                // Arrange
                CreateTaskRequestDto createDto = new CreateTaskRequestDto();
                createDto.setTitle("Solicitud de prueba");
                createDto.setDescription("Descripción de prueba");
                createDto.setPriority("MEDIUM");
                createDto.setSubmitImmediately(false);

                TaskRequest createdTaskRequest = TaskRequest.builder()
                                .id(1L)
                                .title("Solicitud de prueba")
                                .description("Descripción de prueba")
                                .category(TaskRequestCategory.builder().id(1L).name("General").build())
                                .priority(TaskRequestPriority.MEDIUM)
                                .status(TaskRequestStatus.DRAFT)
                                .requesterId(1L)
                                .requestDate(LocalDateTime.now())
                                .build();

                TaskRequestDto taskRequestDto = TaskRequestDto.builder()
                                .id(1L)
                                .title("Solicitud de prueba")
                                .description("Descripción de prueba")
                                .priority("MEDIUM")
                                .status("DRAFT")
                                .requesterId(1L)
                                .build();

                when(taskRequestMapper.toPriorityEnum(anyString())).thenReturn(TaskRequestPriority.MEDIUM);
                when(createTaskRequestUseCase.createDraft(anyString(), anyString(), any(), any(), any(), any(),
                                anyLong()))
                                .thenReturn(createdTaskRequest);
                when(taskRequestMapper.toDto(any(TaskRequest.class))).thenReturn(taskRequestDto);

                // Act & Assert
                mockMvc.perform(post("/api/task-requests")
                                .with(user(UserPrincipal.create(1L, "user", "password",
                                                Collections.singletonList("ROLE_SOLICITANTE"))))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(createDto)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.id", is(1)))
                                .andExpect(jsonPath("$.title", is("Solicitud de prueba")))
                                .andExpect(jsonPath("$.description", is("Descripción de prueba")))
                                .andExpect(jsonPath("$.priority", is("MEDIUM")))
                                .andExpect(jsonPath("$.status", is("DRAFT")));

                verify(createTaskRequestUseCase).createDraft(eq("Solicitud de prueba"), eq("Descripción de prueba"),
                                any(), eq(TaskRequestPriority.MEDIUM), any(), any(), eq(1L));
                verify(taskRequestMapper).toDto(createdTaskRequest);
        }

        @Test
        @DisplayName("Debería obtener una solicitud de tarea por su ID")
        @WithMockUser(roles = "SOLICITANTE")
        void shouldGetTaskRequestById() throws Exception {
                // Arrange
                Long taskRequestId = 1L;

                TaskRequest taskRequest = TaskRequest.builder()
                                .id(taskRequestId)
                                .title("Solicitud de prueba")
                                .description("Descripción de prueba")
                                .category(TaskRequestCategory.builder().id(1L).name("General").build())
                                .priority(TaskRequestPriority.MEDIUM)
                                .status(TaskRequestStatus.DRAFT)
                                .requesterId(1L)
                                .requestDate(LocalDateTime.now())
                                .build();

                TaskRequestDto taskRequestDto = TaskRequestDto.builder()
                                .id(taskRequestId)
                                .title("Solicitud de prueba")
                                .description("Descripción de prueba")
                                .priority("MEDIUM")
                                .status("DRAFT")
                                .requesterId(1L)
                                .build();

                when(taskRequestWorkflowService.findById(taskRequestId)).thenReturn(taskRequest);
                when(taskRequestMapper.toDto(taskRequest)).thenReturn(taskRequestDto);

                // Act & Assert
                mockMvc.perform(get("/api/task-requests/{id}", taskRequestId))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id", is(1)))
                                .andExpect(jsonPath("$.title", is("Solicitud de prueba")))
                                .andExpect(jsonPath("$.description", is("Descripción de prueba")))
                                .andExpect(jsonPath("$.priority", is("MEDIUM")))
                                .andExpect(jsonPath("$.status", is("DRAFT")));

                verify(taskRequestWorkflowService).findById(taskRequestId);
                verify(taskRequestMapper).toDto(taskRequest);
        }

        @Test
        @DisplayName("Debería devolver 404 cuando no se encuentra la solicitud")
        @WithMockUser(roles = "SOLICITANTE")
        void shouldReturn404WhenTaskRequestNotFound() throws Exception {
                // Arrange
                Long taskRequestId = 1L;

                when(taskRequestWorkflowService.findById(taskRequestId))
                                .thenThrow(new RuntimeException("Solicitud no encontrada"));

                // Act & Assert
                mockMvc.perform(get("/api/task-requests/{id}", taskRequestId))
                                .andExpect(status().isNotFound());

                verify(taskRequestWorkflowService).findById(taskRequestId);
                verify(taskRequestMapper, never()).toDto(any(TaskRequest.class));
        }

        @Test
        @DisplayName("Debería obtener las solicitudes de tarea del usuario actual")
        @WithMockUser(roles = "SOLICITANTE")
        void shouldGetMyTaskRequests() throws Exception {
                // Arrange
                Long requesterId = 1L;
                int page = 0;
                int size = 10;

                List<TaskRequest> taskRequests = Arrays.asList(
                                TaskRequest.builder()
                                                .id(1L)
                                                .title("Solicitud 1")
                                                .description("Descripción 1")
                                                .category(TaskRequestCategory.builder().id(1L).name("General").build())
                                                .priority(TaskRequestPriority.MEDIUM)
                                                .status(TaskRequestStatus.DRAFT)
                                                .requesterId(requesterId)
                                                .requestDate(LocalDateTime.now())
                                                .build(),
                                TaskRequest.builder()
                                                .id(2L)
                                                .title("Solicitud 2")
                                                .description("Descripción 2")
                                                .category(TaskRequestCategory.builder().id(1L).name("General").build())
                                                .priority(TaskRequestPriority.HIGH)
                                                .status(TaskRequestStatus.SUBMITTED)
                                                .requesterId(requesterId)
                                                .requestDate(LocalDateTime.now())
                                                .build());

                List<TaskRequestDto> taskRequestDtos = Arrays.asList(
                                TaskRequestDto.builder()
                                                .id(1L)
                                                .title("Solicitud 1")
                                                .description("Descripción 1")
                                                .priority("MEDIUM")
                                                .status("DRAFT")
                                                .requesterId(requesterId)
                                                .build(),
                                TaskRequestDto.builder()
                                                .id(2L)
                                                .title("Solicitud 2")
                                                .description("Descripción 2")
                                                .priority("HIGH")
                                                .status("SUBMITTED")
                                                .requesterId(requesterId)
                                                .build());

                when(taskRequestWorkflowService.findByRequesterId(eq(requesterId), eq(page), eq(size)))
                                .thenReturn(taskRequests);
                when(taskRequestWorkflowService.countByRequesterId(requesterId)).thenReturn(2L);
                when(taskRequestMapper.toPageDto(eq(taskRequests), eq(2L), eq(1), eq(page))).thenReturn(
                                com.bitacora.application.taskrequest.dto.TaskRequestPageDto.builder()
                                                .taskRequests(taskRequestDtos)
                                                .totalItems(2L)
                                                .totalPages(1)
                                                .currentPage(page)
                                                .build());

                // Act & Assert
                mockMvc.perform(get("/api/task-requests/my-requests")
                                .with(user(UserPrincipal.create(requesterId, "user", "password",
                                                Collections.singletonList("ROLE_SOLICITANTE")))))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.taskRequests", hasSize(2)))
                                .andExpect(jsonPath("$.taskRequests[0].id", is(1)))
                                .andExpect(jsonPath("$.taskRequests[0].title", is("Solicitud 1")))
                                .andExpect(jsonPath("$.taskRequests[1].id", is(2)))
                                .andExpect(jsonPath("$.taskRequests[1].title", is("Solicitud 2")))
                                .andExpect(jsonPath("$.totalItems", is(2)))
                                .andExpect(jsonPath("$.totalPages", is(1)))
                                .andExpect(jsonPath("$.currentPage", is(0)));

                verify(taskRequestWorkflowService).findByRequesterId(requesterId, page, size);
                verify(taskRequestWorkflowService).countByRequesterId(requesterId);
                verify(taskRequestMapper).toPageDto(taskRequests, 2L, 1, page);
        }

        @Test
        @DisplayName("Debería enviar una solicitud de tarea")
        @WithMockUser(roles = "SOLICITANTE")
        void shouldSubmitTaskRequest() throws Exception {
                // Arrange
                Long taskRequestId = 1L;
                Long requesterId = 1L;

                TaskRequest submittedTaskRequest = TaskRequest.builder()
                                .id(taskRequestId)
                                .title("Solicitud de prueba")
                                .description("Descripción de prueba")
                                .category(TaskRequestCategory.builder().id(1L).name("General").build())
                                .priority(TaskRequestPriority.MEDIUM)
                                .status(TaskRequestStatus.SUBMITTED)
                                .requesterId(requesterId)
                                .requestDate(LocalDateTime.now())
                                .build();

                TaskRequestDto taskRequestDto = TaskRequestDto.builder()
                                .id(taskRequestId)
                                .title("Solicitud de prueba")
                                .description("Descripción de prueba")
                                .priority("MEDIUM")
                                .status("SUBMITTED")
                                .requesterId(requesterId)
                                .build();

                when(taskRequestWorkflowService.submit(taskRequestId, requesterId)).thenReturn(submittedTaskRequest);
                when(taskRequestMapper.toDto(submittedTaskRequest)).thenReturn(taskRequestDto);

                // Act & Assert
                mockMvc.perform(post("/api/task-requests/{id}/submit", taskRequestId)
                                .with(user(UserPrincipal.create(requesterId, "user", "password",
                                                Collections.singletonList("ROLE_SOLICITANTE")))))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id", is(1)))
                                .andExpect(jsonPath("$.status", is("SUBMITTED")));

                verify(taskRequestWorkflowService).submit(taskRequestId, requesterId);
                verify(taskRequestMapper).toDto(submittedTaskRequest);
        }

        @Test
        @DisplayName("Debería asignar una solicitud de tarea")
        @WithMockUser(roles = "ASIGNADOR")
        void shouldAssignTaskRequest() throws Exception {
                // Arrange
                Long taskRequestId = 1L;
                Long assignerId = 2L;

                TaskRequest assignedTaskRequest = TaskRequest.builder()
                                .id(taskRequestId)
                                .title("Solicitud de prueba")
                                .description("Descripción de prueba")
                                .category(TaskRequestCategory.builder().id(1L).name("General").build())
                                .priority(TaskRequestPriority.MEDIUM)
                                .status(TaskRequestStatus.ASSIGNED)
                                .requesterId(1L)
                                .assignerId(assignerId)
                                .requestDate(LocalDateTime.now())
                                .assignmentDate(LocalDateTime.now())
                                .build();

                TaskRequestDto taskRequestDto = TaskRequestDto.builder()
                                .id(taskRequestId)
                                .title("Solicitud de prueba")
                                .description("Descripción de prueba")
                                .priority("MEDIUM")
                                .status("ASSIGNED")
                                .requesterId(1L)
                                .assignerId(assignerId)
                                .build();

                when(taskRequestWorkflowService.assign(taskRequestId, assignerId)).thenReturn(assignedTaskRequest);
                when(taskRequestMapper.toDto(assignedTaskRequest)).thenReturn(taskRequestDto);

                // Act & Assert
                mockMvc.perform(post("/api/task-requests/{id}/assign", taskRequestId)
                                .with(user(UserPrincipal.create(assignerId, "user", "password",
                                                Collections.singletonList("ROLE_ASIGNADOR")))))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id", is(1)))
                                .andExpect(jsonPath("$.status", is("ASSIGNED")))
                                .andExpect(jsonPath("$.assignerId", is(2)));

                verify(taskRequestWorkflowService).assign(taskRequestId, assignerId);
                verify(taskRequestMapper).toDto(assignedTaskRequest);
        }

        @Test
        @DisplayName("Debería completar una solicitud de tarea")
        @WithMockUser(roles = "EJECUTOR")
        void shouldCompleteTaskRequest() throws Exception {
                // Arrange
                Long taskRequestId = 1L;
                Long executorId = 3L; // ID del ejecutor que completa la solicitud

                TaskRequest completedTaskRequest = TaskRequest.builder()
                                .id(taskRequestId)
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

                TaskRequestDto taskRequestDto = TaskRequestDto.builder()
                                .id(taskRequestId)
                                .title("Solicitud de prueba")
                                .description("Descripción de prueba")
                                .priority("MEDIUM")
                                .status("COMPLETED")
                                .requesterId(1L)
                                .assignerId(2L)
                                .build();

                when(taskRequestWorkflowService.complete(taskRequestId, executorId)).thenReturn(completedTaskRequest);
                when(taskRequestMapper.toDto(completedTaskRequest)).thenReturn(taskRequestDto);

                // Act & Assert
                mockMvc.perform(post("/api/task-requests/{id}/complete", taskRequestId)
                                .with(user(UserPrincipal.create(executorId, "user", "password",
                                                Collections.singletonList("ROLE_EJECUTOR")))))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id", is(1)))
                                .andExpect(jsonPath("$.status", is("COMPLETED")));

                verify(taskRequestWorkflowService).complete(taskRequestId, executorId);
                verify(taskRequestMapper).toDto(completedTaskRequest);
        }

        @Test
        @DisplayName("Debería cancelar una solicitud de tarea")
        @WithMockUser(roles = "SOLICITANTE")
        void shouldCancelTaskRequest() throws Exception {
                // Arrange
                Long taskRequestId = 1L;
                Long requesterId = 1L;

                TaskRequest cancelledTaskRequest = TaskRequest.builder()
                                .id(taskRequestId)
                                .title("Solicitud de prueba")
                                .description("Descripción de prueba")
                                .category(TaskRequestCategory.builder().id(1L).name("General").build())
                                .priority(TaskRequestPriority.MEDIUM)
                                .status(TaskRequestStatus.CANCELLED)
                                .requesterId(requesterId)
                                .requestDate(LocalDateTime.now())
                                .build();

                TaskRequestDto taskRequestDto = TaskRequestDto.builder()
                                .id(taskRequestId)
                                .title("Solicitud de prueba")
                                .description("Descripción de prueba")
                                .priority("MEDIUM")
                                .status("CANCELLED")
                                .requesterId(requesterId)
                                .build();

                when(taskRequestWorkflowService.cancel(taskRequestId, requesterId)).thenReturn(cancelledTaskRequest);
                when(taskRequestMapper.toDto(cancelledTaskRequest)).thenReturn(taskRequestDto);

                // Act & Assert
                mockMvc.perform(post("/api/task-requests/{id}/cancel", taskRequestId)
                                .with(user(UserPrincipal.create(requesterId, "user", "password",
                                                Collections.singletonList("ROLE_SOLICITANTE")))))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id", is(1)))
                                .andExpect(jsonPath("$.status", is("CANCELLED")));

                verify(taskRequestWorkflowService).cancel(taskRequestId, requesterId);
                verify(taskRequestMapper).toDto(cancelledTaskRequest);
        }
}

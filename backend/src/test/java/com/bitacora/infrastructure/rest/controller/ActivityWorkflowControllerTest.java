package com.bitacora.infrastructure.rest.controller;

import com.bitacora.application.activity.ActivityWorkflowService;
import com.bitacora.domain.model.activity.*;
import com.bitacora.infrastructure.rest.dto.workflow.*;
import com.bitacora.infrastructure.security.UserPrincipal;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Tests de integración para el controlador ActivityWorkflowController.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Import(ActivityWorkflowService.class)
class ActivityWorkflowControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @Autowired
        private ActivityWorkflowService activityWorkflowService;

        private ActivityExtended testActivity;
        private UserPrincipal userPrincipal;

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

                // Crear una colección de autoridades que incluya todos los permisos necesarios
                Collection<GrantedAuthority> authorities = Arrays.asList(
                                new SimpleGrantedAuthority("ROLE_ADMIN"),
                                new SimpleGrantedAuthority("REQUEST_ACTIVITIES"),
                                new SimpleGrantedAuthority("ASSIGN_ACTIVITIES"),
                                new SimpleGrantedAuthority("EXECUTE_ACTIVITIES"),
                                new SimpleGrantedAuthority("APPROVE_ACTIVITIES"));
                userPrincipal = new UserPrincipal(1L, "testuser", "password", authorities);
        }

        @Test
        @WithMockUser(authorities = { "REQUEST_ACTIVITIES" })
        void testRequestActivity() throws Exception {
                // Arrange
                RequestActivityDto requestDto = RequestActivityDto.builder()
                                .date(LocalDateTime.now())
                                .type("REUNION")
                                .description("Test Activity")
                                .person("John Doe")
                                .role("Manager")
                                .dependency("IT Department")
                                .situation("Planning meeting")
                                .estimatedHours(8)
                                .notes("Solicitud de actividad de prueba")
                                .build();

                when(activityWorkflowService.requestActivity(any(ActivityExtended.class), anyLong(), anyString()))
                                .thenReturn(testActivity);

                // Act & Assert
                mockMvc.perform(post("/api/activities/request")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestDto))
                                .with(user(userPrincipal)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.id").value(1L))
                                .andExpect(jsonPath("$.description").value("Test Activity"));
        }

        @Test
        @WithMockUser(authorities = { "ASSIGN_ACTIVITIES" })
        void testAssignActivity() throws Exception {
                // Arrange
                AssignActivityDto assignDto = AssignActivityDto.builder()
                                .executorId(3L)
                                .notes("Asignación de actividad de prueba")
                                .build();

                when(activityWorkflowService.assignActivity(anyLong(), anyLong(), anyLong(), anyString()))
                                .thenReturn(testActivity);

                // Act & Assert
                mockMvc.perform(post("/api/activities/1/assign")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(assignDto))
                                .with(user(userPrincipal)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(1L))
                                .andExpect(jsonPath("$.description").value("Test Activity"));
        }

        @Test
        @WithMockUser(authorities = { "EXECUTE_ACTIVITIES" })
        void testStartActivity() throws Exception {
                // Arrange
                StartActivityDto startDto = StartActivityDto.builder()
                                .notes("Inicio de actividad de prueba")
                                .build();

                when(activityWorkflowService.startActivity(anyLong(), anyString()))
                                .thenReturn(testActivity);

                // Act & Assert
                mockMvc.perform(post("/api/activities/1/start")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(startDto))
                                .with(user(userPrincipal)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(1L))
                                .andExpect(jsonPath("$.description").value("Test Activity"));
        }

        @Test
        @WithMockUser(authorities = { "EXECUTE_ACTIVITIES" })
        void testCompleteActivity() throws Exception {
                // Arrange
                CompleteActivityDto completeDto = CompleteActivityDto.builder()
                                .notes("Finalización de actividad de prueba")
                                .actualHours(8)
                                .build();

                when(activityWorkflowService.completeActivity(anyLong(), anyString(), anyInt()))
                                .thenReturn(testActivity);

                // Act & Assert
                mockMvc.perform(post("/api/activities/1/complete")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(completeDto))
                                .with(user(userPrincipal)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(1L))
                                .andExpect(jsonPath("$.description").value("Test Activity"));
        }

        @Test
        @WithMockUser(authorities = { "APPROVE_ACTIVITIES" })
        void testApproveActivity() throws Exception {
                // Arrange
                ApproveActivityDto approveDto = ApproveActivityDto.builder()
                                .notes("Aprobación de actividad de prueba")
                                .build();

                when(activityWorkflowService.approveActivity(anyLong(), anyString()))
                                .thenReturn(testActivity);

                // Act & Assert
                mockMvc.perform(post("/api/activities/1/approve")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(approveDto))
                                .with(user(userPrincipal)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(1L))
                                .andExpect(jsonPath("$.description").value("Test Activity"));
        }

        @Test
        @WithMockUser(authorities = { "APPROVE_ACTIVITIES" })
        void testRejectActivity() throws Exception {
                // Arrange
                RejectActivityDto rejectDto = RejectActivityDto.builder()
                                .reason("Motivo de rechazo")
                                .notes("Rechazo de actividad de prueba")
                                .build();

                when(activityWorkflowService.rejectActivity(anyLong(), anyString()))
                                .thenReturn(testActivity);

                // Act & Assert
                mockMvc.perform(post("/api/activities/1/reject")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(rejectDto))
                                .with(user(userPrincipal)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(1L))
                                .andExpect(jsonPath("$.description").value("Test Activity"));
        }

        @Test
        @WithMockUser(authorities = { "REQUEST_ACTIVITIES" })
        void testCancelActivity() throws Exception {
                // Arrange
                RejectActivityDto cancelDto = RejectActivityDto.builder()
                                .reason("Motivo de cancelación")
                                .notes("Cancelación de actividad de prueba")
                                .build();

                when(activityWorkflowService.cancelActivity(anyLong(), anyString()))
                                .thenReturn(testActivity);

                // Act & Assert
                mockMvc.perform(post("/api/activities/1/cancel")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(cancelDto))
                                .with(user(userPrincipal)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(1L))
                                .andExpect(jsonPath("$.description").value("Test Activity"));
        }

        @Test
        void testUnauthorizedAccess() throws Exception {
                // Arrange
                RequestActivityDto requestDto = RequestActivityDto.builder()
                                .date(LocalDateTime.now())
                                .type("REUNION")
                                .description("Test Activity")
                                .notes("Solicitud de actividad de prueba")
                                .build();

                // Act & Assert - Con autenticación pero sin el permiso específico
                // REQUEST_ACTIVITIES
                Collection<GrantedAuthority> authorities = Arrays.asList(
                                new SimpleGrantedAuthority("ROLE_USER"));
                UserPrincipal userWithoutPermission = new UserPrincipal(2L, "user", "password", authorities);

                mockMvc.perform(post("/api/activities/request")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(requestDto))
                                .with(user(userWithoutPermission)))
                                .andExpect(status().isForbidden());
        }

        @Test
        @WithMockUser(authorities = { "REQUEST_ACTIVITIES" })
        void testInvalidInput() throws Exception {
                // Arrange - DTO con campos requeridos faltantes
                RequestActivityDto invalidDto = RequestActivityDto.builder()
                                .build();

                // Act & Assert
                mockMvc.perform(post("/api/activities/request")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(invalidDto))
                                .with(user(userPrincipal)))
                                .andExpect(status().isBadRequest());
        }
}

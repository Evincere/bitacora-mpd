package com.bitacora.infrastructure.rest;

import com.bitacora.domain.model.activity.Activity;
import com.bitacora.domain.model.activity.ActivityStatus;
import com.bitacora.domain.model.activity.ActivityType;
import com.bitacora.domain.port.ActivityRepository;
import com.bitacora.infrastructure.rest.dto.ActivityCreateDto;
import com.bitacora.infrastructure.rest.dto.ActivityUpdateDto;
import com.bitacora.infrastructure.security.JwtTokenProvider;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;

import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests de integración para el controlador de actividades.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ActivityControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockBean
        private ActivityRepository activityRepository;

        @MockBean
        private JwtTokenProvider jwtTokenProvider;

        private Activity testActivity;

        @BeforeEach
        void setUp() {
                testActivity = Activity.builder()
                                .id(1L)
                                .date(LocalDateTime.now())
                                .type(ActivityType.REUNION)
                                .description("Test Activity")
                                .person("John Doe")
                                .role("Manager")
                                .dependency("IT Department")
                                .situation("Planning meeting")
                                .result("Tasks assigned")
                                .status(ActivityStatus.PENDIENTE)
                                .lastStatusChangeDate(LocalDateTime.now())
                                .comments("Test comment")
                                .agent("Jane Smith")
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .userId(1L)
                                .build();

                // Configurar el mock del repositorio
                when(activityRepository.findById(1L)).thenReturn(Optional.of(testActivity));
                when(activityRepository.save(any(Activity.class))).thenReturn(testActivity);

                List<Activity> activities = Arrays.asList(testActivity);
                when(activityRepository.findAll(0, 10)).thenReturn(activities);
                when(activityRepository.count()).thenReturn(1L);

                // Configurar el mock del proveedor de tokens JWT
                // Nota: No necesitamos configurar autoridades ya que estamos usando @WithMockUser
                when(jwtTokenProvider.getAuthentication(any())).thenReturn(null);
        }

        @Test
        @WithMockUser(authorities = { "READ_ACTIVITIES" })
        void testGetAllActivities() throws Exception {
                mockMvc.perform(get("/activities")
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.activities", hasSize(greaterThanOrEqualTo(1))))
                                .andExpect(jsonPath("$.totalCount", is(1)));
        }

        @Test
        @WithMockUser(authorities = { "READ_ACTIVITIES" })
        void testGetActivityById() throws Exception {
                mockMvc.perform(get("/activities/1")
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id", is(1)))
                                .andExpect(jsonPath("$.description", is("Test Activity")));
        }

        @Test
        @WithMockUser(authorities = { "WRITE_ACTIVITIES" })
        void testCreateActivity() throws Exception {
                ActivityCreateDto createDto = ActivityCreateDto.builder()
                                .date(LocalDateTime.now())
                                .type("REUNION")
                                .description("New Activity")
                                .status("PENDIENTE")
                                .build();

                mockMvc.perform(post("/activities")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(createDto)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.id", is(1)))
                                .andExpect(jsonPath("$.description", is("Test Activity")));
        }

        @Test
        @WithMockUser(authorities = { "WRITE_ACTIVITIES" })
        void testUpdateActivity() throws Exception {
                ActivityUpdateDto updateDto = ActivityUpdateDto.builder()
                                .description("Updated Activity")
                                .status("COMPLETADA")
                                .build();

                mockMvc.perform(put("/activities/1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(updateDto)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id", is(1)))
                                .andExpect(jsonPath("$.description", is("Test Activity")));
        }

        @Test
        @WithMockUser(authorities = { "DELETE_ACTIVITIES" })
        void testDeleteActivity() throws Exception {
                mockMvc.perform(delete("/activities/1")
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isNoContent());
        }
}

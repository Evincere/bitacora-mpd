package com.bitacora.infrastructure.rest.controller;

import com.bitacora.application.dashboard.DashboardMetricsService;
import com.bitacora.infrastructure.rest.dto.dashboard.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Pruebas unitarias para DashboardController.
 */
@ExtendWith(MockitoExtension.class)
class DashboardControllerTest {

    @Mock
    private DashboardMetricsService dashboardMetricsService;

    @InjectMocks
    private DashboardController dashboardController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(dashboardController).build();
    }

    @Test
    void getSystemOverview_ShouldReturnDashboardMetrics() throws Exception {
        // Given
        DashboardMetricsDto expectedMetrics = new DashboardMetricsDto(
                1000L, 250L, 750L, 50L, 35L, 15L, 12L, 5L, 87.5, 24.5, LocalDateTime.now());

        when(dashboardMetricsService.getSystemOverview()).thenReturn(expectedMetrics);

        // When & Then
        mockMvc.perform(get("/api/admin/dashboard/metrics/overview")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.totalTasks").value(1000))
                .andExpect(jsonPath("$.activeTasks").value(250))
                .andExpect(jsonPath("$.completedTasks").value(750))
                .andExpect(jsonPath("$.totalUsers").value(50))
                .andExpect(jsonPath("$.activeUsers").value(35))
                .andExpect(jsonPath("$.tasksCreatedToday").value(15))
                .andExpect(jsonPath("$.tasksCompletedToday").value(12))
                .andExpect(jsonPath("$.overdueTasks").value(5))
                .andExpect(jsonPath("$.onTimeCompletionRate").value(87.5))
                .andExpect(jsonPath("$.averageResolutionTimeHours").value(24.5));
    }

    @Test
    void getTaskStatusMetrics_ShouldReturnTaskStatusDistribution() throws Exception {
        // Given
        List<TaskStatusMetricsDto.StatusDistributionItem> statusItems = Arrays.asList(
                new TaskStatusMetricsDto.StatusDistributionItem("COMPLETED", "Completadas", 300L, 60.0, "#10B981"),
                new TaskStatusMetricsDto.StatusDistributionItem("IN_PROGRESS", "En Progreso", 150L, 30.0, "#3B82F6"),
                new TaskStatusMetricsDto.StatusDistributionItem("ASSIGNED", "Asignadas", 50L, 10.0, "#F59E0B"));

        TaskStatusMetricsDto expectedMetrics = new TaskStatusMetricsDto(
                statusItems, 500L, LocalDateTime.now().minusDays(30), LocalDateTime.now(), LocalDateTime.now());

        when(dashboardMetricsService.getTaskStatusMetrics(any(), any())).thenReturn(expectedMetrics);

        // When & Then
        mockMvc.perform(get("/api/admin/dashboard/metrics/task-status")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.totalTasks").value(500))
                .andExpect(jsonPath("$.statusDistribution").isArray())
                .andExpect(jsonPath("$.statusDistribution[0].status").value("COMPLETED"))
                .andExpect(jsonPath("$.statusDistribution[0].statusName").value("Completadas"))
                .andExpect(jsonPath("$.statusDistribution[0].count").value(300))
                .andExpect(jsonPath("$.statusDistribution[0].percentage").value(60.0))
                .andExpect(jsonPath("$.statusDistribution[0].color").value("#10B981"));
    }

    @Test
    void getUserActivityMetrics_ShouldReturnUserActivityData() throws Exception {
        // Given
        List<UserActivityMetricsDto.UserActivityItem> userItems = Arrays.asList(
                new UserActivityMetricsDto.UserActivityItem(
                        1L, "Juan Pérez", "juan.perez@empresa.com", 25L, 22L, 88.0, 18.5, LocalDateTime.now()),
                new UserActivityMetricsDto.UserActivityItem(
                        2L, "María García", "maria.garcia@empresa.com", 20L, 18L, 90.0, 16.2, LocalDateTime.now()));

        UserActivityMetricsDto expectedMetrics = new UserActivityMetricsDto(
                userItems, 45L, 8.5, 87.3, LocalDateTime.now().minusDays(30), LocalDateTime.now(), LocalDateTime.now());

        when(dashboardMetricsService.getUserActivityMetrics(any(), any())).thenReturn(expectedMetrics);

        // When & Then
        mockMvc.perform(get("/api/admin/dashboard/metrics/user-activity")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.totalActiveUsers").value(45))
                .andExpect(jsonPath("$.averageTasksPerUser").value(8.5))
                .andExpect(jsonPath("$.averageCompletionRate").value(87.3))
                .andExpect(jsonPath("$.topActiveUsers").isArray())
                .andExpect(jsonPath("$.topActiveUsers[0].userId").value(1))
                .andExpect(jsonPath("$.topActiveUsers[0].userName").value("Juan Pérez"))
                .andExpect(jsonPath("$.topActiveUsers[0].userEmail").value("juan.perez@empresa.com"))
                .andExpect(jsonPath("$.topActiveUsers[0].tasksAssigned").value(25))
                .andExpect(jsonPath("$.topActiveUsers[0].tasksCompleted").value(22))
                .andExpect(jsonPath("$.topActiveUsers[0].completionRate").value(88.0));
    }

    @Test
    void getCategoryDistribution_ShouldReturnCategoryData() throws Exception {
        // Given
        List<CategoryDistributionDto.CategoryDistributionItem> categoryItems = Arrays.asList(
                new CategoryDistributionDto.CategoryDistributionItem(
                        1L, "Desarrollo", "Tareas de desarrollo de software", 150L, 50.0, 120L, 80.0, 32.5, "#3B82F6"),
                new CategoryDistributionDto.CategoryDistributionItem(
                        2L, "Soporte", "Tareas de soporte técnico", 100L, 33.3, 85L, 85.0, 24.0, "#10B981"));

        CategoryDistributionDto expectedDistribution = new CategoryDistributionDto(
                categoryItems, 300L, LocalDateTime.now().minusDays(30), LocalDateTime.now(), LocalDateTime.now());

        when(dashboardMetricsService.getCategoryDistribution(any(), any())).thenReturn(expectedDistribution);

        // When & Then
        mockMvc.perform(get("/api/admin/dashboard/metrics/category-distribution")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.totalTasks").value(300))
                .andExpect(jsonPath("$.categoryDistribution").isArray())
                .andExpect(jsonPath("$.categoryDistribution[0].categoryId").value(1))
                .andExpect(jsonPath("$.categoryDistribution[0].categoryName").value("Desarrollo"))
                .andExpect(jsonPath("$.categoryDistribution[0].count").value(150))
                .andExpect(jsonPath("$.categoryDistribution[0].percentage").value(50.0))
                .andExpect(jsonPath("$.categoryDistribution[0].completionRate").value(80.0));
    }

    @Test
    void getPriorityDistribution_ShouldReturnPriorityData() throws Exception {
        // Given
        List<PriorityDistributionDto.PriorityDistributionItem> priorityItems = Arrays.asList(
                new PriorityDistributionDto.PriorityDistributionItem(
                        "HIGH", "Alta", 1, 85L, 28.3, 72L, 84.7, 16.2, 3L, "#EF4444"),
                new PriorityDistributionDto.PriorityDistributionItem(
                        "MEDIUM", "Media", 2, 150L, 50.0, 135L, 90.0, 24.5, 2L, "#F59E0B"));

        PriorityDistributionDto expectedDistribution = new PriorityDistributionDto(
                priorityItems, 300L, LocalDateTime.now().minusDays(30), LocalDateTime.now(), LocalDateTime.now());

        when(dashboardMetricsService.getPriorityDistribution(any(), any())).thenReturn(expectedDistribution);

        // When & Then
        mockMvc.perform(get("/api/admin/dashboard/metrics/priority-distribution")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.totalTasks").value(300))
                .andExpect(jsonPath("$.priorityDistribution").isArray())
                .andExpect(jsonPath("$.priorityDistribution[0].priority").value("HIGH"))
                .andExpect(jsonPath("$.priorityDistribution[0].priorityName").value("Alta"))
                .andExpect(jsonPath("$.priorityDistribution[0].priorityOrder").value(1))
                .andExpect(jsonPath("$.priorityDistribution[0].count").value(85))
                .andExpect(jsonPath("$.priorityDistribution[0].percentage").value(28.3))
                .andExpect(jsonPath("$.priorityDistribution[0].completionRate").value(84.7))
                .andExpect(jsonPath("$.priorityDistribution[0].overdueCount").value(3));
    }

    @Test
    void getTaskStatusMetrics_WithDateParameters_ShouldPassParametersToService() throws Exception {
        // Given
        TaskStatusMetricsDto expectedMetrics = new TaskStatusMetricsDto(
                Arrays.asList(), 0L, LocalDateTime.now().minusDays(7), LocalDateTime.now(), LocalDateTime.now());

        when(dashboardMetricsService.getTaskStatusMetrics(any(), any())).thenReturn(expectedMetrics);

        // When & Then
        mockMvc.perform(get("/api/admin/dashboard/metrics/task-status")
                .param("startDate", "2024-01-01T00:00:00")
                .param("endDate", "2024-01-31T23:59:59")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}

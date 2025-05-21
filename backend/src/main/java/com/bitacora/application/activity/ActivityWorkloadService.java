package com.bitacora.application.activity;

import com.bitacora.domain.model.user.User;
import com.bitacora.domain.model.activity.Activity;
import com.bitacora.domain.model.activity.ActivityStatus;
import com.bitacora.domain.model.user.UserRole;
import com.bitacora.domain.port.repository.ActivityRepository;
import com.bitacora.domain.port.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Servicio para obtener estadísticas de carga de trabajo de actividades.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityWorkloadService {

        private final ActivityRepository activityRepository;
        private final UserRepository userRepository;

        /**
         * Obtiene la distribución de carga de trabajo por ejecutor.
         *
         * @return Lista de mapas con la distribución de carga de trabajo
         */
        public List<Map<String, Object>> getWorkloadDistribution() {
                log.info("Obteniendo distribución de carga de trabajo");

                // Obtener usuarios con rol EJECUTOR
                List<User> executors = userRepository.findByRole(UserRole.EJECUTOR, 0, 100);
                log.info("Encontrados {} ejecutores", executors.size());

                // Lista para almacenar los resultados
                List<Map<String, Object>> result = new ArrayList<>();

                // Para cada ejecutor, obtener sus tareas asignadas
                for (User executor : executors) {
                        Map<String, Object> executorWorkload = new HashMap<>();

                        // Información básica del ejecutor
                        executorWorkload.put("executorId", executor.getId());
                        executorWorkload.put("executorName", executor.getFullName());

                        // Crear filtros para buscar actividades del ejecutor
                        Map<String, Object> filters = new HashMap<>();
                        filters.put("executorId", executor.getId());

                        // Obtener todas las actividades asignadas al ejecutor
                        List<Activity> allActivities = activityRepository.findWithFilters(filters, 0, 1000);

                        // Contar actividades por estado
                        int assignedTasks = (int) allActivities.stream()
                                        .filter(a -> a.getStatus() == ActivityStatus.ASSIGNED)
                                        .count();

                        int inProgressTasks = (int) allActivities.stream()
                                        .filter(a -> a.getStatus() == ActivityStatus.IN_PROGRESS)
                                        .count();

                        int completedTasks = (int) allActivities.stream()
                                        .filter(a -> a.getStatus() == ActivityStatus.COMPLETED)
                                        .count();

                        int approvedTasks = (int) allActivities.stream()
                                        .filter(a -> a.getStatus() == ActivityStatus.APPROVED)
                                        .count();

                        // Añadir conteos al resultado
                        executorWorkload.put("assignedTasks", assignedTasks + inProgressTasks); // Total de tareas
                                                                                                // activas
                        executorWorkload.put("pendingTasks", assignedTasks + inProgressTasks); // Tareas pendientes
                                                                                               // (asignadas + en
                                                                                               // progreso)
                        executorWorkload.put("completedTasks", completedTasks + approvedTasks); // Tareas completadas
                                                                                                // (completadas +
                                                                                                // aprobadas)

                        // Añadir información detallada por estado
                        executorWorkload.put("tasksByStatus", Map.of(
                                        "ASSIGNED", assignedTasks,
                                        "IN_PROGRESS", inProgressTasks,
                                        "COMPLETED", completedTasks,
                                        "APPROVED", approvedTasks));

                        // Añadir el ejecutor al resultado
                        result.add(executorWorkload);
                }

                return result;
        }
}

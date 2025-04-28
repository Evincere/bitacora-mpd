package com.bitacora.application.activity;

import com.bitacora.domain.model.activity.ActivityExtended;
import com.bitacora.domain.model.activity.ActivityStatus;
import com.bitacora.domain.model.activity.ActivityStatusNew;
import com.bitacora.domain.model.activity.state.ActivityState;
import com.bitacora.domain.model.activity.state.ActivityStateFactory;

import com.bitacora.domain.port.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio para gestionar el flujo de trabajo de actividades.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityWorkflowService {

        private final ActivityRepository activityRepository;

        /**
         * Solicita una nueva actividad.
         *
         * @param activity    La actividad a solicitar
         * @param requesterId ID del solicitante
         * @param notes       Notas de la solicitud
         * @return La actividad solicitada
         */
        @Transactional
        public ActivityExtended requestActivity(ActivityExtended activity, Long requesterId, String notes) {
                log.debug("Solicitando actividad: {}", activity.getId());

                // Aplicar la transición directamente en la actividad
                activity.request(requesterId, notes);

                // Guardar la actividad
                return (ActivityExtended) activityRepository.save(activity);
        }

        /**
         * Asigna una actividad a un ejecutor.
         *
         * @param activityId ID de la actividad
         * @param assignerId ID del asignador
         * @param executorId ID del ejecutor
         * @param notes      Notas de la asignación
         * @return La actividad asignada
         */
        @Transactional
        public ActivityExtended assignActivity(Long activityId, Long assignerId, Long executorId, String notes) {
                log.debug("Asignando actividad con ID: {} al ejecutor con ID: {}", activityId, executorId);

                // Obtener la actividad
                ActivityExtended activity = (ActivityExtended) activityRepository.findById(activityId)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "No se encontró la actividad con ID: " + activityId));

                // Crear el estado actual
                ActivityState state = ActivityStateFactory
                                .createState(ActivityStatusNew.fromString(activity.getStatus().name()));

                // Aplicar la transición
                state = state.assign(activity, assignerId, executorId, notes);

                // Guardar la actividad
                return (ActivityExtended) activityRepository.save(activity);
        }

        /**
         * Inicia una actividad.
         *
         * @param activityId ID de la actividad
         * @param notes      Notas de inicio
         * @return La actividad iniciada
         */
        @Transactional
        public ActivityExtended startActivity(Long activityId, String notes) {
                log.debug("Iniciando actividad con ID: {}", activityId);

                // Obtener la actividad
                ActivityExtended activity = (ActivityExtended) activityRepository.findById(activityId)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "No se encontró la actividad con ID: " + activityId));

                // Crear el estado actual
                ActivityState state;
                if (activity.getStatus() == ActivityStatus.PENDIENTE) {
                        state = ActivityStateFactory.createStateFromActivityStatus(activity.getStatus());
                } else {
                        state = ActivityStateFactory
                                        .createState(ActivityStatusNew.fromString(activity.getStatus().name()));
                }

                // Aplicar la transición
                state = state.start(activity, notes);

                // Guardar la actividad
                return (ActivityExtended) activityRepository.save(activity);
        }

        /**
         * Completa una actividad.
         *
         * @param activityId  ID de la actividad
         * @param notes       Notas de finalización
         * @param actualHours Horas reales dedicadas
         * @return La actividad completada
         */
        @Transactional
        public ActivityExtended completeActivity(Long activityId, String notes, Integer actualHours) {
                log.debug("Completando actividad con ID: {}", activityId);

                // Obtener la actividad
                ActivityExtended activity = (ActivityExtended) activityRepository.findById(activityId)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "No se encontró la actividad con ID: " + activityId));

                // Crear el estado actual
                ActivityState state;
                if (activity.getStatus() == ActivityStatus.EN_PROGRESO) {
                        state = ActivityStateFactory.createState(ActivityStatusNew.IN_PROGRESS);
                } else {
                        state = ActivityStateFactory
                                        .createState(ActivityStatusNew.fromString(activity.getStatus().name()));
                }

                // Aplicar la transición
                state = state.complete(activity, notes, actualHours);

                // Guardar la actividad
                return (ActivityExtended) activityRepository.save(activity);
        }

        /**
         * Aprueba una actividad.
         *
         * @param activityId ID de la actividad
         * @param notes      Notas de aprobación
         * @return La actividad aprobada
         */
        @Transactional
        public ActivityExtended approveActivity(Long activityId, String notes) {
                log.debug("Aprobando actividad con ID: {}", activityId);

                // Obtener la actividad
                ActivityExtended activity = (ActivityExtended) activityRepository.findById(activityId)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "No se encontró la actividad con ID: " + activityId));

                // Crear el estado actual
                ActivityState state;
                if (activity.getStatus() == ActivityStatus.COMPLETADA) {
                        state = ActivityStateFactory.createState(ActivityStatusNew.COMPLETED);
                } else {
                        state = ActivityStateFactory
                                        .createState(ActivityStatusNew.fromString(activity.getStatus().name()));
                }

                // Aplicar la transición
                state = state.approve(activity, notes);

                // Guardar la actividad
                return (ActivityExtended) activityRepository.save(activity);
        }

        /**
         * Rechaza una actividad.
         *
         * @param activityId ID de la actividad
         * @param notes      Notas de rechazo
         * @return La actividad rechazada
         */
        @Transactional
        public ActivityExtended rejectActivity(Long activityId, String notes) {
                log.debug("Rechazando actividad con ID: {}", activityId);

                // Obtener la actividad
                ActivityExtended activity = (ActivityExtended) activityRepository.findById(activityId)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "No se encontró la actividad con ID: " + activityId));

                // Crear el estado actual
                ActivityState state;
                if (activity.getStatus() == ActivityStatus.COMPLETADA) {
                        state = ActivityStateFactory.createState(ActivityStatusNew.COMPLETED);
                } else {
                        state = ActivityStateFactory
                                        .createState(ActivityStatusNew.fromString(activity.getStatus().name()));
                }

                // Aplicar la transición
                state = state.reject(activity, notes);

                // Guardar la actividad
                return (ActivityExtended) activityRepository.save(activity);
        }

        /**
         * Cancela una actividad.
         *
         * @param activityId ID de la actividad
         * @param notes      Notas de cancelación
         * @return La actividad cancelada
         */
        @Transactional
        public ActivityExtended cancelActivity(Long activityId, String notes) {
                log.debug("Cancelando actividad con ID: {}", activityId);

                // Obtener la actividad
                ActivityExtended activity = (ActivityExtended) activityRepository.findById(activityId)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "No se encontró la actividad con ID: " + activityId));

                // Crear el estado actual
                ActivityState state;

                // Si la actividad está en estado COMPLETADA, lanzar una excepción
                if (activity.getStatus() == ActivityStatus.COMPLETADA) {
                        throw new IllegalStateException("No se puede cancelar una actividad en estado COMPLETADA");
                }

                if (activity.getStatus() == ActivityStatus.PENDIENTE) {
                        state = ActivityStateFactory.createStateFromActivityStatus(activity.getStatus());
                } else {
                        state = ActivityStateFactory
                                        .createState(ActivityStatusNew.fromString(activity.getStatus().name()));
                }

                // Aplicar la transición
                state = state.cancel(activity, notes);

                // Guardar la actividad
                return (ActivityExtended) activityRepository.save(activity);
        }
}

package com.bitacora.application.activity;

import com.bitacora.domain.event.activity.ActivityCreatedEvent;
import com.bitacora.domain.event.activity.ActivityStatusChangedEvent;
import com.bitacora.domain.model.activity.Activity;
import com.bitacora.domain.model.activity.ActivityStatus;
import com.bitacora.domain.port.repository.ActivityRepository;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Servicio para gestionar actividades.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final ApplicationEventPublisher eventPublisher;

    /**
     * Crea una nueva actividad.
     * 
     * @param activity La actividad a crear
     * @return La actividad creada
     */
    @Transactional
    public Activity createActivity(Activity activity) {
        log.debug("Creando actividad: {}", activity);
        
        Activity savedActivity = activityRepository.save(activity);
        
        // Publicar evento de creación de actividad
        eventPublisher.publishEvent(new ActivityCreatedEvent(savedActivity));
        
        return savedActivity;
    }
    
    /**
     * Actualiza una actividad existente.
     * 
     * @param id El ID de la actividad a actualizar
     * @param activity La actividad con los datos actualizados
     * @return La actividad actualizada
     */
    @Transactional
    public Optional<Activity> updateActivity(Long id, Activity activity) {
        log.debug("Actualizando actividad con ID {}: {}", id, activity);
        
        return activityRepository.findById(id).map(existingActivity -> {
            // Verificar si el estado ha cambiado
            ActivityStatus oldStatus = existingActivity.getStatus();
            ActivityStatus newStatus = activity.getStatus();
            boolean statusChanged = oldStatus != newStatus;
            
            // Actualizar campos
            activity.setId(id);
            activity.setUpdatedAt(LocalDateTime.now());
            
            // Si el estado ha cambiado, actualizar la fecha de cambio de estado
            if (statusChanged) {
                activity.setLastStatusChangeDate(LocalDateTime.now());
            }
            
            Activity updatedActivity = activityRepository.save(activity);
            
            // Si el estado ha cambiado, publicar evento
            if (statusChanged) {
                eventPublisher.publishEvent(new ActivityStatusChangedEvent(updatedActivity, oldStatus));
            }
            
            return updatedActivity;
        });
    }
    
    /**
     * Cambia el estado de una actividad.
     * 
     * @param id El ID de la actividad
     * @param newStatus El nuevo estado
     * @return La actividad actualizada
     */
    @Transactional
    public Optional<Activity> changeActivityStatus(Long id, ActivityStatus newStatus) {
        log.debug("Cambiando estado de actividad con ID {} a {}", id, newStatus);
        
        return activityRepository.findById(id).map(existingActivity -> {
            ActivityStatus oldStatus = existingActivity.getStatus();
            
            // Si el estado no ha cambiado, no hacer nada
            if (oldStatus == newStatus) {
                return existingActivity;
            }
            
            // Actualizar estado y fecha de cambio
            existingActivity.setStatus(newStatus);
            existingActivity.setLastStatusChangeDate(LocalDateTime.now());
            existingActivity.setUpdatedAt(LocalDateTime.now());
            
            Activity updatedActivity = activityRepository.save(existingActivity);
            
            // Publicar evento de cambio de estado
            eventPublisher.publishEvent(new ActivityStatusChangedEvent(updatedActivity, oldStatus));
            
            return updatedActivity;
        });
    }
    
    /**
     * Obtiene una actividad por su ID.
     * 
     * @param id El ID de la actividad
     * @return La actividad, si existe
     */
    @Transactional(readOnly = true)
    public Optional<Activity> getActivityById(Long id) {
        log.debug("Obteniendo actividad con ID: {}", id);
        return activityRepository.findById(id);
    }
    
    /**
     * Obtiene todas las actividades con paginación.
     * 
     * @param page El número de página (comenzando desde 0)
     * @param size El tamaño de la página
     * @return Lista de actividades
     */
    @Transactional(readOnly = true)
    public List<Activity> getAllActivities(int page, int size) {
        log.debug("Obteniendo actividades (página: {}, tamaño: {})", page, size);
        return activityRepository.findAll(page, size);
    }
    
    /**
     * Busca actividades con filtros personalizados.
     * 
     * @param filters Los filtros a aplicar
     * @param page El número de página (comenzando desde 0)
     * @param size El tamaño de la página
     * @return Lista de actividades que cumplen los filtros
     */
    @Transactional(readOnly = true)
    public List<Activity> findActivitiesWithFilters(Map<String, Object> filters, int page, int size) {
        log.debug("Buscando actividades con filtros: {} (página: {}, tamaño: {})", filters, page, size);
        return activityRepository.findWithFilters(filters, page, size);
    }
    
    /**
     * Elimina una actividad.
     * 
     * @param id El ID de la actividad a eliminar
     */
    @Transactional
    public void deleteActivity(Long id) {
        log.debug("Eliminando actividad con ID: {}", id);
        activityRepository.deleteById(id);
    }
    
    /**
     * Cuenta el número total de actividades.
     * 
     * @return El número total de actividades
     */
    @Transactional(readOnly = true)
    public long countActivities() {
        return activityRepository.count();
    }
    
    /**
     * Cuenta el número de actividades que cumplen con los filtros especificados.
     * 
     * @param filters Los filtros a aplicar
     * @return El número de actividades que cumplen con los filtros
     */
    @Transactional(readOnly = true)
    public long countActivitiesWithFilters(Map<String, Object> filters) {
        return activityRepository.countWithFilters(filters);
    }
}

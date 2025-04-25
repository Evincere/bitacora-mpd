package com.bitacora.domain.port.repository;

import com.bitacora.domain.model.activity.ActivityAttachment;

import java.util.List;
import java.util.Optional;

/**
 * Interfaz de repositorio para la entidad ActivityAttachment.
 */
public interface ActivityAttachmentRepository {
    
    /**
     * Guarda un adjunto.
     * 
     * @param attachment El adjunto a guardar
     * @return El adjunto guardado con ID asignado
     */
    ActivityAttachment save(ActivityAttachment attachment);
    
    /**
     * Busca un adjunto por su ID.
     * 
     * @param id El ID del adjunto
     * @return El adjunto encontrado o vacío
     */
    Optional<ActivityAttachment> findById(Long id);
    
    /**
     * Busca adjuntos por ID de actividad.
     * 
     * @param activityId El ID de la actividad
     * @return Lista de adjuntos
     */
    List<ActivityAttachment> findByActivityId(Long activityId);
    
    /**
     * Busca adjuntos por ID de actividad con paginación.
     * 
     * @param activityId El ID de la actividad
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de adjuntos
     */
    List<ActivityAttachment> findByActivityId(Long activityId, int page, int size);
    
    /**
     * Busca adjuntos por ID de usuario.
     * 
     * @param userId El ID del usuario
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de adjuntos
     */
    List<ActivityAttachment> findByUserId(Long userId, int page, int size);
    
    /**
     * Busca adjuntos por tipo de archivo.
     * 
     * @param fileType El tipo de archivo
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de adjuntos
     */
    List<ActivityAttachment> findByFileType(String fileType, int page, int size);
    
    /**
     * Cuenta el número de adjuntos por ID de actividad.
     * 
     * @param activityId El ID de la actividad
     * @return El número de adjuntos
     */
    long countByActivityId(Long activityId);
    
    /**
     * Elimina un adjunto por su ID.
     * 
     * @param id El ID del adjunto
     */
    void deleteById(Long id);
}

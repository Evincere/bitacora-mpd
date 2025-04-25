package com.bitacora.application.activity;

import com.bitacora.domain.model.activity.ActivityAttachment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio de aplicación para gestionar archivos adjuntos en actividades.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityAttachmentService {
    
    private final com.bitacora.domain.service.ActivityAttachmentService activityAttachmentService;
    
    /**
     * Crea un nuevo adjunto.
     * 
     * @param activityId ID de la actividad
     * @param userId ID del usuario que sube el archivo
     * @param userName Nombre del usuario que sube el archivo
     * @param fileName Nombre del archivo
     * @param fileType Tipo MIME del archivo
     * @param fileUrl URL o ruta del archivo
     * @param fileSize Tamaño del archivo en bytes
     * @return El adjunto creado
     */
    @Transactional
    public ActivityAttachment createAttachment(
            Long activityId, 
            Long userId, 
            String userName, 
            String fileName, 
            String fileType, 
            String fileUrl,
            Long fileSize) {
        
        log.debug("Creando adjunto para actividad con ID: {}", activityId);
        
        return activityAttachmentService.createAttachment(
                activityId, userId, userName, fileName, fileType, fileUrl, fileSize);
    }
    
    /**
     * Obtiene un adjunto por su ID.
     * 
     * @param id ID del adjunto
     * @return El adjunto
     */
    @Transactional(readOnly = true)
    public ActivityAttachment getAttachmentById(Long id) {
        log.debug("Obteniendo adjunto con ID: {}", id);
        return activityAttachmentService.getAttachmentById(id);
    }
    
    /**
     * Obtiene los adjuntos de una actividad.
     * 
     * @param activityId ID de la actividad
     * @return Lista de adjuntos
     */
    @Transactional(readOnly = true)
    public List<ActivityAttachment> getAttachmentsByActivityId(Long activityId) {
        log.debug("Obteniendo adjuntos para actividad con ID: {}", activityId);
        return activityAttachmentService.getAttachmentsByActivityId(activityId);
    }
    
    /**
     * Obtiene los adjuntos de una actividad con paginación.
     * 
     * @param activityId ID de la actividad
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de adjuntos
     */
    @Transactional(readOnly = true)
    public List<ActivityAttachment> getAttachmentsByActivityId(Long activityId, int page, int size) {
        log.debug("Obteniendo adjuntos paginados para actividad con ID: {}", activityId);
        return activityAttachmentService.getAttachmentsByActivityId(activityId, page, size);
    }
    
    /**
     * Obtiene los adjuntos subidos por un usuario.
     * 
     * @param userId ID del usuario
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de adjuntos
     */
    @Transactional(readOnly = true)
    public List<ActivityAttachment> getAttachmentsByUserId(Long userId, int page, int size) {
        log.debug("Obteniendo adjuntos para usuario con ID: {}", userId);
        return activityAttachmentService.getAttachmentsByUserId(userId, page, size);
    }
    
    /**
     * Obtiene los adjuntos por tipo de archivo.
     * 
     * @param fileType Tipo de archivo
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de adjuntos
     */
    @Transactional(readOnly = true)
    public List<ActivityAttachment> getAttachmentsByFileType(String fileType, int page, int size) {
        log.debug("Obteniendo adjuntos por tipo de archivo: {}", fileType);
        return activityAttachmentService.getAttachmentsByFileType(fileType, page, size);
    }
    
    /**
     * Cuenta el número de adjuntos en una actividad.
     * 
     * @param activityId ID de la actividad
     * @return Número de adjuntos
     */
    @Transactional(readOnly = true)
    public long countAttachmentsByActivityId(Long activityId) {
        log.debug("Contando adjuntos para actividad con ID: {}", activityId);
        return activityAttachmentService.countAttachmentsByActivityId(activityId);
    }
    
    /**
     * Elimina un adjunto.
     * 
     * @param id ID del adjunto
     * @param userId ID del usuario que elimina
     */
    @Transactional
    public void deleteAttachment(Long id, Long userId) {
        log.debug("Eliminando adjunto con ID: {}", id);
        activityAttachmentService.deleteAttachment(id, userId);
    }
}

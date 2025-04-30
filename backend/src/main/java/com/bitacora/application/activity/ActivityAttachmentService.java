package com.bitacora.application.activity;

import com.bitacora.domain.model.activity.ActivityAttachment;
import com.bitacora.domain.port.repository.ActivityAttachmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

/**
 * Servicio de aplicación para gestionar archivos adjuntos en actividades.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityAttachmentService {

    private final ActivityAttachmentRepository activityAttachmentRepository;

    /**
     * Crea un nuevo adjunto.
     *
     * @param activityId ID de la actividad
     * @param userId     ID del usuario que sube el archivo
     * @param userName   Nombre del usuario que sube el archivo
     * @param fileName   Nombre del archivo
     * @param fileType   Tipo MIME del archivo
     * @param fileUrl    URL o ruta del archivo
     * @param fileSize   Tamaño del archivo en bytes
     * @return El adjunto creado
     */
    @Transactional
    public ActivityAttachment createAttachment(
            final Long activityId,
            final Long userId,
            final String userName,
            final String fileName,
            final String fileType,
            final String fileUrl,
            final Long fileSize) {

        log.debug("Creando adjunto para actividad con ID: {}", activityId);

        ActivityAttachment attachment = ActivityAttachment.create(
                activityId, userId, userName, fileName, fileType, fileUrl, fileSize);

        return activityAttachmentRepository.save(attachment);
    }

    /**
     * Obtiene un adjunto por su ID.
     *
     * @param id ID del adjunto
     * @return El adjunto
     */
    @Transactional(readOnly = true)
    public ActivityAttachment getAttachmentById(final Long id) {
        log.debug("Obteniendo adjunto con ID: {}", id);
        return activityAttachmentRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Adjunto no encontrado con ID: " + id));
    }

    /**
     * Obtiene los adjuntos de una actividad.
     *
     * @param activityId ID de la actividad
     * @return Lista de adjuntos
     */
    @Transactional(readOnly = true)
    public List<ActivityAttachment> getAttachmentsByActivityId(final Long activityId) {
        log.debug("Obteniendo adjuntos para actividad con ID: {}", activityId);
        return activityAttachmentRepository.findByActivityId(activityId);
    }

    /**
     * Obtiene los adjuntos de una actividad con paginación.
     *
     * @param activityId ID de la actividad
     * @param page       Número de página (0-based)
     * @param size       Tamaño de página
     * @return Lista de adjuntos
     */
    @Transactional(readOnly = true)
    public List<ActivityAttachment> getAttachmentsByActivityId(final Long activityId, final int page, final int size) {
        log.debug("Obteniendo adjuntos paginados para actividad con ID: {}", activityId);
        return activityAttachmentRepository.findByActivityId(activityId, page, size);
    }

    /**
     * Obtiene los adjuntos subidos por un usuario.
     *
     * @param userId ID del usuario
     * @param page   Número de página (0-based)
     * @param size   Tamaño de página
     * @return Lista de adjuntos
     */
    @Transactional(readOnly = true)
    public List<ActivityAttachment> getAttachmentsByUserId(final Long userId, final int page, final int size) {
        log.debug("Obteniendo adjuntos para usuario con ID: {}", userId);
        return activityAttachmentRepository.findByUserId(userId, page, size);
    }

    /**
     * Obtiene los adjuntos por tipo de archivo.
     *
     * @param fileType Tipo de archivo
     * @param page     Número de página (0-based)
     * @param size     Tamaño de página
     * @return Lista de adjuntos
     */
    @Transactional(readOnly = true)
    public List<ActivityAttachment> getAttachmentsByFileType(final String fileType, final int page, final int size) {
        log.debug("Obteniendo adjuntos por tipo de archivo: {}", fileType);
        return activityAttachmentRepository.findByFileType(fileType, page, size);
    }

    /**
     * Cuenta el número de adjuntos en una actividad.
     *
     * @param activityId ID de la actividad
     * @return Número de adjuntos
     */
    @Transactional(readOnly = true)
    public long countAttachmentsByActivityId(final Long activityId) {
        log.debug("Contando adjuntos para actividad con ID: {}", activityId);
        return activityAttachmentRepository.countByActivityId(activityId);
    }

    /**
     * Elimina un adjunto.
     *
     * @param id     ID del adjunto
     * @param userId ID del usuario que elimina
     */
    @Transactional
    public void deleteAttachment(final Long id, final Long userId) {
        log.debug("Eliminando adjunto con ID: {}", id);

        // Verificar que el adjunto existe y pertenece al usuario
        ActivityAttachment attachment = getAttachmentById(id);
        if (!attachment.getUserId().equals(userId)) {
            throw new SecurityException("No tienes permiso para eliminar este adjunto");
        }

        activityAttachmentRepository.deleteById(id);
    }
}

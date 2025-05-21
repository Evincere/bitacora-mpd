package com.bitacora.application.taskrequest;

import com.bitacora.domain.model.taskrequest.TaskRequest;
import com.bitacora.domain.model.taskrequest.TaskRequestAttachment;
import com.bitacora.domain.port.repository.TaskRequestAttachmentRepository;
import com.bitacora.domain.port.repository.TaskRequestRepository;
import com.bitacora.infrastructure.config.FileStorageProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

/**
 * Servicio para gestionar los archivos adjuntos de las solicitudes de tareas.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TaskRequestAttachmentService {

        private final TaskRequestRepository taskRequestRepository;
        private final TaskRequestAttachmentRepository attachmentRepository;
        private final FileStorageProperties fileStorageProperties;

        /**
         * Sube archivos adjuntos para una solicitud de tarea.
         *
         * @param taskRequestId ID de la solicitud
         * @param userId        ID del usuario que sube los archivos
         * @param files         Archivos a subir
         * @return Lista de archivos adjuntos creados
         * @throws IOException Si ocurre un error al guardar los archivos
         */
        @Transactional
        public List<TaskRequestAttachment> uploadAttachments(Long taskRequestId, Long userId, List<MultipartFile> files)
                        throws IOException {
                log.info("Subiendo {} archivos adjuntos para la solicitud {}", files.size(), taskRequestId);

                // Verificar que la solicitud existe
                TaskRequest taskRequest = taskRequestRepository.findById(taskRequestId)
                                .orElseThrow(() -> new NoSuchElementException(
                                                "Solicitud no encontrada con ID: " + taskRequestId));

                // Validar el tamaño de los archivos
                for (MultipartFile file : files) {
                        if (file.getSize() > fileStorageProperties.getMaxFileSize()) {
                                String errorMsg = String.format(
                                                "El archivo '%s' excede el tamaño máximo permitido de %d bytes",
                                                file.getOriginalFilename(), fileStorageProperties.getMaxFileSize());
                                log.error(errorMsg);
                                throw new IllegalArgumentException(errorMsg);
                        }
                }

                // Crear el directorio de almacenamiento si no existe
                Path uploadDir = Paths
                                .get(fileStorageProperties.getUploadDir(), "task-requests", taskRequestId.toString())
                                .toAbsolutePath().normalize();
                Files.createDirectories(uploadDir);

                List<TaskRequestAttachment> attachments = new ArrayList<>();

                for (MultipartFile file : files) {
                        try {
                                // Generar un nombre único para el archivo
                                String originalFilename = file.getOriginalFilename();
                                String fileName = UUID.randomUUID() + "_"
                                                + (originalFilename != null ? originalFilename : "file");

                                // Guardar el archivo en el sistema de archivos
                                Path targetLocation = uploadDir.resolve(fileName);
                                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

                                // Crear el registro del archivo adjunto
                                TaskRequestAttachment attachment = TaskRequestAttachment.builder()
                                                .taskRequestId(taskRequestId)
                                                .userId(userId)
                                                .fileName(originalFilename != null ? originalFilename : "file")
                                                .fileType(file.getContentType())
                                                .filePath(targetLocation.toString())
                                                .fileSize(file.getSize())
                                                .uploadedAt(LocalDateTime.now())
                                                .build();

                                // Guardar el registro en la base de datos
                                TaskRequestAttachment savedAttachment = attachmentRepository.save(attachment);
                                attachments.add(savedAttachment);

                                // Añadir el adjunto a la solicitud
                                taskRequest.addAttachment(savedAttachment);
                        } catch (IOException e) {
                                log.error("Error al guardar el archivo: {}", e.getMessage(), e);
                                throw new IOException("Error al guardar el archivo: " + e.getMessage(), e);
                        }
                }

                // Actualizar la solicitud con los nuevos adjuntos
                taskRequestRepository.save(taskRequest);

                return attachments;
        }

        /**
         * Obtiene los archivos adjuntos de una solicitud.
         *
         * @param taskRequestId ID de la solicitud
         * @return Lista de archivos adjuntos
         */
        @Transactional(readOnly = true)
        public List<TaskRequestAttachment> getAttachments(Long taskRequestId) {
                log.info("Obteniendo archivos adjuntos para la solicitud {}", taskRequestId);
                return attachmentRepository.findByTaskRequestId(taskRequestId);
        }

        /**
         * Obtiene un archivo adjunto por su ID.
         *
         * @param attachmentId ID del archivo adjunto
         * @return El archivo adjunto
         * @throws NoSuchElementException Si no se encuentra el archivo adjunto
         */
        @Transactional(readOnly = true)
        public TaskRequestAttachment getAttachmentById(Long attachmentId) {
                log.info("Obteniendo archivo adjunto con ID {}", attachmentId);
                return attachmentRepository.findById(attachmentId)
                                .orElseThrow(() -> new NoSuchElementException(
                                                "Archivo adjunto no encontrado con ID: " + attachmentId));
        }

        /**
         * Sube archivos adjuntos para un comentario de una solicitud de tarea.
         *
         * @param taskRequestId ID de la solicitud
         * @param commentId     ID del comentario
         * @param userId        ID del usuario que sube los archivos
         * @param files         Archivos a subir
         * @return Lista de archivos adjuntos creados
         * @throws IOException Si ocurre un error al guardar los archivos
         */
        @Transactional
        public List<TaskRequestAttachment> uploadAttachmentsForComment(Long taskRequestId, Long commentId, Long userId,
                        List<MultipartFile> files)
                        throws IOException {
                log.info("Subiendo {} archivos adjuntos para el comentario {} de la solicitud {}",
                                files.size(), commentId, taskRequestId);

                // Verificar que la solicitud existe
                taskRequestRepository.findById(taskRequestId)
                                .orElseThrow(() -> new NoSuchElementException(
                                                "Solicitud no encontrada con ID: " + taskRequestId));

                // Validar el tamaño de los archivos
                for (MultipartFile file : files) {
                        if (file.getSize() > fileStorageProperties.getMaxFileSize()) {
                                String errorMsg = String.format(
                                                "El archivo '%s' excede el tamaño máximo permitido de %d bytes",
                                                file.getOriginalFilename(), fileStorageProperties.getMaxFileSize());
                                log.error(errorMsg);
                                throw new IllegalArgumentException(errorMsg);
                        }
                }

                // Crear el directorio de almacenamiento si no existe
                Path uploadDir = Paths
                                .get(fileStorageProperties.getUploadDir(), "task-requests", taskRequestId.toString(),
                                                "comments",
                                                commentId.toString())
                                .toAbsolutePath().normalize();
                Files.createDirectories(uploadDir);

                List<TaskRequestAttachment> attachments = new ArrayList<>();

                for (MultipartFile file : files) {
                        try {
                                // Generar un nombre único para el archivo
                                String originalFilename = file.getOriginalFilename();
                                String fileName = UUID.randomUUID() + "_"
                                                + (originalFilename != null ? originalFilename : "file");

                                // Guardar el archivo en el sistema de archivos
                                Path targetLocation = uploadDir.resolve(fileName);
                                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

                                // Crear el registro del archivo adjunto
                                TaskRequestAttachment attachment = TaskRequestAttachment.builder()
                                                .taskRequestId(taskRequestId)
                                                .userId(userId)
                                                .commentId(commentId) // Asociar el archivo al comentario
                                                .fileName(originalFilename != null ? originalFilename : "file")
                                                .fileType(file.getContentType())
                                                .filePath(targetLocation.toString())
                                                .fileSize(file.getSize())
                                                .uploadedAt(LocalDateTime.now())
                                                .build();

                                // Guardar el registro en la base de datos
                                TaskRequestAttachment savedAttachment = attachmentRepository.save(attachment);
                                attachments.add(savedAttachment);
                        } catch (IOException e) {
                                log.error("Error al guardar el archivo: {}", e.getMessage(), e);
                                throw new IOException("Error al guardar el archivo: " + e.getMessage(), e);
                        }
                }

                return attachments;
        }

        /**
         * Obtiene los archivos adjuntos de un comentario.
         *
         * @param commentId ID del comentario
         * @return Lista de archivos adjuntos
         */
        @Transactional(readOnly = true)
        public List<TaskRequestAttachment> getAttachmentsByCommentId(Long commentId) {
                log.info("Obteniendo archivos adjuntos para el comentario {}", commentId);
                return attachmentRepository.findByCommentId(commentId);
        }

        /**
         * Elimina un archivo adjunto.
         *
         * @param attachmentId ID del archivo adjunto
         * @param userId       ID del usuario que elimina el archivo
         * @throws IOException Si ocurre un error al eliminar el archivo
         */
        @Transactional
        public void deleteAttachment(Long attachmentId, Long userId) throws IOException {
                log.info("Eliminando archivo adjunto {} por el usuario {}", attachmentId, userId);

                // Verificar que el adjunto existe
                TaskRequestAttachment attachment = attachmentRepository.findById(attachmentId)
                                .orElseThrow(() -> new NoSuchElementException(
                                                "Archivo adjunto no encontrado con ID: " + attachmentId));

                // Verificar que el usuario tiene permiso para eliminar el archivo
                if (!attachment.getUserId().equals(userId)) {
                        throw new SecurityException("No tienes permiso para eliminar este archivo");
                }

                // Eliminar el archivo del sistema de archivos
                Path filePath = Paths.get(attachment.getFilePath());
                Files.deleteIfExists(filePath);

                // Eliminar el registro de la base de datos
                attachmentRepository.deleteById(attachmentId);
        }
}

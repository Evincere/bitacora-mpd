package com.bitacora.infrastructure.rest.controller;

import com.bitacora.application.taskrequest.TaskRequestAttachmentService;
import com.bitacora.application.taskrequest.dto.TaskRequestAttachmentDto;
import com.bitacora.application.taskrequest.mapper.TaskRequestAttachmentMapper;
import com.bitacora.domain.model.taskrequest.TaskRequestAttachment;
import com.bitacora.infrastructure.security.CurrentUser;
import com.bitacora.infrastructure.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

/**
 * Controlador REST para gestionar archivos adjuntos de solicitudes de tareas.
 */
@RestController
@RequestMapping("/api/task-requests")
@Tag(name = "Task Request Attachments", description = "API para gestionar archivos adjuntos de solicitudes de tareas")
@RequiredArgsConstructor
@Slf4j
public class TaskRequestAttachmentController {

    private final TaskRequestAttachmentService attachmentService;
    private final TaskRequestAttachmentMapper attachmentMapper;

    /**
     * Sube archivos adjuntos para una solicitud de tarea.
     *
     * @param taskRequestId ID de la solicitud
     * @param files         Archivos a subir
     * @param currentUser   Usuario actual
     * @return Lista de archivos adjuntos creados
     * @throws IOException Si ocurre un error al guardar los archivos
     */
    @PostMapping(value = "/{taskRequestId}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('SOLICITANTE', 'ASIGNADOR', 'EJECUTOR', 'ADMIN')")
    @Operation(summary = "Sube archivos adjuntos para una solicitud de tarea", description = "Sube uno o más archivos adjuntos para una solicitud de tarea existente")
    public ResponseEntity<List<TaskRequestAttachmentDto>> uploadAttachments(
            @PathVariable Long taskRequestId,
            @RequestParam("files") List<MultipartFile> files,
            @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) throws IOException {

        log.info("Subiendo {} archivos adjuntos para la solicitud {} por el usuario {}",
                files.size(), taskRequestId, currentUser.getId());

        List<TaskRequestAttachment> attachments = attachmentService.uploadAttachments(
                taskRequestId, currentUser.getId(), files);

        return ResponseEntity.ok(attachmentMapper.toDtoList(attachments));
    }

    /**
     * Obtiene los archivos adjuntos de una solicitud de tarea.
     *
     * @param taskRequestId ID de la solicitud
     * @return Lista de archivos adjuntos
     */
    @GetMapping("/{taskRequestId}/attachments")
    @PreAuthorize("hasAnyRole('SOLICITANTE', 'ASIGNADOR', 'EJECUTOR', 'ADMIN')")
    @Operation(summary = "Obtiene los archivos adjuntos de una solicitud de tarea", description = "Obtiene la lista de archivos adjuntos de una solicitud de tarea existente")
    public ResponseEntity<List<TaskRequestAttachmentDto>> getAttachments(@PathVariable Long taskRequestId) {
        log.info("Obteniendo archivos adjuntos para la solicitud {}", taskRequestId);

        List<TaskRequestAttachment> attachments = attachmentService.getAttachments(taskRequestId);

        return ResponseEntity.ok(attachmentMapper.toDtoList(attachments));
    }

    /**
     * Descarga un archivo adjunto.
     *
     * @param attachmentId ID del archivo adjunto
     * @return El archivo para descargar
     * @throws IOException Si ocurre un error al leer el archivo
     */
    @GetMapping("/attachments/{attachmentId}/download")
    @PreAuthorize("hasAnyRole('SOLICITANTE', 'ASIGNADOR', 'EJECUTOR', 'ADMIN')")
    @Operation(summary = "Descarga un archivo adjunto", description = "Descarga un archivo adjunto de una solicitud de tarea")
    public ResponseEntity<Resource> downloadAttachment(@PathVariable Long attachmentId) throws IOException {
        log.info("Descargando archivo adjunto {}", attachmentId);

        // Obtener el archivo adjunto
        TaskRequestAttachment attachment = attachmentService.getAttachmentById(attachmentId);

        // Crear un recurso a partir de la ruta del archivo
        Path filePath = Paths.get(attachment.getFilePath());
        Resource resource = new UrlResource(filePath.toUri());

        // Verificar que el archivo existe y es legible
        if (!resource.exists() || !resource.isReadable()) {
            throw new IOException("No se puede leer el archivo: " + attachment.getFileName());
        }

        // Determinar el tipo de contenido
        String contentType = attachment.getFileType();
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        // Configurar la respuesta para la descarga
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attachment.getFileName() + "\"")
                .body(resource);
    }

    /**
     * Elimina un archivo adjunto.
     *
     * @param taskRequestId ID de la solicitud
     * @param attachmentId  ID del archivo adjunto
     * @param currentUser   Usuario actual
     * @return Respuesta vacía
     * @throws IOException Si ocurre un error al eliminar el archivo
     */
    @DeleteMapping("/{taskRequestId}/attachments/{attachmentId}")
    @PreAuthorize("hasAnyRole('SOLICITANTE', 'ASIGNADOR', 'EJECUTOR', 'ADMIN')")
    @Operation(summary = "Elimina un archivo adjunto", description = "Elimina un archivo adjunto de una solicitud de tarea existente")
    public ResponseEntity<Void> deleteAttachment(
            @PathVariable Long taskRequestId,
            @PathVariable Long attachmentId,
            @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) throws IOException {

        log.info("Eliminando archivo adjunto {} de la solicitud {} por el usuario {}",
                attachmentId, taskRequestId, currentUser.getId());

        attachmentService.deleteAttachment(attachmentId, currentUser.getId());

        return ResponseEntity.noContent().build();
    }
}

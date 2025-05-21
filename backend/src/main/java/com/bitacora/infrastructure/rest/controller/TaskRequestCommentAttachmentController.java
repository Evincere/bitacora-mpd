package com.bitacora.infrastructure.rest.controller;

import com.bitacora.application.taskrequest.TaskRequestAttachmentService;
import com.bitacora.application.taskrequest.TaskRequestCommentService;
import com.bitacora.application.taskrequest.dto.TaskRequestCommentDto;
import com.bitacora.application.taskrequest.mapper.TaskRequestAttachmentMapper;
import com.bitacora.application.taskrequest.mapper.TaskRequestCommentMapper;
import com.bitacora.domain.model.taskrequest.TaskRequestAttachment;
import com.bitacora.domain.model.taskrequest.TaskRequestComment;
import com.bitacora.infrastructure.security.CurrentUser;
import com.bitacora.infrastructure.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * Controlador REST para gestionar comentarios con archivos adjuntos en
 * solicitudes de tareas.
 */
@RestController
@RequestMapping("/api/task-requests")
@Tag(name = "Task Request Comments with Attachments", description = "API para gestionar comentarios con archivos adjuntos en solicitudes de tareas")
@RequiredArgsConstructor
@Slf4j
public class TaskRequestCommentAttachmentController {

        private final TaskRequestAttachmentService attachmentService;
        private final TaskRequestCommentService commentService;
        private final TaskRequestCommentMapper commentMapper;
        private final TaskRequestAttachmentMapper attachmentMapper;

        /**
         * Añade un comentario con archivos adjuntos a una solicitud de tarea.
         *
         * @param taskRequestId ID de la solicitud
         * @param content       Contenido del comentario
         * @param files         Archivos adjuntos
         * @param currentUser   Usuario actual
         * @return El comentario creado con sus archivos adjuntos
         * @throws IOException Si ocurre un error al guardar los archivos
         */
        @PostMapping(value = "/comments/with-attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        @PreAuthorize("hasAnyRole('SOLICITANTE', 'ASIGNADOR', 'EJECUTOR', 'ADMIN')")
        @Operation(summary = "Añade un comentario con archivos adjuntos a una solicitud de tarea", description = "Añade un comentario con uno o más archivos adjuntos a una solicitud de tarea existente")
        public ResponseEntity<TaskRequestCommentDto> addCommentWithAttachments(
                        @RequestParam Long taskRequestId,
                        @RequestParam String content,
                        @RequestParam List<MultipartFile> files,
                        @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) throws IOException {

                log.info("Añadiendo comentario con {} archivos adjuntos a la solicitud {} por el usuario {}",
                                files.size(), taskRequestId, currentUser.getId());

                // Crear el comentario
                TaskRequestComment comment = commentService.createComment(
                                taskRequestId,
                                currentUser.getId(),
                                currentUser.getUsername(),
                                content);

                // Subir los archivos adjuntos y asociarlos al comentario
                List<TaskRequestAttachment> attachments = attachmentService.uploadAttachmentsForComment(
                                taskRequestId,
                                comment.getId(),
                                currentUser.getId(),
                                files);

                // Mapear el comentario a DTO incluyendo los archivos adjuntos
                TaskRequestCommentDto commentDto = commentMapper.toDto(comment);
                commentDto.setAttachments(attachmentMapper.toDtoList(attachments));

                return ResponseEntity.ok(commentDto);
        }
}

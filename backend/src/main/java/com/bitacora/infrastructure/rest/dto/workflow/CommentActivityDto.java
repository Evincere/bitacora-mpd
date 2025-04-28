package com.bitacora.infrastructure.rest.dto.workflow;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para agregar un comentario a una actividad.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos para agregar un comentario a una actividad")
public class CommentActivityDto {
    
    @NotBlank(message = "El comentario no puede estar vacío")
    @Schema(description = "Texto del comentario", example = "¿Cuándo estará lista esta tarea?", required = true)
    private String comment;
    
    @Schema(description = "Visibilidad del comentario (público o privado)", example = "PUBLIC")
    private String visibility;
}

package com.bitacora.infrastructure.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO para solicitudes de comentarios.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequestDTO {

    /**
     * Texto del comentario.
     */
    @NotBlank(message = "El comentario es obligatorio")
    @Size(max = 500, message = "El comentario no puede tener más de 500 caracteres")
    private String comment;
}

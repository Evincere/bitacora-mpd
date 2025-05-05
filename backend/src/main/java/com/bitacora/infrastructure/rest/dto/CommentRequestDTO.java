package com.bitacora.infrastructure.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

/**
 * DTO para solicitudes de comentarios.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequestDTO {

    /**
     * Contenido del comentario.
     */
    @NotBlank(message = "El contenido del comentario es obligatorio")
    @Size(max = 500, message = "El comentario no puede tener más de 500 caracteres")
    private String content;

    /**
     * Lista de IDs de usuarios mencionados en el comentario.
     */
    private List<Long> mentions;
}

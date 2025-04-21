package com.bitacora.infrastructure.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO para solicitudes de anuncios.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementRequestDTO {

    /**
     * Título del anuncio.
     */
    @NotBlank(message = "El título es obligatorio")
    @Size(max = 100, message = "El título no puede tener más de 100 caracteres")
    private String title;

    /**
     * Mensaje del anuncio.
     */
    @NotBlank(message = "El mensaje es obligatorio")
    @Size(max = 1000, message = "El mensaje no puede tener más de 1000 caracteres")
    private String message;

    /**
     * Departamento destinatario (opcional).
     */
    private String department;
}

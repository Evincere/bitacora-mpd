package com.bitacora.infrastructure.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO para solicitudes de anuncios de eventos.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventAnnouncementRequestDTO {

    /**
     * Título del evento.
     */
    @NotBlank(message = "El título es obligatorio")
    @Size(max = 100, message = "El título no puede tener más de 100 caracteres")
    private String title;

    /**
     * Descripción del evento.
     */
    @NotBlank(message = "El mensaje es obligatorio")
    @Size(max = 1000, message = "El mensaje no puede tener más de 1000 caracteres")
    private String message;

    /**
     * Fecha del evento en milisegundos desde la época Unix.
     */
    @NotNull(message = "La fecha del evento es obligatoria")
    private Long eventDate;

    /**
     * Ubicación del evento.
     */
    @NotBlank(message = "La ubicación es obligatoria")
    @Size(max = 200, message = "La ubicación no puede tener más de 200 caracteres")
    private String location;

    /**
     * Departamento destinatario (opcional).
     */
    private String department;
}

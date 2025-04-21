package com.bitacora.infrastructure.rest.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para transferir información de actividades entre la API y los clientes.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Información de una actividad")
public class ActivityDto {
    
    @Schema(description = "ID de la actividad", example = "1")
    private Long id;
    
    @NotNull(message = "La fecha no puede ser nula")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Schema(description = "Fecha de la actividad", example = "2023-04-15T10:30:00")
    private LocalDateTime date;
    
    @NotBlank(message = "El tipo no puede estar vacío")
    @Size(max = 50, message = "El tipo no puede tener más de 50 caracteres")
    @Schema(description = "Tipo de actividad", example = "REUNION")
    private String type;
    
    @NotBlank(message = "La descripción no puede estar vacía")
    @Schema(description = "Descripción de la actividad", example = "Reunión con el equipo de desarrollo")
    private String description;
    
    @Schema(description = "Persona relacionada con la actividad", example = "Juan Pérez")
    private String person;
    
    @Schema(description = "Rol de la persona", example = "Coordinador")
    private String role;
    
    @Schema(description = "Dependencia relacionada", example = "Dirección de Sistemas")
    private String dependency;
    
    @Schema(description = "Situación o contexto", example = "Planificación del sprint")
    private String situation;
    
    @Schema(description = "Resultado de la actividad", example = "Se definieron las tareas para el próximo sprint")
    private String result;
    
    @NotBlank(message = "El estado no puede estar vacío")
    @Size(max = 20, message = "El estado no puede tener más de 20 caracteres")
    @Schema(description = "Estado de la actividad", example = "COMPLETADA")
    private String status;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Schema(description = "Fecha del último cambio de estado", example = "2023-04-16T15:45:00")
    private LocalDateTime lastStatusChangeDate;
    
    @Schema(description = "Comentarios adicionales", example = "La reunión fue productiva")
    private String comments;
    
    @Schema(description = "Agente o responsable", example = "María López")
    private String agent;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Schema(description = "Fecha de creación", example = "2023-04-15T10:00:00")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Schema(description = "Fecha de última actualización", example = "2023-04-16T16:00:00")
    private LocalDateTime updatedAt;
    
    @NotNull(message = "El ID del usuario no puede ser nulo")
    @Schema(description = "ID del usuario que creó la actividad", example = "1")
    private Long userId;
}

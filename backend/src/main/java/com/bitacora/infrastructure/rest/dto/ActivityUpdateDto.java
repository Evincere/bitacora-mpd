package com.bitacora.infrastructure.rest.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para actualizar una actividad existente.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos para actualizar una actividad existente")
public class ActivityUpdateDto {
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Schema(description = "Fecha de la actividad", example = "2023-04-15T10:30:00")
    private LocalDateTime date;
    
    @Size(max = 50, message = "El tipo no puede tener más de 50 caracteres")
    @Schema(description = "Tipo de actividad", example = "REUNION")
    private String type;
    
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
    
    @Size(max = 20, message = "El estado no puede tener más de 20 caracteres")
    @Schema(description = "Estado de la actividad", example = "COMPLETADA")
    private String status;
    
    @Schema(description = "Comentarios adicionales", example = "La reunión fue productiva")
    private String comments;
    
    @Schema(description = "Agente o responsable", example = "María López")
    private String agent;
}

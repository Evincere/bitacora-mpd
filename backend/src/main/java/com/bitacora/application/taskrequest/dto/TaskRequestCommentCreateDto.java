package com.bitacora.application.taskrequest.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO para recibir datos de creación de comentarios en solicitudes de tareas.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskRequestCommentCreateDto {
    
    @NotNull(message = "El ID de la solicitud no puede ser nulo")
    private Long taskRequestId;
    
    @NotBlank(message = "El contenido no puede estar vacío")
    @Size(max = 1000, message = "El contenido no puede tener más de 1000 caracteres")
    private String content;

    // Constructor por defecto
    public TaskRequestCommentCreateDto() {
    }

    // Constructor con builder
    private TaskRequestCommentCreateDto(Builder builder) {
        this.taskRequestId = builder.taskRequestId;
        this.content = builder.content;
    }

    // Getters
    public Long getTaskRequestId() {
        return taskRequestId;
    }

    public String getContent() {
        return content;
    }

    // Builder
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long taskRequestId;
        private String content;

        private Builder() {
        }

        public Builder taskRequestId(Long taskRequestId) {
            this.taskRequestId = taskRequestId;
            return this;
        }

        public Builder content(String content) {
            this.content = content;
            return this;
        }

        public TaskRequestCommentCreateDto build() {
            return new TaskRequestCommentCreateDto(this);
        }
    }
}

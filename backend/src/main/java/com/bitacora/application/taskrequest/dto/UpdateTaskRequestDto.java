package com.bitacora.application.taskrequest.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

/**
 * DTO para recibir datos de actualización de solicitudes de tareas.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UpdateTaskRequestDto {
    
    @Size(max = 255, message = "El título no puede tener más de 255 caracteres")
    private String title;
    
    @Size(max = 2000, message = "La descripción no puede tener más de 2000 caracteres")
    private String description;
    
    private Long categoryId;
    
    private String priority;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dueDate;
    
    @Size(max = 1000, message = "Las notas no pueden tener más de 1000 caracteres")
    private String notes;
    
    private boolean submit;

    // Constructor por defecto
    public UpdateTaskRequestDto() {
    }

    // Constructor con builder
    private UpdateTaskRequestDto(Builder builder) {
        this.title = builder.title;
        this.description = builder.description;
        this.categoryId = builder.categoryId;
        this.priority = builder.priority;
        this.dueDate = builder.dueDate;
        this.notes = builder.notes;
        this.submit = builder.submit;
    }

    // Getters
    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getPriority() {
        return priority;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public String getNotes() {
        return notes;
    }

    public boolean isSubmit() {
        return submit;
    }

    // Builder
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String title;
        private String description;
        private Long categoryId;
        private String priority;
        private LocalDateTime dueDate;
        private String notes;
        private boolean submit;

        private Builder() {
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder categoryId(Long categoryId) {
            this.categoryId = categoryId;
            return this;
        }

        public Builder priority(String priority) {
            this.priority = priority;
            return this;
        }

        public Builder dueDate(LocalDateTime dueDate) {
            this.dueDate = dueDate;
            return this;
        }

        public Builder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public Builder submit(boolean submit) {
            this.submit = submit;
            return this;
        }

        public UpdateTaskRequestDto build() {
            return new UpdateTaskRequestDto(this);
        }
    }
}

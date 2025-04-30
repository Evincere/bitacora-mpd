package com.bitacora.application.taskrequest.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * DTO para transferir información de categorías de solicitudes de tareas entre capas.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskRequestCategoryDto {
    private Long id;
    private String name;
    private String description;
    private String color;
    private boolean isDefault;

    // Constructor por defecto
    public TaskRequestCategoryDto() {
    }

    // Constructor con builder
    private TaskRequestCategoryDto(Builder builder) {
        this.id = builder.id;
        this.name = builder.name;
        this.description = builder.description;
        this.color = builder.color;
        this.isDefault = builder.isDefault;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getColor() {
        return color;
    }

    public boolean isDefault() {
        return isDefault;
    }

    // Builder
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private String description;
        private String color;
        private boolean isDefault;

        private Builder() {
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder color(String color) {
            this.color = color;
            return this;
        }

        public Builder isDefault(boolean isDefault) {
            this.isDefault = isDefault;
            return this;
        }

        public TaskRequestCategoryDto build() {
            return new TaskRequestCategoryDto(this);
        }
    }
}

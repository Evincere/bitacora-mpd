package com.bitacora.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Entidad JPA para representar una categoría de solicitud de tarea en la base de datos.
 */
@Entity
@Table(name = "task_request_categories")
public class TaskRequestCategoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "color", nullable = false, length = 7)
    private String color;

    @Column(name = "is_default", nullable = false)
    private boolean isDefault;

    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime updatedAt;

    @Column(name = "creator_id")
    private Long creatorId;

    /**
     * Constructor por defecto requerido por JPA.
     */
    public TaskRequestCategoryEntity() {
    }

    /**
     * Constructor con builder.
     */
    private TaskRequestCategoryEntity(Builder builder) {
        this.id = builder.id;
        this.name = builder.name;
        this.description = builder.description;
        this.color = builder.color;
        this.isDefault = builder.isDefault;
        this.createdAt = builder.createdAt != null ? builder.createdAt : LocalDateTime.now();
        this.updatedAt = builder.updatedAt;
        this.creatorId = builder.creatorId;
    }

    // Getters y setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault(boolean isDefault) {
        this.isDefault = isDefault;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TaskRequestCategoryEntity that = (TaskRequestCategoryEntity) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "TaskRequestCategoryEntity{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", color='" + color + '\'' +
                ", isDefault=" + isDefault +
                '}';
    }

    /**
     * Builder para crear instancias de TaskRequestCategoryEntity.
     */
    public static class Builder {
        private Long id;
        private String name;
        private String description;
        private String color;
        private boolean isDefault;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private Long creatorId;

        private Builder() {
        }

        public static Builder builder() {
            return new Builder();
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

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public Builder creatorId(Long creatorId) {
            this.creatorId = creatorId;
            return this;
        }

        public TaskRequestCategoryEntity build() {
            return new TaskRequestCategoryEntity(this);
        }
    }
}

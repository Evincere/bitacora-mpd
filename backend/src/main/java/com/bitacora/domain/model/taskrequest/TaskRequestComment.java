package com.bitacora.domain.model.taskrequest;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Representa un comentario en una solicitud de tarea.
 */
public class TaskRequestComment {
    private Long id;
    private Long taskRequestId;
    private Long userId;
    private String content;
    private LocalDateTime createdAt;

    /**
     * Constructor privado para el patrón Builder.
     */
    private TaskRequestComment() {
    }

    /**
     * Crea una nueva instancia de TaskRequestComment utilizando el patrón Builder.
     *
     * @return Un nuevo builder para TaskRequestComment
     */
    public static Builder builder() {
        return new Builder();
    }

    /**
     * Obtiene el identificador único del comentario.
     *
     * @return El identificador único
     */
    public Long getId() {
        return id;
    }

    /**
     * Obtiene el identificador de la solicitud a la que pertenece este comentario.
     *
     * @return El identificador de la solicitud
     */
    public Long getTaskRequestId() {
        return taskRequestId;
    }

    /**
     * Obtiene el identificador del usuario que creó el comentario.
     *
     * @return El identificador del usuario
     */
    public Long getUserId() {
        return userId;
    }

    /**
     * Obtiene el contenido del comentario.
     *
     * @return El contenido
     */
    public String getContent() {
        return content;
    }

    /**
     * Obtiene la fecha y hora de creación del comentario.
     *
     * @return La fecha y hora de creación
     */
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    @Override
    public boolean equals(final Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        
        final TaskRequestComment that = (TaskRequestComment) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "TaskRequestComment{" +
                "id=" + id +
                ", taskRequestId=" + taskRequestId +
                ", userId=" + userId +
                ", createdAt=" + createdAt +
                '}';
    }

    /**
     * Builder para crear instancias de TaskRequestComment.
     */
    public static class Builder {
        private final TaskRequestComment instance = new TaskRequestComment();

        private Builder() {
        }

        public Builder id(final Long id) {
            instance.id = id;
            return this;
        }

        public Builder taskRequestId(final Long taskRequestId) {
            instance.taskRequestId = taskRequestId;
            return this;
        }

        public Builder userId(final Long userId) {
            instance.userId = userId;
            return this;
        }

        public Builder content(final String content) {
            instance.content = content;
            return this;
        }

        public Builder createdAt(final LocalDateTime createdAt) {
            instance.createdAt = createdAt;
            return this;
        }

        public TaskRequestComment build() {
            // Validaciones básicas
            if (instance.content == null || instance.content.trim().isEmpty()) {
                throw new IllegalArgumentException("El contenido no puede estar vacío");
            }
            
            if (instance.userId == null) {
                throw new IllegalArgumentException("El identificador del usuario no puede ser nulo");
            }
            
            if (instance.createdAt == null) {
                instance.createdAt = LocalDateTime.now();
            }
            
            return instance;
        }
    }
}

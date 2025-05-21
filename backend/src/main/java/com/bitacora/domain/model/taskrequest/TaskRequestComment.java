package com.bitacora.domain.model.taskrequest;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Representa un comentario en una solicitud de tarea.
 */
public class TaskRequestComment {
    private Long id;
    private Long taskRequestId;
    private Long userId;
    private String userName;
    private String content;
    private LocalDateTime createdAt;
    private Set<Long> readBy = new HashSet<>();
    private Set<Long> mentions = new HashSet<>();

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
     * Obtiene el nombre de usuario que creó el comentario.
     *
     * @return El nombre de usuario
     */
    public String getUserName() {
        return userName;
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

    /**
     * Obtiene el conjunto de IDs de usuarios que han leído el comentario.
     *
     * @return Conjunto de IDs de usuarios
     */
    public Set<Long> getReadBy() {
        return new HashSet<>(readBy);
    }

    /**
     * Marca el comentario como leído por un usuario.
     *
     * @param userId ID del usuario que ha leído el comentario
     * @return true si el usuario se añadió a la lista de lectores, false si ya
     *         estaba en la lista
     */
    public boolean markAsReadBy(Long userId) {
        return this.readBy.add(userId);
    }

    /**
     * Verifica si un usuario ha leído el comentario.
     *
     * @param userId ID del usuario
     * @return true si el usuario ha leído el comentario, false en caso contrario
     */
    public boolean isReadBy(Long userId) {
        return this.readBy.contains(userId);
    }

    /**
     * Obtiene el conjunto de IDs de usuarios mencionados en el comentario.
     *
     * @return Conjunto de IDs de usuarios mencionados
     */
    public Set<Long> getMentions() {
        return new HashSet<>(mentions);
    }

    /**
     * Añade una mención a un usuario en el comentario.
     *
     * @param userId ID del usuario mencionado
     * @return true si el usuario se añadió a la lista de menciones, false si ya
     *         estaba en la lista
     */
    public boolean addMention(Long userId) {
        return this.mentions.add(userId);
    }

    /**
     * Verifica si un usuario está mencionado en el comentario.
     *
     * @param userId ID del usuario
     * @return true si el usuario está mencionado en el comentario, false en caso
     *         contrario
     */
    public boolean isMentioned(Long userId) {
        return this.mentions.contains(userId);
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
                ", userName='" + userName + '\'' +
                ", createdAt=" + createdAt +
                ", readByCount=" + (readBy != null ? readBy.size() : 0) +
                ", mentionsCount=" + (mentions != null ? mentions.size() : 0) +
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

        public Builder userName(final String userName) {
            instance.userName = userName;
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

        public Builder readBy(final Set<Long> readBy) {
            if (readBy != null) {
                instance.readBy = new HashSet<>(readBy);
            }
            return this;
        }

        public Builder mentions(final Set<Long> mentions) {
            if (mentions != null) {
                instance.mentions = new HashSet<>(mentions);
            }
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

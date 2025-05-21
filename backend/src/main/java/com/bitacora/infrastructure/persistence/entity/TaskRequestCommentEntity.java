package com.bitacora.infrastructure.persistence.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Entidad JPA para representar un comentario de solicitud de tarea en la base
 * de datos.
 */
@Entity
@Table(name = "task_request_comments")
public class TaskRequestCommentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_request_id", nullable = false)
    private TaskRequestEntity taskRequest;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "content", nullable = false, length = 1000)
    private String content;

    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime createdAt;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "task_request_comment_read_by", joinColumns = @JoinColumn(name = "comment_id"))
    @Column(name = "user_id")
    private Set<Long> readBy = new HashSet<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "task_request_comment_mentions", joinColumns = @JoinColumn(name = "comment_id"))
    @Column(name = "user_id")
    private Set<Long> mentions = new HashSet<>();

    /**
     * Constructor por defecto requerido por JPA.
     */
    public TaskRequestCommentEntity() {
    }

    /**
     * Constructor con builder.
     */
    private TaskRequestCommentEntity(Builder builder) {
        this.id = builder.id;
        this.taskRequest = builder.taskRequest;
        this.userId = builder.userId;
        this.userName = builder.userName;
        this.content = builder.content;
        this.createdAt = builder.createdAt != null ? builder.createdAt : LocalDateTime.now();
        if (builder.readBy != null) {
            this.readBy = builder.readBy;
        }
        if (builder.mentions != null) {
            this.mentions = builder.mentions;
        }
    }

    // Getters y setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TaskRequestEntity getTaskRequest() {
        return taskRequest;
    }

    public void setTaskRequest(TaskRequestEntity taskRequest) {
        this.taskRequest = taskRequest;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Set<Long> getReadBy() {
        return readBy;
    }

    public void setReadBy(Set<Long> readBy) {
        this.readBy = readBy;
    }

    public Set<Long> getMentions() {
        return mentions;
    }

    public void setMentions(Set<Long> mentions) {
        this.mentions = mentions;
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

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        TaskRequestCommentEntity that = (TaskRequestCommentEntity) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "TaskRequestCommentEntity{" +
                "id=" + id +
                ", taskRequestId=" + (taskRequest != null ? taskRequest.getId() : null) +
                ", userId=" + userId +
                ", userName='" + userName + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }

    /**
     * Builder para crear instancias de TaskRequestCommentEntity.
     */
    public static class Builder {
        private Long id;
        private TaskRequestEntity taskRequest;
        private Long userId;
        private String userName;
        private String content;
        private LocalDateTime createdAt;
        private Set<Long> readBy;
        private Set<Long> mentions;

        private Builder() {
        }

        public static Builder builder() {
            return new Builder();
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder taskRequest(TaskRequestEntity taskRequest) {
            this.taskRequest = taskRequest;
            return this;
        }

        public Builder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public Builder userName(String userName) {
            this.userName = userName;
            return this;
        }

        public Builder content(String content) {
            this.content = content;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder readBy(Set<Long> readBy) {
            this.readBy = readBy;
            return this;
        }

        public Builder mentions(Set<Long> mentions) {
            this.mentions = mentions;
            return this;
        }

        public TaskRequestCommentEntity build() {
            return new TaskRequestCommentEntity(this);
        }
    }
}

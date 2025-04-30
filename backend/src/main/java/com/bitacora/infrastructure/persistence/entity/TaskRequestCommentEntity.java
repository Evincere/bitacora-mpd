package com.bitacora.infrastructure.persistence.entity;

import jakarta.persistence.Column;
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
import java.util.Objects;

/**
 * Entidad JPA para representar un comentario de solicitud de tarea en la base de datos.
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

    @Column(name = "content", nullable = false, length = 1000)
    private String content;

    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime createdAt;

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
        this.content = builder.content;
        this.createdAt = builder.createdAt != null ? builder.createdAt : LocalDateTime.now();
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
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
        private String content;
        private LocalDateTime createdAt;

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

        public Builder content(String content) {
            this.content = content;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public TaskRequestCommentEntity build() {
            return new TaskRequestCommentEntity(this);
        }
    }
}

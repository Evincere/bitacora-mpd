package com.bitacora.application.taskrequest.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * DTO para transferir información de comentarios de solicitudes de tareas entre
 * capas,
 * incluyendo información sobre quién ha leído el comentario.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskRequestCommentWithReadStatusDto {
    private Long id;
    private Long taskRequestId;
    private Long userId;
    private String userName;
    private String userFullName;
    private String userEmail;
    private String content;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    private Set<Long> readBy;
    private boolean readByCurrentUser;
    private Set<Long> mentions;

    // Constructor por defecto
    public TaskRequestCommentWithReadStatusDto() {
    }

    // Constructor con builder
    private TaskRequestCommentWithReadStatusDto(Builder builder) {
        this.id = builder.id;
        this.taskRequestId = builder.taskRequestId;
        this.userId = builder.userId;
        this.userName = builder.userName;
        this.userFullName = builder.userFullName;
        this.userEmail = builder.userEmail;
        this.content = builder.content;
        this.createdAt = builder.createdAt;
        this.readBy = builder.readBy;
        this.readByCurrentUser = builder.readByCurrentUser;
        this.mentions = builder.mentions;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public Long getTaskRequestId() {
        return taskRequestId;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public String getUserFullName() {
        return userFullName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Set<Long> getReadBy() {
        return readBy;
    }

    public boolean isReadByCurrentUser() {
        return readByCurrentUser;
    }

    public Set<Long> getMentions() {
        return mentions;
    }

    /**
     * Builder para crear instancias de TaskRequestCommentWithReadStatusDto.
     */
    public static class Builder {
        private Long id;
        private Long taskRequestId;
        private Long userId;
        private String userName;
        private String userFullName;
        private String userEmail;
        private String content;
        private LocalDateTime createdAt;
        private Set<Long> readBy;
        private boolean readByCurrentUser;
        private Set<Long> mentions;

        public Builder() {
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder taskRequestId(Long taskRequestId) {
            this.taskRequestId = taskRequestId;
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

        public Builder userFullName(String userFullName) {
            this.userFullName = userFullName;
            return this;
        }

        public Builder userEmail(String userEmail) {
            this.userEmail = userEmail;
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

        public Builder readByCurrentUser(boolean readByCurrentUser) {
            this.readByCurrentUser = readByCurrentUser;
            return this;
        }

        public Builder mentions(Set<Long> mentions) {
            this.mentions = mentions;
            return this;
        }

        public TaskRequestCommentWithReadStatusDto build() {
            return new TaskRequestCommentWithReadStatusDto(this);
        }
    }

    /**
     * Crea un nuevo builder para TaskRequestCommentWithReadStatusDto.
     *
     * @return Un nuevo builder
     */
    public static Builder builder() {
        return new Builder();
    }
}

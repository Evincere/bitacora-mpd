package com.bitacora.application.taskrequest.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

/**
 * DTO para transferir información de comentarios de solicitudes de tareas entre
 * capas.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskRequestCommentDto {
    private Long id;
    private Long taskRequestId;
    private Long userId;
    private String userName;
    private String content;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    private Set<Long> mentions;

    private List<TaskRequestAttachmentDto> attachments;

    // Constructor por defecto
    public TaskRequestCommentDto() {
    }

    // Constructor con builder
    private TaskRequestCommentDto(Builder builder) {
        this.id = builder.id;
        this.taskRequestId = builder.taskRequestId;
        this.userId = builder.userId;
        this.userName = builder.userName;
        this.content = builder.content;
        this.createdAt = builder.createdAt;
        this.mentions = builder.mentions;
        this.attachments = builder.attachments;
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

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Set<Long> getMentions() {
        return mentions;
    }

    public List<TaskRequestAttachmentDto> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<TaskRequestAttachmentDto> attachments) {
        this.attachments = attachments;
    }

    // Builder
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long taskRequestId;
        private Long userId;
        private String userName;
        private String content;
        private LocalDateTime createdAt;
        private Set<Long> mentions;
        private List<TaskRequestAttachmentDto> attachments;

        private Builder() {
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

        public Builder content(String content) {
            this.content = content;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder mentions(Set<Long> mentions) {
            this.mentions = mentions;
            return this;
        }

        public Builder attachments(List<TaskRequestAttachmentDto> attachments) {
            this.attachments = attachments;
            return this;
        }

        public TaskRequestCommentDto build() {
            return new TaskRequestCommentDto(this);
        }
    }
}

package com.bitacora.application.taskrequest.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para transferir información de solicitudes de tareas entre capas.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskRequestDto {
    private Long id;
    private String title;
    private String description;
    private TaskRequestCategoryDto category;
    private String priority;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dueDate;

    private String status;
    private Long requesterId;
    private String requesterName;
    private Long assignerId;
    private String assignerName;
    private Long executorId;
    private String executorName;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime requestDate;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime assignmentDate;

    private String notes;
    private List<TaskRequestAttachmentDto> attachments;
    private List<TaskRequestCommentDto> comments;

    // Constructor por defecto
    public TaskRequestDto() {
    }

    // Constructor con builder
    private TaskRequestDto(Builder builder) {
        this.id = builder.id;
        this.title = builder.title;
        this.description = builder.description;
        this.category = builder.category;
        this.priority = builder.priority;
        this.dueDate = builder.dueDate;
        this.status = builder.status;
        this.requesterId = builder.requesterId;
        this.requesterName = builder.requesterName;
        this.assignerId = builder.assignerId;
        this.assignerName = builder.assignerName;
        this.executorId = builder.executorId;
        this.executorName = builder.executorName;
        this.requestDate = builder.requestDate;
        this.assignmentDate = builder.assignmentDate;
        this.notes = builder.notes;
        this.attachments = builder.attachments;
        this.comments = builder.comments;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public TaskRequestCategoryDto getCategory() {
        return category;
    }

    public String getPriority() {
        return priority;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public String getStatus() {
        return status;
    }

    public Long getRequesterId() {
        return requesterId;
    }

    public String getRequesterName() {
        return requesterName;
    }

    public Long getAssignerId() {
        return assignerId;
    }

    public String getAssignerName() {
        return assignerName;
    }

    public Long getExecutorId() {
        return executorId;
    }

    public String getExecutorName() {
        return executorName;
    }

    public LocalDateTime getRequestDate() {
        return requestDate;
    }

    public LocalDateTime getAssignmentDate() {
        return assignmentDate;
    }

    public String getNotes() {
        return notes;
    }

    public List<TaskRequestAttachmentDto> getAttachments() {
        return attachments;
    }

    public List<TaskRequestCommentDto> getComments() {
        return comments;
    }

    // Builder
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String title;
        private String description;
        private TaskRequestCategoryDto category;
        private String priority;
        private LocalDateTime dueDate;
        private String status;
        private Long requesterId;
        private String requesterName;
        private Long assignerId;
        private String assignerName;
        private Long executorId;
        private String executorName;
        private LocalDateTime requestDate;
        private LocalDateTime assignmentDate;
        private String notes;
        private List<TaskRequestAttachmentDto> attachments;
        private List<TaskRequestCommentDto> comments;

        private Builder() {
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder category(TaskRequestCategoryDto category) {
            this.category = category;
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

        public Builder status(String status) {
            this.status = status;
            return this;
        }

        public Builder requesterId(Long requesterId) {
            this.requesterId = requesterId;
            return this;
        }

        public Builder requesterName(String requesterName) {
            this.requesterName = requesterName;
            return this;
        }

        public Builder assignerId(Long assignerId) {
            this.assignerId = assignerId;
            return this;
        }

        public Builder assignerName(String assignerName) {
            this.assignerName = assignerName;
            return this;
        }

        public Builder executorId(Long executorId) {
            this.executorId = executorId;
            return this;
        }

        public Builder executorName(String executorName) {
            this.executorName = executorName;
            return this;
        }

        public Builder requestDate(LocalDateTime requestDate) {
            this.requestDate = requestDate;
            return this;
        }

        public Builder assignmentDate(LocalDateTime assignmentDate) {
            this.assignmentDate = assignmentDate;
            return this;
        }

        public Builder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public Builder attachments(List<TaskRequestAttachmentDto> attachments) {
            this.attachments = attachments;
            return this;
        }

        public Builder comments(List<TaskRequestCommentDto> comments) {
            this.comments = comments;
            return this;
        }

        public TaskRequestDto build() {
            return new TaskRequestDto(this);
        }
    }
}

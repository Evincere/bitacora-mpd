package com.bitacora.infrastructure.persistence.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Entidad JPA para representar una solicitud de tarea en la base de datos.
 */
@Entity
@Table(name = "task_requests")
public class TaskRequestEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", nullable = false, length = 2000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private TaskRequestCategoryEntity category;

    @Column(name = "priority", nullable = false)
    @Enumerated(EnumType.STRING)
    private TaskRequestPriorityEntity priority;

    @Column(name = "due_date")
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime dueDate;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private TaskRequestStatusEntity status;

    @Column(name = "requester_id", nullable = false)
    private Long requesterId;

    @Column(name = "assigner_id")
    private Long assignerId;

    @Column(name = "request_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime requestDate;

    @Column(name = "assignment_date")
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime assignmentDate;

    @Column(name = "notes", length = 1000)
    private String notes;

    @OneToMany(mappedBy = "taskRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TaskRequestAttachmentEntity> attachments = new ArrayList<>();

    @OneToMany(mappedBy = "taskRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TaskRequestCommentEntity> comments = new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime updatedAt;

    /**
     * Constructor por defecto requerido por JPA.
     */
    public TaskRequestEntity() {
    }

    /**
     * Constructor con builder.
     */
    private TaskRequestEntity(Builder builder) {
        this.id = builder.id;
        this.title = builder.title;
        this.description = builder.description;
        this.category = builder.category;
        this.priority = builder.priority;
        this.dueDate = builder.dueDate;
        this.status = builder.status;
        this.requesterId = builder.requesterId;
        this.assignerId = builder.assignerId;
        this.requestDate = builder.requestDate;
        this.assignmentDate = builder.assignmentDate;
        this.notes = builder.notes;
        this.attachments = builder.attachments != null ? builder.attachments : new ArrayList<>();
        this.comments = builder.comments != null ? builder.comments : new ArrayList<>();
        this.createdAt = builder.createdAt != null ? builder.createdAt : LocalDateTime.now();
        this.updatedAt = builder.updatedAt;
    }

    // Getters y setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskRequestCategoryEntity getCategory() {
        return category;
    }

    public void setCategory(TaskRequestCategoryEntity category) {
        this.category = category;
    }

    public TaskRequestPriorityEntity getPriority() {
        return priority;
    }

    public void setPriority(TaskRequestPriorityEntity priority) {
        this.priority = priority;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public TaskRequestStatusEntity getStatus() {
        return status;
    }

    public void setStatus(TaskRequestStatusEntity status) {
        this.status = status;
    }

    public Long getRequesterId() {
        return requesterId;
    }

    public void setRequesterId(Long requesterId) {
        this.requesterId = requesterId;
    }

    public Long getAssignerId() {
        return assignerId;
    }

    public void setAssignerId(Long assignerId) {
        this.assignerId = assignerId;
    }

    public LocalDateTime getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDateTime requestDate) {
        this.requestDate = requestDate;
    }

    public LocalDateTime getAssignmentDate() {
        return assignmentDate;
    }

    public void setAssignmentDate(LocalDateTime assignmentDate) {
        this.assignmentDate = assignmentDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<TaskRequestAttachmentEntity> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<TaskRequestAttachmentEntity> attachments) {
        this.attachments.clear();
        if (attachments != null) {
            this.attachments.addAll(attachments);
        }
    }

    public List<TaskRequestCommentEntity> getComments() {
        return comments;
    }

    public void setComments(List<TaskRequestCommentEntity> comments) {
        this.comments.clear();
        if (comments != null) {
            this.comments.addAll(comments);
        }
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

    /**
     * Añade un comentario a la solicitud.
     *
     * @param comment El comentario a añadir
     */
    public void addComment(TaskRequestCommentEntity comment) {
        comments.add(comment);
        comment.setTaskRequest(this);
    }

    /**
     * Elimina un comentario de la solicitud.
     *
     * @param comment El comentario a eliminar
     */
    public void removeComment(TaskRequestCommentEntity comment) {
        comments.remove(comment);
        comment.setTaskRequest(null);
    }

    /**
     * Añade un archivo adjunto a la solicitud.
     *
     * @param attachment El archivo adjunto a añadir
     */
    public void addAttachment(TaskRequestAttachmentEntity attachment) {
        attachments.add(attachment);
        attachment.setTaskRequest(this);
    }

    /**
     * Elimina un archivo adjunto de la solicitud.
     *
     * @param attachment El archivo adjunto a eliminar
     */
    public void removeAttachment(TaskRequestAttachmentEntity attachment) {
        attachments.remove(attachment);
        attachment.setTaskRequest(null);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TaskRequestEntity that = (TaskRequestEntity) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "TaskRequestEntity{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", status=" + status +
                ", requesterId=" + requesterId +
                ", requestDate=" + requestDate +
                '}';
    }

    /**
     * Builder para crear instancias de TaskRequestEntity.
     */
    public static class Builder {
        private Long id;
        private String title;
        private String description;
        private TaskRequestCategoryEntity category;
        private TaskRequestPriorityEntity priority;
        private LocalDateTime dueDate;
        private TaskRequestStatusEntity status;
        private Long requesterId;
        private Long assignerId;
        private LocalDateTime requestDate;
        private LocalDateTime assignmentDate;
        private String notes;
        private List<TaskRequestAttachmentEntity> attachments;
        private List<TaskRequestCommentEntity> comments;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        private Builder() {
        }

        public static Builder builder() {
            return new Builder();
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

        public Builder category(TaskRequestCategoryEntity category) {
            this.category = category;
            return this;
        }

        public Builder priority(TaskRequestPriorityEntity priority) {
            this.priority = priority;
            return this;
        }

        public Builder dueDate(LocalDateTime dueDate) {
            this.dueDate = dueDate;
            return this;
        }

        public Builder status(TaskRequestStatusEntity status) {
            this.status = status;
            return this;
        }

        public Builder requesterId(Long requesterId) {
            this.requesterId = requesterId;
            return this;
        }

        public Builder assignerId(Long assignerId) {
            this.assignerId = assignerId;
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

        public Builder attachments(List<TaskRequestAttachmentEntity> attachments) {
            this.attachments = attachments;
            return this;
        }

        public Builder comments(List<TaskRequestCommentEntity> comments) {
            this.comments = comments;
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

        public TaskRequestEntity build() {
            return new TaskRequestEntity(this);
        }
    }
}

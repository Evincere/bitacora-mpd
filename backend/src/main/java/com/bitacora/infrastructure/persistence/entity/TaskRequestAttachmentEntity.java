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
 * Entidad JPA para representar un archivo adjunto de solicitud de tarea en la base de datos.
 */
@Entity
@Table(name = "task_request_attachments")
public class TaskRequestAttachmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_request_id", nullable = false)
    private TaskRequestEntity taskRequest;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "file_type", length = 100)
    private String fileType;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "uploaded_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime uploadedAt;

    /**
     * Constructor por defecto requerido por JPA.
     */
    public TaskRequestAttachmentEntity() {
    }

    /**
     * Constructor con builder.
     */
    private TaskRequestAttachmentEntity(Builder builder) {
        this.id = builder.id;
        this.taskRequest = builder.taskRequest;
        this.userId = builder.userId;
        this.fileName = builder.fileName;
        this.fileType = builder.fileType;
        this.filePath = builder.filePath;
        this.fileSize = builder.fileSize;
        this.uploadedAt = builder.uploadedAt != null ? builder.uploadedAt : LocalDateTime.now();
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

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TaskRequestAttachmentEntity that = (TaskRequestAttachmentEntity) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "TaskRequestAttachmentEntity{" +
                "id=" + id +
                ", taskRequestId=" + (taskRequest != null ? taskRequest.getId() : null) +
                ", userId=" + userId +
                ", fileName='" + fileName + '\'' +
                ", fileType='" + fileType + '\'' +
                ", fileSize=" + fileSize +
                ", uploadedAt=" + uploadedAt +
                '}';
    }

    /**
     * Builder para crear instancias de TaskRequestAttachmentEntity.
     */
    public static class Builder {
        private Long id;
        private TaskRequestEntity taskRequest;
        private Long userId;
        private String fileName;
        private String fileType;
        private String filePath;
        private Long fileSize;
        private LocalDateTime uploadedAt;

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

        public Builder fileName(String fileName) {
            this.fileName = fileName;
            return this;
        }

        public Builder fileType(String fileType) {
            this.fileType = fileType;
            return this;
        }

        public Builder filePath(String filePath) {
            this.filePath = filePath;
            return this;
        }

        public Builder fileSize(Long fileSize) {
            this.fileSize = fileSize;
            return this;
        }

        public Builder uploadedAt(LocalDateTime uploadedAt) {
            this.uploadedAt = uploadedAt;
            return this;
        }

        public TaskRequestAttachmentEntity build() {
            return new TaskRequestAttachmentEntity(this);
        }
    }
}

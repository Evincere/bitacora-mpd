package com.bitacora.application.taskrequest.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;

/**
 * DTO para transferir información de archivos adjuntos de solicitudes de tareas
 * entre capas.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskRequestAttachmentDto {
    private Long id;
    private Long taskRequestId;
    private Long userId;
    private String userName;
    private String fileName;
    private String fileType;
    private String filePath;
    private Long fileSize;
    private String downloadUrl;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime uploadedAt;

    // Constructor por defecto
    public TaskRequestAttachmentDto() {
    }

    // Constructor con builder
    private TaskRequestAttachmentDto(Builder builder) {
        this.id = builder.id;
        this.taskRequestId = builder.taskRequestId;
        this.userId = builder.userId;
        this.userName = builder.userName;
        this.fileName = builder.fileName;
        this.fileType = builder.fileType;
        this.filePath = builder.filePath;
        this.fileSize = builder.fileSize;
        this.downloadUrl = builder.downloadUrl;
        this.uploadedAt = builder.uploadedAt;
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

    public String getFileName() {
        return fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public String getFilePath() {
        return filePath;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public String getDownloadUrl() {
        return downloadUrl;
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
        private String fileName;
        private String fileType;
        private String filePath;
        private Long fileSize;
        private String downloadUrl;
        private LocalDateTime uploadedAt;

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

        public Builder downloadUrl(String downloadUrl) {
            this.downloadUrl = downloadUrl;
            return this;
        }

        public Builder uploadedAt(LocalDateTime uploadedAt) {
            this.uploadedAt = uploadedAt;
            return this;
        }

        public TaskRequestAttachmentDto build() {
            return new TaskRequestAttachmentDto(this);
        }
    }
}

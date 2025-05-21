package com.bitacora.domain.model.taskrequest;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Representa un archivo adjunto en una solicitud de tarea.
 */
public class TaskRequestAttachment {
    private Long id;
    private Long taskRequestId;
    private Long userId;
    private Long commentId; // ID del comentario al que está asociado (opcional)
    private String fileName;
    private String fileType;
    private String filePath;
    private Long fileSize;
    private LocalDateTime uploadedAt;

    /**
     * Constructor privado para el patrón Builder.
     */
    private TaskRequestAttachment() {
    }

    /**
     * Crea una nueva instancia de TaskRequestAttachment utilizando el patrón
     * Builder.
     *
     * @return Un nuevo builder para TaskRequestAttachment
     */
    public static Builder builder() {
        return new Builder();
    }

    /**
     * Obtiene el identificador único del archivo adjunto.
     *
     * @return El identificador único
     */
    public Long getId() {
        return id;
    }

    /**
     * Obtiene el identificador de la solicitud a la que pertenece este archivo
     * adjunto.
     *
     * @return El identificador de la solicitud
     */
    public Long getTaskRequestId() {
        return taskRequestId;
    }

    /**
     * Obtiene el identificador del usuario que subió el archivo.
     *
     * @return El identificador del usuario
     */
    public Long getUserId() {
        return userId;
    }

    /**
     * Obtiene el identificador del comentario al que está asociado este archivo
     * adjunto.
     *
     * @return El identificador del comentario, o null si no está asociado a ningún
     *         comentario
     */
    public Long getCommentId() {
        return commentId;
    }

    /**
     * Obtiene el nombre del archivo.
     *
     * @return El nombre del archivo
     */
    public String getFileName() {
        return fileName;
    }

    /**
     * Obtiene el tipo MIME del archivo.
     *
     * @return El tipo MIME
     */
    public String getFileType() {
        return fileType;
    }

    /**
     * Obtiene la ruta donde se almacena el archivo.
     *
     * @return La ruta del archivo
     */
    public String getFilePath() {
        return filePath;
    }

    /**
     * Obtiene el tamaño del archivo en bytes.
     *
     * @return El tamaño del archivo
     */
    public Long getFileSize() {
        return fileSize;
    }

    /**
     * Obtiene la fecha y hora en que se subió el archivo.
     *
     * @return La fecha y hora de subida
     */
    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    @Override
    public boolean equals(final Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        final TaskRequestAttachment that = (TaskRequestAttachment) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "TaskRequestAttachment{" +
                "id=" + id +
                ", taskRequestId=" + taskRequestId +
                ", userId=" + userId +
                ", commentId=" + commentId +
                ", fileName='" + fileName + '\'' +
                ", fileType='" + fileType + '\'' +
                ", fileSize=" + fileSize +
                ", uploadedAt=" + uploadedAt +
                '}';
    }

    /**
     * Builder para crear instancias de TaskRequestAttachment.
     */
    public static class Builder {
        private final TaskRequestAttachment instance = new TaskRequestAttachment();

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

        public Builder commentId(final Long commentId) {
            instance.commentId = commentId;
            return this;
        }

        public Builder fileName(final String fileName) {
            instance.fileName = fileName;
            return this;
        }

        public Builder fileType(final String fileType) {
            instance.fileType = fileType;
            return this;
        }

        public Builder filePath(final String filePath) {
            instance.filePath = filePath;
            return this;
        }

        public Builder fileSize(final Long fileSize) {
            instance.fileSize = fileSize;
            return this;
        }

        public Builder uploadedAt(final LocalDateTime uploadedAt) {
            instance.uploadedAt = uploadedAt;
            return this;
        }

        public TaskRequestAttachment build() {
            // Validaciones básicas
            if (instance.fileName == null || instance.fileName.trim().isEmpty()) {
                throw new IllegalArgumentException("El nombre del archivo no puede estar vacío");
            }

            if (instance.filePath == null || instance.filePath.trim().isEmpty()) {
                throw new IllegalArgumentException("La ruta del archivo no puede estar vacía");
            }

            if (instance.userId == null) {
                throw new IllegalArgumentException("El identificador del usuario no puede ser nulo");
            }

            if (instance.uploadedAt == null) {
                instance.uploadedAt = LocalDateTime.now();
            }

            return instance;
        }
    }
}

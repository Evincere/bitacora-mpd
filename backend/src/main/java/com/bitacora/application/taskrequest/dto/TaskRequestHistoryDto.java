package com.bitacora.application.taskrequest.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;

/**
 * DTO para transferir información de historial de solicitudes de tareas entre
 * capas.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskRequestHistoryDto {
    private Long id;
    private Long taskRequestId;
    private Long userId;
    private String userName;
    private String previousStatus;
    private String newStatus;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime changeDate;

    private String notes;

    // Constructor por defecto
    public TaskRequestHistoryDto() {
    }

    // Constructor con builder
    private TaskRequestHistoryDto(Builder builder) {
        this.id = builder.id;
        this.taskRequestId = builder.taskRequestId;
        this.userId = builder.userId;
        this.userName = builder.userName;
        this.previousStatus = builder.previousStatus;
        this.newStatus = builder.newStatus;
        this.changeDate = builder.changeDate;
        this.notes = builder.notes;
    }

    /**
     * Método estático para crear un nuevo Builder.
     *
     * @return Un nuevo Builder para TaskRequestHistoryDto
     */
    public static Builder builder() {
        return new Builder();
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

    public String getPreviousStatus() {
        return previousStatus;
    }

    public String getNewStatus() {
        return newStatus;
    }

    public LocalDateTime getChangeDate() {
        return changeDate;
    }

    public String getNotes() {
        return notes;
    }

    /**
     * Builder para crear instancias de TaskRequestHistoryDto.
     */
    public static class Builder {
        private Long id;
        private Long taskRequestId;
        private Long userId;
        private String userName;
        private String previousStatus;
        private String newStatus;
        private LocalDateTime changeDate;
        private String notes;

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

        public Builder previousStatus(String previousStatus) {
            this.previousStatus = previousStatus;
            return this;
        }

        public Builder newStatus(String newStatus) {
            this.newStatus = newStatus;
            return this;
        }

        public Builder changeDate(LocalDateTime changeDate) {
            this.changeDate = changeDate;
            return this;
        }

        public Builder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public TaskRequestHistoryDto build() {
            return new TaskRequestHistoryDto(this);
        }
    }
}

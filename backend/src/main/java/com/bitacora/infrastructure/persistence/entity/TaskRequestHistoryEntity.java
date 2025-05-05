package com.bitacora.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.time.LocalDateTime;

/**
 * Entidad JPA para representar un registro en el historial de cambios de una
 * solicitud de tarea en la base de datos.
 */
@Entity
@Table(name = "task_request_history")
public class TaskRequestHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "task_request_id", nullable = false)
    private Long taskRequestId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_name", length = 200)
    private String userName;

    @Column(name = "previous_status", length = 20)
    @Enumerated(EnumType.STRING)
    private TaskRequestStatusEntity previousStatus;

    @Column(name = "new_status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private TaskRequestStatusEntity newStatus;

    @Column(name = "change_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime changeDate;

    @Column(name = "notes", length = 1000)
    private String notes;

    /**
     * Constructor por defecto requerido por JPA.
     */
    public TaskRequestHistoryEntity() {
    }

    /**
     * Constructor con builder.
     */
    private TaskRequestHistoryEntity(Builder builder) {
        this.id = builder.id;
        this.taskRequestId = builder.taskRequestId;
        this.userId = builder.userId;
        this.userName = builder.userName;
        this.previousStatus = builder.previousStatus;
        this.newStatus = builder.newStatus;
        this.changeDate = builder.changeDate != null ? builder.changeDate : LocalDateTime.now();
        this.notes = builder.notes;
    }

    // Getters y setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTaskRequestId() {
        return taskRequestId;
    }

    public void setTaskRequestId(Long taskRequestId) {
        this.taskRequestId = taskRequestId;
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

    public TaskRequestStatusEntity getPreviousStatus() {
        return previousStatus;
    }

    public void setPreviousStatus(TaskRequestStatusEntity previousStatus) {
        this.previousStatus = previousStatus;
    }

    public TaskRequestStatusEntity getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(TaskRequestStatusEntity newStatus) {
        this.newStatus = newStatus;
    }

    public LocalDateTime getChangeDate() {
        return changeDate;
    }

    public void setChangeDate(LocalDateTime changeDate) {
        this.changeDate = changeDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    /**
     * Builder para crear instancias de TaskRequestHistoryEntity.
     */
    public static class Builder {
        private Long id;
        private Long taskRequestId;
        private Long userId;
        private String userName;
        private TaskRequestStatusEntity previousStatus;
        private TaskRequestStatusEntity newStatus;
        private LocalDateTime changeDate;
        private String notes;

        private Builder() {
        }

        public static Builder builder() {
            return new Builder();
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

        public Builder previousStatus(TaskRequestStatusEntity previousStatus) {
            this.previousStatus = previousStatus;
            return this;
        }

        public Builder newStatus(TaskRequestStatusEntity newStatus) {
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

        public TaskRequestHistoryEntity build() {
            return new TaskRequestHistoryEntity(this);
        }
    }
}

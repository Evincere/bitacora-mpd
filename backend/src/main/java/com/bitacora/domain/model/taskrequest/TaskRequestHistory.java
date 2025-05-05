package com.bitacora.domain.model.taskrequest;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Representa un registro en el historial de cambios de una solicitud de tarea.
 */
public class TaskRequestHistory {
    private Long id;
    private Long taskRequestId;
    private Long userId;
    private String userName;
    private TaskRequestStatus previousStatus;
    private TaskRequestStatus newStatus;
    private LocalDateTime changeDate;
    private String notes;

    /**
     * Constructor privado para el patrón Builder.
     */
    private TaskRequestHistory() {
    }

    /**
     * Crea una nueva instancia de TaskRequestHistory utilizando el patrón Builder.
     *
     * @return Un nuevo builder para TaskRequestHistory
     */
    public static Builder builder() {
        return new Builder();
    }

    /**
     * Crea un registro de cambio de estado.
     *
     * @param taskRequestId  ID de la solicitud
     * @param userId         ID del usuario que realiza el cambio
     * @param userName       Nombre del usuario que realiza el cambio
     * @param previousStatus Estado anterior
     * @param newStatus      Nuevo estado
     * @param notes          Notas sobre el cambio
     * @return Un nuevo registro de historial
     */
    public static TaskRequestHistory createStatusChange(
            final Long taskRequestId,
            final Long userId,
            final String userName,
            final TaskRequestStatus previousStatus,
            final TaskRequestStatus newStatus,
            final String notes) {

        return builder()
                .taskRequestId(taskRequestId)
                .userId(userId)
                .userName(userName)
                .previousStatus(previousStatus)
                .newStatus(newStatus)
                .changeDate(LocalDateTime.now())
                .notes(notes)
                .build();
    }

    /**
     * Obtiene el identificador único del registro de historial.
     *
     * @return El identificador único
     */
    public Long getId() {
        return id;
    }

    /**
     * Obtiene el identificador de la solicitud asociada.
     *
     * @return El identificador de la solicitud
     */
    public Long getTaskRequestId() {
        return taskRequestId;
    }

    /**
     * Obtiene el identificador del usuario que realizó el cambio.
     *
     * @return El identificador del usuario
     */
    public Long getUserId() {
        return userId;
    }

    /**
     * Obtiene el nombre del usuario que realizó el cambio.
     *
     * @return El nombre del usuario
     */
    public String getUserName() {
        return userName;
    }

    /**
     * Obtiene el estado anterior de la solicitud.
     *
     * @return El estado anterior
     */
    public TaskRequestStatus getPreviousStatus() {
        return previousStatus;
    }

    /**
     * Obtiene el nuevo estado de la solicitud.
     *
     * @return El nuevo estado
     */
    public TaskRequestStatus getNewStatus() {
        return newStatus;
    }

    /**
     * Obtiene la fecha y hora del cambio.
     *
     * @return La fecha y hora del cambio
     */
    public LocalDateTime getChangeDate() {
        return changeDate;
    }

    /**
     * Obtiene las notas asociadas al cambio.
     *
     * @return Las notas
     */
    public String getNotes() {
        return notes;
    }

    @Override
    public boolean equals(final Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        final TaskRequestHistory that = (TaskRequestHistory) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "TaskRequestHistory{" +
                "id=" + id +
                ", taskRequestId=" + taskRequestId +
                ", userId=" + userId +
                ", userName='" + userName + '\'' +
                ", previousStatus=" + previousStatus +
                ", newStatus=" + newStatus +
                ", changeDate=" + changeDate +
                '}';
    }

    /**
     * Builder para crear instancias de TaskRequestHistory.
     */
    public static class Builder {
        private final TaskRequestHistory instance = new TaskRequestHistory();

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

        public Builder userName(final String userName) {
            instance.userName = userName;
            return this;
        }

        public Builder previousStatus(final TaskRequestStatus previousStatus) {
            instance.previousStatus = previousStatus;
            return this;
        }

        public Builder newStatus(final TaskRequestStatus newStatus) {
            instance.newStatus = newStatus;
            return this;
        }

        public Builder changeDate(final LocalDateTime changeDate) {
            instance.changeDate = changeDate;
            return this;
        }

        public Builder notes(final String notes) {
            instance.notes = notes;
            return this;
        }

        public TaskRequestHistory build() {
            // Validaciones básicas
            if (instance.taskRequestId == null) {
                throw new IllegalArgumentException("El identificador de la solicitud no puede ser nulo");
            }

            if (instance.newStatus == null) {
                throw new IllegalArgumentException("El nuevo estado no puede ser nulo");
            }

            if (instance.changeDate == null) {
                instance.changeDate = LocalDateTime.now();
            }

            return instance;
        }
    }
}

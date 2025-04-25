package com.bitacora.domain.model.activity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

/**
 * Entidad de dominio que representa una actividad en el sistema.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Activity {
    private Long id;
    private LocalDateTime date;
    private ActivityType type;
    private String description;
    private String person;
    private String role;
    private String dependency;
    private String situation;
    private String result;
    private ActivityStatus status;
    private LocalDateTime lastStatusChangeDate;
    private String comments;
    private String agent;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;

    /**
     * Cambia el estado de la actividad y actualiza la fecha del último cambio de estado.
     *
     * @param newStatus El nuevo estado de la actividad
     */
    public void changeStatus(ActivityStatus newStatus) {
        this.status = newStatus;
        this.lastStatusChangeDate = LocalDateTime.now();
    }

    /**
     * Verifica si la actividad está completada.
     *
     * @return true si la actividad está completada, false en caso contrario
     */
    public boolean isCompleted() {
        return ActivityStatus.COMPLETADA.equals(this.status);
    }

    /**
     * Verifica si la actividad está pendiente.
     *
     * @return true si la actividad está pendiente, false en caso contrario
     */
    public boolean isPending() {
        return ActivityStatus.PENDIENTE.equals(this.status);
    }

    /**
     * Verifica si la actividad está en progreso.
     *
     * @return true si la actividad está en progreso, false en caso contrario
     */
    public boolean isInProgress() {
        return ActivityStatus.EN_PROGRESO.equals(this.status);
    }

    /**
     * Verifica si la actividad está cancelada.
     *
     * @return true si la actividad está cancelada, false en caso contrario
     */
    public boolean isCancelled() {
        return ActivityStatus.CANCELADA.equals(this.status);
    }

    /**
     * Verifica si la actividad está archivada.
     *
     * @return true si la actividad está archivada, false en caso contrario
     */
    public boolean isArchived() {
        return ActivityStatus.ARCHIVADA.equals(this.status);
    }
}

package com.bitacora.infrastructure.persistence.entity;

/**
 * Enumeración que representa los posibles estados de una solicitud de tarea en la base de datos.
 */
public enum TaskRequestStatusEntity {
    /**
     * Borrador: La solicitud está siendo creada y aún no ha sido enviada.
     */
    DRAFT,

    /**
     * Enviada: La solicitud ha sido enviada al asignador pero aún no ha sido procesada.
     */
    SUBMITTED,

    /**
     * Asignada: La solicitud ha sido procesada por el asignador y asignada a un ejecutor.
     */
    ASSIGNED,

    /**
     * En Progreso: La tarea ha sido iniciada por el ejecutor y está en proceso.
     */
    IN_PROGRESS,

    /**
     * Completada: La tarea solicitada ha sido completada.
     */
    COMPLETED,

    /**
     * Cancelada: La solicitud ha sido cancelada y no será procesada.
     */
    CANCELLED
}

package com.bitacora.infrastructure.persistence.entity;

/**
 * Enumeración que representa los niveles de prioridad para las solicitudes de tareas en la base de datos.
 */
public enum TaskRequestPriorityEntity {
    /**
     * Crítica: Máxima prioridad, requiere atención inmediata.
     */
    CRITICAL,
    
    /**
     * Alta: Prioridad elevada, debe ser atendida lo antes posible.
     */
    HIGH,
    
    /**
     * Media: Prioridad estándar, debe ser atendida en tiempo razonable.
     */
    MEDIUM,
    
    /**
     * Baja: Prioridad reducida, puede esperar si hay tareas más importantes.
     */
    LOW,
    
    /**
     * Trivial: Mínima prioridad, puede ser atendida cuando no haya otras tareas pendientes.
     */
    TRIVIAL
}

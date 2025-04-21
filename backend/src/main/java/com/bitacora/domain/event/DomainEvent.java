package com.bitacora.domain.event;

import java.time.LocalDateTime;

/**
 * Interfaz base para todos los eventos de dominio.
 */
public interface DomainEvent {
    
    /**
     * Obtiene el identificador del evento.
     * 
     * @return El identificador del evento
     */
    String getEventId();
    
    /**
     * Obtiene la fecha y hora en que ocurrió el evento.
     * 
     * @return La fecha y hora del evento
     */
    LocalDateTime getOccurredOn();
    
    /**
     * Obtiene el tipo del evento.
     * 
     * @return El tipo del evento
     */
    String getEventType();
}

package com.bitacora.domain.event;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Clase base abstracta para eventos de dominio.
 */
public abstract class AbstractDomainEvent implements DomainEvent {
    
    private final String eventId;
    private final LocalDateTime occurredOn;
    
    /**
     * Constructor para crear una instancia de AbstractDomainEvent.
     */
    protected AbstractDomainEvent() {
        this.eventId = UUID.randomUUID().toString();
        this.occurredOn = LocalDateTime.now();
    }
    
    @Override
    public String getEventId() {
        return eventId;
    }
    
    @Override
    public LocalDateTime getOccurredOn() {
        return occurredOn;
    }
    
    @Override
    public String getEventType() {
        return this.getClass().getSimpleName();
    }
}

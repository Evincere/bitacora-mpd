package com.bitacora.domain.event.taskrequest;

import com.bitacora.domain.event.AbstractDomainEvent;
import com.bitacora.domain.model.taskrequest.TaskRequest;
import com.bitacora.domain.model.taskrequest.TaskRequestStatus;

/**
 * Evento de dominio que se dispara cuando se crea una nueva solicitud de tarea.
 */
public class TaskRequestCreatedEvent extends AbstractDomainEvent {
    
    private final Long taskRequestId;
    private final String title;
    private final TaskRequestStatus status;
    private final Long requesterId;
    
    /**
     * Constructor para crear una instancia de TaskRequestCreatedEvent.
     * 
     * @param taskRequest La solicitud de tarea creada
     */
    public TaskRequestCreatedEvent(TaskRequest taskRequest) {
        super();
        this.taskRequestId = taskRequest.getId();
        this.title = taskRequest.getTitle();
        this.status = taskRequest.getStatus();
        this.requesterId = taskRequest.getRequesterId();
    }
    
    /**
     * Obtiene el ID de la solicitud de tarea.
     * 
     * @return El ID de la solicitud de tarea
     */
    public Long getTaskRequestId() {
        return taskRequestId;
    }
    
    /**
     * Obtiene el título de la solicitud.
     * 
     * @return El título de la solicitud
     */
    public String getTitle() {
        return title;
    }
    
    /**
     * Obtiene el estado de la solicitud.
     * 
     * @return El estado de la solicitud
     */
    public TaskRequestStatus getStatus() {
        return status;
    }
    
    /**
     * Obtiene el ID del solicitante.
     * 
     * @return El ID del solicitante
     */
    public Long getRequesterId() {
        return requesterId;
    }
}

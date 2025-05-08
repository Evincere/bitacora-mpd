package com.bitacora.domain.event.taskrequest;

import com.bitacora.domain.event.AbstractDomainEvent;
import com.bitacora.domain.model.taskrequest.TaskRequest;
import com.bitacora.domain.model.taskrequest.TaskRequestStatus;

/**
 * Evento de dominio que se dispara cuando cambia el estado de una solicitud de tarea.
 */
public class TaskRequestStatusChangedEvent extends AbstractDomainEvent {
    
    private final Long taskRequestId;
    private final TaskRequestStatus oldStatus;
    private final TaskRequestStatus newStatus;
    private final Long userId;
    
    /**
     * Constructor para crear una instancia de TaskRequestStatusChangedEvent.
     * 
     * @param taskRequest La solicitud de tarea cuyo estado ha cambiado
     * @param oldStatus El estado anterior de la solicitud
     * @param userId El ID del usuario que realizó el cambio
     */
    public TaskRequestStatusChangedEvent(TaskRequest taskRequest, TaskRequestStatus oldStatus, Long userId) {
        super();
        this.taskRequestId = taskRequest.getId();
        this.oldStatus = oldStatus;
        this.newStatus = taskRequest.getStatus();
        this.userId = userId;
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
     * Obtiene el estado anterior de la solicitud.
     * 
     * @return El estado anterior
     */
    public TaskRequestStatus getOldStatus() {
        return oldStatus;
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
     * Obtiene el ID del usuario que realizó el cambio.
     * 
     * @return El ID del usuario
     */
    public Long getUserId() {
        return userId;
    }
    
    @Override
    public String toString() {
        return "TaskRequestStatusChangedEvent{" +
                "taskRequestId=" + taskRequestId +
                ", oldStatus=" + oldStatus +
                ", newStatus=" + newStatus +
                ", userId=" + userId +
                '}';
    }
}

package com.bitacora.domain.model.taskrequest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Representa una solicitud de tarea en el sistema.
 * Una solicitud de tarea es una petición creada por un usuario (solicitante)
 * para que se asigne y ejecute una tarea específica.
 */
public class TaskRequest {

    private Long id;
    private String title;
    private String description;
    private TaskRequestCategory category;
    private TaskRequestPriority priority;
    private LocalDateTime dueDate;
    private TaskRequestStatus status;
    private Long requesterId;
    private Long assignerId;
    private LocalDateTime requestDate;
    private LocalDateTime assignmentDate;
    private String notes;
    private List<TaskRequestAttachment> attachments = new ArrayList<>();
    private List<TaskRequestComment> comments = new ArrayList<>();

    /**
     * Constructor privado para el patrón Builder.
     */
    private TaskRequest() {
    }

    /**
     * Crea una nueva instancia de TaskRequest utilizando el patrón Builder.
     *
     * @return Un nuevo builder para TaskRequest
     */
    public static Builder builder() {
        return new Builder();
    }

    /**
     * Obtiene el identificador único de la solicitud.
     *
     * @return El identificador único
     */
    public Long getId() {
        return id;
    }

    /**
     * Obtiene el título de la solicitud.
     *
     * @return El título
     */
    public String getTitle() {
        return title;
    }

    /**
     * Obtiene la descripción detallada de la solicitud.
     *
     * @return La descripción
     */
    public String getDescription() {
        return description;
    }

    /**
     * Obtiene la categoría de la solicitud.
     *
     * @return La categoría
     */
    public TaskRequestCategory getCategory() {
        return category;
    }

    /**
     * Obtiene la prioridad de la solicitud.
     *
     * @return La prioridad
     */
    public TaskRequestPriority getPriority() {
        return priority;
    }

    /**
     * Obtiene la fecha límite para completar la tarea solicitada.
     *
     * @return La fecha límite
     */
    public LocalDateTime getDueDate() {
        return dueDate;
    }

    /**
     * Obtiene el estado actual de la solicitud.
     *
     * @return El estado
     */
    public TaskRequestStatus getStatus() {
        return status;
    }

    /**
     * Obtiene el identificador del usuario que creó la solicitud.
     *
     * @return El identificador del solicitante
     */
    public Long getRequesterId() {
        return requesterId;
    }

    /**
     * Obtiene el identificador del usuario asignador que procesó la solicitud.
     *
     * @return El identificador del asignador
     */
    public Long getAssignerId() {
        return assignerId;
    }

    /**
     * Obtiene la fecha en que se creó la solicitud.
     *
     * @return La fecha de solicitud
     */
    public LocalDateTime getRequestDate() {
        return requestDate;
    }

    /**
     * Obtiene la fecha en que se asignó la solicitud.
     *
     * @return La fecha de asignación
     */
    public LocalDateTime getAssignmentDate() {
        return assignmentDate;
    }

    /**
     * Obtiene las notas adicionales de la solicitud.
     *
     * @return Las notas
     */
    public String getNotes() {
        return notes;
    }

    /**
     * Obtiene la lista de archivos adjuntos a la solicitud.
     *
     * @return Lista de adjuntos
     */
    public List<TaskRequestAttachment> getAttachments() {
        return new ArrayList<>(attachments);
    }

    /**
     * Obtiene la lista de comentarios de la solicitud.
     *
     * @return Lista de comentarios
     */
    public List<TaskRequestComment> getComments() {
        return new ArrayList<>(comments);
    }

    /**
     * Asigna la solicitud a un usuario asignador.
     *
     * @param assignerId El identificador del usuario asignador
     * @return La solicitud actualizada
     * @throws IllegalStateException Si la solicitud no está en estado SUBMITTED
     */
    public TaskRequest assign(final Long assignerId) {
        if (this.status != TaskRequestStatus.SUBMITTED) {
            throw new IllegalStateException("Solo se pueden asignar solicitudes en estado SUBMITTED");
        }
        
        if (assignerId == null) {
            throw new IllegalArgumentException("El identificador del asignador no puede ser nulo");
        }
        
        this.assignerId = assignerId;
        this.assignmentDate = LocalDateTime.now();
        this.status = TaskRequestStatus.ASSIGNED;
        return this;
    }

    /**
     * Marca la solicitud como completada.
     *
     * @return La solicitud actualizada
     * @throws IllegalStateException Si la solicitud no está en estado ASSIGNED
     */
    public TaskRequest complete() {
        if (this.status != TaskRequestStatus.ASSIGNED) {
            throw new IllegalStateException("Solo se pueden completar solicitudes en estado ASSIGNED");
        }
        
        this.status = TaskRequestStatus.COMPLETED;
        return this;
    }

    /**
     * Cancela la solicitud.
     *
     * @return La solicitud actualizada
     * @throws IllegalStateException Si la solicitud ya está en estado COMPLETED o CANCELLED
     */
    public TaskRequest cancel() {
        if (this.status == TaskRequestStatus.COMPLETED || this.status == TaskRequestStatus.CANCELLED) {
            throw new IllegalStateException("No se pueden cancelar solicitudes completadas o ya canceladas");
        }
        
        this.status = TaskRequestStatus.CANCELLED;
        return this;
    }

    /**
     * Añade un comentario a la solicitud.
     *
     * @param comment El comentario a añadir
     * @return La solicitud actualizada
     */
    public TaskRequest addComment(final TaskRequestComment comment) {
        if (comment == null) {
            throw new IllegalArgumentException("El comentario no puede ser nulo");
        }
        
        this.comments.add(comment);
        return this;
    }

    /**
     * Añade un archivo adjunto a la solicitud.
     *
     * @param attachment El archivo adjunto a añadir
     * @return La solicitud actualizada
     */
    public TaskRequest addAttachment(final TaskRequestAttachment attachment) {
        if (attachment == null) {
            throw new IllegalArgumentException("El archivo adjunto no puede ser nulo");
        }
        
        this.attachments.add(attachment);
        return this;
    }

    @Override
    public boolean equals(final Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        
        final TaskRequest that = (TaskRequest) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "TaskRequest{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", status=" + status +
                ", requesterId=" + requesterId +
                ", requestDate=" + requestDate +
                '}';
    }

    /**
     * Builder para crear instancias de TaskRequest.
     */
    public static class Builder {
        private final TaskRequest instance = new TaskRequest();

        private Builder() {
        }

        public Builder id(final Long id) {
            instance.id = id;
            return this;
        }

        public Builder title(final String title) {
            instance.title = title;
            return this;
        }

        public Builder description(final String description) {
            instance.description = description;
            return this;
        }

        public Builder category(final TaskRequestCategory category) {
            instance.category = category;
            return this;
        }

        public Builder priority(final TaskRequestPriority priority) {
            instance.priority = priority;
            return this;
        }

        public Builder dueDate(final LocalDateTime dueDate) {
            instance.dueDate = dueDate;
            return this;
        }

        public Builder status(final TaskRequestStatus status) {
            instance.status = status;
            return this;
        }

        public Builder requesterId(final Long requesterId) {
            instance.requesterId = requesterId;
            return this;
        }

        public Builder assignerId(final Long assignerId) {
            instance.assignerId = assignerId;
            return this;
        }

        public Builder requestDate(final LocalDateTime requestDate) {
            instance.requestDate = requestDate;
            return this;
        }

        public Builder assignmentDate(final LocalDateTime assignmentDate) {
            instance.assignmentDate = assignmentDate;
            return this;
        }

        public Builder notes(final String notes) {
            instance.notes = notes;
            return this;
        }

        public Builder attachments(final List<TaskRequestAttachment> attachments) {
            if (attachments != null) {
                instance.attachments = new ArrayList<>(attachments);
            }
            return this;
        }

        public Builder comments(final List<TaskRequestComment> comments) {
            if (comments != null) {
                instance.comments = new ArrayList<>(comments);
            }
            return this;
        }

        public TaskRequest build() {
            // Validaciones básicas
            if (instance.title == null || instance.title.trim().isEmpty()) {
                throw new IllegalArgumentException("El título no puede estar vacío");
            }
            
            if (instance.requesterId == null) {
                throw new IllegalArgumentException("El identificador del solicitante no puede ser nulo");
            }
            
            if (instance.requestDate == null) {
                instance.requestDate = LocalDateTime.now();
            }
            
            if (instance.status == null) {
                instance.status = TaskRequestStatus.DRAFT;
            }
            
            return instance;
        }
    }
}

package com.bitacora.domain.exception;

/**
 * Excepción específica para operaciones relacionadas con solicitudes de tareas.
 */
public class TaskRequestException extends RuntimeException {

    private final TaskRequestErrorCode errorCode;

    /**
     * Constructor con mensaje de error y código de error.
     *
     * @param message   Mensaje descriptivo del error
     * @param errorCode Código de error específico
     */
    public TaskRequestException(final String message, final TaskRequestErrorCode errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    /**
     * Constructor con mensaje de error, causa y código de error.
     *
     * @param message   Mensaje descriptivo del error
     * @param cause     Causa original de la excepción
     * @param errorCode Código de error específico
     */
    public TaskRequestException(final String message, final Throwable cause, final TaskRequestErrorCode errorCode) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    /**
     * Obtiene el código de error asociado a esta excepción.
     *
     * @return El código de error
     */
    public TaskRequestErrorCode getErrorCode() {
        return errorCode;
    }

    /**
     * Enumeración de códigos de error específicos para solicitudes de tareas.
     */
    public enum TaskRequestErrorCode {
        /**
         * La solicitud no existe.
         */
        TASK_REQUEST_NOT_FOUND,
        
        /**
         * La transición de estado no es válida.
         */
        INVALID_STATE_TRANSITION,
        
        /**
         * El usuario no tiene permiso para realizar la operación en la solicitud.
         */
        PERMISSION_DENIED,
        
        /**
         * Error al guardar la solicitud en la base de datos.
         */
        SAVE_ERROR,
        
        /**
         * Error al asignar la solicitud.
         */
        ASSIGNMENT_ERROR,
        
        /**
         * Error al completar la solicitud.
         */
        COMPLETION_ERROR,
        
        /**
         * Error al cancelar la solicitud.
         */
        CANCELLATION_ERROR,
        
        /**
         * Error al enviar la solicitud.
         */
        SUBMISSION_ERROR,
        
        /**
         * Error al actualizar la solicitud.
         */
        UPDATE_ERROR,
        
        /**
         * Error al crear la solicitud.
         */
        CREATION_ERROR
    }
}

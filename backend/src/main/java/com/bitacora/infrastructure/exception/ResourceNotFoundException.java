package com.bitacora.infrastructure.exception;

/**
 * Excepción que se lanza cuando un recurso no se encuentra.
 */
public class ResourceNotFoundException extends RuntimeException {

    /**
     * Constructor por defecto.
     */
    public ResourceNotFoundException() {
        super("Recurso no encontrado");
    }

    /**
     * Constructor con mensaje.
     *
     * @param message El mensaje de error
     */
    public ResourceNotFoundException(final String message) {
        super(message);
    }

    /**
     * Constructor con tipo de recurso e ID.
     *
     * @param resourceType El tipo de recurso
     * @param id           El ID del recurso
     */
    public ResourceNotFoundException(final String resourceType, final Object id) {
        super(resourceType + " con ID " + id + " no encontrado");
    }

    /**
     * Constructor con mensaje y causa.
     *
     * @param message El mensaje de error
     * @param cause   La causa del error
     */
    public ResourceNotFoundException(final String message, final Throwable cause) {
        super(message, cause);
    }
}

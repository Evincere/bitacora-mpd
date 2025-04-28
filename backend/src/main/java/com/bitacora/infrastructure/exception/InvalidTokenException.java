package com.bitacora.infrastructure.exception;

/**
 * Excepción que se lanza cuando un token es inválido.
 */
public class InvalidTokenException extends RuntimeException {

    /**
     * Constructor por defecto.
     */
    public InvalidTokenException() {
        super("Token inválido");
    }

    /**
     * Constructor con mensaje.
     *
     * @param message El mensaje de error
     */
    public InvalidTokenException(final String message) {
        super(message);
    }

    /**
     * Constructor con mensaje y causa.
     *
     * @param message El mensaje de error
     * @param cause   La causa del error
     */
    public InvalidTokenException(final String message, final Throwable cause) {
        super(message, cause);
    }
}

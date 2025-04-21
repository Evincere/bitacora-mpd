package com.bitacora.domain.exception;

/**
 * Excepción base para todas las excepciones de dominio.
 */
public abstract class DomainException extends RuntimeException {
    
    private static final long serialVersionUID = 1L;
    
    /**
     * Constructor para crear una instancia de DomainException con un mensaje.
     * 
     * @param message El mensaje de error
     */
    protected DomainException(String message) {
        super(message);
    }
    
    /**
     * Constructor para crear una instancia de DomainException con un mensaje y una causa.
     * 
     * @param message El mensaje de error
     * @param cause La causa de la excepción
     */
    protected DomainException(String message, Throwable cause) {
        super(message, cause);
    }
}

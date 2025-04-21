package com.bitacora.domain.exception;

/**
 * Excepción que se lanza cuando un nombre de persona no es válido.
 */
public class InvalidPersonNameException extends DomainException {
    
    private static final long serialVersionUID = 1L;
    
    /**
     * Constructor para crear una instancia de InvalidPersonNameException con un mensaje.
     * 
     * @param message El mensaje de error
     */
    public InvalidPersonNameException(String message) {
        super(message);
    }
    
    /**
     * Constructor para crear una instancia de InvalidPersonNameException con un mensaje y una causa.
     * 
     * @param message El mensaje de error
     * @param cause La causa de la excepción
     */
    public InvalidPersonNameException(String message, Throwable cause) {
        super(message, cause);
    }
}

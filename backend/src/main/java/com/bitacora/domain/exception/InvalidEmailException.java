package com.bitacora.domain.exception;

/**
 * Excepción que se lanza cuando una dirección de correo electrónico no es válida.
 */
public class InvalidEmailException extends DomainException {
    
    private static final long serialVersionUID = 1L;
    
    /**
     * Constructor para crear una instancia de InvalidEmailException con un mensaje.
     * 
     * @param message El mensaje de error
     */
    public InvalidEmailException(String message) {
        super(message);
    }
    
    /**
     * Constructor para crear una instancia de InvalidEmailException con un mensaje y una causa.
     * 
     * @param message El mensaje de error
     * @param cause La causa de la excepción
     */
    public InvalidEmailException(String message, Throwable cause) {
        super(message, cause);
    }
}

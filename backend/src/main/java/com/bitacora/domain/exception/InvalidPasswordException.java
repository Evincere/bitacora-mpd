package com.bitacora.domain.exception;

/**
 * Excepción que se lanza cuando una contraseña no cumple con los requisitos de seguridad.
 */
public class InvalidPasswordException extends DomainException {
    
    private static final long serialVersionUID = 1L;
    
    /**
     * Constructor para crear una instancia de InvalidPasswordException con un mensaje.
     * 
     * @param message El mensaje de error
     */
    public InvalidPasswordException(String message) {
        super(message);
    }
    
    /**
     * Constructor para crear una instancia de InvalidPasswordException con un mensaje y una causa.
     * 
     * @param message El mensaje de error
     * @param cause La causa de la excepción
     */
    public InvalidPasswordException(String message, Throwable cause) {
        super(message, cause);
    }
}

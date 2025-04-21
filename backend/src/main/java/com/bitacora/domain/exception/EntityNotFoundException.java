package com.bitacora.domain.exception;

/**
 * Excepción que se lanza cuando no se encuentra una entidad.
 */
public class EntityNotFoundException extends DomainException {
    
    private static final long serialVersionUID = 1L;
    
    /**
     * Constructor para crear una instancia de EntityNotFoundException con un mensaje.
     * 
     * @param message El mensaje de error
     */
    public EntityNotFoundException(String message) {
        super(message);
    }
    
    /**
     * Constructor para crear una instancia de EntityNotFoundException con un mensaje y una causa.
     * 
     * @param message El mensaje de error
     * @param cause La causa de la excepción
     */
    public EntityNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    /**
     * Método de fábrica para crear una instancia de EntityNotFoundException para una entidad específica.
     * 
     * @param entityName El nombre de la entidad
     * @param id El identificador de la entidad
     * @return Una nueva instancia de EntityNotFoundException
     */
    public static EntityNotFoundException forEntity(String entityName, Object id) {
        return new EntityNotFoundException(
                String.format("No se encontró %s con id: %s", entityName, id)
        );
    }
}

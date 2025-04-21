package com.bitacora.domain.model.shared;

import java.io.Serializable;

/**
 * Interfaz base para todos los Value Objects en el dominio.
 * Los Value Objects son inmutables y se comparan por su valor, no por su identidad.
 */
public interface ValueObject extends Serializable {
    
    /**
     * Los Value Objects deben implementar equals y hashCode basados en sus atributos.
     */
    boolean equals(Object o);
    
    /**
     * Los Value Objects deben implementar hashCode basado en sus atributos.
     */
    int hashCode();
    
    /**
     * Los Value Objects deben implementar toString para facilitar la depuración.
     */
    String toString();
}

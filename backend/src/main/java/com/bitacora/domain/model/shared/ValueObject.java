package com.bitacora.domain.model.shared;

import java.io.Serializable;

/**
 * Interfaz base para todos los Value Objects en el dominio.
 * Los Value Objects son inmutables y se comparan por su valor, no por su
 * identidad.
 */
public interface ValueObject extends Serializable {

    /**
     * Los Value Objects deben implementar equals y hashCode basados en sus
     * atributos.
     *
     * @param o El objeto a comparar
     * @return true si los objetos son iguales, false en caso contrario
     */
    boolean equals(Object o);

    /**
     * Los Value Objects deben implementar hashCode basado en sus atributos.
     *
     * @return El código hash calculado
     */
    int hashCode();

    /**
     * Los Value Objects deben implementar toString para facilitar la depuración.
     *
     * @return Una representación en texto del objeto
     */
    String toString();
}

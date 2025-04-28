package com.bitacora.domain.model.shared;

/**
 * Clase base abstracta para Value Objects que proporciona implementaciones por defecto
 * de equals, hashCode y toString.
 */
public abstract class AbstractValueObject implements ValueObject {

    private static final long serialVersionUID = 1L;

    /**
     * Implementación por defecto de equals que compara las clases y delega en doEquals.
     */
    @Override
    public boolean equals(final Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        return doEquals((AbstractValueObject) o);
    }

    /**
     * Método que debe ser implementado por las subclases para comparar los atributos.
     *
     * @param other El otro objeto a comparar
     * @return true si los objetos son iguales, false en caso contrario
     */
    protected abstract boolean doEquals(AbstractValueObject other);

    /**
     * Implementación por defecto de hashCode que delega en doHashCode.
     */
    @Override
    public int hashCode() {
        return doHashCode();
    }

    /**
     * Método que debe ser implementado por las subclases para calcular el hashCode.
     *
     * @return El hashCode calculado
     */
    protected abstract int doHashCode();
}

package com.bitacora.domain.model.user;

import com.bitacora.domain.exception.InvalidPersonNameException;
import com.bitacora.domain.model.shared.AbstractValueObject;

import java.util.Objects;

/**
 * Value Object que representa el nombre de una persona.
 */
public class PersonName extends AbstractValueObject {
    
    private static final long serialVersionUID = 1L;
    
    private final String firstName;
    private final String lastName;
    
    /**
     * Constructor privado para crear una instancia de PersonName.
     * 
     * @param firstName El nombre
     * @param lastName El apellido
     */
    private PersonName(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
    
    /**
     * Método de fábrica para crear una instancia de PersonName.
     * 
     * @param firstName El nombre
     * @param lastName El apellido
     * @return Una nueva instancia de PersonName
     * @throws InvalidPersonNameException Si el nombre o el apellido no son válidos
     */
    public static PersonName of(String firstName, String lastName) {
        if (firstName == null || firstName.trim().isEmpty()) {
            throw new InvalidPersonNameException("El nombre no puede estar vacío");
        }
        
        if (lastName == null || lastName.trim().isEmpty()) {
            throw new InvalidPersonNameException("El apellido no puede estar vacío");
        }
        
        return new PersonName(
                firstName.trim(),
                lastName.trim()
        );
    }
    
    /**
     * Devuelve el nombre.
     * 
     * @return El nombre
     */
    public String getFirstName() {
        return firstName;
    }
    
    /**
     * Devuelve el apellido.
     * 
     * @return El apellido
     */
    public String getLastName() {
        return lastName;
    }
    
    /**
     * Devuelve el nombre completo (nombre y apellido).
     * 
     * @return El nombre completo
     */
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    @Override
    protected boolean doEquals(AbstractValueObject other) {
        PersonName that = (PersonName) other;
        return Objects.equals(firstName, that.firstName) && 
               Objects.equals(lastName, that.lastName);
    }
    
    @Override
    protected int doHashCode() {
        return Objects.hash(firstName, lastName);
    }
    
    @Override
    public String toString() {
        return getFullName();
    }
}

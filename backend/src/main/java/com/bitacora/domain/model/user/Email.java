package com.bitacora.domain.model.user;

import com.bitacora.domain.exception.InvalidEmailException;
import com.bitacora.domain.model.shared.AbstractValueObject;

import java.util.Objects;
import java.util.regex.Pattern;

/**
 * Value Object que representa una dirección de correo electrónico válida.
 */
public final class Email extends AbstractValueObject {

    private static final long serialVersionUID = 1L;

    // Patrón para validar direcciones de correo electrónico
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$");

    private final String value;

    /**
     * Constructor privado para crear una instancia de Email.
     *
     * @param email La dirección de correo electrónico
     */
    private Email(final String email) {
        this.value = email;
    }

    /**
     * Método de fábrica para crear una instancia de Email.
     *
     * @param email La dirección de correo electrónico
     * @return Una nueva instancia de Email
     * @throws InvalidEmailException Si la dirección de correo electrónico no es
     *                               válida
     */
    public static Email of(final String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new InvalidEmailException("La dirección de correo electrónico no puede estar vacía");
        }

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new InvalidEmailException("La dirección de correo electrónico no es válida: " + email);
        }

        return new Email(email.toLowerCase().trim());
    }

    /**
     * Devuelve el valor de la dirección de correo electrónico.
     *
     * @return El valor de la dirección de correo electrónico
     */
    public String getValue() {
        return value;
    }

    @Override
    protected boolean doEquals(final AbstractValueObject other) {
        Email that = (Email) other;
        return Objects.equals(value, that.value);
    }

    @Override
    protected int doHashCode() {
        return Objects.hash(value);
    }

    @Override
    public String toString() {
        return value;
    }
}

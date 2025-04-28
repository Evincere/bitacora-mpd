package com.bitacora.domain.model.user;

import com.bitacora.domain.exception.InvalidPasswordException;
import com.bitacora.domain.model.shared.AbstractValueObject;

import java.util.Objects;
import java.util.regex.Pattern;

/**
 * Value Object que representa una contraseña segura.
 */
public final class Password extends AbstractValueObject {

    private static final long serialVersionUID = 1L;

    // Patrón para validar contraseñas seguras
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
            "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$");

    private final String value;
    private final boolean isHashed;

    /**
     * Constructor privado para crear una instancia de Password.
     *
     * @param password La contraseña
     * @param isHashed Indica si la contraseña ya está hasheada
     */
    private Password(final String password, final boolean isHashed) {
        this.value = password;
        this.isHashed = isHashed;
    }

    /**
     * Método de fábrica para crear una instancia de Password a partir de una
     * contraseña en texto plano.
     *
     * @param password La contraseña en texto plano
     * @return Una nueva instancia de Password
     * @throws InvalidPasswordException Si la contraseña no cumple con los
     *                                  requisitos de seguridad
     */
    public static Password createRaw(final String password) {
        if (password == null || password.trim().isEmpty()) {
            throw new InvalidPasswordException("La contraseña no puede estar vacía");
        }

        if (!PASSWORD_PATTERN.matcher(password).matches()) {
            throw new InvalidPasswordException("La contraseña debe tener al menos 8 caracteres, " +
                    "incluir al menos una letra mayúscula, una letra minúscula, " +
                    "un número y un carácter especial");
        }

        return new Password(password, false);
    }

    /**
     * Método de fábrica para crear una instancia de Password a partir de una
     * contraseña hasheada.
     *
     * @param hashedPassword La contraseña hasheada
     * @return Una nueva instancia de Password
     */
    public static Password createHashed(final String hashedPassword) {
        if (hashedPassword == null || hashedPassword.trim().isEmpty()) {
            throw new InvalidPasswordException("La contraseña hasheada no puede estar vacía");
        }

        return new Password(hashedPassword, true);
    }

    /**
     * Devuelve el valor de la contraseña.
     *
     * @return El valor de la contraseña
     */
    public String getValue() {
        return value;
    }

    /**
     * Indica si la contraseña está hasheada.
     *
     * @return true si la contraseña está hasheada, false en caso contrario
     */
    public boolean isHashed() {
        return isHashed;
    }

    @Override
    protected boolean doEquals(final AbstractValueObject other) {
        Password that = (Password) other;
        return Objects.equals(value, that.value) && isHashed == that.isHashed;
    }

    @Override
    protected int doHashCode() {
        return Objects.hash(value, isHashed);
    }

    @Override
    public String toString() {
        return isHashed ? value : "********";
    }
}

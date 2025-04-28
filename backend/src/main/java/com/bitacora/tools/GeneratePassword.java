package com.bitacora.tools;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utilidad para generar hashes de contraseñas con BCrypt.
 * Esta clase se puede ejecutar como una aplicación independiente para generar
 * hashes de contraseñas que se pueden usar en la base de datos.
 */
public final class GeneratePassword {

    /**
     * Constructor privado para evitar instanciación.
     * Esta es una clase de utilidad que solo debe usarse a través de sus métodos
     * estáticos.
     */
    private GeneratePassword() {
        throw new UnsupportedOperationException("Esta es una clase de utilidad y no debe ser instanciada");
    }

    /**
     * Método principal que genera un hash BCrypt para una contraseña.
     *
     * @param args Los argumentos de línea de comandos (no se utilizan)
     */
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        // Contraseña a cifrar
        String password = "Test@1234";

        // Generar el hash
        String hashedPassword = encoder.encode(password);

        System.out.println("Contraseña original: " + password);
        System.out.println("Contraseña cifrada: " + hashedPassword);

        // Verificar que el hash es correcto
        boolean matches = encoder.matches(password, hashedPassword);
        System.out.println("¿Coincide? " + matches);

        // Verificar con el hash que estamos usando en data.sql
        String storedHash = "$2a$10$OwYFEBAPRIl4Pf9Q0VHV7.LbL9Ym0KeHuONF1R.4A.28v8Bq/mEOi";
        boolean matchesStored = encoder.matches(password, storedHash);
        System.out.println("¿Coincide con el hash almacenado? " + matchesStored);

        // Verificar con el hash original
        String originalHash = "$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG";
        boolean matchesOriginal = encoder.matches(password, originalHash);
        System.out.println("¿Coincide con el hash original? " + matchesOriginal);
    }
}

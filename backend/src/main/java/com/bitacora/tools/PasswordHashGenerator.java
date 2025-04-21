package com.bitacora.tools;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utilidad para generar hashes BCrypt para contraseñas.
 * Esta clase se puede ejecutar directamente para generar un hash BCrypt para
 * una contraseña.
 */
public class PasswordHashGenerator {

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
    }
}

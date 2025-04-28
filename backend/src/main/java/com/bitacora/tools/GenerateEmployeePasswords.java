package com.bitacora.tools;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utilidad para generar hashes BCrypt para contraseñas de empleados.
 * Esta clase se puede ejecutar directamente para generar hashes BCrypt para
 * contraseñas en formato "legajo@Pass".
 */
public final class GenerateEmployeePasswords {

    /**
     * Número de legajo inicial para la generación de contraseñas.
     */
    private static final int LEGAJO_INICIAL = 1001;

    /**
     * Número de legajo final para la generación de contraseñas.
     */
    private static final int LEGAJO_FINAL = 1020;

    /**
     * Constructor privado para evitar instanciación.
     * Esta es una clase de utilidad que solo debe usarse a través de sus métodos
     * estáticos.
     */
    private GenerateEmployeePasswords() {
        throw new UnsupportedOperationException("Esta es una clase de utilidad y no debe ser instanciada");
    }

    /**
     * Método principal que genera hashes BCrypt para contraseñas de empleados.
     *
     * @param args Los argumentos de línea de comandos (no se utilizan)
     */
    public static void main(final String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        // Generar hashes para contraseñas en formato "legajo@Pass"
        for (int legajo = LEGAJO_INICIAL; legajo <= LEGAJO_FINAL; legajo++) {
            String password = legajo + "@Pass";
            String hashedPassword = encoder.encode(password);

            System.out.println("-- Legajo " + legajo + " (" + password + ")");
            System.out.println("UPDATE users");
            System.out.println("SET password = '" + hashedPassword + "'");
            System.out.println("WHERE username = '???';");
            System.out.println();
        }

        // Verificar la contraseña del admin
        String adminPassword = "Admin@123";
        String adminHash = "$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy";
        boolean adminMatches = encoder.matches(adminPassword, adminHash);
        System.out.println("-- Admin password check");
        System.out.println("Password: " + adminPassword);
        System.out.println("Hash: " + adminHash);
        System.out.println("Matches: " + adminMatches);

        // Generar un nuevo hash para la contraseña del admin
        String newAdminHash = encoder.encode(adminPassword);
        System.out.println("New hash: " + newAdminHash);
        System.out.println("Matches with new hash: " + encoder.matches(adminPassword, newAdminHash));
    }
}

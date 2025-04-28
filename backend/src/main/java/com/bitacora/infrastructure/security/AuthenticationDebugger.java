package com.bitacora.infrastructure.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Clase para depurar problemas de autenticación.
 * Solo se activa en el perfil "dev".
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
@Profile("dev")
public class AuthenticationDebugger {

    private final PasswordEncoder passwordEncoder;

    /**
     * Verifica el funcionamiento del codificador de contraseñas.
     *
     * @return Un CommandLineRunner que se ejecuta al inicio
     */
    @Bean
    public CommandLineRunner debugAuthentication() {
        return args -> {
            log.info("Iniciando depuración de autenticación...");

            // Contraseñas de prueba
            String[] passwords = { "Admin@123", "Usuario@123", "test123", "Test@1234" };

            // Hash conocido para Admin@123
            String knownHash = "$2a$10$WpD2XYoCOJRS/4sMniLhGeEuAhvjmjQafgnP1kWHf537L/tBRD0fy";

            log.info("Verificando hash conocido para 'Admin@123': {}", knownHash);

            // Verificar cada contraseña contra el hash conocido
            for (String password : passwords) {
                boolean matches = passwordEncoder.matches(password, knownHash);
                log.info("¿La contraseña '{}' coincide con el hash conocido? {}", password, matches);

                // Generar un nuevo hash para cada contraseña
                String newHash = passwordEncoder.encode(password);
                log.info("Nuevo hash para '{}': {}", password, newHash);

                // Verificar que la contraseña coincide con el nuevo hash
                boolean matchesNewHash = passwordEncoder.matches(password, newHash);
                log.info("¿La contraseña '{}' coincide con el nuevo hash? {}", password, matchesNewHash);

                log.info("---");
            }

            log.info("Depuración de autenticación completada");
        };
    }
}

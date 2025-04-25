package com.bitacora;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

/**
 * Clase principal de la aplicación Bitácora.
 * Configura y arranca la aplicación Spring Boot.
 */
@SpringBootApplication
@EnableCaching
public class BitacoraApplication {

    /**
     * Método principal que inicia la aplicación.
     *
     * @param args Argumentos de línea de comandos
     */
    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(BitacoraApplication.class);

        // Agregar el perfil de flyway para resolver la dependencia circular
        application.setAdditionalProfiles("flyway");

        application.run(args);
    }
}

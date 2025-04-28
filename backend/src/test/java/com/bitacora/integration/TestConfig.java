package com.bitacora.integration;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración específica para pruebas de integración.
 * Desactiva Flyway para evitar conflictos con la configuración de prueba.
 */
@Configuration
@EnableAutoConfiguration(exclude = {FlywayAutoConfiguration.class})
public class TestConfig {
    // Esta clase de configuración desactiva Flyway para las pruebas de integración
}

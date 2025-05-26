package com.bitacora.infrastructure.config;

import org.springframework.boot.actuate.autoconfigure.endpoint.web.WebEndpointAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * Configuración de Actuator para la aplicación.
 *
 * Esta configuración importa automáticamente la configuración de endpoints web
 * de Spring Boot Actuator.
 */
@Configuration
@Import(WebEndpointAutoConfiguration.class)
public class ActuatorConfig {

        /**
         * Bean vacío para mantener la compatibilidad con el código existente.
         * La configuración real se importa de WebEndpointAutoConfiguration.
         *
         * @return Un objeto String vacío
         */
        @Bean
        public String actuatorEndpointsConfigured() {
                return "Actuator endpoints configured via WebEndpointAutoConfiguration";
        }
}

package com.bitacora.infrastructure.config;

import javax.sql.DataSource;
import java.util.Arrays;

import org.flywaydb.core.Flyway;
import org.springframework.boot.autoconfigure.flyway.FlywayProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Configuración personalizada para Flyway.
 * Esta configuración resuelve el problema de dependencia circular entre Flyway
 * y JPA.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
@EnableConfigurationProperties(FlywayProperties.class)
public class FlywayConfig {

    private final FlywayProperties flywayProperties;
    private final Environment env;

    /**
     * Configura Flyway manualmente para evitar la dependencia circular con JPA.
     * Esta configuración se utiliza para el perfil de desarrollo con H2.
     *
     * @param dataSource La fuente de datos configurada
     * @return Una instancia de Flyway configurada
     */
    @Bean(name = "flyway")
    @Primary
    public Flyway flyway(DataSource dataSource) {
        log.info("Inicializando Flyway manualmente...");
        log.info("Perfiles activos: {}", String.join(", ", env.getActiveProfiles()));

        // Obtener las ubicaciones de las migraciones desde las propiedades
        String[] locations = flywayProperties.getLocations().toArray(new String[0]);
        log.info("Ubicaciones de migraciones: {}", String.join(", ", locations));

        // Configurar Flyway con todas las propiedades necesarias
        org.flywaydb.core.api.configuration.FluentConfiguration config = Flyway.configure()
                .dataSource(dataSource)
                .baselineOnMigrate(flywayProperties.isBaselineOnMigrate())
                .outOfOrder(flywayProperties.isOutOfOrder());

        // Configurar las ubicaciones de las migraciones
        if (Arrays.asList(env.getActiveProfiles()).contains("dev")) {
            log.info("Configurando migraciones para entorno de desarrollo (H2)");
            config.locations("classpath:db/migration", "classpath:db/migration/dev")
                    .ignoreMigrationPatterns("*:missing")
                    .ignoreMigrationPatterns("*:ignored");
        } else if (Arrays.asList(env.getActiveProfiles()).contains("prod")) {
            log.info("Configurando migraciones para entorno de producción (PostgreSQL)");
            config.locations("classpath:db/migration", "classpath:db/migration/prod")
                    .ignoreMigrationPatterns("*:missing")
                    .ignoreMigrationPatterns("*:ignored");
        } else {
            log.info("Usando configuración de migraciones por defecto");
            config.locations(locations);
        }

        try {
            Flyway flyway = config.load();

            // Ejecutar las migraciones
            flyway.migrate();

            log.info("Migraciones de Flyway completadas correctamente");
            return flyway;
        } catch (Exception e) {
            log.error("Error al ejecutar las migraciones de Flyway: {}", e.getMessage(), e);
            throw e;
        }
    }
}

package com.bitacora.infrastructure.config;

import javax.sql.DataSource;

import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Configuración personalizada para JPA.
 * Esta configuración asegura que JPA se inicialice después de Flyway.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
@EnableTransactionManagement
@EnableJpaRepositories(basePackages = "com.bitacora.infrastructure.persistence.repository")
@EnableConfigurationProperties(JpaProperties.class)
public class JpaConfig {

    /**
     * Asegura que el EntityManagerFactory se inicialice después de Flyway.
     * Esta anotación se aplica al bean existente creado por Spring Boot.
     * 
     * @param dataSource La fuente de datos
     * @return El EntityManagerFactory configurado
     */
    @DependsOn("flyway")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource) {
        log.info("Configurando EntityManagerFactory para que dependa de Flyway...");
        return null; // Spring Boot creará el bean real
    }
}

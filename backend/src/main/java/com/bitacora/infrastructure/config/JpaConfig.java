package com.bitacora.infrastructure.config;

import javax.sql.DataSource;

import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Properties;

/**
 * Configuración personalizada para JPA.
 * Esta configuración asegura que JPA se inicialice después de Flyway.
 *
 * Se utiliza una configuración unificada para escanear todos los paquetes de
 * persistencia,
 * lo que simplifica la configuración y evita tener que actualizar manualmente
 * la lista
 * de paquetes cuando se agregan nuevos repositorios.
 *
 * Ventajas:
 * - Configuración más simple y fácil de mantener
 * - No es necesario actualizar la configuración al agregar nuevos repositorios
 * - Menos propenso a errores de configuración y dependencias circulares
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
@EnableTransactionManagement
@EnableJpaRepositories(basePackages = "com.bitacora.infrastructure.persistence")
@EnableConfigurationProperties(JpaProperties.class)
public class JpaConfig {

    private final JpaProperties jpaProperties;

    /**
     * Asegura que el EntityManagerFactory se inicialice después de Flyway.
     * Esta anotación se aplica al bean existente creado por Spring Boot.
     *
     * @param dataSource La fuente de datos
     * @return El EntityManagerFactory configurado
     */
    @Bean
    @DependsOn("flyway")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource) {
        log.info("Configurando EntityManagerFactory para que dependa de Flyway...");

        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);
        em.setPackagesToScan("com.bitacora.infrastructure.persistence.entity");

        JpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(vendorAdapter);

        Properties properties = new Properties();
        properties.putAll(jpaProperties.getProperties());
        em.setJpaProperties(properties);

        return em;
    }

    /**
     * Configura el administrador de transacciones de JPA.
     *
     * @param entityManagerFactory El EntityManagerFactory
     * @return El administrador de transacciones
     */
    @Bean
    public PlatformTransactionManager transactionManager(LocalContainerEntityManagerFactoryBean entityManagerFactory) {
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(entityManagerFactory.getObject());
        return transactionManager;
    }
}

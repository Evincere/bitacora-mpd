package com.bitacora.infrastructure.config;

import jakarta.servlet.MultipartConfigElement;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

/**
 * Configuración para la carga de archivos multipart.
 * Esta clase configura los límites de tamaño para la carga de archivos.
 */
@Configuration
public class MultipartConfig {

    @Value("${spring.servlet.multipart.max-file-size:15MB}")
    private String maxFileSize;

    @Value("${spring.servlet.multipart.max-request-size:20MB}")
    private String maxRequestSize;

    /**
     * Configura el resolvedor de multipart para Spring.
     *
     * @return El resolvedor de multipart configurado
     */
    @Bean
    public MultipartResolver multipartResolver() {
        return new StandardServletMultipartResolver();
    }

    /**
     * Configura los límites de tamaño para la carga de archivos multipart.
     *
     * @return La configuración de multipart
     */
    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        
        // Configurar el tamaño máximo de archivo
        factory.setMaxFileSize(DataSize.parse(maxFileSize));
        
        // Configurar el tamaño máximo de solicitud
        factory.setMaxRequestSize(DataSize.parse(maxRequestSize));
        
        return factory.createMultipartConfig();
    }
}

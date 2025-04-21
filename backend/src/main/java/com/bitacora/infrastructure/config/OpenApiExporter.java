package com.bitacora.infrastructure.config;

import io.swagger.v3.oas.models.OpenAPI;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Configuración para exportar la especificación OpenAPI a un archivo JSON.
 * Este archivo será utilizado por el generador de código TypeScript.
 */
@Configuration
@Slf4j
public class OpenApiExporter {

    @Autowired
    @Qualifier("customOpenAPI")
    private OpenAPI openAPI; // Inyecta específicamente el bean customOpenAPI de OpenApiConfig

    @Value("${openapi.output.file:target/openapi.json}")
    private String outputFilePath;

    @Value("${openapi.export:false}")
    private boolean exportOpenApi;

    /**
     * Exporta la especificación OpenAPI a un archivo JSON cuando se ejecuta la
     * aplicación
     * con el perfil "export-openapi".
     *
     * @return Un CommandLineRunner que exporta la especificación
     */
    @Bean
    @Profile("export-openapi")
    public CommandLineRunner exportOpenApiSpec() {
        return args -> {
            log.info("Exportando especificación OpenAPI a JSON...");
            exportOpenApiToFile();
            // Salir de la aplicación después de exportar
            System.exit(0);
        };
    }

    /**
     * Exporta la especificación OpenAPI a un archivo JSON cuando la aplicación está
     * lista
     * y la propiedad openapi.export está establecida en true.
     */
    @EventListener(ApplicationReadyEvent.class)
    public void exportOpenApiOnStartup() {
        if (exportOpenApi) {
            log.info("Exportando especificación OpenAPI a JSON durante el inicio...");
            exportOpenApiToFile();
        }
    }

    /**
     * Método común para exportar la especificación OpenAPI a un archivo JSON.
     */
    private void exportOpenApiToFile() {
        try {
            // Crear el directorio si no existe
            Path outputPath = Paths.get(outputFilePath);
            Files.createDirectories(outputPath.getParent());

            // Convertir la especificación OpenAPI a JSON
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            mapper.findAndRegisterModules();

            // Guardar el archivo JSON
            File outputFile = outputPath.toFile();
            mapper.writerWithDefaultPrettyPrinter().writeValue(outputFile, openAPI);

            log.info("Especificación OpenAPI exportada a: {}", outputFile.getAbsolutePath());
        } catch (Exception e) {
            log.error("Error al exportar la especificación OpenAPI", e);
            throw new RuntimeException("Error al exportar la especificación OpenAPI", e);
        }
    }
}

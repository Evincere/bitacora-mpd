package com.bitacora.infrastructure.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.core.util.Json;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Aplicación independiente para generar la especificación OpenAPI.
 * Esta clase se puede ejecutar directamente para generar el archivo
 * openapi.json.
 *
 * NOTA: Esta clase no debe ser detectada como una clase principal por Spring
 * Boot.
 * Se ha movido a un paquete separado y se ha renombrado para evitar conflictos.
 */
@Configuration
@Profile("export-openapi-cli")
public class OpenApiExporterCli {

    public static void main(String[] args) {
        SpringApplication.run(OpenApiExporterCli.class, args);
    }

    @Bean(name = "exporterOpenAPI")
    public OpenAPI exporterOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Bitácora MPD API")
                        .version("1.0.0")
                        .description("API para la aplicación Bitácora MPD")
                        .license(new License().name("Propiedad del Ministerio Público de la Defensa")))
                .addServersItem(new Server().url("/api").description("Servidor de desarrollo"));
    }

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("public")
                .pathsToMatch("/api/**")
                .build();
    }

    @Bean
    public CommandLineRunner exportOpenApiSpec(OpenAPI exporterOpenAPI) {
        return args -> {
            System.out.println("Exportando especificación OpenAPI a JSON...");

            // Crear el directorio target si no existe
            Path targetDir = Paths.get("target");
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }

            // Convertir la especificación OpenAPI a JSON
            ObjectMapper mapper = Json.mapper();

            // Guardar el archivo JSON
            File outputFile = new File("target/openapi.json");
            mapper.writerWithDefaultPrettyPrinter().writeValue(outputFile, exporterOpenAPI);

            System.out.println("Especificación OpenAPI exportada a: " + outputFile.getAbsolutePath());

            // Salir de la aplicación
            System.exit(0);
        };
    }
}

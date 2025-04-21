package com.bitacora.infrastructure.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

/**
 * Configuración de OpenAPI para la documentación de la API.
 * Esta clase configura la documentación de la API utilizando OpenAPI 3.0.
 */
@Configuration
@OpenAPIDefinition
@SecurityScheme(name = "JWT", type = SecuritySchemeType.HTTP, bearerFormat = "JWT", scheme = "bearer")
public class OpenApiConfig {

        @Value("${spring.profiles.active:dev}")
        private String activeProfile;

        /**
         * Configura la documentación de OpenAPI.
         *
         * @return La configuración de OpenAPI
         */
        @Bean(name = "customOpenAPI")
        public OpenAPI customOpenAPI() {
                return new OpenAPI()
                                .info(getApiInfo())
                                .servers(getServers())
                                .tags(getTags())
                                .addSecurityItem(new SecurityRequirement().addList("JWT"))
                                .components(new Components()
                                                .addSecuritySchemes("JWT",
                                                                new io.swagger.v3.oas.models.security.SecurityScheme()
                                                                                .type(io.swagger.v3.oas.models.security.SecurityScheme.Type.HTTP)
                                                                                .scheme("bearer")
                                                                                .bearerFormat("JWT")
                                                                                .in(io.swagger.v3.oas.models.security.SecurityScheme.In.HEADER)
                                                                                .name("Authorization")));
        }

        /**
         * Configura la información general de la API.
         *
         * @return Objeto Info con la información de la API
         */
        private Info getApiInfo() {
                return new Info()
                                .title("Bitácora MPD API")
                                .description(
                                                "API REST para la gestión de actividades del Ministerio Público de la Defensa. "
                                                                +
                                                                "Esta API permite registrar, consultar y gestionar actividades realizadas por los agentes del MPD, "
                                                                +
                                                                "así como administrar usuarios y generar reportes.")
                                .version("1.0.0")
                                .termsOfService("https://www.mpd.gov.ar/terminos")
                                .contact(new Contact()
                                                .name("Equipo de Desarrollo")
                                                .email("desarrollo@mpd.gov.ar")
                                                .url("https://www.mpd.gov.ar"))
                                .license(new License()
                                                .name("Licencia MPD")
                                                .url("https://www.mpd.gov.ar/licencia"));
        }

        /**
         * Configura los servidores disponibles para la API.
         *
         * @return Lista de servidores
         */
        private List<Server> getServers() {
                Server devServer = new Server()
                                .url("http://localhost:8080/api")
                                .description("Servidor de desarrollo");

                Server prodServer = new Server()
                                .url("https://api.mpd.gov.ar")
                                .description("Servidor de producción");

                return Arrays.asList(devServer, prodServer);
        }

        /**
         * Configura las etiquetas (tags) para agrupar los endpoints.
         *
         * @return Lista de etiquetas
         */
        private List<Tag> getTags() {
                Tag authTag = new Tag()
                                .name("Autenticación")
                                .description("Operaciones relacionadas con la autenticación y autorización");

                Tag activitiesTag = new Tag()
                                .name("Actividades")
                                .description("Operaciones para gestionar actividades");

                Tag usersTag = new Tag()
                                .name("Usuarios")
                                .description("Operaciones para gestionar usuarios");

                Tag reportsTag = new Tag()
                                .name("Reportes")
                                .description("Operaciones para generar reportes y estadísticas");

                return Arrays.asList(authTag, activitiesTag, usersTag, reportsTag);
        }
}

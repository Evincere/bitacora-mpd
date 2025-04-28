package com.bitacora.tools;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.core.util.Json;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Utilidad para generar el archivo OpenAPI JSON.
 * Esta clase es una herramienta independiente y no forma parte de la aplicación
 * Spring Boot.
 */
public final class OpenApiGenerator {

        private OpenApiGenerator() {
                // Constructor privado para evitar instanciación
        }

        /**
         * Método principal para generar el archivo OpenAPI JSON.
         *
         * @param args Argumentos de línea de comandos (no utilizados)
         */
        @SuppressWarnings("unchecked")
        public static void main(String[] args) {
                try {
                        System.out.println("Generando especificación OpenAPI...");

                        // Crear el directorio target si no existe
                        Path targetDir = Paths.get("target");
                        if (!Files.exists(targetDir)) {
                                Files.createDirectories(targetDir);
                        }

                        // Crear la especificación OpenAPI
                        License license = new License().name("Propiedad del Ministerio Público de la Defensa");

                        Info info = new Info()
                                        .title("Bitácora MPD API")
                                        .version("1.0.0")
                                        .description("API para la aplicación Bitácora MPD")
                                        .license(license);

                        Server server = new Server()
                                        .url("/api")
                                        .description("Servidor de desarrollo");

                        OpenAPI openAPI = new OpenAPI()
                                        .info(info)
                                        .addServersItem(server);

                        // Agregar al menos un path para que la especificación sea válida
                        io.swagger.v3.oas.models.PathItem loginPath = new io.swagger.v3.oas.models.PathItem();
                        io.swagger.v3.oas.models.Operation loginOperation = new io.swagger.v3.oas.models.Operation()
                                        .addTagsItem("Autenticación")
                                        .summary("Iniciar sesión")
                                        .operationId("login");

                        // Agregar el cuerpo de la solicitud
                        io.swagger.v3.oas.models.media.Schema<Object> usernameSchema = new io.swagger.v3.oas.models.media.Schema<>()
                                        .type("string");
                        io.swagger.v3.oas.models.media.Schema<Object> passwordSchema = new io.swagger.v3.oas.models.media.Schema<>()
                                        .type("string");

                        io.swagger.v3.oas.models.media.Schema<Object> authRequestSchema = new io.swagger.v3.oas.models.media.Schema<>()
                                        .type("object")
                                        .addProperty("username", usernameSchema)
                                        .addProperty("password", passwordSchema);

                        // Crear esquema para el usuario
                        io.swagger.v3.oas.models.media.Schema<Object> idSchema = new io.swagger.v3.oas.models.media.Schema<>()
                                        .type("string");
                        io.swagger.v3.oas.models.media.Schema<Object> usernameSchema2 = new io.swagger.v3.oas.models.media.Schema<>()
                                        .type("string");
                        io.swagger.v3.oas.models.media.Schema<Object> emailSchema = new io.swagger.v3.oas.models.media.Schema<>()
                                        .type("string");
                        io.swagger.v3.oas.models.media.Schema<Object> firstNameSchema = new io.swagger.v3.oas.models.media.Schema<>()
                                        .type("string");
                        io.swagger.v3.oas.models.media.Schema<Object> lastNameSchema = new io.swagger.v3.oas.models.media.Schema<>()
                                        .type("string");
                        io.swagger.v3.oas.models.media.Schema<Object> roleSchema = new io.swagger.v3.oas.models.media.Schema<>()
                                        .type("string");

                        io.swagger.v3.oas.models.media.Schema<Object> userSchema = new io.swagger.v3.oas.models.media.Schema<>()
                                        .type("object")
                                        .addProperty("id", idSchema)
                                        .addProperty("username", usernameSchema2)
                                        .addProperty("email", emailSchema)
                                        .addProperty("firstName", firstNameSchema)
                                        .addProperty("lastName", lastNameSchema)
                                        .addProperty("role", roleSchema);

                        // Crear esquema para la respuesta de autenticación
                        io.swagger.v3.oas.models.media.Schema<Object> accessTokenSchema =
                                new io.swagger.v3.oas.models.media.Schema<>().type("string");
                        io.swagger.v3.oas.models.media.Schema<Object> refreshTokenSchema =
                                new io.swagger.v3.oas.models.media.Schema<>().type("string");
                        io.swagger.v3.oas.models.media.Schema<Object> tokenTypeSchema =
                                new io.swagger.v3.oas.models.media.Schema<>().type("string");
                        io.swagger.v3.oas.models.media.Schema<Object> expiresInSchema =
                                new io.swagger.v3.oas.models.media.Schema<>().type("integer");

                        io.swagger.v3.oas.models.media.Schema<Object> authResponseSchema =
                                new io.swagger.v3.oas.models.media.Schema<>()
                                .type("object")
                                .addProperty("accessToken", accessTokenSchema)
                                .addProperty("refreshToken", refreshTokenSchema)
                                .addProperty("tokenType", tokenTypeSchema)
                                .addProperty("expiresIn", expiresInSchema)
                                .addProperty("user", userSchema);

                        // Agregar componentes
                        io.swagger.v3.oas.models.Components components = new io.swagger.v3.oas.models.Components()
                                        .addSchemas("AuthRequest", authRequestSchema)
                                        .addSchemas("AuthResponse", authResponseSchema);

                        openAPI.components(components);

                        // Configurar el cuerpo de la solicitud
                        io.swagger.v3.oas.models.parameters.RequestBody requestBody = new io.swagger.v3.oas.models.parameters.RequestBody()
                                        .content(new io.swagger.v3.oas.models.media.Content()
                                                        .addMediaType("application/json",
                                                                        new io.swagger.v3.oas.models.media.MediaType()
                                                                                        .schema(new io.swagger.v3.oas.models.media.Schema<>()
                                                                                                        .$ref("#/components/schemas/AuthRequest"))));

                        loginOperation.requestBody(requestBody);

                        // Configurar la respuesta
                        io.swagger.v3.oas.models.responses.ApiResponse okResponse = new io.swagger.v3.oas.models.responses.ApiResponse()
                                        .description("Autenticación exitosa")
                                        .content(new io.swagger.v3.oas.models.media.Content()
                                                        .addMediaType("application/json",
                                                                        new io.swagger.v3.oas.models.media.MediaType()
                                                                                        .schema(new io.swagger.v3.oas.models.media.Schema<>()
                                                                                                        .$ref("#/components/schemas/AuthResponse"))));

                        loginOperation.responses(new io.swagger.v3.oas.models.responses.ApiResponses()
                                        .addApiResponse("200", okResponse));

                        loginPath.post(loginOperation);

                        // Agregar el path a la especificación
                        openAPI.path("/auth/login", loginPath);

                        // Convertir la especificación OpenAPI a JSON
                        ObjectMapper mapper = Json.mapper();

                        // Guardar el archivo JSON
                        File outputFile = new File("target/openapi.json");
                        mapper.writerWithDefaultPrettyPrinter().writeValue(outputFile, openAPI);

                        System.out.println("Especificación OpenAPI exportada a: " + outputFile.getAbsolutePath());
                } catch (Exception e) {
                        System.err.println("Error al generar la especificación OpenAPI: " + e.getMessage());
                        e.printStackTrace();
                        System.exit(1);
                }
        }
}

package com.bitacora.infrastructure.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

/**
 * Configuración para datos iniciales del sistema.
 * 
 * Esta clase permite cargar datos iniciales desde archivos de configuración
 * en lugar de tenerlos hardcodeados en el código.
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "bitacora.initial-data")
public class InitialDataConfig {

    /**
     * Indica si se deben inicializar los datos al arrancar la aplicación.
     */
    private boolean enabled = true;

    /**
     * Perfil de datos a cargar (dev, test, prod).
     */
    private String profile = "dev";

    /**
     * Configuración de usuarios iniciales.
     */
    private UsersConfig users = new UsersConfig();

    /**
     * Configuración de roles y permisos.
     */
    private RolesConfig roles = new RolesConfig();

    /**
     * Configuración de actividades de ejemplo.
     */
    private ActivitiesConfig activities = new ActivitiesConfig();

    @Data
    public static class UsersConfig {
        /**
         * Lista de usuarios a crear.
         */
        private List<UserConfig> list = List.of();

        /**
         * Configuración de contraseñas por defecto.
         */
        private PasswordDefaults passwordDefaults = new PasswordDefaults();
    }

    @Data
    public static class UserConfig {
        private String username;
        private String password;
        private String email;
        private String firstName;
        private String lastName;
        private String role;
        private String position;
        private String department;
        private boolean active = true;
        private List<String> permissions = List.of();
    }

    @Data
    public static class PasswordDefaults {
        /**
         * Contraseña por defecto para usuarios admin.
         */
        private String admin = "${ADMIN_PASSWORD:Admin@123}";

        /**
         * Contraseña por defecto para usuarios regulares.
         */
        private String user = "${USER_PASSWORD:Usuario@123}";

        /**
         * Contraseña por defecto para usuarios de prueba.
         */
        private String test = "${TEST_PASSWORD:test123}";
    }

    @Data
    public static class RolesConfig {
        /**
         * Lista de roles a crear.
         */
        private List<RoleConfig> list = List.of();
    }

    @Data
    public static class RoleConfig {
        private String name;
        private String description;
        private List<String> permissions = List.of();
    }

    @Data
    public static class ActivitiesConfig {
        /**
         * Indica si se deben crear actividades de ejemplo.
         */
        private boolean enabled = true;

        /**
         * Número de actividades de ejemplo a crear.
         */
        private int count = 3;

        /**
         * Lista de actividades predefinidas.
         */
        private List<ActivityConfig> list = List.of();
    }

    @Data
    public static class ActivityConfig {
        private String type;
        private String description;
        private String person;
        private String role;
        private String dependency;
        private String situation;
        private String result;
        private String status;
        private String comments;
        private String agent;
        private String assignedUsername;
        private int daysOffset = 0; // Días desde hoy (negativo para el pasado)
    }

    /**
     * Configuración específica por ambiente.
     */
    @Data
    public static class EnvironmentConfig {
        /**
         * Variables de entorno soportadas.
         */
        private Map<String, String> environmentVariables = Map.of();

        /**
         * Configuraciones específicas del ambiente.
         */
        private Map<String, Object> settings = Map.of();
    }
}

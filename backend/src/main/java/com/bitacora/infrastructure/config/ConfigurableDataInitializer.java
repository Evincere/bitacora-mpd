package com.bitacora.infrastructure.config;

import com.bitacora.domain.model.user.Email;
import com.bitacora.domain.model.user.Password;
import com.bitacora.domain.model.user.Permission;
import com.bitacora.domain.model.user.PersonName;
import com.bitacora.domain.model.user.User;
import com.bitacora.domain.model.user.UserRole;
import com.bitacora.domain.port.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Inicializador de datos configurable que carga datos desde archivos de configuración.
 * 
 * Esta clase reemplaza el DataInitializer hardcodeado y permite configurar
 * los datos iniciales mediante archivos YAML/Properties.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
@Profile("configurable-data-init")
public class ConfigurableDataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final InitialDataConfig initialDataConfig;
    private final Environment environment;

    /**
     * Inicializa datos configurables al arrancar la aplicación.
     */
    @Bean
    public CommandLineRunner initConfigurableData() {
        return args -> {
            if (!initialDataConfig.isEnabled()) {
                log.info("Inicialización de datos configurables deshabilitada");
                return;
            }

            log.info("Inicializando datos configurables (perfil: {})...", initialDataConfig.getProfile());
            
            try {
                initializeUsers();
                log.info("Datos configurables inicializados correctamente");
            } catch (Exception e) {
                log.error("Error al inicializar datos configurables", e);
                throw e;
            }
        };
    }

    /**
     * Inicializa usuarios desde la configuración.
     */
    private void initializeUsers() {
        var usersConfig = initialDataConfig.getUsers();
        
        if (usersConfig.getList().isEmpty()) {
            log.info("No hay usuarios configurados para inicializar");
            return;
        }

        for (var userConfig : usersConfig.getList()) {
            createUserFromConfig(userConfig, usersConfig);
        }
    }

    /**
     * Crea un usuario desde la configuración.
     */
    private void createUserFromConfig(InitialDataConfig.UserConfig userConfig, 
                                    InitialDataConfig.UsersConfig usersConfig) {
        
        // Verificar si el usuario ya existe
        if (userRepository.findByUsername(userConfig.getUsername()).isPresent()) {
            log.info("El usuario '{}' ya existe, omitiendo creación", userConfig.getUsername());
            return;
        }

        try {
            // Resolver contraseña
            String password = resolvePassword(userConfig, usersConfig);
            String hashedPassword = passwordEncoder.encode(password);

            // Crear conjunto de permisos
            Set<Permission> permissions = new HashSet<>();
            for (String permissionName : userConfig.getPermissions()) {
                try {
                    Permission permission = Permission.valueOf(permissionName);
                    permissions.add(permission);
                } catch (IllegalArgumentException e) {
                    log.warn("Permiso desconocido '{}' para usuario '{}'", permissionName, userConfig.getUsername());
                }
            }

            // Crear usuario
            User user = User.builder()
                    .username(userConfig.getUsername())
                    .password(Password.createHashed(hashedPassword))
                    .email(Email.of(userConfig.getEmail()))
                    .personName(PersonName.of(userConfig.getFirstName(), userConfig.getLastName()))
                    .role(UserRole.valueOf(userConfig.getRole()))
                    .position(userConfig.getPosition())
                    .department(userConfig.getDepartment())
                    .active(userConfig.isActive())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .permissions(permissions)
                    .build();

            userRepository.save(user);
            
            log.info("Usuario '{}' creado correctamente (rol: {}, permisos: {})", 
                    userConfig.getUsername(), userConfig.getRole(), userConfig.getPermissions().size());
            
            // Log de credenciales solo en desarrollo
            if (isDevProfile()) {
                log.info("Credenciales: {} / {}", userConfig.getUsername(), password);
            }
            
        } catch (Exception e) {
            log.error("Error al crear usuario '{}'", userConfig.getUsername(), e);
        }
    }

    /**
     * Resuelve la contraseña del usuario, considerando variables de entorno y valores por defecto.
     */
    private String resolvePassword(InitialDataConfig.UserConfig userConfig, 
                                 InitialDataConfig.UsersConfig usersConfig) {
        
        // Si tiene contraseña específica, usarla
        if (userConfig.getPassword() != null && !userConfig.getPassword().isEmpty()) {
            return resolveEnvironmentVariable(userConfig.getPassword());
        }

        // Usar contraseña por defecto según el rol
        String defaultPassword = switch (userConfig.getRole()) {
            case "ADMIN" -> usersConfig.getPasswordDefaults().getAdmin();
            case "USUARIO" -> usersConfig.getPasswordDefaults().getUser();
            default -> usersConfig.getPasswordDefaults().getTest();
        };

        return resolveEnvironmentVariable(defaultPassword);
    }

    /**
     * Resuelve variables de entorno en formato ${VAR:default}.
     */
    private String resolveEnvironmentVariable(String value) {
        if (value == null || !value.contains("${")) {
            return value;
        }

        // Resolver usando Spring Environment
        return environment.resolvePlaceholders(value);
    }

    /**
     * Verifica si estamos en perfil de desarrollo.
     */
    private boolean isDevProfile() {
        String[] activeProfiles = environment.getActiveProfiles();
        for (String profile : activeProfiles) {
            if ("dev".equals(profile) || "development".equals(profile)) {
                return true;
            }
        }
        return false;
    }
}

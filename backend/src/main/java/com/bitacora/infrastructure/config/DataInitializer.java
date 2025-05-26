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
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Clase para inicializar datos de prueba en la aplicación.
 *
 * ⚠️ OBSOLETO: Esta clase contiene datos hardcodeados y está marcada como
 * obsoleta.
 *
 * Se recomienda usar:
 * 1. ConfigurableDataInitializer con perfil "configurable-data-init" para datos
 * configurables
 * 2. Migraciones de Flyway para datos persistentes
 *
 * Esta clase se mantiene solo para compatibilidad hacia atrás y se activará
 * únicamente con el perfil "legacy-data-init".
 *
 * @deprecated Usar ConfigurableDataInitializer en su lugar
 * @see ConfigurableDataInitializer
 * @see backend/README-DATA-INITIALIZATION.md para más información.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
@Profile("legacy-data-init") // Cambiado a perfil legacy
@Deprecated(since = "2024-12", forRemoval = true)
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Inicializa datos de prueba al arrancar la aplicación.
     *
     * @deprecated Usar ConfigurableDataInitializer en su lugar
     * @return Un CommandLineRunner que se ejecuta al inicio
     */
    @Bean
    @Deprecated(since = "2024-12", forRemoval = true)
    public CommandLineRunner initData() {
        return args -> {
            log.warn("⚠️ ADVERTENCIA: Usando DataInitializer OBSOLETO (perfil 'legacy-data-init' activo)");
            log.warn("⚠️ Este mecanismo contiene datos hardcodeados y será eliminado en futuras versiones");
            log.warn("⚠️ Se recomienda migrar a ConfigurableDataInitializer con perfil 'configurable-data-init'");
            log.warn("⚠️ Ver documentación en backend/README-DATA-INITIALIZATION.md para más información");

            // Crear un usuario de prueba con una contraseña conocida
            // Primero eliminamos el usuario si ya existe
            userRepository.findByUsername("testuser").ifPresent(user -> {
                log.info("Eliminando usuario de prueba existente...");
                userRepository.deleteById(user.getId());
            });

            // Crear el usuario de prueba
            createTestUser();
            log.info("Usuario de prueba creado correctamente");

            // Verificar si ya existe el usuario admin
            if (userRepository.findByUsername("admin").isEmpty()) {
                createAdminUser();
                log.info("Usuario administrador creado correctamente");
            } else {
                log.info("El usuario administrador ya existe");
            }

            // Verificar si ya existe el usuario regular
            if (userRepository.findByUsername("usuario").isEmpty()) {
                createRegularUser();
                log.info("Usuario regular creado correctamente");
            } else {
                log.info("El usuario regular ya existe");
            }

            log.info("Datos de prueba inicializados correctamente");
        };
    }

    /**
     * Crea un usuario administrador.
     */
    private void createAdminUser() {
        // Crear conjunto de permisos
        Set<Permission> adminPermissions = new HashSet<>();
        adminPermissions.add(Permission.READ_ACTIVITIES);
        adminPermissions.add(Permission.WRITE_ACTIVITIES);
        adminPermissions.add(Permission.DELETE_ACTIVITIES);
        adminPermissions.add(Permission.READ_USERS);
        adminPermissions.add(Permission.WRITE_USERS);
        adminPermissions.add(Permission.DELETE_USERS);
        adminPermissions.add(Permission.GENERATE_REPORTS);

        // Crear usuario administrador
        // Usar el hash generado por el depurador de autenticación
        // Contraseña: Admin@123
        String adminHashedPassword = "$2a$10$bieh3BVExvsBBABMSR.oduEksKK2jQhTd.r0lJQ/.HEqjPsVhH4fe";

        User adminUser = User.builder()
                .username("admin")
                .password(Password.createHashed(adminHashedPassword))
                .email(Email.of("admin@bitacora.com"))
                .personName(PersonName.of("Administrador", "Sistema"))
                .role(UserRole.ADMIN)
                .position("Administrador de Sistema")
                .department("Sistemas")
                .active(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .permissions(adminPermissions)
                .build();

        userRepository.save(adminUser);

        log.info("Credenciales del administrador: admin / Admin@123");
        log.info("Hash de la contraseña del administrador: {}", adminHashedPassword);
    }

    /**
     * Crea un usuario regular.
     */
    private void createRegularUser() {
        // Crear conjunto de permisos
        Set<Permission> userPermissions = new HashSet<>();
        userPermissions.add(Permission.READ_ACTIVITIES);
        userPermissions.add(Permission.WRITE_ACTIVITIES);

        // Crear usuario regular
        User regularUser = User.builder()
                .username("usuario")
                .password(Password.createHashed(passwordEncoder.encode("Usuario@123")))
                .email(Email.of("usuario@bitacora.com"))
                .personName(PersonName.of("Usuario", "Regular"))
                .role(UserRole.USUARIO)
                .position("Operador")
                .department("Operaciones")
                .active(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .permissions(userPermissions)
                .build();

        userRepository.save(regularUser);

        log.info("Credenciales del usuario regular: usuario / Usuario@123");
    }

    /**
     * Crea un usuario de prueba con una contraseña simple para pruebas.
     */
    private void createTestUser() {
        // Crear conjunto de permisos
        Set<Permission> adminPermissions = new HashSet<>();
        adminPermissions.add(Permission.READ_ACTIVITIES);
        adminPermissions.add(Permission.WRITE_ACTIVITIES);
        adminPermissions.add(Permission.DELETE_ACTIVITIES);
        adminPermissions.add(Permission.READ_USERS);
        adminPermissions.add(Permission.WRITE_USERS);
        adminPermissions.add(Permission.DELETE_USERS);
        adminPermissions.add(Permission.GENERATE_REPORTS);

        // Crear contraseña simple para pruebas
        String plainPassword = "test123";
        String hashedPassword = passwordEncoder.encode(plainPassword);

        // Crear usuario de prueba
        User testUser = User.builder()
                .username("testuser")
                .password(Password.createHashed(hashedPassword))
                .email(Email.of("test@bitacora.com"))
                .personName(PersonName.of("Test", "User"))
                .role(UserRole.ADMIN)
                .position("Tester")
                .department("QA")
                .active(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .permissions(adminPermissions)
                .build();

        userRepository.save(testUser);

        log.info("Credenciales del usuario de prueba: testuser / test123");
        log.info("Hash de la contraseña: {}", hashedPassword);
    }
}

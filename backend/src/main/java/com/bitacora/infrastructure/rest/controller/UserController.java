package com.bitacora.infrastructure.rest.controller;

import com.bitacora.application.permission.MentionPermissionService;
import com.bitacora.domain.model.user.*;
import com.bitacora.domain.port.UserRepository;
import com.bitacora.infrastructure.rest.dto.UserCreateDto;
import com.bitacora.infrastructure.rest.dto.UserDto;
import com.bitacora.infrastructure.rest.dto.UserUpdateDto;
import com.bitacora.infrastructure.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Controlador REST para la gestión de usuarios.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Usuarios", description = "API para la gestión de usuarios")
@SecurityRequirement(name = "JWT")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MentionPermissionService mentionPermissionService;

    /**
     * Obtiene todos los usuarios con paginación y filtros.
     *
     * @param page   El número de página (comenzando desde 0)
     * @param size   El tamaño de la página
     * @param role   Filtrar por rol (opcional)
     * @param active Filtrar por estado activo (opcional)
     * @param search Buscar por nombre, apellido o email (opcional)
     * @return Una respuesta con los usuarios y el total
     */
    @GetMapping
    @Operation(summary = "Obtener usuarios", description = "Obtiene usuarios con paginación y filtros")
    @PreAuthorize("hasAuthority('READ_USERS')")
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @Parameter(description = "Número de página (comenzando desde 0)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de la página") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Filtrar por rol (opcional)") @RequestParam(required = false) String role,
            @Parameter(description = "Filtrar por estado activo (opcional)") @RequestParam(required = false) Boolean active,
            @Parameter(description = "Buscar por nombre, apellido o email (opcional)") @RequestParam(required = false) String search) {

        // Log para depuración
        System.out.println("Accediendo a getAllUsers con verificación de permisos");
        System.out.println("Filtros aplicados - Rol: " + role + ", Activo: " + active + ", Búsqueda: " + search);

        // Convertir el rol a enum si se proporciona
        UserRole userRole = null;
        if (role != null && !role.isEmpty()) {
            try {
                userRole = UserRole.valueOf(role);
            } catch (IllegalArgumentException e) {
                System.out.println("Rol no válido: " + role);
                // Si el rol no es válido, ignorarlo
            }
        }

        // Obtener usuarios con filtros
        List<User> users;
        long totalCount;

        // Verificar si hay algún filtro aplicado
        if (userRole != null || active != null || (search != null && !search.isEmpty())) {
            // Usar el método de filtrado
            users = userRepository.findWithFilters(userRole, active, search, page, size);
            totalCount = userRepository.countWithFilters(userRole, active, search);
        } else {
            // Sin filtros, obtener todos los usuarios
            users = userRepository.findAll(page, size);
            totalCount = userRepository.count();
        }

        List<UserDto> userDtos = users.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("users", userDtos);
        response.put("totalCount", totalCount);
        response.put("currentPage", page);
        response.put("totalPages", Math.ceil((double) totalCount / size));

        return ResponseEntity.ok(response);
    }

    /**
     * Obtiene un usuario por su ID.
     *
     * @param id El ID del usuario
     * @return El usuario
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener un usuario por ID", description = "Obtiene un usuario por su ID")
    @PreAuthorize("hasAuthority('READ_USERS')")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        // Log para depuración
        System.out.println("Accediendo a getUserById con verificación de permisos, ID: " + id);
        return userRepository.findById(id)
                .map(this::mapToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Obtiene el perfil del usuario autenticado.
     *
     * @param userPrincipal El usuario autenticado
     * @return El perfil del usuario
     */
    @GetMapping("/me")
    @Operation(summary = "Obtener perfil", description = "Obtiene el perfil del usuario autenticado")
    public ResponseEntity<UserDto> getProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        // Log para depuración
        System.out.println("Accediendo a getProfile para usuario: " + userPrincipal.getUsername());
        return userRepository.findById(userPrincipal.getId())
                .map(this::mapToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crea un nuevo usuario.
     *
     * @param userCreateDto Los datos del usuario a crear
     * @return El usuario creado
     */
    @PostMapping
    @Operation(summary = "Crear un usuario", description = "Crea un nuevo usuario")
    @PreAuthorize("hasAuthority('WRITE_USERS')")
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserCreateDto userCreateDto) {
        // Verificar si el nombre de usuario ya existe
        if (userRepository.findByUsername(userCreateDto.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        // Verificar si el correo electrónico ya existe
        if (userRepository.findByEmail(userCreateDto.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        // Crear el usuario
        User user = User.builder()
                .username(userCreateDto.getUsername())
                .password(Password.createHashed(passwordEncoder.encode(userCreateDto.getPassword())))
                .email(Email.of(userCreateDto.getEmail()))
                .personName(PersonName.of(userCreateDto.getFirstName(), userCreateDto.getLastName()))
                .role(UserRole.fromString(userCreateDto.getRole()))
                .position(userCreateDto.getPosition())
                .department(userCreateDto.getDepartment())
                .active(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Agregar permisos adicionales
        if (userCreateDto.getPermissions() != null && !userCreateDto.getPermissions().isEmpty()) {
            Set<Permission> permissions = userCreateDto.getPermissions().stream()
                    .map(Permission::fromString)
                    .filter(permission -> permission != null)
                    .collect(Collectors.toSet());

            user.setPermissions(permissions);
        }

        User savedUser = userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDto(savedUser));
    }

    /**
     * Actualiza un usuario existente.
     *
     * @param id            El ID del usuario a actualizar
     * @param userUpdateDto Los datos del usuario a actualizar
     * @return El usuario actualizado
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un usuario", description = "Actualiza un usuario existente")
    @PreAuthorize("hasAuthority('WRITE_USERS')")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateDto userUpdateDto) {

        return userRepository.findById(id)
                .map(user -> {
                    // Actualizar contraseña si se proporciona
                    if (userUpdateDto.getPassword() != null && !userUpdateDto.getPassword().isEmpty()) {
                        user.setPassword(Password.createHashed(passwordEncoder.encode(userUpdateDto.getPassword())));
                    }

                    // Actualizar correo electrónico si se proporciona
                    if (userUpdateDto.getEmail() != null && !userUpdateDto.getEmail().isEmpty()) {
                        user.setEmail(Email.of(userUpdateDto.getEmail()));
                    }

                    // Actualizar nombre si se proporciona
                    if (userUpdateDto.getFirstName() != null && userUpdateDto.getLastName() != null) {
                        user.setPersonName(PersonName.of(userUpdateDto.getFirstName(), userUpdateDto.getLastName()));
                    } else if (userUpdateDto.getFirstName() != null) {
                        user.setPersonName(
                                PersonName.of(userUpdateDto.getFirstName(), user.getPersonName().getLastName()));
                    } else if (userUpdateDto.getLastName() != null) {
                        user.setPersonName(
                                PersonName.of(user.getPersonName().getFirstName(), userUpdateDto.getLastName()));
                    }

                    // Actualizar rol si se proporciona
                    if (userUpdateDto.getRole() != null && !userUpdateDto.getRole().isEmpty()) {
                        user.setRole(UserRole.fromString(userUpdateDto.getRole()));
                    }

                    // Actualizar posición si se proporciona
                    if (userUpdateDto.getPosition() != null) {
                        user.setPosition(userUpdateDto.getPosition());
                    }

                    // Actualizar departamento si se proporciona
                    if (userUpdateDto.getDepartment() != null) {
                        user.setDepartment(userUpdateDto.getDepartment());
                    }

                    // Actualizar estado activo si se proporciona
                    if (userUpdateDto.getActive() != null) {
                        user.setActive(userUpdateDto.getActive());
                    }

                    // Actualizar permisos si se proporcionan
                    if (userUpdateDto.getPermissions() != null) {
                        Set<Permission> permissions = userUpdateDto.getPermissions().stream()
                                .map(Permission::fromString)
                                .filter(permission -> permission != null)
                                .collect(Collectors.toSet());

                        user.setPermissions(permissions);
                    }

                    user.setUpdatedAt(LocalDateTime.now());

                    User updatedUser = userRepository.save(user);
                    return ResponseEntity.ok(mapToDto(updatedUser));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Elimina un usuario.
     *
     * @param id El ID del usuario a eliminar
     * @return Una respuesta vacía
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un usuario", description = "Elimina un usuario existente")
    @PreAuthorize("hasAuthority('DELETE_USERS')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userRepository.findById(id).isPresent()) {
            userRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Obtiene usuarios por rol.
     *
     * @param role El rol de los usuarios a obtener
     * @param page El número de página (comenzando desde 0)
     * @param size El tamaño de la página
     * @return Lista de usuarios con el rol especificado
     */
    @GetMapping("/by-role/{role}")
    @Operation(summary = "Obtener usuarios por rol", description = "Obtiene usuarios que tienen el rol especificado")
    @PreAuthorize("hasAuthority('READ_USERS')")
    public ResponseEntity<List<UserDto>> getUsersByRole(
            @Parameter(description = "Rol de los usuarios") @PathVariable String role,
            @Parameter(description = "Número de página (comenzando desde 0)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de la página") @RequestParam(defaultValue = "100") int size) {
        // Log para depuración
        System.out.println("Accediendo a getUsersByRole con verificación de permisos, rol: " + role);

        try {
            UserRole userRole = UserRole.valueOf(role);
            List<User> users = userRepository.findByRole(userRole, page, size);

            List<UserDto> userDtos = users.stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(userDtos);
        } catch (IllegalArgumentException e) {
            // Si el rol no existe, devolver una lista vacía
            return ResponseEntity.ok(List.of());
        }
    }

    /**
     * Busca usuarios por nombre o username para menciones.
     *
     * @param query         Texto para buscar en nombre o username
     * @param limit         Límite de resultados a devolver
     * @param taskRequestId ID de la solicitud (opcional)
     * @param userPrincipal El usuario autenticado
     * @return Lista de usuarios que coinciden con la búsqueda
     */
    @GetMapping("/search")
    @Operation(summary = "Buscar usuarios para menciones", description = "Busca usuarios por nombre o username para menciones en comentarios")
    public ResponseEntity<List<UserDto>> searchUsers(
            @Parameter(description = "Texto para buscar en nombre o username") @RequestParam String query,
            @Parameter(description = "Límite de resultados") @RequestParam(defaultValue = "5") int limit,
            @Parameter(description = "ID de la solicitud (opcional)") @RequestParam(required = false) Long taskRequestId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        List<User> users;

        // Si se proporciona un ID de solicitud, filtrar por permisos de menciones
        if (taskRequestId != null) {
            users = mentionPermissionService.getMentionableUsers(userPrincipal.getId(), taskRequestId);

            // Filtrar por la consulta
            users = users.stream()
                    .filter(user -> {
                        String fullName = user.getPersonName().getFullName().toLowerCase();
                        String username = user.getUsername().toLowerCase();
                        String queryLower = query.toLowerCase();
                        return fullName.contains(queryLower) || username.contains(queryLower);
                    })
                    .limit(limit)
                    .collect(Collectors.toList());
        } else {
            // Implementar búsqueda de usuarios por nombre o username
            users = userRepository.findByNameOrUsername(query, limit);

            // Filtrar por permisos de menciones
            users = mentionPermissionService.filterMentionableUsers(userPrincipal.getId(), users);
        }

        List<UserDto> userDtos = users.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(userDtos);
    }

    /**
     * Mapea un usuario a un DTO.
     *
     * @param user El usuario
     * @return El DTO
     */
    /**
     * Endpoint de prueba para verificar la autenticación y los permisos.
     *
     * @param userPrincipal El usuario autenticado
     * @return Información sobre el usuario y sus permisos
     */
    @GetMapping("/test-auth")
    @Operation(summary = "Probar autenticación", description = "Endpoint de prueba para verificar la autenticación y los permisos")
    public ResponseEntity<Map<String, Object>> testAuth(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        // Log para depuración
        System.out.println("Accediendo a testAuth para usuario: " + userPrincipal.getUsername());

        Map<String, Object> response = new HashMap<>();
        response.put("username", userPrincipal.getUsername());
        response.put("id", userPrincipal.getId());
        response.put("authorities", userPrincipal.getAuthorities().stream()
                .map(auth -> auth.getAuthority())
                .collect(Collectors.toList()));
        response.put("timestamp", LocalDateTime.now());
        response.put("message", "Autenticación exitosa");

        return ResponseEntity.ok(response);
    }

    /**
     * Mapea un usuario a un DTO.
     *
     * @param user El usuario
     * @return El DTO
     */
    private UserDto mapToDto(User user) {
        Set<String> permissions = user.getPermissions().stream()
                .map(Permission::name)
                .collect(Collectors.toSet());

        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail().getValue())
                .firstName(user.getPersonName().getFirstName())
                .lastName(user.getPersonName().getLastName())
                .role(user.getRole().name())
                .position(user.getPosition())
                .department(user.getDepartment())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .permissions(permissions)
                .build();
    }
}

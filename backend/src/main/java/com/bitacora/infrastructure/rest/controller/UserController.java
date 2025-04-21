package com.bitacora.infrastructure.rest.controller;

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
    
    /**
     * Obtiene todos los usuarios con paginación.
     * 
     * @param page El número de página (comenzando desde 0)
     * @param size El tamaño de la página
     * @return Una respuesta con los usuarios y el total
     */
    @GetMapping
    @Operation(summary = "Obtener usuarios", description = "Obtiene usuarios con paginación")
    @PreAuthorize("hasAuthority('READ_USERS')")
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @Parameter(description = "Número de página (comenzando desde 0)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de la página") @RequestParam(defaultValue = "10") int size) {
        
        List<User> users = userRepository.findAll(page, size);
        long totalCount = userRepository.count();
        
        List<UserDto> userDtos = users.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("users", userDtos);
        response.put("totalCount", totalCount);
        
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
     * @param id El ID del usuario a actualizar
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
                        user.setPersonName(PersonName.of(userUpdateDto.getFirstName(), user.getPersonName().getLastName()));
                    } else if (userUpdateDto.getLastName() != null) {
                        user.setPersonName(PersonName.of(user.getPersonName().getFirstName(), userUpdateDto.getLastName()));
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

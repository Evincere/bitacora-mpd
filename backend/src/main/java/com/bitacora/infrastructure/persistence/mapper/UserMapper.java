package com.bitacora.infrastructure.persistence.mapper;

import com.bitacora.domain.model.user.*;
import com.bitacora.infrastructure.persistence.entity.UserEntity;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Mapper para convertir entre la entidad UserEntity y el modelo de dominio User.
 */
@Component("userEntityMapper")
public class UserMapper {

    /**
     * Convierte una entidad UserEntity a un modelo de dominio User.
     *
     * @param entity La entidad UserEntity
     * @return El modelo de dominio User
     */
    public User toDomain(UserEntity entity) {
        if (entity == null) {
            return null;
        }

        // Convertir permisos de String a Permission
        Set<Permission> permissions = entity.getPermissions().stream()
                .map(Permission::fromString)
                .filter(permission -> permission != null)
                .collect(Collectors.toSet());

        return User.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .password(Password.createHashed(entity.getPassword()))
                .email(Email.of(entity.getEmail()))
                .personName(PersonName.of(entity.getFirstName(), entity.getLastName()))
                .role(UserRole.fromString(entity.getRole()))
                .position(entity.getPosition())
                .department(entity.getDepartment())
                .active(entity.isActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .permissions(permissions)
                .build();
    }

    /**
     * Convierte un modelo de dominio User a una entidad UserEntity.
     *
     * @param domain El modelo de dominio User
     * @return La entidad UserEntity
     */
    public UserEntity toEntity(User domain) {
        if (domain == null) {
            return null;
        }

        // Convertir permisos de Permission a String
        Set<String> permissions = domain.getPermissions().stream()
                .map(Permission::name)
                .collect(Collectors.toSet());

        return UserEntity.builder()
                .id(domain.getId())
                .username(domain.getUsername())
                .password(domain.getPassword() != null ? domain.getPassword().getValue() : null)
                .email(domain.getEmail() != null ? domain.getEmail().getValue() : null)
                .firstName(domain.getPersonName() != null ? domain.getPersonName().getFirstName() : null)
                .lastName(domain.getPersonName() != null ? domain.getPersonName().getLastName() : null)
                .role(domain.getRole() != null ? domain.getRole().name() : null)
                .position(domain.getPosition())
                .department(domain.getDepartment())
                .active(domain.isActive())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .permissions(permissions)
                .activities(new HashSet<>())
                .build();
    }
}

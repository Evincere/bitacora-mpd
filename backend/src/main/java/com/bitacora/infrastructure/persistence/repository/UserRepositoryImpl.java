package com.bitacora.infrastructure.persistence.repository;

import com.bitacora.domain.model.user.User;
import com.bitacora.domain.model.user.UserRole;
import com.bitacora.domain.port.UserRepository;
import com.bitacora.infrastructure.persistence.entity.UserEntity;
import com.bitacora.infrastructure.persistence.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementación del repositorio de usuarios que utiliza JPA.
 */
@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {

    private final UserJpaRepository userJpaRepository;
    private final UserMapper userMapper;

    @Override
    public User save(User user) {
        UserEntity entity = userMapper.toEntity(user);
        UserEntity savedEntity = userJpaRepository.save(entity);
        return userMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userJpaRepository.findById(id)
                .map(userMapper::toDomain);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userJpaRepository.findByUsername(username)
                .map(userMapper::toDomain);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userJpaRepository.findByEmail(email)
                .map(userMapper::toDomain);
    }

    @Override
    public List<User> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userJpaRepository.findAll(pageable)
                .stream()
                .map(userMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> findByDepartment(String department, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userJpaRepository.findByDepartment(department, pageable)
                .stream()
                .map(userMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> findByRole(UserRole role, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userJpaRepository.findByRole(role.name(), pageable)
                .stream()
                .map(userMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public long count() {
        return userJpaRepository.count();
    }

    @Override
    public long countByDepartment(String department) {
        return userJpaRepository.countByDepartment(department);
    }

    @Override
    public long countByRole(UserRole role) {
        return userJpaRepository.countByRole(role.name());
    }

    @Override
    public void deleteById(Long id) {
        userJpaRepository.deleteById(id);
    }

    @Override
    public List<User> findByNameOrUsername(String query, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return userJpaRepository
                .findByUsernameContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                        query, query, query, pageable)
                .stream()
                .map(userMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> findWithFilters(UserRole role, Boolean active, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        // Aplicar filtros según los parámetros proporcionados
        if (role != null && active != null) {
            // Filtrar por rol y estado activo
            return userJpaRepository.findByRoleAndActive(role.name(), active, pageable)
                    .stream()
                    .map(userMapper::toDomain)
                    .collect(Collectors.toList());
        } else if (role != null) {
            // Filtrar solo por rol
            return userJpaRepository.findByRole(role.name(), pageable)
                    .stream()
                    .map(userMapper::toDomain)
                    .collect(Collectors.toList());
        } else if (active != null) {
            // Filtrar solo por estado activo
            return userJpaRepository.findByActive(active, pageable)
                    .stream()
                    .map(userMapper::toDomain)
                    .collect(Collectors.toList());
        } else if (search != null && !search.isEmpty()) {
            // Filtrar por búsqueda de texto
            return userJpaRepository
                    .findByUsernameContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                            search, search, search, pageable)
                    .stream()
                    .map(userMapper::toDomain)
                    .collect(Collectors.toList());
        } else {
            // Sin filtros, devolver todos los usuarios
            return findAll(page, size);
        }
    }

    @Override
    public long countWithFilters(UserRole role, Boolean active, String search) {
        // Aplicar filtros según los parámetros proporcionados
        if (role != null && active != null) {
            // Contar por rol y estado activo
            return userJpaRepository.countByRoleAndActive(role.name(), active);
        } else if (role != null) {
            // Contar solo por rol
            return userJpaRepository.countByRole(role.name());
        } else if (active != null) {
            // Contar solo por estado activo
            return userJpaRepository.countByActive(active);
        } else if (search != null && !search.isEmpty()) {
            // Contar por búsqueda de texto (aproximado)
            // Nota: Esto es una aproximación, ya que no tenemos un método específico para
            // contar
            return userJpaRepository
                    .findByUsernameContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                            search, search, search, PageRequest.of(0, Integer.MAX_VALUE))
                    .getTotalElements();
        } else {
            // Sin filtros, contar todos los usuarios
            return count();
        }
    }
}

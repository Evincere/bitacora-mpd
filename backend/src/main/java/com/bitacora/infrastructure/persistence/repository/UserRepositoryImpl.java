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
}

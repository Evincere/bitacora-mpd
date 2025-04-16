package com.bitacora.domain.port;

import com.bitacora.domain.model.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository {
    User save(User user);
    Optional<User> findById(Long id);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findAll(int page, int size);
    List<User> findByDepartment(String department, int page, int size);
    List<User> findByRole(String role, int page, int size);
    long count();
    long countByDepartment(String department);
    long countByRole(String role);
    void deleteById(Long id);
}

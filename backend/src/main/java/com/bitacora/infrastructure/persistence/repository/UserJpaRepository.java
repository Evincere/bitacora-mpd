package com.bitacora.infrastructure.persistence.repository;

import com.bitacora.infrastructure.persistence.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio JPA para la entidad UserEntity.
 */
@Repository
public interface UserJpaRepository extends JpaRepository<UserEntity, Long> {

    /**
     * Busca un usuario por su nombre de usuario.
     *
     * @param username El nombre de usuario
     * @return Un Optional que contiene el usuario si se encuentra, o vacío si no
     */
    Optional<UserEntity> findByUsername(String username);

    /**
     * Busca un usuario por su dirección de correo electrónico.
     *
     * @param email La dirección de correo electrónico
     * @return Un Optional que contiene el usuario si se encuentra, o vacío si no
     */
    Optional<UserEntity> findByEmail(String email);

    /**
     * Verifica si existe un usuario con el nombre de usuario especificado.
     *
     * @param username El nombre de usuario
     * @return true si existe un usuario con el nombre de usuario especificado,
     *         false en caso contrario
     */
    boolean existsByUsername(String username);

    /**
     * Verifica si existe un usuario con la dirección de correo electrónico
     * especificada.
     *
     * @param email La dirección de correo electrónico
     * @return true si existe un usuario con la dirección de correo electrónico
     *         especificada, false en caso contrario
     */
    boolean existsByEmail(String email);

    /**
     * Busca usuarios por departamento con paginación.
     *
     * @param department El departamento
     * @param pageable   La información de paginación
     * @return Una página de usuarios
     */
    Page<UserEntity> findByDepartment(String department, Pageable pageable);

    /**
     * Busca usuarios por rol con paginación.
     *
     * @param role     El rol
     * @param pageable La información de paginación
     * @return Una página de usuarios
     */
    Page<UserEntity> findByRole(String role, Pageable pageable);

    /**
     * Cuenta el número de usuarios por departamento.
     *
     * @param department El departamento
     * @return El número de usuarios
     */
    long countByDepartment(String department);

    /**
     * Cuenta el número de usuarios por rol.
     *
     * @param role El rol
     * @return El número de usuarios
     */
    long countByRole(String role);

    /**
     * Busca usuarios por nombre o nombre de usuario.
     *
     * @param query    Texto para buscar en nombre o nombre de usuario
     * @param pageable La información de paginación
     * @return Una página de usuarios que coinciden con la búsqueda
     */
    Page<UserEntity> findByUsernameContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
            String query, String firstNameQuery, String lastNameQuery, Pageable pageable);
}

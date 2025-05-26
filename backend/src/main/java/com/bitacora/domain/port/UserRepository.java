package com.bitacora.domain.port;

import com.bitacora.domain.model.user.User;
import com.bitacora.domain.model.user.UserRole;

import java.util.List;
import java.util.Optional;

/**
 * Puerto (interfaz) para el repositorio de usuarios.
 * Define las operaciones que debe proporcionar cualquier implementación de
 * repositorio de usuarios.
 */
public interface UserRepository {

    /**
     * Guarda un usuario.
     *
     * @param user El usuario a guardar
     * @return El usuario guardado con su ID asignado
     */
    User save(User user);

    /**
     * Busca un usuario por su ID.
     *
     * @param id El ID del usuario
     * @return Un Optional que contiene el usuario si se encuentra, o vacío si no
     */
    Optional<User> findById(Long id);

    /**
     * Busca un usuario por su nombre de usuario.
     *
     * @param username El nombre de usuario
     * @return Un Optional que contiene el usuario si se encuentra, o vacío si no
     */
    Optional<User> findByUsername(String username);

    /**
     * Busca un usuario por su dirección de correo electrónico.
     *
     * @param email La dirección de correo electrónico
     * @return Un Optional que contiene el usuario si se encuentra, o vacío si no
     */
    Optional<User> findByEmail(String email);

    /**
     * Busca todos los usuarios con paginación.
     *
     * @param page El número de página (comenzando desde 0)
     * @param size El tamaño de la página
     * @return Una lista con los usuarios de la página especificada
     */
    List<User> findAll(int page, int size);

    /**
     * Busca usuarios por departamento con paginación.
     *
     * @param department El departamento
     * @param page       El número de página (comenzando desde 0)
     * @param size       El tamaño de la página
     * @return Una lista con los usuarios del departamento especificado
     */
    List<User> findByDepartment(String department, int page, int size);

    /**
     * Busca usuarios por rol con paginación.
     *
     * @param role El rol
     * @param page El número de página (comenzando desde 0)
     * @param size El tamaño de la página
     * @return Una lista con los usuarios del rol especificado
     */
    List<User> findByRole(UserRole role, int page, int size);

    /**
     * Cuenta el número total de usuarios.
     *
     * @return El número total de usuarios
     */
    long count();

    /**
     * Cuenta el número de usuarios por departamento.
     *
     * @param department El departamento
     * @return El número de usuarios del departamento especificado
     */
    long countByDepartment(String department);

    /**
     * Cuenta el número de usuarios por rol.
     *
     * @param role El rol
     * @return El número de usuarios del rol especificado
     */
    long countByRole(UserRole role);

    /**
     * Elimina un usuario.
     *
     * @param id El ID del usuario a eliminar
     */
    void deleteById(Long id);

    /**
     * Busca usuarios por nombre o nombre de usuario.
     *
     * @param query Texto para buscar en nombre o nombre de usuario
     * @param limit Límite de resultados a devolver
     * @return Lista de usuarios que coinciden con la búsqueda
     */
    List<User> findByNameOrUsername(String query, int limit);

    /**
     * Busca usuarios aplicando múltiples filtros.
     *
     * @param role   Filtrar por rol (opcional)
     * @param active Filtrar por estado activo (opcional)
     * @param search Buscar por nombre, apellido o email (opcional)
     * @param page   El número de página (comenzando desde 0)
     * @param size   El tamaño de la página
     * @return Lista de usuarios que cumplen con los filtros
     */
    List<User> findWithFilters(UserRole role, Boolean active, String search, int page, int size);

    /**
     * Cuenta el número de usuarios que cumplen con los filtros.
     *
     * @param role   Filtrar por rol (opcional)
     * @param active Filtrar por estado activo (opcional)
     * @param search Buscar por nombre, apellido o email (opcional)
     * @return El número de usuarios que cumplen con los filtros
     */
    long countWithFilters(UserRole role, Boolean active, String search);
}

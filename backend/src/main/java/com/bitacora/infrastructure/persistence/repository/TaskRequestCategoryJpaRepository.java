package com.bitacora.infrastructure.persistence.repository;

import com.bitacora.infrastructure.persistence.entity.TaskRequestCategoryEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio JPA para la entidad TaskRequestCategoryEntity.
 */
@Repository
public interface TaskRequestCategoryJpaRepository extends JpaRepository<TaskRequestCategoryEntity, Long> {

    /**
     * Busca la categoría por defecto.
     *
     * @return Un Optional que contiene la categoría por defecto si existe, o vacío si no
     */
    Optional<TaskRequestCategoryEntity> findByIsDefaultTrue();

    /**
     * Busca categorías por nombre (coincidencia parcial).
     *
     * @param name Parte del nombre a buscar
     * @return Lista de categorías que coinciden con el nombre
     */
    List<TaskRequestCategoryEntity> findByNameContainingIgnoreCase(String name);
}

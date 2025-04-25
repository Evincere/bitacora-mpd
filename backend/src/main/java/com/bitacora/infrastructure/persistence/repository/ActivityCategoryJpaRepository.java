package com.bitacora.infrastructure.persistence.repository;

import com.bitacora.infrastructure.persistence.entity.ActivityCategoryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio JPA para la entidad ActivityCategoryEntity.
 */
@Repository
public interface ActivityCategoryJpaRepository extends JpaRepository<ActivityCategoryEntity, Long> {
    
    /**
     * Busca categorías por nombre.
     * 
     * @param name El nombre a buscar
     * @return Una lista de categorías que coinciden con el nombre
     */
    List<ActivityCategoryEntity> findByNameContainingIgnoreCase(String name);
    
    /**
     * Busca categorías predeterminadas.
     * 
     * @return Una lista de categorías predeterminadas
     */
    List<ActivityCategoryEntity> findByIsDefaultTrue();
    
    /**
     * Busca categorías creadas por un usuario específico.
     * 
     * @param creatorId El ID del usuario creador
     * @param pageable La información de paginación
     * @return Una página de categorías
     */
    Page<ActivityCategoryEntity> findByCreatorId(Long creatorId, Pageable pageable);
    
    /**
     * Busca una categoría por nombre exacto.
     * 
     * @param name El nombre exacto
     * @return La categoría encontrada o vacío
     */
    Optional<ActivityCategoryEntity> findByNameIgnoreCase(String name);
    
    /**
     * Busca categorías por texto libre.
     * 
     * @param query El texto a buscar
     * @param pageable La información de paginación
     * @return Una página de categorías
     */
    @Query("SELECT c FROM ActivityCategoryEntity c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<ActivityCategoryEntity> search(@Param("query") String query, Pageable pageable);
}

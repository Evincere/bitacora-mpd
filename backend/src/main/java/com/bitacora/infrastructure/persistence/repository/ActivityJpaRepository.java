package com.bitacora.infrastructure.persistence.repository;

import com.bitacora.infrastructure.persistence.entity.ActivityEntity;
import com.bitacora.infrastructure.persistence.projection.ActivityCount;
import com.bitacora.infrastructure.persistence.projection.ActivitySummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio JPA para la entidad ActivityEntity.
 */
@Repository
public interface ActivityJpaRepository
                extends JpaRepository<ActivityEntity, Long>, JpaSpecificationExecutor<ActivityEntity> {

        /**
         * Busca actividades por tipo con paginación.
         *
         * @param type     El tipo de actividad
         * @param pageable La información de paginación
         * @return Una página de actividades
         */
        Page<ActivityEntity> findByType(String type, Pageable pageable);

        /**
         * Busca actividades por estado con paginación.
         *
         * @param status   El estado de la actividad
         * @param pageable La información de paginación
         * @return Una página de actividades
         */
        Page<ActivityEntity> findByStatus(String status, Pageable pageable);

        /**
         * Busca actividades por usuario con paginación.
         *
         * @param userId   El ID del usuario
         * @param pageable La información de paginación
         * @return Una página de actividades
         */
        Page<ActivityEntity> findByUserId(Long userId, Pageable pageable);

        /**
         * Busca actividades por solicitante con paginación.
         *
         * @param requesterId El ID del solicitante
         * @param pageable    La información de paginación
         * @return Una página de actividades
         */
        Page<ActivityEntity> findByRequesterId(Long requesterId, Pageable pageable);

        /**
         * Busca actividades por rango de fechas con paginación.
         *
         * @param startDate La fecha de inicio
         * @param endDate   La fecha de fin
         * @param pageable  La información de paginación
         * @return Una página de actividades
         */
        Page<ActivityEntity> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

        /**
         * Busca actividades por rango de fechas sin paginación.
         *
         * @param startDate La fecha de inicio
         * @param endDate   La fecha de fin
         * @return Una lista de actividades
         */
        List<ActivityEntity> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate);

        /**
         * Busca actividades por persona con paginación.
         *
         * @param person   El nombre de la persona
         * @param pageable La información de paginación
         * @return Una página de actividades
         */
        Page<ActivityEntity> findByPersonContainingIgnoreCase(String person, Pageable pageable);

        /**
         * Busca actividades por texto libre con paginación.
         *
         * @param query    El texto a buscar
         * @param pageable La información de paginación
         * @return Una página de actividades
         */
        @Query("SELECT a FROM ActivityEntity a WHERE " +
                        "LOWER(a.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
                        "LOWER(a.situation) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
                        "LOWER(a.result) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
                        "LOWER(a.comments) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
                        "LOWER(a.person) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
                        "LOWER(a.dependency) LIKE LOWER(CONCAT('%', :query, '%'))")
        Page<ActivityEntity> search(@Param("query") String query, Pageable pageable);

        /**
         * Cuenta el número de actividades por usuario.
         *
         * @param userId El ID del usuario
         * @return El número de actividades
         */
        long countByUserId(Long userId);

        /**
         * Cuenta el número de actividades por solicitante.
         *
         * @param requesterId El ID del solicitante
         * @return El número de actividades
         */
        long countByRequesterId(Long requesterId);

        /**
         * Cuenta el número de actividades por tipo.
         *
         * @param type El tipo de actividad
         * @return El número de actividades
         */
        long countByType(String type);

        /**
         * Cuenta el número de actividades por estado.
         *
         * @param status El estado de la actividad
         * @return El número de actividades
         */
        long countByStatus(String status);

        /**
         * Cuenta el número de actividades por rango de fechas.
         *
         * @param startDate La fecha de inicio
         * @param endDate   La fecha de fin
         * @return El número de actividades
         */
        long countByDateBetween(LocalDateTime startDate, LocalDateTime endDate);

        /**
         * Cuenta el número de actividades por persona.
         *
         * @param person El nombre de la persona
         * @return El número de actividades
         */
        long countByPersonContainingIgnoreCase(String person);

        /**
         * Cuenta el número de actividades que coinciden con una búsqueda.
         *
         * @param query El texto a buscar
         * @return El número de actividades
         */
        @Query("SELECT COUNT(a) FROM ActivityEntity a WHERE " +
                        "LOWER(a.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
                        "LOWER(a.situation) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
                        "LOWER(a.result) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
                        "LOWER(a.comments) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
                        "LOWER(a.person) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
                        "LOWER(a.dependency) LIKE LOWER(CONCAT('%', :query, '%'))")
        long countSearch(@Param("query") String query);

        /**
         * Busca actividades con proyección de resumen.
         *
         * @param pageable La información de paginación
         * @return Una página de resúmenes de actividades
         */
        @Query("SELECT a.id as id, a.date as date, a.type as type, a.description as description, " +
                        "a.status as status, a.person as person, a.createdAt as createdAt, a.userId as userId " +
                        "FROM ActivityEntity a")
        Page<ActivitySummary> findAllSummaries(Pageable pageable);

        /**
         * Busca actividades con proyección de resumen por tipo.
         *
         * @param type     El tipo de actividad
         * @param pageable La información de paginación
         * @return Una página de resúmenes de actividades
         */
        @Query("SELECT a.id as id, a.date as date, a.type as type, a.description as description, " +
                        "a.status as status, a.person as person, a.createdAt as createdAt, a.userId as userId " +
                        "FROM ActivityEntity a WHERE a.type = :type")
        Page<ActivitySummary> findSummariesByType(@Param("type") String type, Pageable pageable);

        /**
         * Busca actividades con proyección de resumen por estado.
         *
         * @param status   El estado de la actividad
         * @param pageable La información de paginación
         * @return Una página de resúmenes de actividades
         */
        @Query("SELECT a.id as id, a.date as date, a.type as type, a.description as description, " +
                        "a.status as status, a.person as person, a.createdAt as createdAt, a.userId as userId " +
                        "FROM ActivityEntity a WHERE a.status = :status")
        Page<ActivitySummary> findSummariesByStatus(@Param("status") String status, Pageable pageable);

        /**
         * Obtiene el conteo de actividades por tipo.
         *
         * @return Una lista de conteos por tipo
         */
        @Query("SELECT a.type as category, COUNT(a) as count FROM ActivityEntity a GROUP BY a.type")
        List<ActivityCount> countByTypeGrouped();

        /**
         * Obtiene el conteo de actividades por estado.
         *
         * @return Una lista de conteos por estado
         */
        @Query("SELECT a.status as category, COUNT(a) as count FROM ActivityEntity a GROUP BY a.status")
        List<ActivityCount> countByStatusGrouped();
}

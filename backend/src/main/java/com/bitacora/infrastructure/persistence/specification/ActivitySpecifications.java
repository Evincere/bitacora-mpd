package com.bitacora.infrastructure.persistence.specification;

import com.bitacora.infrastructure.persistence.entity.ActivityEntity;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

/**
 * Clase de utilidad que proporciona especificaciones JPA para consultas dinámicas
 * de actividades.
 */
public class ActivitySpecifications {

    private ActivitySpecifications() {
        // Clase de utilidad, no debe ser instanciada
    }

    /**
     * Crea una especificación para filtrar actividades por tipo.
     *
     * @param type El tipo de actividad
     * @return Una especificación JPA
     */
    public static Specification<ActivityEntity> hasType(String type) {
        return (root, query, criteriaBuilder) -> {
            if (type == null || type.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("type"), type);
        };
    }

    /**
     * Crea una especificación para filtrar actividades por estado.
     *
     * @param status El estado de la actividad
     * @return Una especificación JPA
     */
    public static Specification<ActivityEntity> hasStatus(String status) {
        return (root, query, criteriaBuilder) -> {
            if (status == null || status.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("status"), status);
        };
    }

    /**
     * Crea una especificación para filtrar actividades por usuario.
     *
     * @param userId El ID del usuario
     * @return Una especificación JPA
     */
    public static Specification<ActivityEntity> belongsToUser(Long userId) {
        return (root, query, criteriaBuilder) -> {
            if (userId == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("userId"), userId);
        };
    }

    /**
     * Crea una especificación para filtrar actividades por rango de fechas.
     *
     * @param startDate La fecha de inicio
     * @param endDate   La fecha de fin
     * @return Una especificación JPA
     */
    public static Specification<ActivityEntity> dateIsBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return (root, query, criteriaBuilder) -> {
            if (startDate == null && endDate == null) {
                return criteriaBuilder.conjunction();
            }
            if (startDate == null) {
                return criteriaBuilder.lessThanOrEqualTo(root.get("date"), endDate);
            }
            if (endDate == null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("date"), startDate);
            }
            return criteriaBuilder.between(root.get("date"), startDate, endDate);
        };
    }

    /**
     * Crea una especificación para buscar actividades por texto libre.
     *
     * @param query El texto a buscar
     * @return Una especificación JPA
     */
    public static Specification<ActivityEntity> containsText(String query) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (query == null || query.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            
            String likePattern = "%" + query.toLowerCase() + "%";
            
            return criteriaBuilder.or(
                criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), likePattern),
                criteriaBuilder.like(criteriaBuilder.lower(root.get("situation")), likePattern),
                criteriaBuilder.like(criteriaBuilder.lower(root.get("result")), likePattern),
                criteriaBuilder.like(criteriaBuilder.lower(root.get("comments")), likePattern),
                criteriaBuilder.like(criteriaBuilder.lower(root.get("person")), likePattern),
                criteriaBuilder.like(criteriaBuilder.lower(root.get("dependency")), likePattern)
            );
        };
    }
    
    /**
     * Combina múltiples especificaciones con AND.
     *
     * @param specs Las especificaciones a combinar
     * @return Una especificación combinada
     */
    @SafeVarargs
    public static Specification<ActivityEntity> where(Specification<ActivityEntity>... specs) {
        Specification<ActivityEntity> result = Specification.where(null);
        for (Specification<ActivityEntity> spec : specs) {
            result = result.and(spec);
        }
        return result;
    }
}

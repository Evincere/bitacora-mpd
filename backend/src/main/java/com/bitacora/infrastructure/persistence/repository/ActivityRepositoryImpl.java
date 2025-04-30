package com.bitacora.infrastructure.persistence.repository;

import com.bitacora.domain.model.activity.Activity;
import com.bitacora.domain.model.activity.ActivityStatus;
import com.bitacora.domain.model.activity.ActivityType;
import com.bitacora.domain.port.repository.ActivityRepository;
import com.bitacora.infrastructure.persistence.entity.ActivityEntity;
import com.bitacora.infrastructure.persistence.mapper.ActivityMapper;
import com.bitacora.infrastructure.persistence.specification.ActivitySpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementación del repositorio de actividades que utiliza JPA.
 */
@Repository
@RequiredArgsConstructor
public class ActivityRepositoryImpl implements ActivityRepository {

    private final ActivityJpaRepository activityJpaRepository;
    private final ActivityMapper activityMapper;

    @Override
    public Activity save(Activity activity) {
        ActivityEntity entity = activityMapper.toEntity(activity);
        ActivityEntity savedEntity = activityJpaRepository.save(entity);
        return activityMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Activity> findById(Long id) {
        return activityJpaRepository.findById(id)
                .map(activityMapper::toDomain);
    }

    @Override
    public List<Activity> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return activityJpaRepository.findAll(pageable)
                .stream()
                .map(activityMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Activity> findByType(ActivityType type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return activityJpaRepository.findByType(type.name(), pageable)
                .stream()
                .map(activityMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Activity> findByStatus(ActivityStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return activityJpaRepository.findByStatus(status.name(), pageable)
                .stream()
                .map(activityMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Activity> findByUserId(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return activityJpaRepository.findByUserId(userId, pageable)
                .stream()
                .map(activityMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Activity> findByRequesterId(Long requesterId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        // Crear una especificación para buscar actividades con requesterId específico
        // y con estado REQUESTED (para diferenciar solicitudes de actividades
        // regulares)
        Specification<ActivityEntity> spec = Specification.where(
                (root, query, cb) -> cb.equal(root.get("requesterId"), requesterId));

        return activityJpaRepository.findAll(spec, pageable)
                .stream()
                .map(activityMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Activity> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return activityJpaRepository.findByDateBetween(startDate, endDate, pageable)
                .stream()
                .map(activityMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Activity> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return activityJpaRepository.findByDateBetween(startDate, endDate)
                .stream()
                .map(activityMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Activity> findByPerson(String person, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return activityJpaRepository.findByPersonContainingIgnoreCase(person, pageable)
                .stream()
                .map(activityMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Activity> search(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return activityJpaRepository.search(query, pageable)
                .stream()
                .map(activityMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public long count() {
        return activityJpaRepository.count();
    }

    @Override
    public long countByUserId(Long userId) {
        return activityJpaRepository.countByUserId(userId);
    }

    @Override
    public long countByRequesterId(Long requesterId) {
        // Crear una especificación para contar actividades con requesterId específico
        // y con estado REQUESTED (para diferenciar solicitudes de actividades
        // regulares)
        Specification<ActivityEntity> spec = Specification.where(
                (root, query, cb) -> cb.equal(root.get("requesterId"), requesterId));

        return activityJpaRepository.count(spec);
    }

    @Override
    public long countByType(ActivityType type) {
        return activityJpaRepository.countByType(type.name());
    }

    @Override
    public long countByStatus(ActivityStatus status) {
        return activityJpaRepository.countByStatus(status.name());
    }

    @Override
    public long countByDateBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return activityJpaRepository.countByDateBetween(startDate, endDate);
    }

    @Override
    public long countByPerson(String person) {
        return activityJpaRepository.countByPersonContainingIgnoreCase(person);
    }

    @Override
    public long countSearch(String query) {
        return activityJpaRepository.countSearch(query);
    }

    @Override
    public List<Activity> findWithFilters(Map<String, Object> filters, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<ActivityEntity> spec = buildSpecificationFromFilters(filters);

        return activityJpaRepository.findAll(spec, pageable)
                .stream()
                .map(activityMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public long countWithFilters(Map<String, Object> filters) {
        Specification<ActivityEntity> spec = buildSpecificationFromFilters(filters);
        return activityJpaRepository.count(spec);
    }

    /**
     * Construye una especificación JPA a partir de un mapa de filtros.
     *
     * @param filters El mapa de filtros
     * @return Una especificación JPA
     */
    private Specification<ActivityEntity> buildSpecificationFromFilters(Map<String, Object> filters) {
        Specification<ActivityEntity> spec = Specification.where(null);

        if (filters == null || filters.isEmpty()) {
            return spec;
        }

        if (filters.containsKey("type")) {
            String type = (String) filters.get("type");
            spec = spec.and(ActivitySpecifications.hasType(type));
        }

        if (filters.containsKey("status")) {
            String status = (String) filters.get("status");
            spec = spec.and(ActivitySpecifications.hasStatus(status));
        }

        if (filters.containsKey("userId")) {
            Long userId = Long.valueOf(filters.get("userId").toString());
            spec = spec.and(ActivitySpecifications.belongsToUser(userId));
        }

        if (filters.containsKey("startDate") || filters.containsKey("endDate")) {
            LocalDateTime startDate = filters.containsKey("startDate") ? (LocalDateTime) filters.get("startDate")
                    : null;
            LocalDateTime endDate = filters.containsKey("endDate") ? (LocalDateTime) filters.get("endDate") : null;
            spec = spec.and(ActivitySpecifications.dateIsBetween(startDate, endDate));
        }

        if (filters.containsKey("search")) {
            String search = (String) filters.get("search");
            spec = spec.and(ActivitySpecifications.containsText(search));
        }

        return spec;
    }

    @Override
    public void deleteById(Long id) {
        activityJpaRepository.deleteById(id);
    }
}

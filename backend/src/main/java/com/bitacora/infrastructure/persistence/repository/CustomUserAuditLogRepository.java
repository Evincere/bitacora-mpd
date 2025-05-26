package com.bitacora.infrastructure.persistence.repository;

import com.bitacora.domain.model.audit.AuditActionType;
import com.bitacora.domain.model.audit.AuditResult;
import com.bitacora.domain.model.audit.UserAuditLog;
import com.bitacora.domain.port.repository.UserAuditLogRepository;
import com.bitacora.infrastructure.persistence.entity.UserAuditLogEntity;
import com.bitacora.infrastructure.persistence.jpa.JpaUserAuditLogRepository;
import com.bitacora.infrastructure.persistence.mapper.UserAuditLogMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementación JPA del repositorio de auditoría de usuarios.
 */
@Repository
@Primary
public class CustomUserAuditLogRepository implements UserAuditLogRepository {

    private JpaUserAuditLogRepository jpaRepository;
    private UserAuditLogMapper mapper;

    @Autowired
    public void setJpaRepository(JpaUserAuditLogRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Autowired
    public void setMapper(UserAuditLogMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public UserAuditLog save(UserAuditLog auditLog) {
        UserAuditLogEntity entity = mapper.toEntity(auditLog);
        UserAuditLogEntity savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public Optional<UserAuditLog> findById(Long id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    public List<UserAuditLog> findByUserId(Long userId, int page, int size) {
        return jpaRepository.findByUserIdOrderByTimestampDesc(userId, PageRequest.of(page, size))
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserAuditLog> findByUsername(String username, int page, int size) {
        return jpaRepository.findByUsernameOrderByTimestampDesc(username, PageRequest.of(page, size))
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserAuditLog> findByActionType(AuditActionType actionType, int page, int size) {
        return jpaRepository.findByActionTypeOrderByTimestampDesc(actionType, PageRequest.of(page, size))
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserAuditLog> findByEntityType(String entityType, int page, int size) {
        return jpaRepository.findByEntityTypeOrderByTimestampDesc(entityType, PageRequest.of(page, size))
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserAuditLog> findByEntityId(String entityId, int page, int size) {
        return jpaRepository.findByEntityIdOrderByTimestampDesc(entityId, PageRequest.of(page, size))
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserAuditLog> findByResult(AuditResult result, int page, int size) {
        return jpaRepository.findByResultOrderByTimestampDesc(result, PageRequest.of(page, size))
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserAuditLog> findByTimestampBetween(LocalDateTime startDate, LocalDateTime endDate, int page,
            int size) {
        return jpaRepository.findByTimestampBetweenOrderByTimestampDesc(startDate, endDate, PageRequest.of(page, size))
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserAuditLog> findBySuspicious(boolean suspicious, int page, int size) {
        return jpaRepository.findBySuspiciousOrderByTimestampDesc(suspicious, PageRequest.of(page, size))
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserAuditLog> findByFilters(
            Long userId,
            String username,
            AuditActionType actionType,
            String entityType,
            String entityId,
            AuditResult result,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Boolean suspicious,
            String module,
            int page,
            int size) {

        Specification<UserAuditLogEntity> spec = createSpecification(
                userId, username, actionType, entityType, entityId,
                result, startDate, endDate, suspicious, module);

        return jpaRepository.findAll(spec, PageRequest.of(page, size))
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public long countByFilters(
            Long userId,
            String username,
            AuditActionType actionType,
            String entityType,
            String entityId,
            AuditResult result,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Boolean suspicious,
            String module) {

        Specification<UserAuditLogEntity> spec = createSpecification(
                userId, username, actionType, entityType, entityId,
                result, startDate, endDate, suspicious, module);

        return jpaRepository.count(spec);
    }

    @Override
    public int deleteByTimestampBefore(LocalDateTime date) {
        return jpaRepository.deleteByTimestampBefore(date);
    }

    /**
     * Crea una especificación JPA basada en los filtros proporcionados.
     */
    private Specification<UserAuditLogEntity> createSpecification(
            Long userId,
            String username,
            AuditActionType actionType,
            String entityType,
            String entityId,
            AuditResult result,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Boolean suspicious,
            String module) {

        Specification<UserAuditLogEntity> spec = null;

        if (userId != null) {
            Specification<UserAuditLogEntity> userIdSpec = (root, query, cb) -> cb.equal(root.get("userId"), userId);
            spec = spec == null ? userIdSpec : spec.and(userIdSpec);
        }

        if (username != null && !username.isEmpty()) {
            Specification<UserAuditLogEntity> usernameSpec = (root, query, cb) -> cb
                    .like(cb.lower(root.get("username")), "%" + username.toLowerCase() + "%");
            spec = spec == null ? usernameSpec : spec.and(usernameSpec);
        }

        if (actionType != null) {
            Specification<UserAuditLogEntity> actionTypeSpec = (root, query, cb) -> cb.equal(root.get("actionType"),
                    actionType);
            spec = spec == null ? actionTypeSpec : spec.and(actionTypeSpec);
        }

        if (entityType != null && !entityType.isEmpty()) {
            Specification<UserAuditLogEntity> entityTypeSpec = (root, query, cb) -> cb.equal(root.get("entityType"),
                    entityType);
            spec = spec == null ? entityTypeSpec : spec.and(entityTypeSpec);
        }

        if (entityId != null && !entityId.isEmpty()) {
            Specification<UserAuditLogEntity> entityIdSpec = (root, query, cb) -> cb.equal(root.get("entityId"),
                    entityId);
            spec = spec == null ? entityIdSpec : spec.and(entityIdSpec);
        }

        if (result != null) {
            Specification<UserAuditLogEntity> resultSpec = (root, query, cb) -> cb.equal(root.get("result"), result);
            spec = spec == null ? resultSpec : spec.and(resultSpec);
        }

        if (startDate != null) {
            Specification<UserAuditLogEntity> startDateSpec = (root, query, cb) -> cb
                    .greaterThanOrEqualTo(root.get("timestamp"), startDate);
            spec = spec == null ? startDateSpec : spec.and(startDateSpec);
        }

        if (endDate != null) {
            Specification<UserAuditLogEntity> endDateSpec = (root, query, cb) -> cb
                    .lessThanOrEqualTo(root.get("timestamp"), endDate);
            spec = spec == null ? endDateSpec : spec.and(endDateSpec);
        }

        if (suspicious != null) {
            Specification<UserAuditLogEntity> suspiciousSpec = (root, query, cb) -> cb.equal(root.get("suspicious"),
                    suspicious);
            spec = spec == null ? suspiciousSpec : spec.and(suspiciousSpec);
        }

        if (module != null && !module.isEmpty()) {
            Specification<UserAuditLogEntity> moduleSpec = (root, query, cb) -> cb.equal(root.get("module"), module);
            spec = spec == null ? moduleSpec : spec.and(moduleSpec);
        }

        return spec != null ? spec : (root, query, cb) -> cb.conjunction();
    }
}

package com.bitacora.infrastructure.persistence.repository;

import com.bitacora.domain.model.activity.ActivityComment;
import com.bitacora.domain.port.repository.ActivityCommentRepository;
import com.bitacora.infrastructure.persistence.mapper.ActivityCommentMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementación del repositorio ActivityCommentRepository.
 */
@Repository
public class ActivityCommentRepositoryImpl implements ActivityCommentRepository {
    
    private final ActivityCommentJpaRepository activityCommentJpaRepository;
    private final ActivityCommentMapper activityCommentMapper;
    
    /**
     * Constructor.
     * 
     * @param activityCommentJpaRepository Repositorio JPA para ActivityCommentEntity
     * @param activityCommentMapper Mapper para convertir entre ActivityComment y ActivityCommentEntity
     */
    public ActivityCommentRepositoryImpl(
            ActivityCommentJpaRepository activityCommentJpaRepository,
            ActivityCommentMapper activityCommentMapper) {
        this.activityCommentJpaRepository = activityCommentJpaRepository;
        this.activityCommentMapper = activityCommentMapper;
    }
    
    @Override
    public ActivityComment save(ActivityComment comment) {
        var entity = activityCommentMapper.toEntity(comment);
        var savedEntity = activityCommentJpaRepository.save(entity);
        return activityCommentMapper.toDomain(savedEntity);
    }
    
    @Override
    public Optional<ActivityComment> findById(Long id) {
        return activityCommentJpaRepository.findById(id)
                .map(activityCommentMapper::toDomain);
    }
    
    @Override
    public List<ActivityComment> findByActivityId(Long activityId) {
        return activityCommentJpaRepository.findByActivityIdOrderByCreatedAtDesc(activityId).stream()
                .map(activityCommentMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ActivityComment> findByActivityId(Long activityId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return activityCommentJpaRepository.findByActivityId(activityId, pageable).stream()
                .map(activityCommentMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ActivityComment> findByUserId(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return activityCommentJpaRepository.findByUserId(userId, pageable).stream()
                .map(activityCommentMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public long countByActivityId(Long activityId) {
        return activityCommentJpaRepository.countByActivityId(activityId);
    }
    
    @Override
    public void deleteById(Long id) {
        activityCommentJpaRepository.deleteById(id);
    }
}

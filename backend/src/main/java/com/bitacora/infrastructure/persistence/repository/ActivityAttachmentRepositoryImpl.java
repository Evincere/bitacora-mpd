package com.bitacora.infrastructure.persistence.repository;

import com.bitacora.domain.model.activity.ActivityAttachment;
import com.bitacora.domain.port.repository.ActivityAttachmentRepository;
import com.bitacora.infrastructure.persistence.mapper.ActivityAttachmentMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementación del repositorio ActivityAttachmentRepository.
 */
@Repository
public class ActivityAttachmentRepositoryImpl implements ActivityAttachmentRepository {
    
    private final ActivityAttachmentJpaRepository activityAttachmentJpaRepository;
    private final ActivityAttachmentMapper activityAttachmentMapper;
    
    /**
     * Constructor.
     * 
     * @param activityAttachmentJpaRepository Repositorio JPA para ActivityAttachmentEntity
     * @param activityAttachmentMapper Mapper para convertir entre ActivityAttachment y ActivityAttachmentEntity
     */
    public ActivityAttachmentRepositoryImpl(
            ActivityAttachmentJpaRepository activityAttachmentJpaRepository,
            ActivityAttachmentMapper activityAttachmentMapper) {
        this.activityAttachmentJpaRepository = activityAttachmentJpaRepository;
        this.activityAttachmentMapper = activityAttachmentMapper;
    }
    
    @Override
    public ActivityAttachment save(ActivityAttachment attachment) {
        var entity = activityAttachmentMapper.toEntity(attachment);
        var savedEntity = activityAttachmentJpaRepository.save(entity);
        return activityAttachmentMapper.toDomain(savedEntity);
    }
    
    @Override
    public Optional<ActivityAttachment> findById(Long id) {
        return activityAttachmentJpaRepository.findById(id)
                .map(activityAttachmentMapper::toDomain);
    }
    
    @Override
    public List<ActivityAttachment> findByActivityId(Long activityId) {
        return activityAttachmentJpaRepository.findByActivityIdOrderByUploadedAtDesc(activityId).stream()
                .map(activityAttachmentMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ActivityAttachment> findByActivityId(Long activityId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return activityAttachmentJpaRepository.findByActivityId(activityId, pageable).stream()
                .map(activityAttachmentMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ActivityAttachment> findByUserId(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return activityAttachmentJpaRepository.findByUserId(userId, pageable).stream()
                .map(activityAttachmentMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ActivityAttachment> findByFileType(String fileType, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return activityAttachmentJpaRepository.findByFileTypeContainingIgnoreCase(fileType, pageable).stream()
                .map(activityAttachmentMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public long countByActivityId(Long activityId) {
        return activityAttachmentJpaRepository.countByActivityId(activityId);
    }
    
    @Override
    public void deleteById(Long id) {
        activityAttachmentJpaRepository.deleteById(id);
    }
}

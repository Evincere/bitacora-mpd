package com.bitacora.infrastructure.persistence.repository;

import com.bitacora.domain.model.activity.ActivityCategory;
import com.bitacora.domain.port.repository.ActivityCategoryRepository;
import com.bitacora.infrastructure.persistence.mapper.ActivityCategoryMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementación del repositorio ActivityCategoryRepository.
 */
@Repository
public class ActivityCategoryRepositoryImpl implements ActivityCategoryRepository {
    
    private final ActivityCategoryJpaRepository activityCategoryJpaRepository;
    private final ActivityCategoryMapper activityCategoryMapper;
    
    /**
     * Constructor.
     * 
     * @param activityCategoryJpaRepository Repositorio JPA para ActivityCategoryEntity
     * @param activityCategoryMapper Mapper para convertir entre ActivityCategory y ActivityCategoryEntity
     */
    public ActivityCategoryRepositoryImpl(
            ActivityCategoryJpaRepository activityCategoryJpaRepository,
            ActivityCategoryMapper activityCategoryMapper) {
        this.activityCategoryJpaRepository = activityCategoryJpaRepository;
        this.activityCategoryMapper = activityCategoryMapper;
    }
    
    @Override
    public ActivityCategory save(ActivityCategory category) {
        var entity = activityCategoryMapper.toEntity(category);
        var savedEntity = activityCategoryJpaRepository.save(entity);
        return activityCategoryMapper.toDomain(savedEntity);
    }
    
    @Override
    public Optional<ActivityCategory> findById(Long id) {
        return activityCategoryJpaRepository.findById(id)
                .map(activityCategoryMapper::toDomain);
    }
    
    @Override
    public List<ActivityCategory> findAll() {
        return activityCategoryJpaRepository.findAll().stream()
                .map(activityCategoryMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ActivityCategory> findByNameContaining(String name) {
        return activityCategoryJpaRepository.findByNameContainingIgnoreCase(name).stream()
                .map(activityCategoryMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ActivityCategory> findDefaultCategories() {
        return activityCategoryJpaRepository.findByIsDefaultTrue().stream()
                .map(activityCategoryMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ActivityCategory> findByCreatorId(Long creatorId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return activityCategoryJpaRepository.findByCreatorId(creatorId, pageable).stream()
                .map(activityCategoryMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<ActivityCategory> findByName(String name) {
        return activityCategoryJpaRepository.findByNameIgnoreCase(name)
                .map(activityCategoryMapper::toDomain);
    }
    
    @Override
    public void deleteById(Long id) {
        activityCategoryJpaRepository.deleteById(id);
    }
    
    @Override
    public List<ActivityCategory> search(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return activityCategoryJpaRepository.search(query, pageable).stream()
                .map(activityCategoryMapper::toDomain)
                .collect(Collectors.toList());
    }
}

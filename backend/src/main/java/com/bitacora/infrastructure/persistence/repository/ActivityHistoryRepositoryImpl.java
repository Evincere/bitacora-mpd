package com.bitacora.infrastructure.persistence.repository;

import com.bitacora.domain.model.activity.ActivityHistory;
import com.bitacora.domain.port.repository.ActivityHistoryRepository;
import com.bitacora.infrastructure.persistence.mapper.ActivityHistoryMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementación del repositorio ActivityHistoryRepository.
 */
@Repository
public class ActivityHistoryRepositoryImpl implements ActivityHistoryRepository {
    
    private final ActivityHistoryJpaRepository activityHistoryJpaRepository;
    private final ActivityHistoryMapper activityHistoryMapper;
    
    /**
     * Constructor.
     * 
     * @param activityHistoryJpaRepository Repositorio JPA para ActivityHistoryEntity
     * @param activityHistoryMapper Mapper para convertir entre ActivityHistory y ActivityHistoryEntity
     */
    public ActivityHistoryRepositoryImpl(
            ActivityHistoryJpaRepository activityHistoryJpaRepository,
            ActivityHistoryMapper activityHistoryMapper) {
        this.activityHistoryJpaRepository = activityHistoryJpaRepository;
        this.activityHistoryMapper = activityHistoryMapper;
    }
    
    @Override
    public ActivityHistory save(ActivityHistory history) {
        var entity = activityHistoryMapper.toEntity(history);
        var savedEntity = activityHistoryJpaRepository.save(entity);
        return activityHistoryMapper.toDomain(savedEntity);
    }
    
    @Override
    public Optional<ActivityHistory> findById(Long id) {
        return activityHistoryJpaRepository.findById(id)
                .map(activityHistoryMapper::toDomain);
    }
    
    @Override
    public List<ActivityHistory> findByActivityId(Long activityId) {
        return activityHistoryJpaRepository.findByActivityIdOrderByChangeDateDesc(activityId).stream()
                .map(activityHistoryMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ActivityHistory> findByActivityId(Long activityId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return activityHistoryJpaRepository.findByActivityId(activityId, pageable).stream()
                .map(activityHistoryMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ActivityHistory> findByUserId(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return activityHistoryJpaRepository.findByUserId(userId, pageable).stream()
                .map(activityHistoryMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ActivityHistory> findByNewStatus(String newStatus, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return activityHistoryJpaRepository.findByNewStatus(newStatus, pageable).stream()
                .map(activityHistoryMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ActivityHistory> findByChangeDateBetween(LocalDateTime startDate, LocalDateTime endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return activityHistoryJpaRepository.findByChangeDateBetween(startDate, endDate, pageable).stream()
                .map(activityHistoryMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public void deleteById(Long id) {
        activityHistoryJpaRepository.deleteById(id);
    }
}

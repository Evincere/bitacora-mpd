package com.bitacora.infrastructure.persistence.repository;

import com.bitacora.infrastructure.persistence.entity.ActivityEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ActivityJpaRepository extends JpaRepository<ActivityEntity, Long> {
    
    Page<ActivityEntity> findByUserId(Long userId, Pageable pageable);
    
    Page<ActivityEntity> findByType(String type, Pageable pageable);
    
    Page<ActivityEntity> findByStatus(String status, Pageable pageable);
    
    Page<ActivityEntity> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    Page<ActivityEntity> findByPerson(String person, Pageable pageable);
    
    @Query("SELECT a FROM ActivityEntity a WHERE " +
           "LOWER(a.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.person) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.role) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.dependency) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<ActivityEntity> search(@Param("query") String query, Pageable pageable);
}

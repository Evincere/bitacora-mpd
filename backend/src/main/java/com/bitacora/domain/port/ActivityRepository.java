package com.bitacora.domain.port;

import com.bitacora.domain.model.Activity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ActivityRepository {
    Activity save(Activity activity);
    Optional<Activity> findById(Long id);
    List<Activity> findAll(int page, int size);
    List<Activity> findByUserId(Long userId, int page, int size);
    List<Activity> findByType(String type, int page, int size);
    List<Activity> findByStatus(String status, int page, int size);
    List<Activity> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate, int page, int size);
    List<Activity> findByPerson(String person, int page, int size);
    List<Activity> search(String query, int page, int size);
    long count();
    long countByUserId(Long userId);
    long countByType(String type);
    long countByStatus(String status);
    long countByDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    long countByPerson(String person);
    long countSearch(String query);
    void deleteById(Long id);
}

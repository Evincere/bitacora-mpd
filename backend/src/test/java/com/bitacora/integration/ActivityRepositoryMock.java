package com.bitacora.integration;

import com.bitacora.domain.model.activity.Activity;
import com.bitacora.domain.model.activity.ActivityStatus;
import com.bitacora.domain.model.activity.ActivityType;
import com.bitacora.domain.port.repository.ActivityRepository;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Implementación mock del repositorio de actividades para pruebas.
 */
@Repository
@Primary
public class ActivityRepositoryMock implements ActivityRepository {

    private final Map<Long, Activity> activities = new HashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    @Override
    public Activity save(Activity activity) {
        if (activity.getId() == null) {
            Long id = idGenerator.getAndIncrement();
            activity.setId(id);
        }
        activities.put(activity.getId(), activity);
        return activity;
    }

    @Override
    public Optional<Activity> findById(Long id) {
        return Optional.ofNullable(activities.get(id));
    }

    @Override
    public List<Activity> findAll(int page, int size) {
        return new ArrayList<>(activities.values());
    }

    @Override
    public List<Activity> findByType(ActivityType type, int page, int size) {
        return activities.values().stream()
                .filter(a -> a.getType() == type)
                .toList();
    }

    @Override
    public List<Activity> findByStatus(ActivityStatus status, int page, int size) {
        return activities.values().stream()
                .filter(a -> a.getStatus() == status)
                .toList();
    }

    @Override
    public List<Activity> findByUserId(Long userId, int page, int size) {
        return new ArrayList<>();
    }

    @Override
    public List<Activity> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate, int page, int size) {
        return activities.values().stream()
                .filter(a -> !a.getDate().isBefore(startDate) && !a.getDate().isAfter(endDate))
                .toList();
    }

    @Override
    public List<Activity> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return activities.values().stream()
                .filter(a -> !a.getDate().isBefore(startDate) && !a.getDate().isAfter(endDate))
                .toList();
    }

    @Override
    public List<Activity> findByPerson(String person, int page, int size) {
        return activities.values().stream()
                .filter(a -> a.getPerson() != null && a.getPerson().contains(person))
                .toList();
    }

    @Override
    public List<Activity> search(String query, int page, int size) {
        return new ArrayList<>(activities.values());
    }

    @Override
    public long count() {
        return activities.size();
    }

    @Override
    public long countByUserId(Long userId) {
        return 0;
    }

    @Override
    public long countByType(ActivityType type) {
        return activities.values().stream()
                .filter(a -> a.getType() == type)
                .count();
    }

    @Override
    public long countByStatus(ActivityStatus status) {
        return activities.values().stream()
                .filter(a -> a.getStatus() == status)
                .count();
    }

    @Override
    public long countByDateBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return activities.values().stream()
                .filter(a -> !a.getDate().isBefore(startDate) && !a.getDate().isAfter(endDate))
                .count();
    }

    @Override
    public long countByPerson(String person) {
        return activities.values().stream()
                .filter(a -> a.getPerson() != null && a.getPerson().contains(person))
                .count();
    }

    @Override
    public long countSearch(String query) {
        return activities.size();
    }

    @Override
    public List<Activity> findWithFilters(Map<String, Object> filters, int page, int size) {
        return new ArrayList<>(activities.values());
    }

    @Override
    public long countWithFilters(Map<String, Object> filters) {
        return activities.size();
    }

    @Override
    public void deleteById(Long id) {
        activities.remove(id);
    }

    /**
     * Limpia todas las actividades almacenadas.
     */
    public void clear() {
        activities.clear();
    }
}

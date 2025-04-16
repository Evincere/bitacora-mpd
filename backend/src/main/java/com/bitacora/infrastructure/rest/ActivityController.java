package com.bitacora.infrastructure.rest;

import com.bitacora.infrastructure.persistence.entity.ActivityEntity;
import com.bitacora.infrastructure.persistence.repository.ActivityJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/activities")
@RequiredArgsConstructor
public class ActivityController {
    
    private final ActivityJpaRepository activityRepository;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllActivities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String search
    ) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date"));
        Page<ActivityEntity> activitiesPage;
        
        if (type != null && !type.isEmpty()) {
            activitiesPage = activityRepository.findByType(type, pageRequest);
        } else if (status != null && !status.isEmpty()) {
            activitiesPage = activityRepository.findByStatus(status, pageRequest);
        } else if (startDate != null && !startDate.isEmpty() && endDate != null && !endDate.isEmpty()) {
            LocalDateTime start = LocalDateTime.parse(startDate + "T00:00:00");
            LocalDateTime end = LocalDateTime.parse(endDate + "T23:59:59");
            activitiesPage = activityRepository.findByDateBetween(start, end, pageRequest);
        } else if (search != null && !search.isEmpty()) {
            activitiesPage = activityRepository.search(search, pageRequest);
        } else {
            activitiesPage = activityRepository.findAll(pageRequest);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("activities", activitiesPage.getContent());
        response.put("totalCount", activitiesPage.getTotalElements());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ActivityEntity> getActivityById(@PathVariable Long id) {
        return activityRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<ActivityEntity> createActivity(@RequestBody ActivityEntity activity) {
        activity.setId(null); // Asegurar que es una nueva entidad
        activity.setCreatedAt(LocalDateTime.now());
        activity.setLastStatusChangeDate(LocalDateTime.now());
        
        // Temporalmente asignamos un userId fijo para desarrollo
        if (activity.getUserId() == null) {
            activity.setUserId(1L);
        }
        
        ActivityEntity savedActivity = activityRepository.save(activity);
        return ResponseEntity.ok(savedActivity);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ActivityEntity> updateActivity(
            @PathVariable Long id,
            @RequestBody ActivityEntity activity
    ) {
        return activityRepository.findById(id)
                .map(existingActivity -> {
                    activity.setId(id);
                    activity.setCreatedAt(existingActivity.getCreatedAt());
                    activity.setUpdatedAt(LocalDateTime.now());
                    
                    // Si el estado ha cambiado, actualizamos la fecha de cambio
                    if (!existingActivity.getStatus().equals(activity.getStatus())) {
                        activity.setLastStatusChangeDate(LocalDateTime.now());
                    } else {
                        activity.setLastStatusChangeDate(existingActivity.getLastStatusChangeDate());
                    }
                    
                    ActivityEntity updatedActivity = activityRepository.save(activity);
                    return ResponseEntity.ok(updatedActivity);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        return activityRepository.findById(id)
                .map(activity -> {
                    activityRepository.delete(activity);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

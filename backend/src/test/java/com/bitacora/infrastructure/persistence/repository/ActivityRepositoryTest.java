package com.bitacora.infrastructure.persistence.repository;

import com.bitacora.domain.model.activity.Activity;
import com.bitacora.domain.model.activity.ActivityStatus;
import com.bitacora.domain.model.activity.ActivityType;
import com.bitacora.domain.port.ActivityRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests de integración para el repositorio de actividades.
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ActivityRepositoryTest {
    
    @Autowired
    private ActivityRepository activityRepository;
    
    @Test
    void testSaveAndFindById() {
        // Arrange
        Activity activity = createTestActivity();
        
        // Act
        Activity savedActivity = activityRepository.save(activity);
        Optional<Activity> foundActivity = activityRepository.findById(savedActivity.getId());
        
        // Assert
        assertTrue(foundActivity.isPresent());
        assertEquals(savedActivity.getId(), foundActivity.get().getId());
        assertEquals(activity.getDescription(), foundActivity.get().getDescription());
    }
    
    @Test
    void testFindAll() {
        // Arrange
        Activity activity1 = createTestActivity();
        Activity activity2 = createTestActivity();
        activityRepository.save(activity1);
        activityRepository.save(activity2);
        
        // Act
        List<Activity> activities = activityRepository.findAll(0, 10);
        
        // Assert
        assertFalse(activities.isEmpty());
        assertTrue(activities.size() >= 2);
    }
    
    @Test
    void testFindByType() {
        // Arrange
        Activity activity = createTestActivity();
        activity.setType(ActivityType.REUNION);
        activityRepository.save(activity);
        
        // Act
        List<Activity> activities = activityRepository.findByType(ActivityType.REUNION, 0, 10);
        
        // Assert
        assertFalse(activities.isEmpty());
        assertEquals(ActivityType.REUNION, activities.get(0).getType());
    }
    
    @Test
    void testFindByStatus() {
        // Arrange
        Activity activity = createTestActivity();
        activity.setStatus(ActivityStatus.PENDIENTE);
        activityRepository.save(activity);
        
        // Act
        List<Activity> activities = activityRepository.findByStatus(ActivityStatus.PENDIENTE, 0, 10);
        
        // Assert
        assertFalse(activities.isEmpty());
        assertEquals(ActivityStatus.PENDIENTE, activities.get(0).getStatus());
    }
    
    @Test
    void testFindByDateBetween() {
        // Arrange
        LocalDateTime startDate = LocalDateTime.now().minusDays(1);
        LocalDateTime endDate = LocalDateTime.now().plusDays(1);
        
        Activity activity = createTestActivity();
        activity.setDate(LocalDateTime.now());
        activityRepository.save(activity);
        
        // Act
        List<Activity> activities = activityRepository.findByDateBetween(startDate, endDate, 0, 10);
        
        // Assert
        assertFalse(activities.isEmpty());
    }
    
    @Test
    void testDeleteById() {
        // Arrange
        Activity activity = createTestActivity();
        Activity savedActivity = activityRepository.save(activity);
        
        // Act
        activityRepository.deleteById(savedActivity.getId());
        Optional<Activity> foundActivity = activityRepository.findById(savedActivity.getId());
        
        // Assert
        assertFalse(foundActivity.isPresent());
    }
    
    @Test
    void testCount() {
        // Arrange
        long initialCount = activityRepository.count();
        Activity activity = createTestActivity();
        activityRepository.save(activity);
        
        // Act
        long newCount = activityRepository.count();
        
        // Assert
        assertEquals(initialCount + 1, newCount);
    }
    
    /**
     * Crea una actividad de prueba.
     * 
     * @return La actividad de prueba
     */
    private Activity createTestActivity() {
        return Activity.builder()
                .date(LocalDateTime.now())
                .type(ActivityType.REUNION)
                .description("Test Activity")
                .person("John Doe")
                .role("Manager")
                .dependency("IT Department")
                .situation("Planning meeting")
                .result("Tasks assigned")
                .status(ActivityStatus.PENDIENTE)
                .lastStatusChangeDate(LocalDateTime.now())
                .comments("Test comment")
                .agent("Jane Smith")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .userId(1L)
                .build();
    }
}

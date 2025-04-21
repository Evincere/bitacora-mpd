package com.bitacora.domain.model.activity;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests unitarios para la clase Activity.
 */
class ActivityTest {
    
    @Test
    void testChangeStatus() {
        // Arrange
        Activity activity = Activity.builder()
                .id(1L)
                .description("Test Activity")
                .status(ActivityStatus.PENDIENTE)
                .build();
        
        // Act
        activity.changeStatus(ActivityStatus.EN_PROGRESO);
        
        // Assert
        assertEquals(ActivityStatus.EN_PROGRESO, activity.getStatus());
        assertNotNull(activity.getLastStatusChangeDate());
    }
    
    @Test
    void testIsCompleted() {
        // Arrange
        Activity activity = Activity.builder()
                .id(1L)
                .description("Test Activity")
                .status(ActivityStatus.COMPLETADA)
                .build();
        
        // Act & Assert
        assertTrue(activity.isCompleted());
        assertFalse(activity.isPending());
        assertFalse(activity.isInProgress());
        assertFalse(activity.isCancelled());
        assertFalse(activity.isArchived());
    }
    
    @Test
    void testIsPending() {
        // Arrange
        Activity activity = Activity.builder()
                .id(1L)
                .description("Test Activity")
                .status(ActivityStatus.PENDIENTE)
                .build();
        
        // Act & Assert
        assertTrue(activity.isPending());
        assertFalse(activity.isCompleted());
        assertFalse(activity.isInProgress());
        assertFalse(activity.isCancelled());
        assertFalse(activity.isArchived());
    }
    
    @Test
    void testIsInProgress() {
        // Arrange
        Activity activity = Activity.builder()
                .id(1L)
                .description("Test Activity")
                .status(ActivityStatus.EN_PROGRESO)
                .build();
        
        // Act & Assert
        assertTrue(activity.isInProgress());
        assertFalse(activity.isCompleted());
        assertFalse(activity.isPending());
        assertFalse(activity.isCancelled());
        assertFalse(activity.isArchived());
    }
    
    @Test
    void testIsCancelled() {
        // Arrange
        Activity activity = Activity.builder()
                .id(1L)
                .description("Test Activity")
                .status(ActivityStatus.CANCELADA)
                .build();
        
        // Act & Assert
        assertTrue(activity.isCancelled());
        assertFalse(activity.isCompleted());
        assertFalse(activity.isPending());
        assertFalse(activity.isInProgress());
        assertFalse(activity.isArchived());
    }
    
    @Test
    void testIsArchived() {
        // Arrange
        Activity activity = Activity.builder()
                .id(1L)
                .description("Test Activity")
                .status(ActivityStatus.ARCHIVADA)
                .build();
        
        // Act & Assert
        assertTrue(activity.isArchived());
        assertFalse(activity.isCompleted());
        assertFalse(activity.isPending());
        assertFalse(activity.isInProgress());
        assertFalse(activity.isCancelled());
    }
    
    @Test
    void testBuilder() {
        // Arrange
        LocalDateTime now = LocalDateTime.now();
        
        // Act
        Activity activity = Activity.builder()
                .id(1L)
                .date(now)
                .type(ActivityType.REUNION)
                .description("Test Activity")
                .person("John Doe")
                .role("Manager")
                .dependency("IT Department")
                .situation("Planning meeting")
                .result("Tasks assigned")
                .status(ActivityStatus.COMPLETADA)
                .lastStatusChangeDate(now)
                .comments("Good meeting")
                .agent("Jane Smith")
                .createdAt(now)
                .updatedAt(now)
                .userId(2L)
                .build();
        
        // Assert
        assertEquals(1L, activity.getId());
        assertEquals(now, activity.getDate());
        assertEquals(ActivityType.REUNION, activity.getType());
        assertEquals("Test Activity", activity.getDescription());
        assertEquals("John Doe", activity.getPerson());
        assertEquals("Manager", activity.getRole());
        assertEquals("IT Department", activity.getDependency());
        assertEquals("Planning meeting", activity.getSituation());
        assertEquals("Tasks assigned", activity.getResult());
        assertEquals(ActivityStatus.COMPLETADA, activity.getStatus());
        assertEquals(now, activity.getLastStatusChangeDate());
        assertEquals("Good meeting", activity.getComments());
        assertEquals("Jane Smith", activity.getAgent());
        assertEquals(now, activity.getCreatedAt());
        assertEquals(now, activity.getUpdatedAt());
        assertEquals(2L, activity.getUserId());
    }
}

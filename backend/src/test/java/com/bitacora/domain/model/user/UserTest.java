package com.bitacora.domain.model.user;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests unitarios para la clase User.
 */
class UserTest {
    
    @Test
    void testHasPermission() {
        // Arrange
        Set<Permission> permissions = new HashSet<>();
        permissions.add(Permission.READ_ACTIVITIES);
        
        User user = User.builder()
                .id(1L)
                .username("testuser")
                .role(UserRole.USUARIO)
                .permissions(permissions)
                .build();
        
        // Act & Assert
        assertTrue(user.hasPermission(Permission.READ_ACTIVITIES));
        assertTrue(user.hasPermission(Permission.WRITE_ACTIVITIES)); // Viene del rol USUARIO
        assertFalse(user.hasPermission(Permission.DELETE_ACTIVITIES));
    }
    
    @Test
    void testAddPermission() {
        // Arrange
        User user = User.builder()
                .id(1L)
                .username("testuser")
                .role(UserRole.USUARIO)
                .build();
        
        // Act
        user.addPermission(Permission.GENERATE_REPORTS);
        
        // Assert
        assertTrue(user.hasPermission(Permission.GENERATE_REPORTS));
    }
    
    @Test
    void testRemovePermission() {
        // Arrange
        Set<Permission> permissions = new HashSet<>();
        permissions.add(Permission.READ_ACTIVITIES);
        permissions.add(Permission.GENERATE_REPORTS);
        
        User user = User.builder()
                .id(1L)
                .username("testuser")
                .role(UserRole.USUARIO)
                .permissions(permissions)
                .build();
        
        // Act
        user.removePermission(Permission.GENERATE_REPORTS);
        
        // Assert
        assertTrue(user.hasPermission(Permission.READ_ACTIVITIES));
        assertFalse(user.hasPermission(Permission.GENERATE_REPORTS));
    }
    
    @Test
    void testActivateDeactivate() {
        // Arrange
        User user = User.builder()
                .id(1L)
                .username("testuser")
                .active(false)
                .build();
        
        // Act & Assert
        assertFalse(user.isActive());
        
        user.activate();
        assertTrue(user.isActive());
        
        user.deactivate();
        assertFalse(user.isActive());
    }
    
    @Test
    void testGetFullName() {
        // Arrange
        User user = User.builder()
                .id(1L)
                .username("testuser")
                .personName(PersonName.of("John", "Doe"))
                .build();
        
        // Act & Assert
        assertEquals("John Doe", user.getFullName());
    }
    
    @Test
    void testBuilder() {
        // Arrange
        LocalDateTime now = LocalDateTime.now();
        Set<Permission> permissions = new HashSet<>();
        permissions.add(Permission.GENERATE_REPORTS);
        
        // Act
        User user = User.builder()
                .id(1L)
                .username("testuser")
                .password(Password.createHashed("hashedPassword"))
                .email(Email.of("test@example.com"))
                .personName(PersonName.of("John", "Doe"))
                .role(UserRole.ADMIN)
                .position("Manager")
                .department("IT")
                .active(true)
                .createdAt(now)
                .updatedAt(now)
                .permissions(permissions)
                .build();
        
        // Assert
        assertEquals(1L, user.getId());
        assertEquals("testuser", user.getUsername());
        assertEquals("hashedPassword", user.getPassword().getValue());
        assertEquals("test@example.com", user.getEmail().getValue());
        assertEquals("John", user.getPersonName().getFirstName());
        assertEquals("Doe", user.getPersonName().getLastName());
        assertEquals(UserRole.ADMIN, user.getRole());
        assertEquals("Manager", user.getPosition());
        assertEquals("IT", user.getDepartment());
        assertTrue(user.isActive());
        assertEquals(now, user.getCreatedAt());
        assertEquals(now, user.getUpdatedAt());
        assertTrue(user.getPermissions().contains(Permission.GENERATE_REPORTS));
    }
}

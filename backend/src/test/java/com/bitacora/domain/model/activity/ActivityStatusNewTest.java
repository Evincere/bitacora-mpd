package com.bitacora.domain.model.activity;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests unitarios para la enumeración ActivityStatusNew.
 */
class ActivityStatusNewTest {
    
    @Test
    void testGetDisplayName() {
        // Act & Assert
        assertEquals("Solicitada", ActivityStatusNew.REQUESTED.getDisplayName());
        assertEquals("Asignada", ActivityStatusNew.ASSIGNED.getDisplayName());
        assertEquals("En Progreso", ActivityStatusNew.IN_PROGRESS.getDisplayName());
        assertEquals("Completada", ActivityStatusNew.COMPLETED.getDisplayName());
        assertEquals("Aprobada", ActivityStatusNew.APPROVED.getDisplayName());
        assertEquals("Rechazada", ActivityStatusNew.REJECTED.getDisplayName());
        assertEquals("Cancelada", ActivityStatusNew.CANCELLED.getDisplayName());
    }
    
    @Test
    void testFromStringWithValidValues() {
        // Act & Assert - Usando nombres de enum
        assertEquals(ActivityStatusNew.REQUESTED, ActivityStatusNew.fromString("REQUESTED"));
        assertEquals(ActivityStatusNew.ASSIGNED, ActivityStatusNew.fromString("ASSIGNED"));
        assertEquals(ActivityStatusNew.IN_PROGRESS, ActivityStatusNew.fromString("IN_PROGRESS"));
        assertEquals(ActivityStatusNew.COMPLETED, ActivityStatusNew.fromString("COMPLETED"));
        assertEquals(ActivityStatusNew.APPROVED, ActivityStatusNew.fromString("APPROVED"));
        assertEquals(ActivityStatusNew.REJECTED, ActivityStatusNew.fromString("REJECTED"));
        assertEquals(ActivityStatusNew.CANCELLED, ActivityStatusNew.fromString("CANCELLED"));
        
        // Act & Assert - Usando nombres de visualización
        assertEquals(ActivityStatusNew.REQUESTED, ActivityStatusNew.fromString("Solicitada"));
        assertEquals(ActivityStatusNew.ASSIGNED, ActivityStatusNew.fromString("Asignada"));
        assertEquals(ActivityStatusNew.IN_PROGRESS, ActivityStatusNew.fromString("En Progreso"));
        assertEquals(ActivityStatusNew.COMPLETED, ActivityStatusNew.fromString("Completada"));
        assertEquals(ActivityStatusNew.APPROVED, ActivityStatusNew.fromString("Aprobada"));
        assertEquals(ActivityStatusNew.REJECTED, ActivityStatusNew.fromString("Rechazada"));
        assertEquals(ActivityStatusNew.CANCELLED, ActivityStatusNew.fromString("Cancelada"));
    }
    
    @Test
    void testFromStringCaseInsensitive() {
        // Act & Assert - Usando nombres de enum en minúsculas
        assertEquals(ActivityStatusNew.REQUESTED, ActivityStatusNew.fromString("requested"));
        assertEquals(ActivityStatusNew.ASSIGNED, ActivityStatusNew.fromString("assigned"));
        assertEquals(ActivityStatusNew.IN_PROGRESS, ActivityStatusNew.fromString("in_progress"));
        
        // Act & Assert - Usando nombres de visualización con diferentes casos
        assertEquals(ActivityStatusNew.REQUESTED, ActivityStatusNew.fromString("solicitada"));
        assertEquals(ActivityStatusNew.ASSIGNED, ActivityStatusNew.fromString("ASIGNADA"));
        assertEquals(ActivityStatusNew.IN_PROGRESS, ActivityStatusNew.fromString("En progreso"));
    }
    
    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {" ", "  ", "\t", "\n"})
    void testFromStringWithNullOrEmptyValues(String input) {
        // Act & Assert
        assertEquals(ActivityStatusNew.REQUESTED, ActivityStatusNew.fromString(input));
    }
    
    @Test
    void testFromStringWithInvalidValues() {
        // Act & Assert
        assertEquals(ActivityStatusNew.REQUESTED, ActivityStatusNew.fromString("INVALID_STATUS"));
        assertEquals(ActivityStatusNew.REQUESTED, ActivityStatusNew.fromString("Estado Inválido"));
        assertEquals(ActivityStatusNew.REQUESTED, ActivityStatusNew.fromString("123"));
    }
}

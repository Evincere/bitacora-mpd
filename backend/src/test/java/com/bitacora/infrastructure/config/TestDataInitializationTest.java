package com.bitacora.infrastructure.config;

import com.bitacora.domain.port.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Prueba para verificar la inicialización de datos de prueba.
 */
@SpringBootTest
@ActiveProfiles("test") // Usar perfil de prueba
public class TestDataInitializationTest {

    @Autowired
    private UserRepository userRepository;

    /**
     * Verifica que los usuarios de prueba se hayan creado correctamente.
     */
    @Test
    public void testUsersAreInitialized() {
        // Verificar que los usuarios de prueba existen
        assertTrue(userRepository.findByUsername("admin").isPresent(), "El usuario admin debería existir");
        assertTrue(userRepository.findByUsername("usuario").isPresent(), "El usuario regular debería existir");
        assertTrue(userRepository.findByUsername("testuser").isPresent(), "El usuario de prueba debería existir");
    }
}

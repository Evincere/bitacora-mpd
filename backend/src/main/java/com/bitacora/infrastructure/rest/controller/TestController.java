package com.bitacora.infrastructure.rest.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador de prueba para verificar la autenticación y autorización.
 */
@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
@Tag(name = "Test", description = "API de prueba")
public class TestController {

    /**
     * Endpoint público que no requiere autenticación.
     *
     * @return Un mensaje de prueba
     */
    @GetMapping("/public")
    @Operation(summary = "Endpoint público", description = "Endpoint público que no requiere autenticación")
    public ResponseEntity<Map<String, Object>> publicEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Este es un endpoint público que no requiere autenticación");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint protegido que requiere autenticación.
     *
     * @return Un mensaje de prueba
     */
    @GetMapping("/protected")
    @Operation(summary = "Endpoint protegido", description = "Endpoint protegido que requiere autenticación")
    public ResponseEntity<Map<String, Object>> protectedEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Este es un endpoint protegido que requiere autenticación");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint que requiere rol de administrador.
     *
     * @return Un mensaje de prueba
     */
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Endpoint de administrador", description = "Endpoint que requiere rol de administrador")
    public ResponseEntity<Map<String, Object>> adminEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Este es un endpoint que requiere rol de administrador");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
}

package com.bitacora.infrastructure.rest.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador de prueba para verificar que la configuración de rutas funciona correctamente.
 * Este controlador se puede eliminar una vez que se haya verificado que el controlador principal funciona.
 */
@RestController
@RequestMapping("/activities-test")
public class ActivityTestController {

    /**
     * Endpoint de prueba para verificar que la configuración de rutas funciona correctamente.
     *
     * @return Un mensaje de prueba
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> testActivities() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Endpoint de actividades funcionando correctamente");
        response.put("status", "success");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
}

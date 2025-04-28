package com.bitacora.infrastructure.rest.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Controlador REST para diagnóstico de la aplicación.
 * Este controlador proporciona endpoints para verificar el estado de la aplicación.
 */
@RestController
@RequestMapping("/diagnostic")
@RequiredArgsConstructor
@Tag(name = "Diagnóstico", description = "API para diagnóstico de la aplicación")
@Slf4j
public class DiagnosticController {

    /**
     * Verifica el estado de la aplicación.
     *
     * @return Una respuesta con el estado de la aplicación
     */
    @GetMapping("/health")
    @Operation(summary = "Verificar estado", description = "Verifica el estado de la aplicación")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        log.info("Verificando estado de la aplicación");
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", new Date());
        response.put("message", "La aplicación está funcionando correctamente");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Verifica las rutas de actividades.
     *
     * @return Una respuesta con las rutas disponibles
     */
    @GetMapping("/routes/activities")
    @Operation(summary = "Verificar rutas de actividades", description = "Verifica las rutas disponibles para actividades")
    public ResponseEntity<Map<String, Object>> checkActivityRoutes() {
        log.info("Verificando rutas de actividades");
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("timestamp", new Date());
        
        List<Map<String, String>> routes = new ArrayList<>();
        
        Map<String, String> route1 = new HashMap<>();
        route1.put("method", "GET");
        route1.put("path", "/api/activities");
        route1.put("description", "Obtener todas las actividades");
        routes.add(route1);
        
        Map<String, String> route2 = new HashMap<>();
        route2.put("method", "GET");
        route2.put("path", "/api/activities/{id}");
        route2.put("description", "Obtener una actividad por ID");
        routes.add(route2);
        
        Map<String, String> route3 = new HashMap<>();
        route3.put("method", "POST");
        route3.put("path", "/api/activities");
        route3.put("description", "Crear una actividad");
        routes.add(route3);
        
        Map<String, String> route4 = new HashMap<>();
        route4.put("method", "PUT");
        route4.put("path", "/api/activities/{id}");
        route4.put("description", "Actualizar una actividad");
        routes.add(route4);
        
        Map<String, String> route5 = new HashMap<>();
        route5.put("method", "DELETE");
        route5.put("path", "/api/activities/{id}");
        route5.put("description", "Eliminar una actividad");
        routes.add(route5);
        
        Map<String, String> route6 = new HashMap<>();
        route6.put("method", "GET");
        route6.put("path", "/api/activities/stats/by-type");
        route6.put("description", "Obtener estadísticas por tipo");
        routes.add(route6);
        
        Map<String, String> route7 = new HashMap<>();
        route7.put("method", "GET");
        route7.put("path", "/api/activities/stats/by-status");
        route7.put("description", "Obtener estadísticas por estado");
        routes.add(route7);
        
        Map<String, String> route8 = new HashMap<>();
        route8.put("method", "GET");
        route8.put("path", "/api/activities/summaries");
        route8.put("description", "Obtener resúmenes de actividades");
        routes.add(route8);
        
        response.put("routes", routes);
        
        return ResponseEntity.ok(response);
    }
}

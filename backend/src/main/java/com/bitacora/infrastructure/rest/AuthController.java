package com.bitacora.infrastructure.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        // Para desarrollo, aceptamos cualquier usuario/contraseña
        String username = loginRequest.get("username");
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", 1L);
        response.put("username", username);
        response.put("email", username + "@example.com");
        response.put("firstName", "Usuario");
        response.put("lastName", "Demo");
        response.put("role", "ADMIN");
        response.put("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IlVzdWFyaW8gRGVtbyIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
        
        return ResponseEntity.ok(response);
    }
}

package com.bitacora.infrastructure.security;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Date;

/**
 * Servicio para gestionar la lista negra de tokens JWT.
 * Almacena los tokens invalidados hasta su fecha de expiración.
 */
@Service
public class TokenBlacklistService {

    // Mapa para almacenar los tokens invalidados y su fecha de expiración
    private final Map<String, Date> blacklistedTokens = new ConcurrentHashMap<>();

    /**
     * Añade un token a la lista negra.
     *
     * @param token El token JWT a invalidar
     * @param expiryDate La fecha de expiración del token
     */
    public void addToBlacklist(String token, Date expiryDate) {
        blacklistedTokens.put(token, expiryDate);
        
        // Limpiar tokens expirados periódicamente
        cleanupExpiredTokens();
    }

    /**
     * Verifica si un token está en la lista negra.
     *
     * @param token El token JWT a verificar
     * @return true si el token está en la lista negra, false en caso contrario
     */
    public boolean isBlacklisted(String token) {
        return blacklistedTokens.containsKey(token);
    }

    /**
     * Elimina los tokens expirados de la lista negra.
     */
    private void cleanupExpiredTokens() {
        Date now = new Date();
        blacklistedTokens.entrySet().removeIf(entry -> entry.getValue().before(now));
    }
}

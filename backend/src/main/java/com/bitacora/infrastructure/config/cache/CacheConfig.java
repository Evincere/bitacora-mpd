package com.bitacora.infrastructure.config.cache;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;

/**
 * Configuración de caché para la aplicación.
 */
@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * Nombres de las cachés utilizadas en la aplicación.
     */
    public static final String ACTIVITIES_CACHE = "activities";
    public static final String USERS_CACHE = "users";
    public static final String ACTIVITY_TYPES_CACHE = "activityTypes";
    public static final String ACTIVITY_STATUSES_CACHE = "activityStatuses";
    
    /**
     * Configura el gestor de caché con Caffeine.
     * 
     * @return El gestor de caché configurado
     */
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        
        // Configura las cachés disponibles
        cacheManager.setCacheNames(Arrays.asList(
                ACTIVITIES_CACHE,
                USERS_CACHE,
                ACTIVITY_TYPES_CACHE,
                ACTIVITY_STATUSES_CACHE
        ));
        
        // Configura Caffeine
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .initialCapacity(100)
                .maximumSize(500)
                .expireAfterWrite(10, TimeUnit.MINUTES)
                .recordStats());
        
        return cacheManager;
    }
}

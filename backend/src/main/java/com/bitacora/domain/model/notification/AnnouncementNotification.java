package com.bitacora.domain.model.notification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Modelo de dominio para notificaciones de anuncios y comunicados.
 * Extiende la clase base RealTimeNotification.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class AnnouncementNotification extends RealTimeNotification {
    
    /**
     * Departamento al que va dirigido el anuncio (null si es global).
     */
    private String department;
    
    /**
     * Tipo de anuncio.
     */
    private AnnouncementType announcementType;
    
    /**
     * Fecha del evento en milisegundos desde la época Unix (si es un evento).
     */
    private Long eventDate;
    
    /**
     * Ubicación del evento (si es un evento).
     */
    private String location;
    
    /**
     * Identificador del usuario que creó el anuncio.
     */
    private Long createdById;
    
    /**
     * Nombre del usuario que creó el anuncio.
     */
    private String createdByName;
    
    /**
     * Tipos de anuncio disponibles.
     */
    public enum AnnouncementType {
        /**
         * Anuncio global para todos los usuarios.
         */
        GLOBAL,
        
        /**
         * Anuncio específico para un departamento.
         */
        DEPARTMENTAL,
        
        /**
         * Anuncio de un evento programado.
         */
        EVENT
    }
}

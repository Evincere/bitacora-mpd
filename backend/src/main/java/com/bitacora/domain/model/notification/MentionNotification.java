package com.bitacora.domain.model.notification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Modelo de dominio para notificaciones de menciones en comentarios.
 * Extiende la clase base RealTimeNotification.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class MentionNotification extends RealTimeNotification {
    
    /**
     * ID de la solicitud donde se realizó la mención.
     */
    private Long taskRequestId;
    
    /**
     * Título de la solicitud donde se realizó la mención.
     */
    private String taskRequestTitle;
    
    /**
     * ID del comentario donde se realizó la mención.
     */
    private Long commentId;
    
    /**
     * ID del usuario que realizó la mención.
     */
    private Long mentionedById;
    
    /**
     * Nombre del usuario que realizó la mención.
     */
    private String mentionedByName;
    
    /**
     * Fragmento del comentario que contiene la mención.
     */
    private String commentFragment;
}

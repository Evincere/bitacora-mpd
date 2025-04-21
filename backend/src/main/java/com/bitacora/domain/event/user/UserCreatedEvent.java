package com.bitacora.domain.event.user;

import com.bitacora.domain.event.AbstractDomainEvent;
import com.bitacora.domain.model.user.User;

/**
 * Evento de dominio que se dispara cuando se crea un usuario.
 */
public class UserCreatedEvent extends AbstractDomainEvent {
    
    private final Long userId;
    private final String username;
    private final String email;
    
    /**
     * Constructor para crear una instancia de UserCreatedEvent.
     * 
     * @param user El usuario creado
     */
    public UserCreatedEvent(User user) {
        super();
        this.userId = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail().getValue();
    }
    
    /**
     * Obtiene el ID del usuario.
     * 
     * @return El ID del usuario
     */
    public Long getUserId() {
        return userId;
    }
    
    /**
     * Obtiene el nombre de usuario.
     * 
     * @return El nombre de usuario
     */
    public String getUsername() {
        return username;
    }
    
    /**
     * Obtiene la dirección de correo electrónico del usuario.
     * 
     * @return La dirección de correo electrónico
     */
    public String getEmail() {
        return email;
    }
}

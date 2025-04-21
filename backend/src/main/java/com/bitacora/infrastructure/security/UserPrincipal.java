package com.bitacora.infrastructure.security;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

/**
 * Principal de usuario para Spring Security con información adicional.
 */
@Getter
public class UserPrincipal extends User {
    
    private final Long id;
    
    /**
     * Constructor para crear un UserPrincipal.
     * 
     * @param id El ID del usuario
     * @param username El nombre de usuario
     * @param password La contraseña
     * @param authorities Las autoridades del usuario
     */
    public UserPrincipal(Long id, String username, String password, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
        this.id = id;
    }
}

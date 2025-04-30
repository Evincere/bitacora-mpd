package com.bitacora.infrastructure.security;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;
import java.util.List;

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

    /**
     * Método de utilidad para tests: crea un UserPrincipal con roles como String.
     */
    public static UserPrincipal create(Long id, String username, String password, List<String> roles) {
        java.util.List<org.springframework.security.core.GrantedAuthority> authorities = new java.util.ArrayList<>();
        for (String role : roles) {
            authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(role));
        }
        return new UserPrincipal(id, username, password, authorities);
    }
}

package com.bitacora.infrastructure.security;

import com.bitacora.domain.model.user.Permission;
import com.bitacora.domain.model.user.User;
import com.bitacora.domain.port.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementación de UserDetailsService para cargar usuarios desde el repositorio.
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    
    private final UserRepository userRepository;
    
    /**
     * Carga un usuario por su nombre de usuario.
     * 
     * @param username El nombre de usuario
     * @return Los detalles del usuario
     * @throws UsernameNotFoundException Si no se encuentra el usuario
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
        
        if (!user.isActive()) {
            throw new UsernameNotFoundException("Usuario desactivado: " + username);
        }
        
        return new UserPrincipal(
                user.getId(),
                user.getUsername(),
                user.getPassword().getValue(),
                getAuthorities(user)
        );
    }
    
    /**
     * Obtiene las autoridades de un usuario.
     * 
     * @param user El usuario
     * @return Las autoridades del usuario
     */
    private List<GrantedAuthority> getAuthorities(User user) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        
        // Agregar rol como autoridad
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        
        // Agregar permisos como autoridades
        List<GrantedAuthority> permissionAuthorities = user.getPermissions().stream()
                .map(Permission::name)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        
        authorities.addAll(permissionAuthorities);
        
        // Agregar permisos del rol como autoridades
        List<GrantedAuthority> rolePermissionAuthorities = user.getRole().getPermissions().stream()
                .map(Permission::name)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        
        authorities.addAll(rolePermissionAuthorities);
        
        return authorities;
    }
}

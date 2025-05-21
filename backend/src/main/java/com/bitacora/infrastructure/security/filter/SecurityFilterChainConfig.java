package com.bitacora.infrastructure.security.filter;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.core.Ordered;

/**
 * Configuración para la cadena de filtros de seguridad.
 * Implementa el patrón Chain of Responsibility.
 *
 * @deprecated Esta clase ha sido reemplazada por la configuración unificada en
 *             {@link com.bitacora.infrastructure.security.SecurityConfig}.
 *             La funcionalidad de esta clase se ha migrado al método
 *             {@code customSecurityFilterRegistration} en SecurityConfig.
 *             Esta clase se mantiene temporalmente por compatibilidad y será
 *             eliminada
 *             en futuras versiones.
 */
@Deprecated
@RequiredArgsConstructor
public class SecurityFilterChainConfig {

    private final JwtValidationHandler jwtValidationHandler;
    private final BlacklistCheckHandler blacklistCheckHandler;
    private final PermissionsHandler permissionsHandler;

    /**
     * Configura la cadena de filtros de seguridad.
     * El orden de los filtros es importante:
     * 1. Primero se verifica si el token está en la lista negra
     * 2. Luego se valida el token JWT
     * 3. Finalmente se verifican los permisos
     *
     * @return El bean de registro de filtros
     * @deprecated Este método ha sido reemplazado por
     *             {@code customSecurityFilterRegistration} en
     *             {@link com.bitacora.infrastructure.security.SecurityConfig}.
     */
    @Deprecated
    public FilterRegistrationBean<SecurityFilterHandler> securityFilterChain() {
        // Configurar la cadena de filtros
        blacklistCheckHandler.setNext(jwtValidationHandler);
        jwtValidationHandler.setNext(permissionsHandler);

        // Registrar el primer filtro de la cadena
        FilterRegistrationBean<SecurityFilterHandler> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(blacklistCheckHandler);
        registrationBean.addUrlPatterns("/api/*");
        registrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE + 10);

        return registrationBean;
    }
}

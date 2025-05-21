package com.bitacora.infrastructure.security;

import com.bitacora.infrastructure.security.filter.BlacklistCheckHandler;
import com.bitacora.infrastructure.security.filter.JwtValidationHandler;
import com.bitacora.infrastructure.security.filter.PermissionsHandler;
import com.bitacora.infrastructure.security.filter.SecurityFilterHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Configuración de seguridad unificada para la aplicación.
 * Combina la configuración de Spring Security y la cadena de filtros
 * personalizada.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final BlacklistCheckHandler blacklistCheckHandler;
    private final JwtValidationHandler jwtValidationHandler;
    private final PermissionsHandler permissionsHandler;

    /**
     * Configura la cadena de filtros de seguridad.
     *
     * @param http La configuración de seguridad HTTP
     * @return La cadena de filtros de seguridad
     * @throws Exception Si ocurre un error al configurar la seguridad
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        // Rutas de autenticación unificadas
                        .requestMatchers("/api/auth/**", "/auth/**").permitAll()
                        // Rutas específicas de autenticación para mayor claridad
                        .requestMatchers("/api/auth/login", "/auth/login").permitAll()
                        .requestMatchers("/api/auth/refresh", "/auth/refresh").permitAll()
                        .requestMatchers("/api/auth/logout", "/auth/logout").permitAll()
                        .requestMatchers("/api/auth/test", "/auth/test").permitAll()
                        // Documentación API
                        .requestMatchers("/api/api-docs/**", "/api/swagger-ui/**", "/api/swagger-ui.html").permitAll()
                        // Monitoreo y administración
                        .requestMatchers("/api/actuator/**").permitAll()
                        .requestMatchers("/api/h2-console/**", "/h2-console/**").permitAll()
                        // Permitir acceso a endpoints de WebSocket
                        .requestMatchers("/api/ws/**", "/ws/**").permitAll()
                        // Permitir acceso a endpoints de actividades para pruebas
                        .requestMatchers("/api/activities/**", "/activities/**").permitAll()
                        .anyRequest().authenticated())
                // Configurar la cadena de filtros usando el patrón Chain of Responsibility
                .addFilterBefore(configureFilterChain(), UsernamePasswordAuthenticationFilter.class)
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()))
                .build();
    }

    /**
     * Configura el origen de configuración CORS.
     *
     * @return El origen de configuración CORS
     */
    @Value("${bitacora.cors.allowed-origins:http://localhost:3000,http://localhost:8090,https://metres-dispatch-takes-reserve.trycloudflare.com}")
    private String[] allowedOrigins;

    @Value("${bitacora.cors.allowed-methods:GET,POST,PUT,PATCH,DELETE,OPTIONS}")
    private String[] allowedMethods;

    @Value("${bitacora.cors.allowed-headers:authorization,content-type,x-auth-token,*}")
    private String[] allowedHeaders;

    @Value("${bitacora.cors.exposed-headers:x-auth-token,authorization}")
    private String[] exposedHeaders;

    @Value("${bitacora.cors.allow-credentials:true}")
    private boolean allowCredentials;

    @Value("${bitacora.cors.max-age:3600}")
    private long maxAge;

    /**
     * Configura la cadena de filtros usando el patrón Chain of Responsibility.
     * El orden de los filtros es importante:
     * 1. Primero se verifica si el token está en la lista negra
     * 2. Luego se valida el token JWT
     * 3. Finalmente se verifican los permisos
     *
     * @return El primer filtro de la cadena
     */
    private BlacklistCheckHandler configureFilterChain() {
        // Configurar la cadena de filtros
        blacklistCheckHandler.setNext(jwtValidationHandler);
        jwtValidationHandler.setNext(permissionsHandler);

        // Devolver el primer filtro de la cadena
        return blacklistCheckHandler;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Usar los valores de las propiedades inyectadas
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins));
        configuration.setAllowedMethods(Arrays.asList(allowedMethods));
        configuration.setAllowedHeaders(Arrays.asList(allowedHeaders));
        configuration.setExposedHeaders(Arrays.asList(exposedHeaders));
        configuration.setAllowCredentials(allowCredentials);
        configuration.setMaxAge(maxAge);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Configura el codificador de contraseñas.
     *
     * @return El codificador de contraseñas
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configura el administrador de autenticación.
     *
     * @param authenticationConfiguration La configuración de autenticación
     * @return El administrador de autenticación
     * @throws Exception Si ocurre un error al configurar el administrador de
     *                   autenticación
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * Registra los filtros de seguridad personalizados como un
     * FilterRegistrationBean.
     * Este bean reemplaza al anterior 'securityFilterChain' en
     * SecurityFilterChainConfig.
     *
     * @return El bean de registro de filtros
     */
    @Bean
    public FilterRegistrationBean<SecurityFilterHandler> customSecurityFilterRegistration() {
        // Configurar la cadena de filtros (esto ya se hace en configureFilterChain,
        // pero lo mantenemos aquí por claridad)
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

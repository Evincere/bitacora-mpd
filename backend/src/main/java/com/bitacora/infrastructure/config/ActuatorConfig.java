package com.bitacora.infrastructure.config;

import org.springframework.boot.actuate.autoconfigure.endpoint.web.CorsEndpointProperties;
import org.springframework.boot.actuate.autoconfigure.endpoint.web.WebEndpointProperties;
import org.springframework.boot.actuate.autoconfigure.web.server.ManagementPortType;
import org.springframework.boot.actuate.endpoint.ExposableEndpoint;
import org.springframework.boot.actuate.endpoint.web.EndpointLinksResolver;
import org.springframework.boot.actuate.endpoint.web.EndpointMapping;
import org.springframework.boot.actuate.endpoint.web.EndpointMediaTypes;
import org.springframework.boot.actuate.endpoint.web.ExposableWebEndpoint;
import org.springframework.boot.actuate.endpoint.web.WebEndpointsSupplier;
import org.springframework.boot.actuate.endpoint.web.annotation.ControllerEndpointsSupplier;
import org.springframework.boot.actuate.endpoint.web.annotation.ServletEndpointsSupplier;
import org.springframework.boot.actuate.endpoint.web.servlet.WebMvcEndpointHandlerMapping;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Configuración de Actuator para la aplicación.
 */
@Configuration
public class ActuatorConfig {

        /**
         * Configura el mapeo de endpoints de Actuator.
         *
         * @param webEndpointsSupplier        Proveedor de endpoints web
         * @param servletEndpointsSupplier    Proveedor de endpoints servlet
         * @param controllerEndpointsSupplier Proveedor de endpoints controller
         * @param endpointMediaTypes          Tipos de medios de los endpoints
         * @param corsProperties              Propiedades CORS
         * @param webEndpointProperties       Propiedades de endpoints web
         * @param environment                 Entorno de la aplicación
         * @return El mapeo de endpoints configurado
         */
        @Bean
        public WebMvcEndpointHandlerMapping webEndpointServletHandlerMapping(
                        WebEndpointsSupplier webEndpointsSupplier,
                        ServletEndpointsSupplier servletEndpointsSupplier,
                        ControllerEndpointsSupplier controllerEndpointsSupplier,
                        EndpointMediaTypes endpointMediaTypes,
                        CorsEndpointProperties corsProperties,
                        WebEndpointProperties webEndpointProperties,
                        Environment environment) {

                List<ExposableEndpoint<?>> allEndpoints = new ArrayList<>();
                Collection<ExposableWebEndpoint> webEndpoints = webEndpointsSupplier.getEndpoints();
                allEndpoints.addAll(webEndpoints);
                allEndpoints.addAll(servletEndpointsSupplier.getEndpoints());
                allEndpoints.addAll(controllerEndpointsSupplier.getEndpoints());

                String basePath = webEndpointProperties.getBasePath();
                EndpointMapping endpointMapping = new EndpointMapping(basePath);
                boolean shouldRegisterLinksMapping = this.shouldRegisterLinksMapping(
                                webEndpointProperties, environment, basePath);

                return new WebMvcEndpointHandlerMapping(
                                endpointMapping,
                                webEndpoints,
                                endpointMediaTypes,
                                corsProperties.toCorsConfiguration(),
                                new EndpointLinksResolver(allEndpoints, basePath),
                                shouldRegisterLinksMapping);
        }

        /**
         * Determina si se debe registrar el mapeo de enlaces.
         *
         * @param webEndpointProperties Propiedades de endpoints web
         * @param environment           Entorno de la aplicación
         * @param basePath              Ruta base
         * @return true si se debe registrar el mapeo de enlaces, false en caso
         *         contrario
         */
        private boolean shouldRegisterLinksMapping(
                        WebEndpointProperties webEndpointProperties,
                        Environment environment,
                        String basePath) {

                boolean discoveryEnabled = webEndpointProperties.getDiscovery().isEnabled();
                boolean hasBasePath = StringUtils.hasText(basePath);
                boolean isSamePort = ManagementPortType.get(environment).equals(ManagementPortType.SAME);

                return discoveryEnabled && (hasBasePath || isSamePort);
        }
}

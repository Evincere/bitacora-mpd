# Solución a la Dependencia Circular entre Flyway y JPA

## Problema

Spring Boot puede generar una dependencia circular entre Flyway y JPA cuando ambos están configurados en la aplicación. El error típico es:

```
Circular depends-on relationship between 'flyway' and 'entityManagerFactory'
```

Este error ocurre porque:

1. Flyway necesita ejecutarse antes que JPA para crear/actualizar el esquema de la base de datos
2. JPA (a través de Hibernate) también intenta gestionar el esquema de la base de datos
3. La configuración automática de Spring Boot puede crear una dependencia circular entre estos componentes

## Solución Implementada

Para resolver este problema, hemos implementado las siguientes soluciones:

### 1. Configuración Manual de Flyway

Hemos creado una clase `FlywayConfig` que configura manualmente Flyway:

```java
@Configuration
@RequiredArgsConstructor
@EnableConfigurationProperties(FlywayProperties.class)
public class FlywayConfig {

    @Bean(name = "flyway")
    @DependsOn("dataSource")
    public Flyway flyway(DataSource dataSource) {
        // Configuración manual de Flyway
        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .locations(...)
                .baselineOnMigrate(...)
                .load();
        
        flyway.migrate();
        return flyway;
    }
}
```

### 2. Configuración de JPA

Hemos creado una clase `JpaConfig` que asegura que JPA se inicialice después de Flyway:

```java
@Configuration
@EnableJpaRepositories(...)
public class JpaConfig {

    @DependsOn("flyway")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource) {
        // Spring Boot creará el bean real
        return null;
    }
}
```

### 3. Desactivación de la Configuración Automática

Hemos desactivado la configuración automática de Flyway en `application-flyway.yml`:

```yaml
spring:
  autoconfigure:
    exclude:
      - org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration
```

### 4. Configuración de Perfiles

Hemos agregado un perfil específico para esta configuración y lo activamos en la clase principal:

```java
public static void main(String[] args) {
    SpringApplication application = new SpringApplication(BitacoraApplication.class);
    application.setAdditionalProfiles("flyway");
    application.run(args);
}
```

## Alternativas

Otras soluciones posibles incluyen:

1. **Usar solo Flyway o solo JPA para gestionar el esquema**:
   - Configurar `spring.jpa.hibernate.ddl-auto=none` para que JPA no intente crear el esquema
   - Usar solo las migraciones de Flyway para gestionar el esquema

2. **Usar Spring Boot 3.2+ con la nueva configuración**:
   - Spring Boot 3.2 introdujo mejoras para manejar esta situación
   - Configurar `spring.jpa.defer-datasource-initialization=false`

## Referencias

- [Documentación de Flyway](https://flywaydb.org/documentation/)
- [Documentación de Spring Boot sobre Flyway](https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto.data-initialization.migration-tool.flyway)
- [Issue de Spring Boot sobre dependencia circular](https://github.com/spring-projects/spring-boot/issues/6135)

# Buenas Prácticas para Repositorios JPA

Este documento describe las mejores prácticas para la configuración y uso de repositorios JPA en el proyecto Bitácora.

## Estructura de Paquetes

La estructura de paquetes para los repositorios sigue el patrón de arquitectura hexagonal:

```
com.bitacora
├── domain
│   └── port
│       └── repository       # Interfaces de repositorio (puertos)
└── infrastructure
    └── persistence
        ├── adapter          # Adaptadores que implementan los puertos
        ├── entity           # Entidades JPA
        ├── jpa              # Interfaces JPA específicas
        ├── mapper           # Mappers entre entidades y modelos
        └── repository       # Implementaciones de repositorios e interfaces JPA
```

## Configuración de Repositorios

### Configuración Unificada

Utilizamos una configuración unificada para escanear todos los paquetes de persistencia:

```java
@EnableJpaRepositories(basePackages = "com.bitacora.infrastructure.persistence")
```

Ventajas:
- Configuración simple y fácil de mantener
- No es necesario actualizar la configuración al agregar nuevos repositorios
- Menos propenso a errores de configuración

### Convenciones de Nombres

Para evitar confusiones y dependencias circulares, seguimos estas convenciones de nombres:

1. **Interfaces de dominio (puertos)**:
   - Ubicación: `com.bitacora.domain.port.repository`
   - Nomenclatura: `[Entidad]Repository`
   - Ejemplo: `UserRepository`

2. **Interfaces JPA**:
   - Ubicación: `com.bitacora.infrastructure.persistence.repository` o `com.bitacora.infrastructure.persistence.jpa`
   - Nomenclatura: `[Entidad]JpaRepository`
   - Ejemplo: `UserJpaRepository`

3. **Implementaciones de repositorios**:
   - Ubicación: `com.bitacora.infrastructure.persistence.repository`
   - Nomenclatura: `[Entidad]RepositoryImpl` o `Custom[Entidad]Repository`
   - Ejemplo: `UserRepositoryImpl` o `CustomUserRepository`

4. **Adaptadores**:
   - Ubicación: `com.bitacora.infrastructure.persistence.adapter`
   - Nomenclatura: `[Entidad]RepositoryAdapter`
   - Ejemplo: `UserRepositoryAdapter`

> **IMPORTANTE**: Evitar el sufijo `Impl` para clases que implementan interfaces de dominio pero dependen de interfaces de Spring Data JPA con nombres similares, ya que esto puede causar confusión y dependencias circulares.

## Prevención de Dependencias Circulares

### Problemas Comunes

Las dependencias circulares en repositorios JPA suelen ocurrir por:

1. **Nombres ambiguos**: Cuando Spring no puede distinguir entre diferentes implementaciones
2. **Inyección bidireccional**: Cuando dos clases dependen mutuamente
3. **Configuración fragmentada**: Cuando los repositorios están en diferentes paquetes con configuraciones separadas

### Soluciones

1. **Usar nombres claros y distintos**:
   ```java
   // EVITAR
   public class UserRepositoryImpl implements UserRepository {
       private final UserRepository jpaRepository; // ¡Ambigüedad!
   }
   
   // PREFERIR
   public class UserRepositoryImpl implements UserRepository {
       private final UserJpaRepository jpaRepository; // Claro y distinto
   }
   ```

2. **Evitar sufijos conflictivos**:
   ```java
   // EVITAR
   public class JpaUserRepositoryImpl implements UserRepository {
       private final JpaUserRepository jpaRepository;
   }
   
   // PREFERIR
   public class CustomUserRepository implements UserRepository {
       private final JpaUserRepository jpaRepository;
   }
   ```

3. **Usar anotaciones para resolver ambigüedades**:
   ```java
   @Repository
   @Primary
   public class CustomUserRepository implements UserRepository {
       // Esta implementación será la principal
   }
   ```

4. **Inyección por setter en lugar de constructor** (cuando sea necesario):
   ```java
   @Repository
   public class CustomUserRepository implements UserRepository {
       private UserJpaRepository jpaRepository;
       
       @Autowired
       public void setJpaRepository(UserJpaRepository jpaRepository) {
           this.jpaRepository = jpaRepository;
       }
   }
   ```

## Ejemplos de Implementación

### Ejemplo 1: Repositorio de Usuario

```java
// Interfaz de dominio (puerto)
public interface UserRepository {
    User save(User user);
    Optional<User> findById(Long id);
    // ...
}

// Interfaz JPA
@Repository
public interface UserJpaRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByUsername(String username);
    // ...
}

// Implementación
@Repository
public class UserRepositoryImpl implements UserRepository {
    private final UserJpaRepository userJpaRepository;
    private final UserMapper userMapper;
    
    public UserRepositoryImpl(UserJpaRepository userJpaRepository, UserMapper userMapper) {
        this.userJpaRepository = userJpaRepository;
        this.userMapper = userMapper;
    }
    
    @Override
    public User save(User user) {
        UserEntity entity = userMapper.toEntity(user);
        UserEntity savedEntity = userJpaRepository.save(entity);
        return userMapper.toDomain(savedEntity);
    }
    
    // ...
}
```

## Referencias

- [Spring Data JPA - Reference Documentation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [Spring Framework - Dependency Injection](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-dependencies)

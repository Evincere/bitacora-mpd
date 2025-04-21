# 2. Adopción de Arquitectura Hexagonal

Fecha: 2023-01-20

## Estado

Aceptado

## Contexto

Necesitamos definir una arquitectura para el backend que:

1. Permita separar claramente la lógica de negocio de los detalles técnicos
2. Facilite las pruebas automatizadas
3. Permita la evolución independiente de diferentes partes del sistema
4. Soporte el desarrollo basado en dominio (DDD)
5. Sea mantenible a largo plazo

Estamos considerando diferentes opciones arquitectónicas, incluyendo:
- Arquitectura en capas tradicional (3-tier)
- Arquitectura Hexagonal (Puertos y Adaptadores)
- Clean Architecture
- Arquitectura basada en microservicios

## Decisión

Adoptaremos la Arquitectura Hexagonal (también conocida como Puertos y Adaptadores) para el backend.

La estructura de paquetes será:

```
com.bitacora
├── application       # Casos de uso
├── domain           # Entidades y reglas de negocio
│   ├── model        # Modelos de dominio
│   ├── event        # Eventos de dominio
│   └── port         # Puertos (interfaces)
└── infrastructure   # Adaptadores
    ├── persistence  # Implementaciones de repositorios
    ├── rest         # Controladores REST
    └── config       # Configuraciones
```

Principios clave:
1. La capa de dominio no tiene dependencias externas
2. La comunicación con el exterior se realiza a través de puertos (interfaces)
3. Los adaptadores implementan los puertos para conectar con tecnologías específicas
4. La lógica de negocio está centralizada en la capa de dominio
5. Las dependencias apuntan hacia el dominio (Regla de Dependencia)

## Consecuencias

### Positivas

- **Independencia de frameworks**: La lógica de negocio no depende de frameworks o bibliotecas externas
- **Testabilidad**: Facilita las pruebas unitarias mediante mocks de los puertos
- **Flexibilidad**: Permite cambiar implementaciones técnicas sin afectar la lógica de negocio
- **Claridad**: Separación clara de responsabilidades
- **Evolución**: Facilita la evolución independiente de diferentes partes del sistema

### Negativas

- **Complejidad inicial**: Mayor curva de aprendizaje para desarrolladores no familiarizados con el patrón
- **Más código**: Requiere más interfaces y clases que una arquitectura más simple
- **Sobrecarga de mapeo**: Necesidad de mapear entre modelos de dominio y modelos de infraestructura

## Referencias

- [Arquitectura Hexagonal por Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [DDD y Arquitectura Hexagonal](https://vaadin.com/blog/ddd-part-1-strategic-domain-driven-design)
- [Implementación de Arquitectura Hexagonal en Spring Boot](https://reflectoring.io/spring-hexagonal/)

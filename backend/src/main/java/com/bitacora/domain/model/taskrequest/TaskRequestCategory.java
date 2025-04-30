package com.bitacora.domain.model.taskrequest;

/**
 * Clase que representa una categoría para las solicitudes de tareas.
 * Las categorías permiten clasificar las solicitudes según su naturaleza o departamento.
 */
public class TaskRequestCategory {
    private Long id;
    private String name;
    private String description;
    private String color;
    private boolean isDefault;

    /**
     * Constructor privado para el patrón Builder.
     */
    private TaskRequestCategory() {
    }

    /**
     * Crea una nueva instancia de TaskRequestCategory utilizando el patrón Builder.
     *
     * @return Un nuevo builder para TaskRequestCategory
     */
    public static Builder builder() {
        return new Builder();
    }

    /**
     * Obtiene el identificador único de la categoría.
     *
     * @return El identificador único
     */
    public Long getId() {
        return id;
    }

    /**
     * Obtiene el nombre de la categoría.
     *
     * @return El nombre
     */
    public String getName() {
        return name;
    }

    /**
     * Obtiene la descripción de la categoría.
     *
     * @return La descripción
     */
    public String getDescription() {
        return description;
    }

    /**
     * Obtiene el color asociado a la categoría (en formato hexadecimal).
     *
     * @return El color
     */
    public String getColor() {
        return color;
    }

    /**
     * Indica si esta es la categoría por defecto.
     *
     * @return true si es la categoría por defecto, false en caso contrario
     */
    public boolean isDefault() {
        return isDefault;
    }

    @Override
    public boolean equals(final Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        final TaskRequestCategory that = (TaskRequestCategory) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "TaskRequestCategory{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", color='" + color + '\'' +
                ", isDefault=" + isDefault +
                '}';
    }

    /**
     * Builder para crear instancias de TaskRequestCategory.
     */
    public static class Builder {
        private final TaskRequestCategory instance = new TaskRequestCategory();

        private Builder() {
        }

        public Builder id(final Long id) {
            instance.id = id;
            return this;
        }

        public Builder name(final String name) {
            instance.name = name;
            return this;
        }

        public Builder description(final String description) {
            instance.description = description;
            return this;
        }

        public Builder color(final String color) {
            instance.color = color;
            return this;
        }

        public Builder isDefault(final boolean isDefault) {
            instance.isDefault = isDefault;
            return this;
        }

        public TaskRequestCategory build() {
            // Validaciones básicas
            if (instance.name == null || instance.name.trim().isEmpty()) {
                throw new IllegalArgumentException("El nombre no puede estar vacío");
            }
            
            if (instance.color == null) {
                // Color por defecto si no se especifica
                instance.color = "#808080"; // Gris
            }
            
            return instance;
        }
    }
}

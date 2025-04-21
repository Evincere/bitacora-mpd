# Componentes de Virtualización

Este directorio contiene componentes optimizados para renderizar grandes cantidades de datos de manera eficiente mediante técnicas de virtualización.

## Índice

1. [VirtualList](#virtuallist)
2. [VirtualGrid](#virtualgrid)
3. [InfiniteVirtualList](#infinitevirtuallist)
4. [Mejores Prácticas](#mejores-prácticas)

## VirtualList

Componente para renderizar listas grandes de manera eficiente. Solo renderiza los elementos visibles en la ventana de visualización, lo que mejora significativamente el rendimiento.

### Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| items | Array | Lista de elementos a renderizar |
| height | number \| string | Altura del contenedor |
| width | number \| string | Ancho del contenedor (opcional, default: '100%') |
| estimateSize | number | Tamaño estimado de cada elemento (opcional, default: 50) |
| dynamicSize | boolean | Si se debe medir dinámicamente el tamaño de los elementos (opcional, default: false) |
| renderItem | Function | Función para renderizar cada elemento |
| overscan | number | Número de elementos adicionales a renderizar fuera de la vista (opcional, default: 10) |
| className | string | Clase CSS adicional (opcional) |
| onItemsRendered | Function | Callback cuando se renderizan elementos (opcional) |
| scrollToIndex | number | Índice al que desplazarse (opcional) |
| scrollToAlignment | 'start' \| 'center' \| 'end' \| 'auto' | Alineación al desplazarse a un elemento (opcional, default: 'auto') |
| onScroll | Function | Callback cuando se produce un evento de desplazamiento (opcional) |
| itemKey | Function | Función para generar claves únicas para los elementos (opcional) |

### Ejemplo de uso

```jsx
<VirtualList
  items={activities}
  height={500}
  estimateSize={80}
  dynamicSize={true}
  renderItem={(activity, index) => (
    <ActivityRow key={activity.id} activity={activity} />
  )}
  overscan={10}
  itemKey={(index) => activities[index]?.id || index}
/>
```

## VirtualGrid

Componente para renderizar cuadrículas grandes de manera eficiente. Organiza los elementos en filas y columnas, y solo renderiza las filas visibles.

### Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| items | Array | Lista de elementos a renderizar |
| height | number \| string | Altura del contenedor |
| width | number \| string | Ancho del contenedor (opcional, default: '100%') |
| columnWidth | number | Ancho de cada columna |
| rowHeight | number | Altura de cada fila (opcional) |
| dynamicHeight | boolean | Si se debe medir dinámicamente la altura de las filas (opcional, default: false) |
| gap | number | Espacio entre elementos (opcional, default: 20) |
| renderItem | Function | Función para renderizar cada elemento |
| overscan | number | Número de filas adicionales a renderizar fuera de la vista (opcional, default: 10) |
| className | string | Clase CSS adicional (opcional) |
| onItemsRendered | Function | Callback cuando se renderizan elementos (opcional) |
| scrollToIndex | number | Índice al que desplazarse (opcional) |
| scrollToAlignment | 'start' \| 'center' \| 'end' \| 'auto' | Alineación al desplazarse a un elemento (opcional, default: 'auto') |
| onScroll | Function | Callback cuando se produce un evento de desplazamiento (opcional) |
| itemKey | Function | Función para generar claves únicas para las filas (opcional) |

### Ejemplo de uso

```jsx
<VirtualGrid
  items={activities}
  height={600}
  columnWidth={300}
  rowHeight={350}
  dynamicHeight={true}
  gap={20}
  renderItem={(activity) => (
    <ActivityCard key={activity.id} activity={activity} />
  )}
  overscan={10}
  itemKey={(index) => activities[index]?.id || index}
/>
```

## InfiniteVirtualList

Componente que extiende VirtualList para implementar carga infinita (infinite scroll). Detecta cuando el usuario se acerca al final de la lista y carga más elementos automáticamente.

### Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| items | Array | Lista de elementos a renderizar |
| height | number \| string | Altura del contenedor |
| width | number \| string | Ancho del contenedor (opcional, default: '100%') |
| estimateSize | number | Tamaño estimado de cada elemento (opcional, default: 50) |
| dynamicSize | boolean | Si se debe medir dinámicamente el tamaño de los elementos (opcional, default: false) |
| renderItem | Function | Función para renderizar cada elemento |
| overscan | number | Número de elementos adicionales a renderizar fuera de la vista (opcional, default: 10) |
| className | string | Clase CSS adicional (opcional) |
| hasNextPage | boolean | Si hay más páginas para cargar |
| isNextPageLoading | boolean | Si se está cargando la siguiente página |
| loadNextPage | Function | Función para cargar la siguiente página |
| loadingIndicator | ReactNode | Componente para mostrar durante la carga (opcional) |
| threshold | number | Número de elementos antes del final para comenzar a cargar más (opcional, default: 5) |
| scrollToIndex | number | Índice al que desplazarse (opcional) |
| scrollToAlignment | 'start' \| 'center' \| 'end' \| 'auto' | Alineación al desplazarse a un elemento (opcional, default: 'auto') |
| onScroll | Function | Callback cuando se produce un evento de desplazamiento (opcional) |
| itemKey | Function | Función para generar claves únicas para los elementos (opcional) |

### Ejemplo de uso

```jsx
<InfiniteVirtualList
  items={activities}
  height={500}
  estimateSize={80}
  dynamicSize={true}
  renderItem={(activity) => (
    <ActivityRow key={activity.id} activity={activity} />
  )}
  hasNextPage={hasNextPage}
  isNextPageLoading={isLoading}
  loadNextPage={fetchNextPage}
  overscan={10}
  threshold={10}
/>
```

## Mejores Prácticas

### Cuándo usar virtualización

- Listas con más de 50-100 elementos
- Grids con muchos elementos
- Cuando el rendimiento de desplazamiento es lento
- Para mejorar el tiempo de carga inicial de listas grandes

### Optimización de parámetros

#### overscan

El parámetro `overscan` determina cuántos elementos adicionales se renderizan fuera del área visible:

- **Valor bajo (1-3)**: Menor uso de memoria, pero puede causar parpadeo en desplazamiento rápido
- **Valor medio (5-10)**: Buen equilibrio para la mayoría de casos
- **Valor alto (15+)**: Desplazamiento más suave, pero mayor uso de memoria

Recomendación: Usar 10 como valor predeterminado y ajustar según las pruebas de rendimiento.

#### dynamicSize

- Activar cuando los elementos tienen altura variable
- Desactivar cuando todos los elementos tienen la misma altura para mejor rendimiento

#### estimateSize

- Debe ser lo más cercano posible al tamaño real promedio de los elementos
- Un valor preciso mejora el rendimiento inicial y reduce los saltos durante el desplazamiento

### Patrones comunes

#### Carga infinita

Combinar virtualización con carga paginada para implementar scroll infinito:

```jsx
<InfiniteVirtualList
  items={items}
  height={500}
  hasNextPage={hasNextPage}
  isNextPageLoading={isLoading}
  loadNextPage={fetchNextPage}
/>
```

#### Desplazamiento a un elemento específico

```jsx
const scrollToItem = (itemId) => {
  const index = items.findIndex(item => item.id === itemId);
  if (index !== -1) {
    setScrollToIndex(index);
  }
};
```

### Solución de problemas comunes

#### Saltos durante el desplazamiento

- Asegurarse de que `estimateSize` sea preciso
- Activar `dynamicSize` para elementos de altura variable
- Aumentar el valor de `overscan`

#### Alto uso de memoria

- Reducir el valor de `overscan`
- Asegurarse de que los elementos renderizados no tengan fugas de memoria
- Considerar la implementación de "windowing" más agresiva para listas extremadamente grandes

#### Problemas de rendimiento

- Simplificar los componentes de elementos individuales
- Usar React.memo para evitar renderizados innecesarios
- Evitar cálculos costosos dentro de los elementos renderizados

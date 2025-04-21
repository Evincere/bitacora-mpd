import { render, screen } from '@testing-library/react';
import VirtualList from '../VirtualList';

// Generar datos de prueba
const generateItems = (count) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    name: `Item ${i}`,
    description: `Description for item ${i}`
  }));
};

// Renderizar un elemento
const renderItem = (item) => (
  <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
    <h3>{item.name}</h3>
    <p>{item.description}</p>
  </div>
);

describe('VirtualList Performance', () => {
  test('renders 1000 items efficiently', () => {
    const items = generateItems(1000);
    
    // Medir tiempo de renderizado
    const startTime = performance.now();
    
    render(
      <VirtualList
        items={items}
        height={500}
        estimateSize={50}
        renderItem={renderItem}
        overscan={10}
      />
    );
    
    const endTime = performance.now();
    
    // Verificar que el contenedor existe
    expect(screen.getByTestId('virtual-list-container')).toBeInTheDocument();
    
    // Verificar que el tiempo de renderizado es aceptable (menos de 100ms)
    expect(endTime - startTime).toBeLessThan(100);
  });
  
  test('renders with dynamic sizing', () => {
    const items = generateItems(100);
    
    render(
      <VirtualList
        items={items}
        height={500}
        estimateSize={50}
        dynamicSize={true}
        renderItem={renderItem}
        overscan={10}
      />
    );
    
    // Verificar que el contenedor existe
    expect(screen.getByTestId('virtual-list-container')).toBeInTheDocument();
    
    // Verificar que los elementos tienen altura automática
    const listItems = document.querySelectorAll('[data-index]');
    expect(listItems.length).toBeGreaterThan(0);
    
    // Al menos un elemento debe tener altura 'auto'
    const hasAutoHeight = Array.from(listItems).some(
      item => item.style.height === 'auto'
    );
    expect(hasAutoHeight).toBe(true);
  });
  
  test('renders with custom item key function', () => {
    const items = generateItems(100);
    const itemKey = jest.fn(index => `custom-key-${index}`);
    
    render(
      <VirtualList
        items={items}
        height={500}
        estimateSize={50}
        renderItem={renderItem}
        overscan={10}
        itemKey={itemKey}
      />
    );
    
    // Verificar que la función itemKey fue llamada
    expect(itemKey).toHaveBeenCalled();
  });
  
  test('handles empty items array', () => {
    render(
      <VirtualList
        items={[]}
        height={500}
        estimateSize={50}
        renderItem={renderItem}
        overscan={10}
      />
    );
    
    // Verificar que el contenedor existe
    expect(screen.getByTestId('virtual-list-container')).toBeInTheDocument();
    
    // No debería haber elementos renderizados
    const listItems = document.querySelectorAll('[data-index]');
    expect(listItems.length).toBe(0);
  });
  
  test('renders with different overscan values', () => {
    const items = generateItems(1000);
    
    // Probar con overscan bajo
    const { unmount: unmountLow } = render(
      <VirtualList
        items={items}
        height={500}
        estimateSize={50}
        renderItem={renderItem}
        overscan={1}
      />
    );
    
    const lowOverscanItems = document.querySelectorAll('[data-index]');
    const lowCount = lowOverscanItems.length;
    unmountLow();
    
    // Probar con overscan alto
    render(
      <VirtualList
        items={items}
        height={500}
        estimateSize={50}
        renderItem={renderItem}
        overscan={20}
      />
    );
    
    const highOverscanItems = document.querySelectorAll('[data-index]');
    const highCount = highOverscanItems.length;
    
    // Verificar que con overscan más alto se renderizan más elementos
    expect(highCount).toBeGreaterThan(lowCount);
  });
});

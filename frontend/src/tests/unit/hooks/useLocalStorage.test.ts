import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/core/hooks/useLocalStorage';

describe('useLocalStorage hook', () => {
  // Limpiar localStorage antes de cada prueba
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  // Mock para localStorage
  const localStorageMock = {
    getItem: jest.spyOn(Storage.prototype, 'getItem'),
    setItem: jest.spyOn(Storage.prototype, 'setItem'),
    removeItem: jest.spyOn(Storage.prototype, 'removeItem'),
  };

  test('should use the initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial value'));
    
    expect(result.current[0]).toBe('initial value');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
  });

  test('should use the value from localStorage if it exists', () => {
    // Configurar un valor en localStorage
    localStorage.setItem('test-key', JSON.stringify('stored value'));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial value'));
    
    expect(result.current[0]).toBe('stored value');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
  });

  test('should update localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial value'));
    
    // Actualizar el valor
    act(() => {
      result.current[1]('new value');
    });
    
    // Verificar que el estado y localStorage se actualizaron
    expect(result.current[0]).toBe('new value');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new value'));
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new value'));
  });

  test('should handle function updates correctly', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial value'));
    
    // Actualizar el valor usando una función
    act(() => {
      result.current[1]((prev) => `${prev} updated`);
    });
    
    // Verificar que el estado y localStorage se actualizaron correctamente
    expect(result.current[0]).toBe('initial value updated');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('initial value updated'));
  });

  test('should handle complex objects', () => {
    const initialObject = { name: 'John', age: 30 };
    const { result } = renderHook(() => useLocalStorage('test-object', initialObject));
    
    // Verificar valor inicial
    expect(result.current[0]).toEqual(initialObject);
    
    // Actualizar el objeto
    const updatedObject = { name: 'Jane', age: 25 };
    act(() => {
      result.current[1](updatedObject);
    });
    
    // Verificar que el estado y localStorage se actualizaron
    expect(result.current[0]).toEqual(updatedObject);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-object', JSON.stringify(updatedObject));
  });

  test('should handle localStorage errors gracefully', () => {
    // Simular un error al leer de localStorage
    localStorageMock.getItem.mockImplementationOnce(() => {
      throw new Error('localStorage error');
    });
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback value'));
    
    // Debería usar el valor inicial en caso de error
    expect(result.current[0]).toBe('fallback value');
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  test('should handle localStorage setItem errors gracefully', () => {
    // Simular un error al escribir en localStorage
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error('localStorage error');
    });
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial value'));
    
    // Intentar actualizar el valor
    act(() => {
      result.current[1]('new value');
    });
    
    // El estado debería actualizarse aunque localStorage falle
    expect(result.current[0]).toBe('new value');
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});

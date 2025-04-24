import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/core/hooks/useDebounce';

// Mock para setTimeout y clearTimeout
jest.useFakeTimers();

describe('useDebounce hook', () => {
  test('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial value', 500));
    expect(result.current).toBe('initial value');
  });

  test('should update the value after the specified delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial value', delay: 500 } }
    );

    // Verificar valor inicial
    expect(result.current).toBe('initial value');

    // Cambiar el valor
    rerender({ value: 'updated value', delay: 500 });

    // El valor no debe cambiar inmediatamente
    expect(result.current).toBe('initial value');

    // Avanzar el tiempo menos del delay
    act(() => {
      jest.advanceTimersByTime(400);
    });

    // El valor aún no debe cambiar
    expect(result.current).toBe('initial value');

    // Avanzar el tiempo hasta completar el delay
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Ahora el valor debe actualizarse
    expect(result.current).toBe('updated value');
  });

  test('should use the new delay when it changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial value', delay: 500 } }
    );

    // Cambiar el valor y el delay
    rerender({ value: 'updated value', delay: 1000 });

    // Avanzar el tiempo menos del nuevo delay
    act(() => {
      jest.advanceTimersByTime(800);
    });

    // El valor aún no debe cambiar
    expect(result.current).toBe('initial value');

    // Avanzar el tiempo hasta completar el nuevo delay
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Ahora el valor debe actualizarse
    expect(result.current).toBe('updated value');
  });

  test('should clear timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    
    const { unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'test value', delay: 500 } }
    );

    // Desmontar el hook
    unmount();

    // Verificar que clearTimeout fue llamado
    expect(clearTimeoutSpy).toHaveBeenCalled();
    
    clearTimeoutSpy.mockRestore();
  });
});

import { useEffect, useState } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return typeof window !== 'undefined'
        ? window.localStorage.getItem(key)
        : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Отложенное сохранение с debounce 300 мс
  useEffect(() => {
    const handler = setTimeout(() => {
      window.localStorage.setItem(
        key,
        typeof storedValue === 'string' ? storedValue : JSON.stringify(storedValue)
      );
    }, 300);

    return () => clearTimeout(handler); // Очищаем таймер при каждом изменении storedValue
  }, [storedValue, key]);

  return [storedValue, setStoredValue];
};

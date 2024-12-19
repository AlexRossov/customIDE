import { useEffect, useState } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = window.localStorage.getItem(key);
      // Если ключ отсутствует, используем initialValue
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Отложенное сохранение с debounce 300 мс
  useEffect(() => {
    const handler = setTimeout(() => {
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(storedValue));
        }
      } catch (error) {
        console.error('Ошибка при сохранении в localStorage:', error);
      }
    }, 300);


    return () => clearTimeout(handler); // Очищаем таймер при каждом изменении storedValue
  }, [storedValue, key]);

  return [storedValue, setStoredValue];
};

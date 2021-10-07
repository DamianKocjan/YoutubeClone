import { useState } from 'react';

interface Returns<T> {
  data: T | null;
  set: (value: T, toJSON: boolean) => void;
  remove: () => void;
}

export function useLocalStorage<T>(key: string): Returns<T> {
  const [localStorageData, setLocalStorageData] = useState(
    (window.localStorage.getItem(key) as unknown as T) || null
  );

  const remove = (): void => {
    localStorage.removeItem(key);
  };

  const set = (value: T, toJSON = false): void => {
    const parsed = toJSON ? JSON.stringify(value) : String(value);

    setLocalStorageData(value);
    localStorage.setItem(key, parsed);
  };

  return { data: localStorageData, set, remove };
}

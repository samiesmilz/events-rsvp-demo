"use client";

import { useState, useEffect } from "react";

/**
 * Using this localStorage hook to sync state with localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  // On mount - Load from localStorage
  useEffect(() => {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        setValue(JSON.parse(item));
      } catch {
        // If parsing fails, we'll keep initial value
      }
    }
  }, [key]);

  // Update localStorage when value changes
  const setStoredValue = (newValue: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const nextValue =
        typeof newValue === "function"
          ? (newValue as (prevValue: T) => T)(prev)
          : newValue;

      localStorage.setItem(key, JSON.stringify(nextValue));
      return nextValue;
    });
  };

  return [value, setStoredValue] as const;
}

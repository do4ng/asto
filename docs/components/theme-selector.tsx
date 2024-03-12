'use client';

/* eslint-disable import/no-cycle */
import { toggleTheme } from '@/app/layout';
import { useEffect, useState } from 'react';

export function ThemeSelector() {
  const [defaultValue, setDefaultValue] = useState('dark');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log(localStorage.getItem('theme') as any);
      setDefaultValue((localStorage.getItem('theme') as any) || 'dark');
    }
  }, []);

  console.log(defaultValue);

  return (
    <select
      onChange={(e) => {
        localStorage.setItem('theme', e.target.value);
        setDefaultValue(e.target.value);
        toggleTheme(e.target.value as any);
      }}
      value={defaultValue}
    >
      <option key="dark" value="dark">
        Dark
      </option>
      <option key="white" value="white">
        White
      </option>
    </select>
  );
}

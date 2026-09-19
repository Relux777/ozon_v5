// src/components/ThemeSwitch/index.tsx
'use client';

import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import Sun from '@/assets/svg/ThemeSwitch/sun.svg';
import Moon from '@/assets/svg/ThemeSwitch/moon.svg';

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations('A11y');

  // После монтирования клиент знает реальную тему
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Заглушка, чтобы избежать сдвига layout
  if (!mounted) {
    return <div className="w-5 h-5" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      className='active_scale_09'
      onClick={toggleTheme}
      aria-label={t('themeToggle')}
    >
      {isDark ? (
        <Sun width={22} height={22} viewBox="0 0 24 24" aria-hidden="true" />
      ) : (
        <Moon width={22} height={22} viewBox="0 0 24 24" aria-hidden="true" />
      )}
    </button>
  );
}

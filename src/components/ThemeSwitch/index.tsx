// src/components/ThemeSwitch/index.tsx
'use client';

import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';

import Sun from '@/assets/svg/ThemeSwitch/sun.svg';
import Moon from '@/assets/svg/ThemeSwitch/moon.svg';

// Обе иконки есть в разметке, видимую выбирает CSS по data-theme (.theme-icon-* в style.scss):
// кнопка рендерится на сервере сразу — без пустой заглушки до гидратации и без сдвига шапки.
// Тема на клиенте известна к моменту клика, поэтому переключение работает как раньше.
export default function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations('A11y');

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      className='active_scale_09'
      onClick={toggleTheme}
      aria-label={t('themeToggle')}
    >
      <Sun className='theme-icon-sun' width={22} height={22} viewBox="0 0 24 24" aria-hidden="true" />
      <Moon className='theme-icon-moon' width={22} height={22} viewBox="0 0 24 24" aria-hidden="true" />
    </button>
  );
}

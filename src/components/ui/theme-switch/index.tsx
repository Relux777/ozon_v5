// src/components/ui/theme-switch/index.tsx — инструкция: theme-switch.md рядом
'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';

import Sun from '@/assets/svg/ThemeSwitch/sun.svg';
import Moon from '@/assets/svg/ThemeSwitch/moon.svg';

const ICON_IN_MS = 500;
const ICON_OUT_MS = 250;
// лёгкий «перелёт» в конце — иконка встаёт на место с пружинкой
const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

// Обе иконки есть в разметке и лежат друг на друге, видимую выбирает CSS по data-theme (_theme-switch.scss):
// кнопка рендерится на сервере сразу — без пустой заглушки до гидратации и без сдвига шапки.
// Тема меняется сразу, без перехода страницы; анимируется только иконка (Web Animations API — на неё не действует
// disableTransitionOnChange провайдера next-themes, который на момент смены темы отключает CSS-переходы).
type Props = {
  /**
   * Цвет панели браузера (<meta name="theme-color">) для каждой темы сайта. Метатеги с media по системной теме
   * (viewport.themeColor в layout) не знают о теме, выбранной кнопкой, — без этого панель оставалась светлой
   * на тёмном сайте и наоборот. Не задан — метатеги не трогаются.
   */
  themeColors?: { light: string; dark: string };
};

export default function ThemeSwitch({ themeColors }: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations('A11y');
  const sunRef = useRef<HTMLSpanElement>(null);
  const moonRef = useRef<HTMLSpanElement>(null);

  const lightColor = themeColors?.light;
  const darkColor = themeColors?.dark;

  // панель браузера — в цвет выбранной темы сайта (все метатеги theme-color, какой бы media у них ни был)
  useEffect(() => {
    if (!lightColor || !darkColor || (resolvedTheme !== 'light' && resolvedTheme !== 'dark')) return;
    const color = resolvedTheme === 'dark' ? darkColor : lightColor;
    for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) meta.content = color;
  }, [resolvedTheme, lightColor, darkColor]);

  /** уходящая иконка проворачивается и гаснет, новая — выкручивается навстречу и встаёт с пружинкой */
  const animateIcons = (next: 'light' | 'dark') => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const [incoming, outgoing] = next === 'dark' ? [sunRef.current, moonRef.current] : [moonRef.current, sunRef.current];

    outgoing?.animate(
      [
        { opacity: 1, rotate: '0deg', scale: 1 },
        { opacity: 0, rotate: '90deg', scale: 0.4 },
      ],
      { duration: ICON_OUT_MS, easing: 'ease-in' },
    );
    incoming?.animate(
      [
        { opacity: 0, rotate: '-90deg', scale: 0.4 },
        { opacity: 1, rotate: '0deg', scale: 1 },
      ],
      { duration: ICON_IN_MS, easing: SPRING },
    );
  };

  const toggleTheme = () => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    animateIcons(next);
  };

  return (
    <button
      type="button"
      className='theme-switch grid place-center active_scale_09'
      onClick={toggleTheme}
      aria-label={t('themeToggle')}
    >
      <span ref={sunRef} className='theme-icon theme-icon-sun grid' aria-hidden="true">
        <Sun width={22} height={22} viewBox="0 0 24 24" />
      </span>
      <span ref={moonRef} className='theme-icon theme-icon-moon grid' aria-hidden="true">
        <Moon width={22} height={22} viewBox="0 0 24 24" />
      </span>
    </button>
  );
}

// src/components/ui/theme-switch/index.tsx — инструкция: theme-switch.md рядом
'use client';

import { useRef } from 'react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';

import Sun from '@/assets/svg/ThemeSwitch/sun.svg';
import Moon from '@/assets/svg/ThemeSwitch/moon.svg';

type Props = {
  /** новая тема «раскрывается» кругом от кнопки (View Transitions API); false — анимируется только иконка */
  reveal?: boolean;
};

const REVEAL_MS = 450;
const ICON_IN_MS = 500;
const ICON_OUT_MS = 250;
// лёгкий «перелёт» в конце — иконка встаёт на место с пружинкой
const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

// Обе иконки есть в разметке и лежат друг на друге, видимую выбирает CSS по data-theme (_theme-switch.scss):
// кнопка рендерится на сервере сразу — без пустой заглушки до гидратации и без сдвига шапки.
// Анимации — Web Animations API, а не CSS transition: провайдер next-themes с disableTransitionOnChange
// на момент смены темы отключает все переходы на странице, а на WAAPI это не действует.
export default function ThemeSwitch({ reveal = true }: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations('A11y');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sunRef = useRef<HTMLSpanElement>(null);
  const moonRef = useRef<HTMLSpanElement>(null);

  /** уходящая иконка проворачивается и гаснет, новая — выкручивается навстречу и встаёт с пружинкой */
  const animateIcons = (next: 'light' | 'dark') => {
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
    const root = document.documentElement;
    // текущая тема — та, что сейчас на экране (атрибут на <html>), на случай быстрых повторных нажатий
    const current = root.getAttribute('data-theme') ?? resolvedTheme;
    const next = current === 'dark' ? 'light' : 'dark';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // next-themes ставит атрибут в эффекте — позже, чем View Transition снимает «новое» состояние страницы,
    // поэтому тему применяем сами сразу, а setTheme — чтобы выбор сохранился и обновилось состояние провайдера
    const apply = () => {
      root.setAttribute('data-theme', next);
      root.style.colorScheme = next;
      setTheme(next);
      if (!reducedMotion) animateIcons(next);
    };

    const button = buttonRef.current;
    if (!reveal || reducedMotion || !button || !('startViewTransition' in document)) {
      apply();
      return;
    }

    // круг раскрывается из центра кнопки до самого дальнего угла экрана
    const { left, top, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    // класс включает правила ::view-transition-* только для смены темы (_theme-switch.scss)
    root.classList.add('theme-reveal');
    const transition = document.startViewTransition(apply);

    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: REVEAL_MS, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
        );
      })
      // переход пропущен (например, второе нажатие во время первого) — тема всё равно применена
      .catch(() => {});
    transition.finished.finally(() => root.classList.remove('theme-reveal'));
  };

  return (
    <button
      ref={buttonRef}
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

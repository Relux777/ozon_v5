# ThemeSwitch

Клиентская кнопка смены темы (светлая ↔ тёмная) на `next-themes`. В разметке сразу **обе** иконки (солнце и луна),
какую показать — решает CSS по атрибуту `data-theme` на `<html>`. Поэтому кнопка есть уже в серверном HTML,
без пустой заглушки до гидратации и без сдвига шапки.

**Смена темы:** страница переключается сразу, без перехода. Анимируется только иконка: уходящая проворачивается
и гаснет, новая выкручивается навстречу и встаёт на место с пружинкой (Web Animations API — на неё не действует
`disableTransitionOnChange` провайдера, который на время смены темы отключает CSS-переходы).
При «уменьшении движения» в системе иконка меняется без анимации.

## Файлы

| Файл | Что внутри |
|---|---|
| `index.tsx` | компонент и анимация иконок |
| `_theme-switch.scss` | конечные положения иконок по `[data-theme='dark']` |

## Что нужно в проекте

- Пакет `next-themes` и провайдер с `attribute="data-theme"` вокруг приложения (в Ozon V5 — `src/providers/ThemeProvider.tsx`),
  а на `<html>` — `suppressHydrationWarning`.
- Переменные темы в `[data-theme='dark']` (в ReluxCode — `_variables.scss`).
- Иконки `@/assets/svg/ThemeSwitch/sun.svg` и `moon.svg` (SVGR).
- `@use "../../components/ui/theme-switch/theme-switch";` в начале `style.scss`.
- Перевод `A11y.themeToggle` и раздел `A11y` в `clientMessages`.
- ReluxCode: `grid`, `place-center`, `active_scale_09`.

## Пример

```tsx
import ThemeSwitch from '@/components/ui/theme-switch';

<header>… <ThemeSwitch /> …</header>
```

## Что менять под проект

- Иконки и размер (`width/height={22}`) — в `index.tsx`.
- Скорость и характер анимации иконок — `ICON_IN_MS`, `ICON_OUT_MS`, `SPRING` в `index.tsx`.
- Другой атрибут темы (например, класс `.dark`) — поменять селектор в `_theme-switch.scss` и `attribute` у провайдера.
- Нужен третий режим «как в системе» — `setTheme('system')`; сейчас кнопка переключает только две темы.

## Подводные камни

- Проверять анимацию на активной вкладке: в скрытой не идут кадры.

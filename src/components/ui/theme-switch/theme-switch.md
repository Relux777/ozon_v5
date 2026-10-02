# ThemeSwitch

Клиентская кнопка смены темы (светлая ↔ тёмная) на `next-themes`. В разметке сразу **обе** иконки (солнце и луна),
какую показать — решает CSS по атрибуту `data-theme` на `<html>`. Поэтому кнопка есть уже в серверном HTML,
без пустой заглушки до гидратации и без сдвига шапки.

## Файлы

| Файл | Что внутри |
|---|---|
| `index.tsx` | компонент |
| `_theme-switch.scss` | `.theme-icon-sun` / `.theme-icon-moon` — видимость по `[data-theme='dark']` |

## Что нужно в проекте

- Пакет `next-themes` и провайдер с `attribute="data-theme"` вокруг приложения (в Ozon V5 — `src/providers/ThemeProvider.tsx`),
  а на `<html>` — `suppressHydrationWarning`.
- Переменные темы в `[data-theme='dark']` (в ReluxCode — `_variables.scss`).
- Иконки `@/assets/svg/ThemeSwitch/sun.svg` и `moon.svg` (SVGR).
- `@use "../../components/ui/theme-switch/theme-switch";` в начале `style.scss`.
- Перевод `A11y.themeToggle` и раздел `A11y` в `clientMessages`.

## Пример

```tsx
import ThemeSwitch from '@/components/ui/theme-switch';

<header>… <ThemeSwitch /> …</header>
```

## Что менять под проект

- Иконки и размер (`width/height={22}`) — в `index.tsx`.
- Другой атрибут темы (например, класс `.dark`) — поменять селектор в `_theme-switch.scss` и `attribute` у провайдера.
- Нужен третий режим «как в системе» — `setTheme('system')`; сейчас кнопка переключает только две темы.

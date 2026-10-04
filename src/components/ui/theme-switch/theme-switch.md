# ThemeSwitch

Клиентская кнопка смены темы (светлая ↔ тёмная) на `next-themes`. В разметке сразу **обе** иконки (солнце и луна),
какую показать — решает CSS по атрибуту `data-theme` на `<html>`. Поэтому кнопка есть уже в серверном HTML,
без пустой заглушки до гидратации и без сдвига шапки.

**Анимация смены темы:**
- иконка: уходящая проворачивается и гаснет, новая выкручивается навстречу и встаёт на место с пружинкой;
- страница: новая тема «раскрывается» кругом из кнопки (View Transitions API, ~0,45 с). Где API нет (старые браузеры)
  или в системе включено «уменьшение движения», тема меняется сразу, без анимации.

Всё на Web Animations API, а не на CSS transition: next-themes с `disableTransitionOnChange` на момент смены темы
отключает все переходы на странице, на WAAPI это не действует.

## Файлы

| Файл | Что внутри |
|---|---|
| `index.tsx` | компонент, анимации иконки и «раскрытия» темы |
| `_theme-switch.scss` | положения иконок по `[data-theme='dark']`, правила `::view-transition-*` (только пока на `<html>` класс `.theme-reveal`) |

## Что нужно в проекте

- Пакет `next-themes` и провайдер с `attribute="data-theme"` вокруг приложения (в Ozon V5 — `src/providers/ThemeProvider.tsx`),
  а на `<html>` — `suppressHydrationWarning`.
- Переменные темы в `[data-theme='dark']` (в ReluxCode — `_variables.scss`).
- Иконки `@/assets/svg/ThemeSwitch/sun.svg` и `moon.svg` (SVGR).
- `@use "../../components/ui/theme-switch/theme-switch";` в начале `style.scss`.
- Перевод `A11y.themeToggle` и раздел `A11y` в `clientMessages`.
- ReluxCode: `grid`, `place-center`, `active_scale_09`.

## Пропсы

| Проп | Тип | По умолчанию | Что делает |
|---|---|---|---|
| `reveal` | `boolean` | `true` | новая тема раскрывается кругом от кнопки; `false` — анимируется только иконка |

## Пример

```tsx
import ThemeSwitch from '@/components/ui/theme-switch';

<header>… <ThemeSwitch /> …</header>

// без «раскрытия» страницы — анимируется только иконка
<ThemeSwitch reveal={false} />
```

## Что менять под проект

- Иконки и размер (`width/height={22}`) — в `index.tsx`.
- Скорость и характер анимации — `REVEAL_MS`, `ICON_IN_MS`, `ICON_OUT_MS`, `SPRING` в `index.tsx`.
- Другой атрибут темы (например, класс `.dark`) — поменять селектор в `_theme-switch.scss`, `attribute` у провайдера
  и функцию `apply` в `index.tsx` (она ставит атрибут сама, см. ниже).
- Нужен третий режим «как в системе» — `setTheme('system')`; сейчас кнопка переключает только две темы.

## Подводные камни

- Тему компонент ставит на `<html>` сам (атрибут и `color-scheme`) и только потом вызывает `setTheme`: next-themes
  применяет атрибут в эффекте — уже после того, как View Transition сняла «новое» состояние страницы, и круг раскрыл бы
  старую тему.
- Пока идёт раскрытие (~0,45 с), страница показана снимком — клики в это время не проходят. Это нормально для View Transitions.
- Проверять анимацию на активной вкладке: в скрытой не идут кадры.

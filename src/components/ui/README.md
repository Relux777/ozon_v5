# UI-компоненты (общие для проектов)

Здесь лежат компоненты, которые не знают ничего про Ozon и переносятся в другой проект **папкой**.
Всё, что связано с этим сайтом (тексты, конкретные блоки, данные), — в `src/components/*` уровнем выше.

| Папка | Что это | Клиентский | Инструкция |
|---|---|---|---|
| `modal/` | Модалка: портал, свайп вниз, Escape, фокус; лист снизу / по центру / справа | да | [modal.md](modal/modal.md) |
| `faq-accordion/` | Аккордеон «вопрос–ответ», открыт один пункт, плавное раскрытие, открытие по `#якорю` | да | [faq-accordion.md](faq-accordion/faq-accordion.md) |
| `alert/` | Всплывающие уведомления: 4 типа, 7 позиций, стопка-«колода», таймер с паузами, свайп, кнопка действия, появление из «капли» | да | [alert.md](alert/alert.md) |
| `copy-code/` | «Таблетка» с кодом и кнопкой «Скопировать» (результат — уведомлением `alert`) | да | [copy-code.md](copy-code/copy-code.md) |
| `copy-link/` | Кнопка, копирующая текст/ссылку (сам текст не показывает; результат — уведомлением `alert`) | да | [copy-link.md](copy-link/copy-link.md) |
| `scroll-top/` | Плавающая кнопка «наверх» + общий класс `.float-btn` | да | [scroll-top.md](scroll-top/scroll-top.md) |
| `theme-switch/` | Переключатель светлой/тёмной темы без «мигания» | да | [theme-switch.md](theme-switch/theme-switch.md) |
| `photo-slider/` | Лента фото со свайпом, пагинацией и окном просмотра (размытый фон, свайпы, закрытие вниз) | да | [photo-slider.md](photo-slider/photo-slider.md) |
| `breadcrumbs/` | Хлебные крошки (серверный) | нет | [breadcrumbs.md](breadcrumbs/breadcrumbs.md) |
| `json-ld/` | `<script type="application/ld+json">` с защитой от `</script>` | нет | [json-ld.md](json-ld/json-ld.md) |

## Общие требования к проекту

- **ReluxCode** (`src/assets/scss/ReluxCode.scss`) подключён в корневом layout — раскладка компонентов сделана его классами
  (`flex`, `grid`, `gap-*`, `br-*`, `bg-X-Y`, `hover-none`…). Без ReluxCode компоненты работают, но выглядят «голыми».
- **Стили компонента** лежат рядом с ним: `*.module.scss` (Modal) или партиал `_имя.scss` с глобальными классами.
  Партиалы подключаются одной строкой в начале проектного `style.scss`:
  ```scss
  @use "../../components/ui/faq-accordion/faq-accordion";
  ```
  Проектные правила ниже в `style.scss` могут их переопределить (например, отступ `.float-btn` над нижним меню).
- **SVG как компоненты** (SVGR: `import Icon from '@/assets/svg/x.svg'`) — нужны Modal, ScrollTop, ThemeSwitch.
- **next-intl** — Modal, ScrollTop, ThemeSwitch и Breadcrumbs берут подписи для скринридеров из раздела `A11y`
  (`close`, `scrollTop`, `themeToggle`, `breadcrumbs`). Для клиентских компонентов раздел `A11y` должен быть в `clientMessages`
  корневого layout. Остальные компоненты получают подписи пропсами.
- Алиас `@/*` → `src/*` в `tsconfig.json`.

## Перенос в новый проект

1. Скопировать нужные папки в `src/components/ui/`.
2. Проверить зависимости из таблицы выше и из `.md` компонента (SVG, ключи `A11y`, `#modal-root`, `next-themes`).
3. Подключить партиалы `_*.scss` в `style.scss`.
4. `npx tsc --noEmit` и `npx next build`.

Правило: в `ui/` не импортировать ничего из `@/config`, `@/lib`, `@/data` и проектных компонентов — иначе папка перестанет
переноситься. Если компоненту нужен текст или данные — передавать пропсами.

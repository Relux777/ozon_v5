# FaqAccordion

Клиентский аккордеон «вопрос — ответ». Открыт всегда один пункт, раскрытие плавное (`grid-template-rows: 0fr → 1fr`),
пункт можно открыть ссылкой с якорем (`/support#q-money-2`). Кнопка — `<button aria-expanded>`, не `<details>`.

## Файлы

| Файл | Что внутри |
|---|---|
| `index.tsx` | компонент |
| `_faq-accordion.scss` | классы `.tip`, `.tip-summary` (плюс → крестик), `.tip-body`, `.tip-body-inner`, `.tip-open` |

## Что нужно в проекте

- `@use "../../components/ui/faq-accordion/faq-accordion";` в начале `style.scss`.
- ReluxCode: `grid`, `gap-8`, `bg-3-100`, `br-20`, `border-1px-2-10`, `flex`, `hover-none`, `text_left`, `font-14`, `color-2-90`,
  `overflow-hidden`.
- Для открытия по якорю — класс `.scroll-anchor` в проекте (отступ под липкую шапку):
  `.scroll-anchor { scroll-margin-top: calc(var(--header-h, 60px) + 12px); }`.

## Пропсы

| Проп | Тип | По умолчанию | Что делает |
|---|---|---|---|
| `items` | `{ title: string; text: string }[]` | — | вопросы и ответы (текст — обычная строка) |
| `defaultOpen` | `number` | `0` | какой пункт открыт сразу; `-1` — все закрыты |
| `idPrefix` | `string` | — | id пунктов `${idPrefix}-1`, `-2`…; включает открытие по `#якорю` |

## Пример

```tsx
import FaqAccordion from '@/components/ui/faq-accordion';

const items = [
    { title: 'Когда приходят деньги?', text: 'Через 3 часа после смены.' },
    { title: 'Нужен ли опыт?', text: 'Нет, первый день — обучение.' },
];

<FaqAccordion items={items} defaultOpen={-1} idPrefix="q-money" />
// ссылка /page#q-money-2 откроет второй вопрос
```

Серверная страница передаёт уже переведённые строки (`t.raw('faq')` и т.п.) — своих переводов у компонента нет.
Разметку FAQPage (schema.org) компонент не добавляет — это делает страница через `JsonLd`.

## Что менять под проект

- Цвет открытого пункта и значка `+` — `rgb(var(--bg-5) / 8%)` и `rgb(var(--bg-5))` в `_faq-accordion.scss`.
- Отступы внутри — `padding` у `.tip-summary` и у `p` в `.tip-body-inner`.
- Ключ пункта — `item.title`: заголовки в одном списке должны быть разными.

# Breadcrumbs

Серверные хлебные крошки: `<nav aria-label>` + `<ol>`, разделитель «/» рисует CSS. Последний пункт — текущая страница
(`aria-current="page"`, без ссылки).

## Файлы

| Файл | Что внутри |
|---|---|
| `index.tsx` | компонент (async, серверный) |
| `_breadcrumbs.scss` | разделитель `.breadcrumbs li + li::before { content: '/' }` |

## Что нужно в проекте

- `@use "../../components/ui/breadcrumbs/breadcrumbs";` в начале `style.scss`.
- next-intl: `getTranslations('A11y')` → ключ `breadcrumbs` (подпись навигации) и `Link` из `@/i18n/navigation`
  (сохраняет текущий язык в ссылках). В проекте без next-intl заменить на `next/link` и строку.
- ReluxCode: `mb-15 flex gap-7 font-12 color-5-100 color-2-80`.

## Пример

```tsx
import Breadcrumbs from '@/components/ui/breadcrumbs';

<Breadcrumbs items={[
    { label: 'Главная', href: '/' },
    { label: 'Склады', href: '/sklad' },
    { label: 'Казань' },
]} />
```

Разметку BreadcrumbList для поисковиков компонент **не** выводит — её добавляет страница через `JsonLd`
(в Ozon V5 — `breadcrumbJsonLd()` из `lib/seo.ts`). Это разные вещи: крошки можно скрыть, а JSON-LD оставить.

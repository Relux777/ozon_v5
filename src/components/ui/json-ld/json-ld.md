# JsonLd

Серверный компонент: выводит `<script type="application/ld+json">` с разметкой schema.org (WebSite, BreadcrumbList,
FAQPage…). Символ `<` экранируется как `<`, поэтому строка из данных не может закрыть тег `</script>`.

## Пропсы

| Проп | Тип | Что делает |
|---|---|---|
| `data` | `Record<string, unknown>` | объект schema.org (с `@context` и `@type`) |

## Пример

```tsx
import JsonLd from '@/components/ui/json-ld';

<JsonLd data={{
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((q) => ({
        '@type': 'Question',
        name: q.title,
        acceptedAnswer: { '@type': 'Answer', text: q.text },
    })),
}} />
```

## Правила

- Ставить на странице (серверный компонент), не в клиентских компонентах.
- FAQPage — только для настоящих вопросов и только на одной странице сайта (одинаковые FAQ на многих страницах Google размечать
  не советует).
- `dangerouslySetInnerHTML` здесь намеренный: линтер (Biome) на него ругается — это ожидаемо.

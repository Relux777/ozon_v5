# CopyCode

Клиентская «таблетка»: сам код крупно + кнопка «Скопировать». Результат — всплывающим уведомлением `ui/alert`
(«Скопировано» + сам код; его же объявляет скринридер), подпись кнопки не меняется. Если буфер обмена недоступен
(http, запрет браузера), показывается уведомление-ошибка `A11y.copyFailed` — код всё равно виден на экране.
Нужен `AlertProvider` выше по дереву (см. `alert/alert.md`), без него копирование работает молча.

## Пропсы

| Проп | Тип | Что делает |
|---|---|---|
| `code` | `string` | что показать и скопировать |
| `copyLabel` | `string` | подпись кнопки («Скопировать») |
| `copiedLabel` | `string` | заголовок уведомления после копирования («Скопировано»); второй строкой — сам код |

Подписи приходят пропсами с сервера — клиентскому компоненту не нужны свои переводы.

## Пример

```tsx
import CopyCode from '@/components/ui/copy-code';

<CopyCode code="QK3HMR42" copyLabel={t('copy')} copiedLabel={t('copied')} />
```

## Стили — задаёт проект

Раскладка — классами ReluxCode в разметке (`flex nowrap align-center justify-between gap-10 br-36 w-full`, кнопка
`hover-none px-10 br-36`). Цвета намеренно **не** в папке компонента: они зависят от фона, на котором стоит «таблетка».
В проекте должны быть два класса, например (как в Ozon V5, `style.scss`, блок `.promo`):

```scss
.promo-code {                       // сама таблетка
    padding: 6px 6px 6px 18px;
    background: #fff;
    code { min-width: 0; overflow-wrap: anywhere; user-select: all; }
}
.promo-copy {                       // кнопка
    min-height: 40px;
    background: rgb(var(--bg-5));
    color: #fff;
    @include mixins.hover { background: #0047cc; }
}
```

Хотите другие имена классов — поменяйте их в `index.tsx` (две строки `className`).

# CopyLink

Клиентская кнопка «Скопировать …»: копирует строку (ссылку, адрес, номер), сама строка на экран не выводится.
Результат — всплывающим уведомлением `ui/alert`: заголовок `copiedLabel`, второй строкой — скопированный текст
(его же объявляет скринридер); при ошибке буфера обмена — уведомление-ошибка `A11y.copyFailed`. Подпись кнопки не
меняется. Нужен `AlertProvider` выше по дереву (см. `alert/alert.md`).

## Пропсы

| Проп | Тип | Что делает |
|---|---|---|
| `url` | `string` | что скопировать (любой текст, не только ссылка) |
| `copyLabel` | `string` | подпись кнопки |
| `copiedLabel` | `string` | заголовок уведомления после копирования («Адрес скопирован») |
| `className` | `string` | весь внешний вид кнопки — классами ReluxCode/проекта |
| `icon` | `ReactNode` | иконка перед подписью (готовая разметка с сервера) |

## Пример

```tsx
import CopyLink from '@/components/ui/copy-link';
import CopySVG from '@/assets/svg/sklad/copy.svg';

<CopyLink
    url="г. Казань, ул. Примерная, 1"
    copyLabel="Копировать адрес"
    copiedLabel="Скопировано"
    icon={<CopySVG width={16} height={16} aria-hidden="true" />}
    className="hover-none inline-flex nowrap align-center gap-5 h-36 px-16 br-36 font-12 font-w-500"
/>
```

Своих стилей у компонента нет — оформление целиком через `className`. Для чипа с иконкой обязательно `nowrap`:
у `.inline-flex` в ReluxCode `flex-wrap: wrap`, и без него иконка переносится на отдельную строку.

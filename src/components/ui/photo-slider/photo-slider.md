# PhotoSlider

Клиентская лента фото со свайпом и окном просмотра. Без библиотек: листание — нативный CSS scroll-snap (инерция,
жесты и доступность прокрутки — браузерные), анимации — Web Animations API.

- **Лента:** активный слайд по центру, соседние приглушены и чуть меньше; свайп пальцем, перетаскивание мышью,
  стрелки ← → (когда фокус на ленте), Home/End.
- **Пагинация под лентой:** счётчик «03 / 07», точки (активная вытягивается в «таблетку» фирменного цвета), стрелки.
- **Окно просмотра** (нажатие на фото): фото «вылетает» из миниатюры и «возвращается» в неё при закрытии, фон размыт
  (`backdrop-filter`), листание свайпом / стрелками / точками / клавишами ← →, закрытие свайпом вниз, `Esc`, крестиком
  или нажатием мимо фото. Прокрутка страницы блокируется, фокус уходит в окно и возвращается на фото.
- Крупная версия фото и код окна грузятся заранее — при наведении/фокусе на миниатюре; пока крупное фото грузится,
  под ним видна миниатюра.
- `prefers-reduced-motion` — без анимаций и плавной прокрутки.

## Файлы

| Файл | Что внутри |
|---|---|
| `index.tsx` | лента + пагинация (клиентский компонент) |
| `photo-viewer.tsx` | окно просмотра — отдельный чанк (`next/dynamic`), грузится только когда нужен |
| `shared.ts` | типы `PhotoSlide`, `PhotoSliderLabels`, `VIEWER_SIZES`, предзагрузка крупного фото |
| `_photo-slider.scss` | глобальные классы `.photo-slider*`, `.photo-viewer*` |

## Что нужно в проекте

1. **Стили** — строка в начале `style.scss`:
   ```scss
   @use "../../components/ui/photo-slider/photo-slider";
   ```
   Внутри партиала миксины подключены относительным путём `../../../assets/scss/mixins` (ReluxCode).
2. **ReluxCode** v2.2.10+: используются `flex`, `grid`, `gap-*`, `w-46`, `h-46`, `br-round`, `bg-3-100`, `border-1px-2-10`,
   `hover-none`, `active_scale_09`, `sr-only`, `md-0`, **`z-40`** (окно должно быть выше плавающих кнопок и баннеров) и др.
3. **SVG (SVGR):** `@/assets/svg/chevron-left.svg`, `@/assets/svg/menu/chevron-right.svg`, `@/assets/svg/x.svg`,
   `@/assets/svg/search-plus.svg` (все — Boxicons v3).
4. **Контейнер портала** `<div id="modal-root"></div>` в корневом layout (как у Modal). Если его нет — окно рисуется в `<body>`.
5. **Картинки — статическим импортом** (`import Shot from '@/assets/img/…/1.webp'`): нужны `width`/`height` и `blurDataURL`.
   Источник — webp не шире ~1080 px (крупнее в окне не показывается); миниатюры и крупные версии режет `next/image`.
6. Переводы не нужны: все подписи приходят пропсом `labels` (с сервера).

## Пропсы

| Проп | Тип | Обязательный | Что делает |
|---|---|---|---|
| `slides` | `PhotoSlide[]` | да | `{ src, alt, title?, text? }` — фото, описание для скринридеров, подпись под фото |
| `labels` | `PhotoSliderLabels` | да | подписи кнопок и окна (см. ниже) |
| `sizes` | `string` | нет | `sizes` миниатюр, по умолчанию `(max-width: 620px) 58vw, 250px` — под `--ps-slide-w` |
| `className` | `string` | нет | доп. классы на обёртку |

`labels`: `region` (название ленты), `viewer` (название окна), `prev`, `next`, `close`, `open` (начало подписи
кнопки-фото: «Открыть крупно: <title>»), `position` (шаблон «{n} из {total}»), `goTo` (шаблон «Показать снимок {n}»).
`{n}` и `{total}` подставляет сам компонент — в next-intl такие строки брать через `t.raw(…)`, а не `t(…)`.

## Пример

```tsx
// серверный компонент
import { getTranslations } from 'next-intl/server';
import PhotoSlider, { type PhotoSliderLabels } from '@/components/ui/photo-slider';
import Shot1 from '@/assets/img/slider/1.webp';
import Shot2 from '@/assets/img/slider/2.webp';

export default async function Gallery({ locale }: { locale: string }) {
    const t = await getTranslations({ locale, namespace: 'Gallery' });
    const items = t.raw('items') as { title: string; text: string; alt: string }[];

    return (
        <PhotoSlider
            slides={[Shot1, Shot2].map((src, i) => ({ src, ...items[i] }))}
            labels={t.raw('slider') as PhotoSliderLabels}
        />
    );
}
```

В этом проекте так сделан `src/components/AppScreens` (скриншоты приложения на странице города).

## Что менять под проект

- **Ширина слайда / зазор / скругление** — `--ps-slide-w`, `--ps-gap`, `--ps-radius` на `.photo-slider` в `_photo-slider.scss`.
  Поменяли ширину — поправьте проп `sizes`.
- **Приглушение соседних слайдов** — `.photo-slider-slide:not(.is-active)` (`opacity`, `scale`).
- **Фон окна** — `.photo-viewer-backdrop` (цвет и сила размытия). Только стандартный `backdrop-filter`: если рядом написать
  `-webkit-backdrop-filter`, минификатор оставит один префиксный, и в Chrome размытие пропадёт.
- **Поля окна** (место под счётчик сверху и подпись снизу) — `--pv-top`, `--pv-bottom` на `.photo-viewer`.
- **Пороги жестов** — `AXIS_LOCK`, `CLOSE_DISTANCE`, `CLOSE_VELOCITY`, `FLIP_SHARE` в `photo-viewer.tsx`; длительности — `OPEN_MS`, `CLOSE_MS`.
- **`sizes` крупного фото** — `VIEWER_SIZES` в `shared.ts` (по нему же идёт предзагрузка).

## Подводные камни

- Пальцем лента окна листается нативно (`touch-action: pan-x`), жест вниз ловит JS — не ставьте на ленту окна
  `touch-action: none`/`pan-y`, иначе пропадёт либо свайп вбок, либо закрытие вниз.
- Внутри ленты слайдера — `<section aria-label>` (ориентир для скринридеров). В этом проекте правило «первая секция в main»
  (`main section:first-of-type .container`) её не задевает, потому что внутри нет `.container`.
- Проверять анимации на активной вкладке: в скрытой не идут кадры — плавная прокрутка и переходы «замирают».

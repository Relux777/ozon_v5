import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getLocaleFromParams } from '@/i18n/params';
import lab from './_lab/navbar1.module.scss';
import Stage, { type VariantId } from './_lab/Stage';

// Страница целиком статическая: сборка упадёт, если в неё попадёт рендер «на запрос» — cookies, headers, незакэшированные
// данные (Next 16.4, работает с cacheComponents). У каждой страницы сайта, кроме [...rest]: там адрес заранее не известен
export const ensureStatic = 'navigation';

// Служебная страница для выбора нижнего меню: не в поиске, не в sitemap, ссылок на неё нет.
// Тексты только по-русски (на других языках переведены лишь подписи пунктов). Варианты — в _lab/, настоящее меню
// (components/NavBar) не тронуто. Выбрали вариант — перенести его в NavBar, а эту папку удалить
export const metadata: Metadata = {
    title: 'Варианты нижнего меню',
    robots: { index: false, follow: false },
};

type Props = {
    params: Promise<{ locale: string }>;
};

const VARIANTS: { id: VariantId; title: string; text: string; tries: string[] }[] = [
    {
        id: 'v1',
        title: '1. Наш',
        text: 'Как сейчас на сайте: компактная стеклянная плашка, слайдер переезжает к нажатому пункту с «пружинкой».',
        tries: ['нажимайте пункты'],
    },
    {
        id: 'v2',
        title: '2. Наш + перетаскивание',
        text: 'Тот же вид, но слайдер можно тянуть пальцем или мышью. Он тянется за пальцем, растягивается от скорости и подсвечивает пункт под собой. Отпустили — доезжает до ближайшего пункта, резкий бросок — до следующего.',
        tries: ['потяните слайдер влево-вправо', 'бросьте его резким движением', 'нажмите пункт — слайдер вытянется по пути'],
    },
    {
        id: 'v3',
        title: '3. Как в iOS',
        text: 'По мотивам панели вкладок iOS с Liquid Glass: широкая стеклянная капсула, выбранный пункт — синим на серой «таблетке». При прокрутке вниз панель сворачивается в кружок с текущим пунктом, при прокрутке вверх — разворачивается.',
        tries: ['прокрутите экран вниз, потом вверх', 'нажмите на свёрнутый кружок', 'зажмите и протяните по панели'],
    },
    {
        id: 'v4',
        title: '4. Наш + «стекло» как в iOS',
        text: 'Наш вид с анимацией из iOS: при нажатии слайдер переезжает под палец и плавно растёт, пока его держат, становится прозрачнее, иконка под ним увеличивается. Отпустили — пружинисто садится.',
        tries: ['зажмите любой пункт и подержите', 'зажмите и тяните', 'отпустите — слайдер сядет с покачиванием'],
    },
    {
        id: 'v5',
        title: '5. Жидкое стекло',
        text: 'Своя версия без SVG-фильтров, поэтому работает и на iPhone. Слайдер — линза: под ней иконки по-настоящему увеличены и окрашены, у края — цветная кромка, по панели за линзой бежит блик. Нажатие поднимает линзу, удержание растит, перетаскивание тянет её «каплей» с лёгким притяжением к пунктам.',
        tries: ['нажмите и держите', 'медленно проведите линзой через иконки', 'бросьте линзу резким движением'],
    },
];

export default async function NavbarVariantsPage({ params }: Props) {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'NavBar' });
    const labels = [t('home'), t('promotions'), t('warehouses'), t('menu')];

    return (
        <main>
            <section>
                <div className='container'>
                    <h1 className='mb-10 text-balance'>Варианты нижнего меню</h1>
                    <p className='mb-20 max-w-60-ch text-pretty'>
                        Пять вариантов на одной странице, у каждого — свой «экран телефона»: его можно прокручивать, пункты — нажимать и тянуть. Меню сайта
                        внизу — настоящее, оно не менялось. Страница служебная и в поиск не попадает.
                    </p>

                    <div className={lab.grid}>
                        {VARIANTS.map((v, i) => (
                            <article key={v.id} className='flex column gap-12'>
                                <div>
                                    <h2 className='font-18 mb-5'>{v.title}</h2>
                                    <p className='font-14 text-pretty mb-7'>{v.text}</p>
                                    <ul className={`font-14 ${lab.tries}`}>
                                        {v.tries.map((tr) => (
                                            <li key={tr}>{tr}</li>
                                        ))}
                                    </ul>
                                </div>
                                <Stage variant={v.id} labels={labels} ariaLabel={`Вариант ${v.title}`} eager={i === 0} />
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

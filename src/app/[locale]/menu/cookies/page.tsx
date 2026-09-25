import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getLocaleFromParams } from '@/i18n/params';
import { CONTACTS, OWNER, YANDEX_METRIKA_ID } from '@/config/legal';
import LegalDoc from '@/components/LegalDoc';
import CookieSettings from '@/components/CookieSettings';

// Cookie и согласие на аналитику: какие cookie ставит сайт, и отдельно — текст согласия на обработку данных
// Яндекс Метрикой (с 01.09.2025 согласие оформляется отдельно от других документов, ч. 1 ст. 9 152-ФЗ).
// Кнопка «Изменить выбор cookie» — отзыв согласия. Текст на русском — юридически значимая версия.

type Props = {
    params: Promise<{ locale: string }>;
};

const TITLE = 'Cookie и согласие на аналитику';

export const metadata: Metadata = {
    title: TITLE,
    robots: { index: false, follow: false },
};

type Row = { name: string; owner: string; purpose: string; term: string; analytics?: boolean };

const COOKIES: Row[] = [
    { name: 'NEXT_LOCALE', owner: 'Сайт', purpose: 'Запоминает выбранный язык сайта', term: '1 год' },
    { name: 'cookie_consent', owner: 'Сайт', purpose: 'Хранит ваш выбор в уведомлении о cookie: «Принять» или «Отклонить»', term: '1 год' },
    { name: 'theme (хранилище браузера)', owner: 'Сайт', purpose: 'Запоминает светлую или тёмную тему. Это не cookie, а запись в браузере — на сервер не отправляется', term: 'Пока вы не очистите данные сайта' },
    { name: '_ym_uid, _ym_d', owner: 'ООО «ЯНДЕКС» (Яндекс Метрика)', purpose: 'Отличают новые визиты от повторных, хранят дату первого визита', term: '1 год', analytics: true },
    { name: '_ym_isad и другие _ym_*', owner: 'ООО «ЯНДЕКС» (Яндекс Метрика)', purpose: 'Служебные данные статистики: блокировщик рекламы, текущий визит', term: 'От окончания визита до 2 дней', analytics: true },
];

export default async function CookiesPage({ params }: Props) {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'Cookies' });

    const settings = (
        <CookieSettings
            labels={{ button: t('settings'), all: t('statusAll'), necessary: t('statusNecessary'), none: t('statusNone') }}
        />
    );

    const sections = [
        {
            id: 'what',
            title: 'Что такое cookie и как вы выбираете',
            content: (
                <>
                    <p>
                        Cookie — небольшие файлы, которые сайт сохраняет в браузере. При первом визите внизу экрана появляется
                        уведомление с двумя равнозначными кнопками: «Принять» разрешает cookie аналитики, «Отклонить» оставляет
                        только необходимые. Пока вы не выбрали, аналитика не загружается; сайт полностью работает при любом выборе.
                    </p>
                    <p>Передумали — нажмите кнопку ниже: уведомление откроется снова.</p>
                    {settings}
                </>
            ),
        },
        {
            id: 'list',
            title: 'Какие cookie использует сайт',
            content: (
                <>
                    <ul className='grid gap-10'>
                        {COOKIES.map((row) => (
                            <li className='grid gap-5 pd-15 br-20 bg-2-3' key={row.name}>
                                <div className='flex align-center justify-between gap-8'>
                                    <code className='color-2-90 font-w-500'>{row.name}</code>
                                    <span className={`inline-flex nowrap align-center h-20 px-10 br-36 font-12 ${row.analytics ? 'bg-5-10 color-5-100' : 'bg-2-7 color-2-80'}`}>
                                        {row.analytics ? 'Аналитика — только после «Принять»' : 'Необходимые'}
                                    </span>
                                </div>
                                <p>{row.purpose}</p>
                                <p className='font-12 color-2-80'>
                                    {row.owner} · срок хранения: {row.term}
                                </p>
                            </li>
                        ))}
                    </ul>
                    {!YANDEX_METRIKA_ID && (
                        <p className='font-14 color-2-80'>
                            Сейчас счётчик Яндекс Метрики на сайте не подключён — cookie _ym_* не ставятся ни при каком выборе.
                            Если мы его подключим, он будет работать только у тех, кто нажал «Принять».
                        </p>
                    )}
                    <p>
                        Удалить cookie можно в настройках браузера (раздел «Конфиденциальность» или «Данные сайтов»). Тогда при
                        следующем визите уведомление появится снова.
                    </p>
                </>
            ),
        },
        {
            id: 'consent',
            title: 'Согласие на обработку персональных данных для аналитики',
            content: (
                <>
                    <p>
                        Нажимая «Принять» в уведомлении о cookie, я свободно, своей волей и в своём интересе даю согласие{' '}
                        {OWNER.fullNameGenitive} (оператор; {CONTACTS.email}) на обработку моих персональных данных с помощью
                        сервиса Яндекс Метрика на следующих условиях.
                    </p>
                    <ul className='legal-list grid gap-5'>
                        <li>
                            <b>Данные:</b> идентификаторы cookie, IP-адрес, сведения о браузере, устройстве и операционной системе,
                            адреса просмотренных страниц и источник перехода, дата и время посещения, действия на сайте (переходы,
                            прокрутка, клики).
                        </li>
                        <li><b>Цель:</b> статистика посещаемости и улучшение сайта.</li>
                        <li>
                            <b>Действия:</b> сбор, запись, систематизация, накопление, хранение, уточнение, извлечение,
                            использование, обезличивание, блокирование, удаление, уничтожение, а также передача (предоставление)
                            ООО «ЯНДЕКС», которое обрабатывает данные по поручению оператора для подсчёта статистики.
                            Распространение данных не осуществляется.
                        </li>
                        <li><b>Способ:</b> автоматизированная обработка, без принятия решений, которые влекут для меня юридические последствия.</li>
                        <li><b>Срок:</b> 1 год с момента согласия или до его отзыва.</li>
                        <li>
                            <b>Отзыв:</b> в любой момент — кнопкой «Изменить выбор cookie» на этой странице (выбрать «Отклонить») или
                            письмом на {CONTACTS.email}. Отзыв не влияет на законность обработки до него.
                        </li>
                    </ul>
                    <p>
                        Как оператор обрабатывает остальные данные — в{' '}
                        <Link href='/menu/privacy' className='color-5-100'>политике обработки персональных данных</Link>.
                    </p>
                </>
            ),
        },
    ];

    return <LegalDoc locale={locale} href='/menu/cookies' title={TITLE} sections={sections} />;
}

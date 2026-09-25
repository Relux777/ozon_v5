import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { getLocaleFromParams } from '@/i18n/params';
import { CONTACTS, OWNER } from '@/config/legal';
import LegalDoc from '@/components/LegalDoc';

// О проекте: кто ведёт сайт, откуда данные, как сайт зарабатывает. Текст на русском, как у остальных документов

type Props = {
    params: Promise<{ locale: string }>;
};

const TITLE = 'О проекте';

export const metadata: Metadata = {
    title: TITLE,
    robots: { index: false, follow: false },
};

const external = { target: '_blank', rel: 'nofollow noopener noreferrer' } as const;

export default async function AboutPage({ params }: Props) {
    const locale = await getLocaleFromParams(params);

    const sections = [
        {
            id: 'what',
            title: 'Что это за сайт',
            content: (
                <p>
                    «Озон Работа» — независимый информационный сайт для тех, кто ищет подработку на складах Ozon через приложение
                    Ozon Job. Мы не Ozon и не его официальный представитель: Ozon — товарный знак ООО «Интернет Решения».
                    Официальные условия всегда смотрите в приложении Ozon Job, на{' '}
                    <a href='https://job.ozon.ru' className='color-5-100' {...external}>job.ozon.ru</a>, в{' '}
                    <a href='https://docs.ozon.ru/job-ff-help/' className='color-5-100' {...external}>справке Ozon Job</a> и на{' '}
                    <a href='https://career.ozon.ru' className='color-5-100' {...external}>career.ozon.ru</a>.
                </p>
            ),
        },
        {
            id: 'sources',
            title: 'Откуда данные',
            content: (
                <p>
                    Адреса складов по городам, условия, выплаты, рейтинг и акции мы собираем из открытой справки Ozon Job,
                    страниц career.ozon.ru, справки и страниц Ozon Банка и пересказываем своими словами. Даты сверки указаны
                    рядом с каждым разделом. Нашли ошибку — напишите нам, исправим.
                </p>
            ),
        },
        {
            id: 'owner',
            title: 'Кто ведёт сайт',
            content: (
                <p>
                    Владелец сайта — {OWNER.fullName} (физическое лицо). Почта —{' '}
                    <a href={`mailto:${CONTACTS.email}`} className='color-5-100'>{CONTACTS.email}</a>, телефон —{' '}
                    <a href={`tel:${CONTACTS.phone.tel}`} className='color-5-100'>{CONTACTS.phone.label}</a>, Telegram —{' '}
                    <a href={CONTACTS.telegram.url} className='color-5-100' target='_blank' rel='noopener noreferrer'>@{CONTACTS.telegram.username}</a>
                    , ежедневно с {CONTACTS.hours.from} до {CONTACTS.hours.to}. По вопросам аккаунта Ozon Job, выплат и рейтинга
                    мы помочь не можем — пишите в поддержку в приложении.
                </p>
            ),
        },
        {
            id: 'money',
            title: 'Как сайт зарабатывает',
            content: (
                <p>
                    На реферальных ссылках и коде приглашения с пометкой «Реклама»: если вы оформитесь по ним и выполните условия,
                    Ozon или Ozon Банк может выплатить нам вознаграждение. Подробнее — на странице{' '}
                    <Link href='/menu/ads' className='color-5-100'>«Реклама и вознаграждение»</Link>.
                </p>
            ),
        },
        {
            id: 'cooperation',
            title: 'Сотрудничество',
            content: (
                <p>
                    Компании могут заказать у нас такой же рекламный сайт — на нескольких языках, с SEO и аккуратной юридической
                    частью. Подробнее — на странице <Link href='/menu/cooperation' className='color-5-100'>«Сотрудничество»</Link>.
                </p>
            ),
        },
    ];

    return <LegalDoc locale={locale} href='/menu/about' title={TITLE} sections={sections} />;
}

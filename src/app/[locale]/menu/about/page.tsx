import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';

// Заглушка: не индексируем, пока текста мало.
export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default function AboutPage() {
    return (
        <main>
            <div className='container py-20'>
                <h1 className='color-2-90'>О проекте</h1>
                <p className='max-w-60-ch mb-15'>
                    «Озон Работа» — независимый информационный сайт для тех, кто ищет подработку или
                    постоянную работу на складах и в доставке Ozon. Мы не Ozon и не его официальный
                    представитель: Ozon — товарный знак ООО «Интернет Решения». Актуальные вакансии и
                    официальные правила всегда смотрите на{' '}
                    <a className='color-5-100' href='https://career.ozon.ru' target='_blank' rel='nofollow noopener noreferrer'>
                        career.ozon.ru
                    </a>{' '}
                    и в приложении Ozon Job.
                </p>
                <p className='max-w-60-ch mb-15'>
                    На сайте мы собираем в одном месте адреса складов по городам, ориентировочный доход,
                    условия оформления и порядок первых шагов — на основе открытой справки Ozon Job и
                    страниц career.ozon.ru. Даты сверки данных указаны рядом с каждым разделом.
                </p>
                <p className='max-w-60-ch mb-15'>
                    Часть ссылок на сайте — реферальные (код приглашения Ozon Job, ссылка на Ozon Карту):
                    если вы оформитесь по ним, мы можем получить вознаграждение от Ozon или Ozon Банка.
                    Подробнее — на странице{' '}
                    <Link className='color-5-100' href='/menu/ads'>«Реклама и вознаграждение»</Link>.
                </p>
                <p className='mt-20'>
                    <Link href='/menu' className='color-5-100'>← Назад в меню</Link>
                </p>
            </div>
        </main>
    );
}

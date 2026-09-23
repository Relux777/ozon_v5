import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';

// Заглушка: сводит воедино раскрытие рекламы, уже расписанное по местам (#promo/#card на главной).
export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default function AdsPage() {
    return (
        <main>
            <div className='container py-20'>
                <h1 className='color-2-90'>Реклама и вознаграждение</h1>
                <p className='max-w-60-ch mb-15'>
                    На сайте есть два вида реферальных ссылок, отмеченных пометкой «Реклама»:
                </p>
                <p className='max-w-60-ch mb-7'>
                    <b className='color-2-90'>Код приглашения Ozon Job.</b> Если вы установите приложение
                    и введёте наш код, а затем выполните условия акции, Ozon может выплатить нам
                    вознаграждение. На ваш бонус это не влияет — его размер и условия определяет Ozon.
                </p>
                <p className='max-w-60-ch mb-15'>
                    <b className='color-2-90'>Ссылка на Ozon Карту.</b> Если вы оформите карту по нашей
                    ссылке, закажете и активируете её, Ozon Банк может выплатить нам вознаграждение — на
                    ваш кешбэк это не влияет. Услугу предоставляет ООО «ОЗОН Банк», лицензия Банка России
                    № 3542 от 12.04.2023.
                </p>
                <p className='max-w-60-ch mb-15'>
                    Мы не публикуем размер собственного вознаграждения и не влияем на условия акций —
                    их устанавливает и может изменить только организатор (Ozon или Ozon Банк).
                </p>
                <p className='mt-20'>
                    <Link href='/menu' className='color-5-100'>← Назад в меню</Link>
                </p>
            </div>
        </main>
    );
}

import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';

// Заглушка: сводит воедино раскрытие рекламы, уже расписанное по местам (#promo/#card на главной, /stocks).
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
                    <b className='color-2-90'>Приглашения Ozon Банка</b> — Ozon Карта, кредитная и зарплатная
                    карты, Ozon Premium, перевод пенсии, регистрация бизнеса и счёт для бизнеса (раздел{' '}
                    <Link href='/stocks' className='color-5-100'>«Акции»</Link>). Если вы оформите продукт по
                    нашей ссылке и выполните условия, банк может выплатить нам вознаграждение — на ваши условия
                    это не влияет. Банковские услуги оказывает ООО «ОЗОН Банк», лицензия Банка России № 3542
                    от 12.04.2023; подписку Ozon Premium — ООО «Интернет Решения».
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

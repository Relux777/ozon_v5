import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';

// Страница-заглушка: короткая выжимка по справке Ozon Job, полное описание — позже.
// Не индексируем, пока текста мало.
export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default function LevelPage() {
    return (
        <main>
            <div className='container py-20'>
                <h1 className='color-2-90'>Уровни рейтинга Ozon Job</h1>
                <p className='max-w-60-ch mb-20'>
                    Уровень формируется из баллов за выходы на объекты за последние 30 дней. От него зависят
                    сроки выплат, ожидаемая сумма за слот, на сколько дней вперёд можно забронировать слот и
                    вообще возможность записаться на склад. В первый день на объекте уровень — «Новичок»; в
                    приложении Ozon Job уровни могут отображаться и цифрами (0–3, затем «Бриллиант» — самый
                    высокий, слоты на год вперёд).
                </p>
                <p className='font-12'>
                    По справке Ozon Job (docs.ozon.ru, разделы «Уровни и баллы» и «График выплат»), сверено
                    23.09.2026. Полное описание уровней и порогов появится здесь позже.
                </p>
                <p className='mt-20'>
                    <Link href='/#pay' className='color-5-100'>← Назад, к разделу «Деньги»</Link>
                </p>
            </div>
        </main>
    );
}

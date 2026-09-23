import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';

// Страница-заглушка: полный список вопросов и ответов появится здесь позже.
// Не индексируем, пока текста мало.
export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default function SupportPage() {
    return (
        <main>
            <div className='container py-20'>
                <h1 className='color-2-90'>Вопросы и ответы</h1>
                <p className='max-w-60-ch mb-20'>
                    Здесь появится полный список вопросов и ответов о работе через Ozon Job: выплаты,
                    документы, уровни рейтинга и условия акций. Пока самые частые вопросы — на главной,
                    в разделе «На что обратить внимание».
                </p>
                <p className='mt-20'>
                    <Link href='/#tips' className='color-5-100'>← Назад, к разделу «Вопросы»</Link>
                </p>
            </div>
        </main>
    );
}

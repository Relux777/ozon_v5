import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
    const t = await getTranslations('NotFoundPage');

    return (
        <main className="container text_center pd-20">
            <h1 className="font-36">{t('title')}</h1>
            <p>{t('description')}</p>
            <Link href="/">{t('home')}</Link>
        </main>
    );
}

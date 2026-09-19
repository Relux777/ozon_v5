'use client';

import { useTranslations } from 'next-intl';

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
    const t = useTranslations('ErrorPage');

    return (
        <main className="container text_center pd-20">
            <h1 className="font-36">{t('title')}</h1>
            <button type="button" onClick={() => retry()}>
                {t('retry')}
            </button>
        </main>
    );
}

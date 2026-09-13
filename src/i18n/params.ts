import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { routing, type AppLocale } from './routing';

export async function getLocaleFromParams(
    params: Promise<{ locale: string }>
): Promise<AppLocale> {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return locale;
}
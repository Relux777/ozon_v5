import * as rootParams from 'next/root-params';
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
import ru from '../../messages/ru.json';

type Dict = { [key: string]: unknown };

const isDict = (value: unknown): value is Dict =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

// Недостающие ключи добираем из ru: лучше показать русский текст, чем уронить страницу.
// Полноту словарей контролирует src/i18n/messages.check.ts на этапе tsc.
function withFallback(base: Dict, override: Dict): Dict {
    const result: Dict = { ...base };

    for (const [key, value] of Object.entries(override)) {
        const baseValue = base[key];
        result[key] = isDict(baseValue) && isDict(value) ? withFallback(baseValue, value) : value;
    }

    return result;
}

export default getRequestConfig(async ({ locale }) => {
    if (!locale) {
        const paramValue = await rootParams.locale();
        if (hasLocale(routing.locales, paramValue)) {
            locale = paramValue;
        } else {
            notFound();
        }
    }

    const messages =
        locale === routing.defaultLocale
            ? ru
            : withFallback(ru, (await import(`../../messages/${locale}.json`)).default);

    return {
        locale,
        messages,
        timeZone: 'Europe/Moscow',
    };
});

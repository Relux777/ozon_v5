// Выбор посетителя в уведомлении о cookie — для баннера (CookieBanner), счётчика (YandexMetrika) и кнопки
// «Изменить выбор cookie» (CookieSettings). Только для браузера: хранится в первой стороне, в cookie на год.
// Необходимая cookie — сам этот выбор — работает всегда; аналитика — только при 'all'.

export type Consent = 'all' | 'necessary';

const COOKIE = 'cookie_consent';
const MAX_AGE = 60 * 60 * 24 * 365;

/** выбор изменился (detail — новое значение) */
export const CONSENT_CHANGE_EVENT = 'cookie-consent:change';
/** открыть баннер заново (кнопка «Изменить выбор cookie») */
export const CONSENT_OPEN_EVENT = 'cookie-consent:open';

export function readConsent(): Consent | null {
    try {
        const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=(all|necessary)`));
        return match ? (match[1] as Consent) : null;
    } catch {
        return null;
    }
}

export function writeConsent(value: Consent) {
    const previous = readConsent();
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API есть не во всех браузерах (Safari до 18.4)
    document.cookie = `${COOKIE}=${value}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
    if (value === 'necessary' && previous === 'all') removeAnalyticsCookies();
    window.dispatchEvent(new CustomEvent<Consent>(CONSENT_CHANGE_EVENT, { detail: value }));
}

export function openCookieSettings() {
    window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

// Отзыв согласия: удаляем cookie Яндекс Метрики (_ym_*) и Google Analytics (_ga*, _gid, _gat*) — и на хосте,
// и на родительском домене, куда их ставят счётчики. Сами скрипты перестают работать только с перезагрузкой страницы
const ANALYTICS_COOKIE = /^(_ym|_ga|_gid|_gat)/;

function removeAnalyticsCookies() {
    const host = window.location.hostname;
    const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`];
    for (const pair of document.cookie.split('; ')) {
        const name = pair.split('=')[0];
        if (!ANALYTICS_COOKIE.test(name)) continue;
        for (const domain of domains) {
            // biome-ignore lint/suspicious/noDocumentCookie: см. writeConsent
            document.cookie = `${name}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ''}`;
        }
    }
}

// Реферальные программы для раздела «Акции» (/stocks): приглашения Ozon Банка «Приведи друга» и заработок с Ozon.
//
// Где взять свою ссылку:
//  - Ozon Банк: главная приложения банка → значок напротив имени (или Выгода → Пригласите друзей) → продукт → «Отправить ссылку»;
//  - Ozon Blogger: ozon.ru/blogger-referrer → войти по Ozon ID → реферальная ссылка и промокод.
// Тексты карточек — StocksPage.offers.<id> в messages/ru.json; иконка и цвет — в странице (src/app/[locale]/stocks/page.tsx).
// Новая программа = строка здесь + блок StocksPage.offers.<id> в словаре + иконка в странице.
//
// Условия сверены 2026-09-25: https://help-bank.ozon.ru/individuals/bonuses-and-promotions/referral, ozon.ru/bloggers,
// ozon.ru/blogger-referrer и страницы самих приглашений. Поменялась ссылка — заменить url здесь.
import { routing, type AppLocale } from '@/i18n/routing';
import { CARD } from './promo';

/** Дата сверки условий — выводится на странице и уходит в sitemap как lastModified */
export const REFERRALS_CHECKED_AT = '2026-09-25';

/**
 * Языки, на которых раздел переведён и индексируется. С 2026-09-25 — все 7. Если добавите язык без перевода
 * StocksPage — уберите его отсюда: на нём будет noindex, и он выпадет из sitemap и hreflang.
 */
export const STOCKS_LOCALES: readonly AppLocale[] = routing.locales;

/** personal / business — продукты банка (сетка с фильтром), earn — заработок (отдельная секция рядом с кодом Ozon Job) */
export type ReferralCategory = 'personal' | 'business' | 'earn';

/**
 * advertiser — кто оказывает услугу (для пометки «Реклама» на карточке):
 * bank — ООО «ОЗОН Банк», ozon — ООО «Интернет Решения» (Ozon Premium, Ozon Blogger).
 * erid — идентификатор рекламы из ОРД (ст. 18.1 ФЗ «О рекламе»); пусто — не выводится, с ним — в строке рекламодателя
 */
export const REFERRALS = [
    { id: 'debit', category: 'personal', advertiser: 'bank', url: CARD.url, erid: CARD.erid },
    { id: 'credit', category: 'personal', advertiser: 'bank', url: 'https://ozon.ru/fintech/promo/ref/KWUM8IGKD', erid: '' },
    { id: 'premium', category: 'personal', advertiser: 'ozon', url: 'https://ozon.ru/fintech/promo/ref/ZYM7MHHZ8', erid: '' },
    { id: 'salary', category: 'personal', advertiser: 'bank', url: 'https://ozon.ru/fintech/promo/ref/MYSMDPS2U', erid: '' },
    { id: 'pension', category: 'personal', advertiser: 'bank', url: 'https://ozon.ru/fintech/promo/ref/XZHNQIJ9M', erid: '' },
    { id: 'bizReg', category: 'business', advertiser: 'bank', url: 'https://ozon.ru/fintech/promo/ref/6L4KZ0RXN', erid: '' },
    { id: 'bizAccount', category: 'business', advertiser: 'bank', url: 'https://ozon.ru/fintech/apps/mgm/OUIKE6KZH', erid: '' },
    { id: 'blogger', category: 'earn', advertiser: 'ozon', url: 'https://www.ozon.ru/bloggers/?refcode=LRFV3ELS2YAG', erid: '' },
] as const satisfies readonly { id: string; category: ReferralCategory; advertiser: 'bank' | 'ozon'; url: string; erid: string }[];

export type ReferralId = (typeof REFERRALS)[number]['id'];

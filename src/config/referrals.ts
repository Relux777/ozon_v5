// Реферальные программы для раздела «Акции» (/stocks) — приглашения Ozon Банка «Приведи друга».
//
// Ссылки персональные, выдаются в приложении банка: Ozon Банк → Выгода → Пригласите друзей → продукт → «Отправить ссылку».
// Тексты карточек — StocksPage.offers.<id> в messages/ru.json; иконка и цвет — в странице (src/app/[locale]/stocks/page.tsx).
// Новая программа = строка здесь + блок StocksPage.offers.<id> в словаре + иконка в странице.
//
// Условия сверены 2026-09-25: https://help-bank.ozon.ru/individuals/bonuses-and-promotions/referral и страницы самих приглашений.
// Если банк поменяет ссылку (например, при перевыпуске приглашения) — заменить url здесь.
import type { AppLocale } from '@/i18n/routing';
import { CARD } from './promo';

/** Дата сверки условий — выводится на странице и уходит в sitemap как lastModified */
export const REFERRALS_CHECKED_AT = '2026-09-25';

/**
 * Языки, на которых раздел уже переведён. Остальные показывают временный русский текст и закрыты от индексации
 * (noindex, нет в sitemap и hreflang). Переведёте StocksPage на язык — добавьте его сюда.
 */
export const STOCKS_LOCALES: readonly AppLocale[] = ['ru'];

export type ReferralCategory = 'personal' | 'business';

/**
 * advertiser — кто оказывает услугу (для пометки «Реклама» на карточке):
 * bank — ООО «ОЗОН Банк», ozon — ООО «Интернет Решения» (подписка Ozon Premium)
 */
export const REFERRALS = [
    { id: 'debit', category: 'personal', advertiser: 'bank', url: CARD.url },
    { id: 'credit', category: 'personal', advertiser: 'bank', url: 'https://ozon.ru/fintech/promo/ref/KWUM8IGKD' },
    { id: 'premium', category: 'personal', advertiser: 'ozon', url: 'https://ozon.ru/fintech/promo/ref/ZYM7MHHZ8' },
    { id: 'salary', category: 'personal', advertiser: 'bank', url: 'https://ozon.ru/fintech/promo/ref/MYSMDPS2U' },
    { id: 'pension', category: 'personal', advertiser: 'bank', url: 'https://ozon.ru/fintech/promo/ref/XZHNQIJ9M' },
    { id: 'bizReg', category: 'business', advertiser: 'bank', url: 'https://ozon.ru/fintech/promo/ref/6L4KZ0RXN' },
    { id: 'bizAccount', category: 'business', advertiser: 'bank', url: 'https://ozon.ru/fintech/apps/mgm/OUIKE6KZH' },
] as const satisfies readonly { id: string; category: ReferralCategory; advertiser: 'bank' | 'ozon'; url: string }[];

export type ReferralId = (typeof REFERRALS)[number]['id'];

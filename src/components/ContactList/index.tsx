import type { CSSProperties } from 'react';
import { getTranslations } from 'next-intl/server';
import type { AppLocale } from '@/i18n/routing';
import { CONTACTS } from '@/config/legal';

// Иконки — Boxicons (Free, CC BY 4.0, https://boxicons.com). viewBox='0 0 24 24' — у иконок не родного размера
import EnvelopeSVG from '@/assets/svg/support/envelope.svg';
import PhoneSVG from '@/assets/svg/support/phone.svg';
import TelegramSVG from '@/assets/svg/support/telegram.svg';
import ClockSVG from '@/assets/svg/support/clock.svg';

type Props = {
    locale: AppLocale;
    /** тема письма для ссылки mailto: — своя на каждой странице («Вопрос с сайта», «Заказ сайта») */
    mailSubject: string;
};

const accent = (color: string) => ({ '--accent': color }) as CSSProperties;

// Контакты владельца сайта (config/legal.ts): почта, телефон, Telegram и часы ответа. Общий блок для
// /menu/support (колонка справа) и /menu/cooperation. Подписи — Contacts.* в messages/*.json
export default async function ContactList({ locale, mailSubject }: Props) {
    const t = await getTranslations({ locale, namespace: 'Contacts' });

    const rows = [
        {
            key: 'email',
            icon: EnvelopeSVG,
            color: 'rgb(var(--bg-5))',
            label: t('email'),
            value: CONTACTS.email,
            href: `mailto:${CONTACTS.email}?subject=${encodeURIComponent(mailSubject)}`,
        },
        { key: 'phone', icon: PhoneSVG, color: '#0ca678', label: t('phone'), value: CONTACTS.phone.label, href: `tel:${CONTACTS.phone.tel}` },
        {
            key: 'telegram',
            icon: TelegramSVG,
            color: '#229ed9',
            label: t('telegram'),
            value: `@${CONTACTS.telegram.username}`,
            href: CONTACTS.telegram.url,
            external: true,
        },
    ];

    return (
        <ul className='grid gap-8'>
            {rows.map(({ key, icon: Icon, color, label, value, href, external }) => (
                <li key={key}>
                    <a
                        href={href}
                        className='page-nav-head hover-none flex nowrap align-center gap-12 pd-10 br-20 bg-2-3'
                        style={accent(color)}
                        {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                    >
                        <span className='icon-badge grid place-center w-36 h-36 br-round shrink-0' aria-hidden='true'>
                            <Icon width={20} height={20} viewBox='0 0 24 24' />
                        </span>
                        <span className='contact-value grid gap-2'>
                            <span className='font-12 color-2-80'>{label}</span>
                            <b className='color-2-90'>{value}</b>
                        </span>
                    </a>
                </li>
            ))}
            <li className='flex nowrap align-center gap-12 pd-10' style={accent('#7a5af8')}>
                <span className='icon-badge grid place-center w-36 h-36 br-round shrink-0' aria-hidden='true'>
                    <ClockSVG width={20} height={20} viewBox='0 0 24 24' />
                </span>
                <span className='grid gap-2'>
                    <span className='font-12 color-2-80'>{t('hoursLabel')}</span>
                    <b className='color-2-90'>{t('hours', CONTACTS.hours)}</b>
                </span>
            </li>
        </ul>
    );
}

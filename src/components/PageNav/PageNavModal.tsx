import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import ChevronDown from '@/assets/svg/chevron-down.svg';

export type PageNavLink = { label: string; href: string };
export type PageNavItem = { kicker: string; title: string; href: string; links?: PageNavLink[] };
/** Дополнительная ссылка под оглавлением: страница сайта (href вида `/sklad`) или внешний сайт (external) */
export type PageNavExtra = { label: string; href: string; external?: boolean; icon?: ReactNode };

export type PageNavModalProps = {
    title: string;
    items: PageNavItem[];
    onNavigate: () => void;
    /** раздел, который был на экране в момент открытия, — подсвечивается */
    activeHref?: string;
    /** краткая справка над оглавлением — готовая разметка с сервера (страница города) */
    summary?: ReactNode;
    extrasTitle?: string;
    extras?: PageNavExtra[];
};

// «Ozon в цифрах*» — звёздочка ссылается на сноску в самом разделе, в оглавлении она лишняя
const cleanKicker = (kicker: string) => kicker.replace(/\*+$/, '');

// Оглавление страницы: у каждого раздела номер в кружке, подпись и заголовок одной кликабельной строкой
// со стрелкой, под-разделы — «таблетками» под ней. Раздел, который сейчас на экране, подсвечен
// (.page-nav-item-active). Оформление состояний — .page-nav-* в style.scss, раскладка — утилитами.
export default function PageNavModal({ title, items, onNavigate, activeHref, summary, extrasTitle, extras }: PageNavModalProps) {
    return (
        <div className='pd-20'>
            <h2 className='font-18 mb-20'>{title}</h2>
            {summary}
            <ol className='grid gap-5'>
                {items.map((item, i) => {
                    const active = item.href === activeHref;

                    return (
                        <li className={`page-nav-item br-20${active ? ' page-nav-item-active' : ''}`} key={item.href}>
                            <a
                                href={item.href}
                                onClick={onNavigate}
                                aria-current={active ? 'location' : undefined}
                                className='page-nav-head hover-none flex nowrap align-center gap-12 pd-10 br-20'
                            >
                                <span className='page-nav-num grid place-center w-36 h-36 br-round shrink-0 font-12 font-w-700' aria-hidden='true'>
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <span className='grid gap-2 flex-1'>
                                    <span className='color-2-80 font-12'>{cleanKicker(item.kicker)}</span>
                                    <span className='color-2-90 font-w-500'>{item.title}</span>
                                </span>
                                <ChevronDown className='page-nav-arrow shrink-0 color-5-100' width={18} height={18} viewBox='0 0 24 24' aria-hidden='true' />
                            </a>
                            {item.links && item.links.length > 0 && (
                                <ul className='page-nav-sub flex gap-5'>
                                    {item.links.map((link) => (
                                        <li key={link.href}>
                                            <a
                                                href={link.href}
                                                onClick={onNavigate}
                                                className='page-nav-chip hover-none inline-flex nowrap align-center px-10 py-4 br-36 bg-2-7 color-2-90 font-12'
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ol>

            {extras && extras.length > 0 && (
                <>
                    {extrasTitle && <p className='color-2-80 font-12 mt-15 mb-7'>{extrasTitle}</p>}
                    <ul className='grid gap-5'>
                        {extras.map((extra) => {
                            const className = 'page-nav-head hover-none flex nowrap align-center gap-12 pd-10 br-20 bg-2-3';
                            const content = (
                                <>
                                    {extra.icon && (
                                        <span className='page-nav-num grid place-center w-36 h-36 br-round shrink-0' aria-hidden='true'>
                                            {extra.icon}
                                        </span>
                                    )}
                                    <span className='flex-1 color-2-90 font-w-500'>{extra.label}</span>
                                    {extra.external ? (
                                        <span className='shrink-0 color-5-100' aria-hidden='true'>↗</span>
                                    ) : (
                                        <ChevronDown className='page-nav-arrow shrink-0 color-5-100' width={18} height={18} viewBox='0 0 24 24' aria-hidden='true' />
                                    )}
                                </>
                            );

                            return (
                                <li key={extra.href}>
                                    {extra.external ? (
                                        <a href={extra.href} className={className} target='_blank' rel='nofollow noopener noreferrer'>
                                            {content}
                                        </a>
                                    ) : (
                                        <Link href={extra.href} onClick={onNavigate} className={className}>
                                            {content}
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
        </div>
    );
}

import type { ReactNode } from 'react';
import { getFormatter, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { LEGAL_UPDATED_AT } from '@/config/legal';

type Section = { id: string; title: string; content: ReactNode };

type Props = {
    locale: AppLocale;
    href: DocHref;
    title: string;
    lead?: ReactNode;
    sections: Section[];
};

// Документы сайта: ссылка и подпись в списке «Другие документы». Тексты документов — на русском (юридически
// значимая версия); на других языках над документом — пометка Legal.ruOnly
const DOCS = [
    { href: '/menu/about', title: 'О проекте' },
    { href: '/menu/privacy', title: 'Политика обработки персональных данных' },
    { href: '/menu/cookies', title: 'Cookie и согласие на аналитику' },
    { href: '/menu/terms', title: 'Пользовательское соглашение' },
    { href: '/menu/ads', title: 'Реклама и вознаграждение' },
] as const;

type DocHref = (typeof DOCS)[number]['href'];

// Общий вид документа: заголовок и дата редакции, текст разделами в карточке, справа — оглавление
// (якоря разделов) и другие документы. На телефоне колонка справа уходит под текст
export default async function LegalDoc({ locale, href, title, lead, sections }: Props) {
    const format = await getFormatter({ locale });
    const tLegal = await getTranslations({ locale, namespace: 'Legal' });
    const tMenu = await getTranslations({ locale, namespace: 'MenuPage' });
    const updated = format.dateTime(new Date(LEGAL_UPDATED_AT), { dateStyle: 'long' });

    return (
        <main>
            {/* одна секция: у первой секции страницы высота «почти во весь экран» (style.scss) */}
            <section>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{tMenu('docsTitle')}</p>
                    <h1 className='mb-7 color-2-90 text-balance'>{title}</h1>
                    <p className='font-14 color-2-80 mb-15'>{tLegal('updated', { date: updated })}</p>
                    {locale !== 'ru' && (
                        <p lang={locale} className='max-w-60-ch mb-15 pd-15 br-20 bg-5-10 color-5-100 font-14'>{tLegal('ruOnly')}</p>
                    )}
                    {lead && <div className='max-w-60-ch mb-20'>{lead}</div>}

                    <div className='flex row-flush' lang='ru'>
                        <div className='f-w-8 mb-20'>
                            <article className='legal grid gap-15 pd-20 br-20 bg-3-100 border-1px-2-10 shadow-3'>
                                {sections.map((section, i) => (
                                    <section className='scroll-anchor grid gap-10' id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
                                        <h2 className='menu-title color-2-90' id={`${section.id}-title`}>
                                            {i + 1}. {section.title}
                                        </h2>
                                        {section.content}
                                    </section>
                                ))}
                            </article>
                        </div>

                        <div className='f-w-4 mb-20'>
                            {/* колонка тянется на высоту ряда (flex), внутри неё оглавление «едет» за прокруткой */}
                            <aside className='sticky-aside grid gap-15 content-start'>
                                <nav className='grid gap-8 pd-20 br-20 bg-2-3 font-14' aria-labelledby='legal-toc-title'>
                                    <b className='color-2-90' id='legal-toc-title'>Содержание</b>
                                    <ol className='grid gap-5'>
                                        {sections.map((section, i) => (
                                            <li key={section.id}>
                                                <a href={`#${section.id}`} className='color-5-100'>
                                                    {i + 1}. {section.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ol>
                                </nav>
                                <nav className='grid gap-8 pd-20 br-20 bg-2-3 font-14' aria-labelledby='legal-docs-title'>
                                    <b className='color-2-90' id='legal-docs-title'>Документы сайта</b>
                                    <ul className='grid gap-5'>
                                        {DOCS.map((doc) => (
                                            <li key={doc.href}>
                                                {doc.href === href ? (
                                                    <span className='color-2-90 font-w-500' aria-current='page'>{doc.title}</span>
                                                ) : (
                                                    <Link href={doc.href} className='color-5-100'>{doc.title}</Link>
                                                )}
                                            </li>
                                        ))}
                                        <li>
                                            <Link href='/menu/cooperation' className='color-5-100'>Сотрудничество и контакты</Link>
                                        </li>
                                    </ul>
                                </nav>
                                <Link href='/menu' className='color-5-100 font-14'>← Назад в меню</Link>
                            </aside>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

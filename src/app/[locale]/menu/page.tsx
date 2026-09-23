import type { Metadata } from 'next';
import { getLocaleFromParams } from '@/i18n/params';
import { getTranslations } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/seo';
import { Link } from '@/i18n/navigation';
import HotSVG from '@/assets/svg/hot.svg';

type Props = {
    params: Promise<{ locale: string }>;
};

type MenuItem = { title: string; text: string; href: string };

// Иконка у каждого пункта своя пока только цветом — реальных SVG под каждый раздел ещё нет,
// везде hot.svg на замену (заглушка для теста вёрстки, обсуждали с владельцем).
const ITEM_COLORS = ['#0b5bff', '#12b76a', '#f79009', '#7a5af8', '#0bc5c5', '#f04438'];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'MenuPage' });
    const tMeta = await getTranslations({ locale, namespace: 'Metadata' });

    return buildPageMetadata({
        locale,
        href: '/menu',
        title: t('title'),
        description: t('description'),
        siteName: tMeta('siteName'),
    });
}

export default async function MenuPage({ params }: Props) {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'MenuPage' });
    const tMeta = await getTranslations({ locale, namespace: 'Metadata' });
    const items = t.raw('items') as MenuItem[];

    return (
        <main>
            <section>
                <div className="container">
                    <p className="color-5-100 font-14">{tMeta('siteName')}</p>
                    <h1 className="mb-7 color-2-90 text-balance">{t('heading')}</h1>
                    <p className="max-w-60-ch mb-20">{t('lead')}</p>

                    <ul className="flex row-flush">
                        {items.map((item, i) => (
                            <li className="f-w-6 mb-15" key={item.href}>
                                <Link href={item.href} className="block h-full hover-none">
                                    <div className="flex nowrap align-center gap-14 h-full pd-20 br-20 bg-3-100 border-1px-2-10 shadow-3 translate_0_5 tr-2">
                                        <span
                                            className="grid place-center shrink-0 w-46 h-46 br-round"
                                            style={{
                                                background: `${ITEM_COLORS[i % ITEM_COLORS.length]}1a`,
                                                color: ITEM_COLORS[i % ITEM_COLORS.length],
                                            }}
                                        >
                                            <HotSVG width={22} height={22} aria-hidden="true" />
                                        </span>
                                        <span className="grid gap-2">
                                            <b className="color-2-90">{item.title}</b>
                                            <span className="font-14 color-2-80">{item.text}</span>
                                        </span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </main>
    );
}

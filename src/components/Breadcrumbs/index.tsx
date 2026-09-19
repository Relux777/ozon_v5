import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import styles from './breadcrumbs.module.scss';

type Item = { label: string; href?: string };

export default async function Breadcrumbs({ items }: { items: Item[] }) {
    const t = await getTranslations('A11y');

    return (
        <nav aria-label={t('breadcrumbs')} className="mb-15">
            <ol className={`flex gap-7 ${styles.list}`}>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={item.label}>
                            {item.href && !isLast ? (
                                <Link href={item.href}>{item.label}</Link>
                            ) : (
                                <span className="color-2-80" aria-current={isLast ? 'page' : undefined}>
                                    {item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

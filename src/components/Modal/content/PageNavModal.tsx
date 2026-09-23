export type PageNavLink = { label: string; href: string };
export type PageNavItem = { kicker: string; title: string; href: string; links?: PageNavLink[] };

type Props = {
    title: string;
    items: PageNavItem[];
    onNavigate: () => void;
};

// Минималистичное дерево-оглавление: подпись раздела, под ней с отступом — заголовок-ссылка,
// и если у раздела есть под-темы — ещё один отступ под них. Разделитель — тонкая линия под каждым
// пунктом (border-b-1px-1-10), подсветка при наведении — .page-nav-link в style.scss.
export default function PageNavModal({ title, items, onNavigate }: Props) {
    return (
        <div className='pd-20'>
            <h2 className='font-18 mb-20'>{title}</h2>
            <ul className='grid'>
                {items.map((item) => (
                    <li className='grid gap-5 pb-12 border-b-1px-1-10' key={item.href}>
                        <p className='color-2-80 font-12'>{item.kicker}</p>
                        <a href={item.href} onClick={onNavigate} className='page-nav-link block py-5 br-8 pl-10 color-5-100 font-w-500'>
                            {item.title}
                        </a>
                        {item.links && (
                            <ul className='grid gap-1'>
                                {item.links.map((link) => (
                                    <li key={link.href}>
                                        <a href={link.href} onClick={onNavigate} className='page-nav-link block py-5 br-8 pl-20 color-5-100 font-14'>
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

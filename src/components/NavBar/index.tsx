// app/components/NavBar/index.tsx
'use client';

import { useTranslations } from 'next-intl';
import { usePathname, Link } from '@/i18n/navigation';
import styles from './nav.module.scss';

import HomeSVG from '@/assets/svg/home.svg';
import HotSVG from '@/assets/svg/hot.svg';
import LocationSVG from '@/assets/svg/location.svg';
import MenuSVG from '@/assets/svg/menu.svg';

const NavBarLink = [
    { href: '/', labelKey: 'home', icon: HomeSVG },
    { href: '/a', labelKey: 'promotions', icon: HotSVG },
    { href: '/sklad', labelKey: 'warehouses', icon: LocationSVG },
    { href: '/menu', labelKey: 'menu', icon: MenuSVG },
] as const;

export default function NavBarComponent() {
    const pathname = usePathname();
    const t = useTranslations('NavBar');

    return (
        <div className={`p-fixed w-full z-10 ${styles.nav}`}>
            <nav className="flex justify-center align-center gap-5 p-events-none">
                <ul className={`flex nowrap overflow-hidden p-relative br-36 shadow-1 blur-7 p-events-all ${styles.ul} ${styles.home}`}>
                    {NavBarLink.map((link) => {
                        const Icon = link.icon;
                        const isActive = link.href === '/'
                            ? pathname === link.href
                            : pathname === link.href || pathname.startsWith(`${link.href}/`);

                        const itemClasses = `flex column align-center justify-center p-relative z-10 gap-3 active_scale_09 ${styles.link} ${isActive ? styles.active : ''}`;

                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={itemClasses}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    <Icon className={styles.nav_icon} width={24} height={24} aria-hidden="true" />
                                    <span className="block">{t(link.labelKey)}</span>
                                </Link>
                            </li>
                        );
                    })}

                    <li aria-hidden="true">
                        <div className={`${styles.slider} p-absolute t-0 l-0 br-36 shadow-2 bg-2-10 visible tr-bezier-5`} ></div>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
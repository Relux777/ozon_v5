import HomeSVG from '@/assets/svg/home.svg';
import HotSVG from '@/assets/svg/hot.svg';
import LocationSVG from '@/assets/svg/location.svg';
import MenuSVG from '@/assets/svg/menu.svg';

// Те же 4 пункта и иконки, что у настоящего меню (components/NavBar). Подписи приходят с сервера — словарь NavBar
export const NAV_ITEMS = [
    { href: '/', icon: HomeSVG },
    { href: '/stocks', icon: HotSVG },
    { href: '/sklad', icon: LocationSVG },
    { href: '/menu', icon: MenuSVG },
] as const;

export type VariantProps = {
    labels: readonly string[];
    /** подпись <nav> для скринридеров: варианты стоят на одной странице, их надо различать */
    ariaLabel: string;
};

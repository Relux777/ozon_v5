//app/src/components/Header/index.tsx

import { Link } from '@/i18n/navigation';

import { getLocale, getTranslations } from 'next-intl/server';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeSwitch from "@/components/ui/theme-switch";
import { getLanguageByCode } from '@/config/languages';
import { THEME_COLORS } from '@/config/site';

import LogoIcon from '@/assets/svg/logo.svg';

import styles from './header.module.scss'

export default async function HeaderComponent() {

    // ступеней размытия 10 ($layers-count в header.module.scss), но слоёв 9: у десятой blur(0) — она ничего
    // не размывала, а отдельный слой с backdrop-filter всё равно пересчитывался на каждом кадре прокрутки
    const BLUR_LAYERS_COUNT = 9;
    const t = await getTranslations('LanguageModal');
    const headerT = await getTranslations('Header');
    // флаг и название текущего языка — на сервере: так 7 SVG-флагов не попадают в общий клиентский JS
    // (весь список нужен только в модалке выбора языка, она грузится отдельным чанком)
    const { label: languageLabel, flag: Flag } = getLanguageByCode(await getLocale());

    return (
        <header className={`p-sticky t-0 z-20 ${styles.header}`}>

            <div className={`p-absolute p-events-none overflow-hidden ${styles.headerBlur}`} aria-hidden="true">
                {Array.from({ length: BLUR_LAYERS_COUNT }).map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: слои одинаковые и не переставляются — номер и есть их ключ
                    <div key={i} className={`p-absolute inset-0 ${styles.headerBlurLayer}`} />
                ))}
            </div>

            <nav className="container flex justify-between align-center h-60">
                <ul className='flex align-center gap-10'>
                    <li>
                        {/* Link из next-intl сохраняет текущую локаль */}
                        <Link href="/" className={`flex align-center gap-5 hover-80 ${styles.logo}`}>
                            <LogoIcon style={{ width: '30px', height: '30px' }} aria-hidden="true" />
                            <span className='font-22 space-nowrap'>{headerT('title')}</span>
                        </Link>
                    </li>
                </ul>
                <ul className='flex align-center gap-10'>
                    <li>
                        <LanguageSwitcher
                            modalTitle={t('title')}
                            label={languageLabel}
                            flag={<Flag width={22} height={22} aria-hidden="true" />}
                        />
                    </li>
                    <li><span className={`block bg-2-20 ${styles.gap}`}></span></li>
                    <li>
                        <ThemeSwitch themeColors={THEME_COLORS} />
                    </li>
                </ul>
            </nav>
        </header>
    )
}

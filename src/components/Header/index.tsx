import Link from 'next/link'

import LanguageSwitcher from "@/hook/LanguageSwitcher";
import ThemeSwitch from "@/hook/ThemeSwitch";

import LogoIcon from '@/assets/svg/logo.svg';

import styles from './header.module.scss'

export default function HeaderComponent() {

    const BLUR_LAYERS_COUNT = 10;

    return (
        <header className={`p-sticky t-0 z-20 ${styles.header}`}>

            <div className={`p-absolute p-events-none overflow-hidden ${styles.headerBlur}`} aria-hidden="true">
                {Array.from({ length: BLUR_LAYERS_COUNT }).map((_, i) => (
                    <div key={i} className={`p-absolute inset-0 ${styles.headerBlurLayer}`} />
                ))}
            </div>

            <nav className="container flex justify-between align-center h-60">
                <ul className='flex align-center gap-10'>
                    <li>
                        <Link href="/" className={`flex align-center gap-5 hover-80 ${styles.logo}`}>
                            <LogoIcon style={{ width: '30px', height: '30px' }} />
                            <h2 className='font-22'>Озон Работа</h2>
                        </Link>
                    </li>
                </ul>
                <ul className='flex align-center gap-10'>
                    <li>
                        <LanguageSwitcher />
                    </li>
                    <li><span className={`block bg-2-20 ${styles.gap}`}></span></li>
                    <li>
                        <ThemeSwitch />
                    </li>
                </ul>
            </nav>
        </header>
    )
}
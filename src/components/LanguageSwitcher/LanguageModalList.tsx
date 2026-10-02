// src/components/LanguageSwitcher/LanguageModalList.tsx

'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

import CheckSVG from '@/assets/svg/check.svg';
import { LANGUAGES } from '@/config/languages';

export default function LanguageModalList() {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleSelect(code: (typeof LANGUAGES)[number]['code']) {
        if (code === locale) return;

        // сохраняем query (?utm_source=… и т.п.), иначе при смене языка теряется рекламная метка
        const query = Object.fromEntries(new URLSearchParams(window.location.search));

        startTransition(() => {
            router.replace({ pathname, query }, { locale: code });
        });
    }

    return (
        <ul aria-busy={isPending}>
            {LANGUAGES.map(({ code, label, flag: Flag }) => {
                const isActive = code === locale;

                return (
                    <li key={code}>
                        <button
                            type="button"
                            className={`flex align-center justify-between pd-10 br-8 w-full bg-2-3 mb-7 hover-80 ${isActive ? 'active' : ''}`}
                            onClick={() => handleSelect(code)}
                            disabled={isPending}
                            aria-pressed={isActive}
                        >
                            <div className='flex align-center gap-7'>
                                <Flag width={22} height={22} />
                                <span>{label}</span>
                            </div>
                            <CheckSVG
                                width={16}
                                height={16}
                                className={isActive ? '' : 'visibility-hidden'}
                                fill='#005bff'
                                viewBox="0 0 24 24"
                            />
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
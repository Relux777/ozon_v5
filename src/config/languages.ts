import type { AppLocale } from '@/i18n/routing';

import Flag_ru from '@/assets/svg/Language/ru.svg';
import Flag_uz from '@/assets/svg/Language/uz.svg';
import Flag_am from '@/assets/svg/Language/am.svg';
import Flag_az from '@/assets/svg/Language/az.svg';
import Flag_ge from '@/assets/svg/Language/ge.svg';
import Flag_kg from '@/assets/svg/Language/kg.svg';
import Flag_kz from '@/assets/svg/Language/kz.svg';

export const LANGUAGES: { code: AppLocale; label: string; flag: typeof Flag_ru }[] = [
    { code: 'ru', label: 'Русский', flag: Flag_ru },
    { code: 'uz', label: "O'zbekcha", flag: Flag_uz },
    { code: 'hy', label: 'Հայերեն', flag: Flag_am },
    { code: 'az', label: 'Azərbaycanca', flag: Flag_az },
    { code: 'ka', label: 'ქართული', flag: Flag_ge },
    { code: 'ky', label: 'Кыргызча', flag: Flag_kg },
    { code: 'kk', label: 'Қазақша', flag: Flag_kz },
];

export function getLanguageByCode(code: string) {
    return LANGUAGES.find((lang) => lang.code === code) ?? LANGUAGES[0];
}
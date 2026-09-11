// app/src/components/Modal/content/LanguageModal.tsx
import CheckSVG from '@/assets/svg/check.svg';

import Flag_ru from '@/assets/svg/Language/ru.svg';
import Flag_am from '@/assets/svg/Language/am.svg';
import Flag_az from '@/assets/svg/Language/az.svg';
import Flag_ge from '@/assets/svg/Language/ge.svg';
import Flag_kg from '@/assets/svg/Language/kg.svg';
import Flag_kz from '@/assets/svg/Language/kz.svg';
import Flag_uz from '@/assets/svg/Language/uz.svg';

const LanguageContent = [
    { code: 'ru', label: 'Русский', flag: Flag_ru },
    { code: 'uz', label: 'Узбекский', flag: Flag_uz },
    { code: 'am', label: 'Армянский', flag: Flag_am },
    { code: 'az', label: 'Азербайджанский', flag: Flag_az },
    { code: 'ge', label: 'Грузинский', flag: Flag_ge },
    { code: 'kg', label: 'Киргизский', flag: Flag_kg },
    { code: 'kz', label: 'Казахский', flag: Flag_kz },
];

export default function LanguageModal() {
    return (
        <main className="text_center pd-20">
            <header className='mb-15'>
                <h2>Выберите язык</h2>
            </header>
            <ul>
                {LanguageContent.map(({ code, label, flag: Flag }) => (
                    <li key={code}>
                        <button className='flex align-center justify-between pd-10 br-8 w-full bg-2-3 mb-7 hover-80'>
                            <div className='flex align-center gap-7'>
                                <Flag width={22} height={22} />
                                <span>{label}</span>
                            </div>
                            <CheckSVG width={16} height={16} className='visibility-hidden' viewBox="0 0 24 24" />
                        </button>
                    </li>
                ))}
            </ul>
        </main>
    );
}
// src/components/RatingCalculator/index.tsx
'use client';

import { useId, useState } from 'react';
import ChevronDownSVG from '@/assets/svg/chevron-down.svg';

type Option = { label: string; value: number };

type Props = {
    locale: string;
    /** производительность: подпись → баллы (отрицательные — списание за низкую производительность) */
    productivity: Option[];
    /** ранняя запись: подпись → надбавка в % к положительным баллам */
    early: Option[];
    /** выбранные по умолчанию строки (индексы) — чтобы серверный HTML сразу показывал осмысленный пример */
    defaultProductivity: number;
    defaultEarly: number;
    /** подписи приходят с сервера — клиентскому компоненту не нужны свои переводы */
    labels: {
        productivity: string;
        early: string;
        result: string;
        /** шаблон с {base} и {bonus} — подставляется здесь */
        formula: string;
        noBonus: string;
        /** формы слова «балл» по правилам множественного числа языка (one/few/many/other…) */
        pointsForms: Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };
    };
};

type PickerProps = {
    id: string;
    label: string;
    options: Option[];
    value: number;
    onChange: (index: number) => void;
};

// Выпадающий список: нативный <select> (клавиатура, скринридеры, системный список на телефоне без поддержки
// base-select) + своя стрелка поверх. Оформление и анимация открытия — .calc-select* в style.scss
function Picker({ id, label, options, value, onChange }: PickerProps) {
    return (
        <label className='f-w-6 grid gap-5 mb-15' htmlFor={id}>
            <span className='font-14 font-w-500 color-2-90'>{label}</span>
            <span className='calc-select-wrap p-relative block'>
                <select
                    id={id}
                    className='calc-select w-full h-46 px-16 br-20 bg-2-7 font-16 cursor-pointer'
                    value={value}
                    onChange={(event) => onChange(Number(event.target.value))}
                >
                    {options.map((option, i) => (
                        <option value={i} key={option.label}>{option.label}</option>
                    ))}
                </select>
                <ChevronDownSVG className='calc-select-icon p-absolute' width={20} height={20} aria-hidden='true' />
            </span>
        </label>
    );
}

// Калькулятор баллов за слот: баллы за производительность + надбавка за раннюю запись (процент от них).
// Надбавка только к начислению: при списании за низкую производительность её нет.
export default function RatingCalculator({ locale, productivity, early, defaultProductivity, defaultEarly, labels }: Props) {
    const id = useId();
    const [p, setP] = useState(defaultProductivity);
    const [e, setE] = useState(defaultEarly);

    const base = productivity[p].value;
    const bonus = base > 0 ? early[e].value : 0;
    const total = Math.round(base * (1 + bonus / 100));
    const plural = new Intl.PluralRules(locale).select(Math.abs(total));
    // «−» (минус), а не дефис: так число читается и не переносится
    const sign = total > 0 ? '+' : total < 0 ? '−' : '';

    return (
        <div className='grid gap-15'>
            <div className='flex row-flush'>
                <Picker id={`${id}-p`} label={labels.productivity} options={productivity} value={p} onChange={setP} />
                <Picker id={`${id}-e`} label={labels.early} options={early} value={e} onChange={setE} />
            </div>

            {/* итог — синий, как «Вознаграждение» в формуле выплаты на главной; aria-live — скринридер озвучит пересчёт */}
            <div className='formula-result grid gap-5 br-20 pd-20' aria-live='polite'>
                <span className='font-12 text-uppercase letter-s-8'>{labels.result}</span>
                {/* key={total}: при каждом пересчёте число пересоздаётся — и заново играет анимация .calc-value */}
                <b className='calc-value inline-block font-36 font-w-700' key={total}>
                    {sign}
                    {Math.abs(total)} <span className='font-18 font-w-500'>{labels.pointsForms[plural] ?? labels.pointsForms.other}</span>
                </b>
                <span className='font-14'>
                    {base > 0
                        ? labels.formula.replace('{base}', String(base)).replace('{bonus}', String(bonus))
                        : labels.noBonus}
                </span>
            </div>
        </div>
    );
}

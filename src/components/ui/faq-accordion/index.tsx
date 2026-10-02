'use client';

import { useEffect, useState } from 'react';

type Item = { title: string; text: string };

type Props = {
    items: Item[];
    /** какой пункт открыт сразу (-1 — ни один); по умолчанию первый */
    defaultOpen?: number;
    /**
     * Префикс id пунктов: `${idPrefix}-1`, `${idPrefix}-2`… Со ссылкой вида /menu/support#q-money-2
     * нужный вопрос сразу откроется (и при переходе по такой ссылке на этой же странице)
     */
    idPrefix?: string;
};

// Тот же вид, что был у нативных <details name="pay-tips">, но раскрытие анимировано (grid-rows
// 0fr → 1fr в style.scss, у .tip/.tip-summary) и открыт всегда только один пункт.
export default function FaqAccordion({ items, defaultOpen = 0, idPrefix }: Props) {
    const [openIndex, setOpenIndex] = useState(defaultOpen);

    useEffect(() => {
        if (!idPrefix) return;
        const openFromHash = () => {
            const match = window.location.hash.match(new RegExp(`^#${idPrefix}-(\\d+)$`));
            const index = match ? Number(match[1]) - 1 : -1;
            if (index >= 0 && index < items.length) setOpenIndex(index);
        };
        openFromHash();
        window.addEventListener('hashchange', openFromHash);
        return () => window.removeEventListener('hashchange', openFromHash);
    }, [idPrefix, items.length]);

    return (
        <div className='grid gap-8'>
            {items.map((item, i) => {
                const open = i === openIndex;

                return (
                    <div
                        className={`tip bg-3-100 br-20 border-1px-2-10${open ? ' tip-open' : ''}${idPrefix ? ' scroll-anchor' : ''}`}
                        id={idPrefix && `${idPrefix}-${i + 1}`}
                        key={item.title}
                    >
                        <button
                            type='button'
                            className='tip-summary hover-none text_left flex nowrap justify-between align-center gap-10 w-full font-w-500 color-2-90 cursor-pointer'
                            aria-expanded={open}
                            onClick={() => setOpenIndex(open ? -1 : i)}
                        >
                            {item.title}
                        </button>
                        <div className='tip-body'>
                            <div className='tip-body-inner overflow-hidden'>
                                <p className='font-14'>{item.text}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

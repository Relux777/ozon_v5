'use client';

import { useState } from 'react';

type Item = { title: string; text: string };

// Тот же вид, что был у нативных <details name="pay-tips">, но раскрытие анимировано (grid-rows
// 0fr → 1fr в style.scss, у .tip/.tip-summary) и открыт всегда только один пункт.
export default function FaqAccordion({ items }: { items: Item[] }) {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className='grid gap-8'>
            {items.map((item, i) => {
                const open = i === openIndex;

                return (
                    <div className={`tip bg-3-100 br-20 border-1px-2-10${open ? ' tip-open' : ''}`} key={item.title}>
                        <button
                            type='button'
                            className='tip-summary hover-none flex nowrap justify-between align-center gap-10 w-full font-w-500 color-2-90 cursor-pointer'
                            aria-expanded={open}
                            onClick={() => setOpenIndex(open ? -1 : i)}
                        >
                            {item.title}
                        </button>
                        <div className='tip-body'>
                            <div className='tip-body-inner'>
                                <p className='font-14'>{item.text}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

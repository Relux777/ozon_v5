import type { ReactNode } from 'react';
import Image from 'next/image';
import HeroIMG from '@/assets/img/pg1.webp';

// Кнопки первого экрана — одинаковые на главной и на страницах городов. На телефоне (≤620px, m-w-full)
// каждая во всю ширину с текстом по центру: две кнопки разной длины в ряд на 360–400px переносились «лесенкой»
export const HERO_PRIMARY_BTN =
    'flex align-center justify-center m-w-full bg-5-100 hover-none hover-bg-5-80 br-36 h-46 px-24 color-6-100 translate_0_2 shadow-1';
export const HERO_SECONDARY_BTN =
    'flex align-center justify-center m-w-full bg-2-7 hover-none br-36 h-46 px-24 color-2-100 translate_0_2 blur-7 touch-no-blur shadow-3';

type Props = {
    /** над подзаголовком — например, хлебные крошки на странице города */
    top?: ReactNode;
    kicker: string;
    heading: string;
    lead: string;
    features: string[];
    /** кнопки под списком (ссылки с классами HERO_*_BTN) */
    actions: ReactNode;
    imageAlt: string;
};

// Первый экран: текст слева, «парящая» иллюстрация справа. Должен быть первой <section> в <main> —
// высота «почти во весь экран» и размер картинки заданы в style.scss через main section:first-of-type
export default function Hero({ top, kicker, heading, lead, features, actions, imageAlt }: Props) {
    return (
        <section>
            <div className="container flex align-center">
                <div className="f-w-8">
                    {top}
                    <p className="color-5-100 font-14">{kicker}</p>
                    <h1 className="color-2-90">{heading}</h1>
                    <p className='font-16 max-w-60-ch'>{lead}</p>
                    <ul className='font-14 checks-li grid gap-7 mb-20'>
                        {features.map((feature) => (
                            <li className='p-relative pl-30' key={feature}>{feature}</li>
                        ))}
                    </ul>
                    <div className='flex gap-15'>
                        {actions}
                    </div>
                </div>
                <div className="f-w-4">
                    <div className='home-img grid justify-i-center pb-12'>
                        {/* ширина картинки ограничена 340px (style.scss → .home-img img) на любом экране:
                            было 70vw — на телефоне браузер брал версию меньше, чем нужно для чёткости */}
                        <Image
                            className='float w-full'
                            src={HeroIMG}
                            alt={imageAlt}
                            sizes='340px'
                            loading='eager'
                            fetchPriority='high'
                        />
                        <span className='shadow float-shadow h-20 mt-15 p-events-none' aria-hidden='true'></span>
                    </div>
                </div>
            </div>
        </section>
    );
}

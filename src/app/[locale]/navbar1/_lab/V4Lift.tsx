'use client';

import type { VariantProps } from './items';
import OurDraggableBar from './OurDraggableBar';

// 4. Наш вариант с анимацией «жидкого стекла» из iOS: при нажатии слайдер переезжает под палец и плавно растёт,
// пока палец прижат (через 0,3 с — ещё немного), становится прозрачнее, иконка под ним увеличивается.
// Отпустили — пружинисто садится на место. Тянуть тоже можно
export default function V4Lift(props: VariantProps) {
    return <OurDraggableBar {...props} mode='lift' />;
}

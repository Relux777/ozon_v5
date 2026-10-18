'use client';

import type { VariantProps } from './items';
import OurDraggableBar from './OurDraggableBar';

// 2. Наш вариант + слайдер тянется пальцем или мышью: растягивается от скорости, подсвечивает пункт под собой,
// отпущенный доезжает до ближайшего пункта (резкий бросок — до следующего). Нажатие на пункт — как раньше
export default function V2Drag(props: VariantProps) {
    return <OurDraggableBar {...props} mode='drag' />;
}

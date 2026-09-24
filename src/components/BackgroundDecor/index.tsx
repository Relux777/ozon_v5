import ParticlesLazy from './ParticlesLazy'
import styles from './background.module.scss'

import Image from 'next/image'
// Пятна — размытые градиенты: хранятся в 1/4 размера и растягиваются браузером до исходного
// (разница после наложения на фон — не больше 6/255 на канал, на глаз не видна).
// Было: оригиналы 1266×1211 и 1833×1822 без sizes — оптимизатор отдавал их как w=3840, ~260 КБ на каждой странице.
// Исходники (docs-left.webp / docs-right.webp) лежат рядом — если нужно будет перегенерировать.
import DocsLeft from './docs-left-sm.webp'
import DocsRight from './docs-right-sm.webp'

export default function BackgroundDecor() {
  const imageClasses = "p-relative z-minus p-events-none u-select-none";

  return (
    <div className={`w-full h-full p-fixed p-events-none u-select-none ${styles.background}`}>
        <ParticlesLazy className={`w-full h-full p-events-none u-select-none ${styles.canvas}`} />
        <div className={`p-fixed  ${styles.left}`} >
          {/* unoptimized: файл уже маленький webp, пережатие оптимизатором его только увеличит */}
          <Image
            src={DocsLeft}
            width={1266}
            height={1211}
            unoptimized
            alt=""
            className={imageClasses}
            draggable={false}
            fetchPriority="low"
          />
        </div>
        <div className={`p-fixed ${styles.right}`} >
          <Image
            src={DocsRight}
            width={1833}
            height={1822}
            unoptimized
            alt=""
            className={imageClasses}
            draggable={false}
            fetchPriority="low"
          />
        </div>
    </div>
  )
}

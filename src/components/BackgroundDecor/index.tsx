import ParticlesLazy from './ParticlesLazy'
import styles from './background.module.scss'

import Image from 'next/image'
// Пятна — размытые градиенты: хранятся в 1/8 размера (158×151 и 229×228, ~7 КБ) и растягиваются браузером
// до исходного; отличие от оригинала после наложения на фон — то же, что было у версии в 1/4 (до ~5/255 на канал).
// Маленький собственный размер важен и для скорости: растянутая картинка считается для LCP не больше своего
// размера, поэтому фоновое пятно не может стать «самым крупным элементом» вместо заголовка и картинки героя
// (в 1/4 оно им становилось — LCP ждал ленивую декоративную картинку, ~4 с на телефоне в Lighthouse).
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
            // всегда на первом экране: lazy только откладывал загрузку до раскладки; низкий приоритет — после важного
            loading="eager"
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
            loading="eager"
            fetchPriority="low"
          />
        </div>
    </div>
  )
}

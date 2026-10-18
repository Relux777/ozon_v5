// Рисунки бренда «РенДит Работа»: сердце в два каллиграфических мазка и буква «Р», нарисованная так же — кистью
// (мазки с острыми концами и переменной толщиной, а не шрифт). Из них собраны варианты логотипа (LOGOS).
// Файл подключает scripts/brand-assets.cjs: на сайте используются сердце в два мазка (шапка) и залитое сердце (значки);
// остальные варианты выгружаются по просьбе — node scripts/brand-assets.cjs --logos (папка brand-logos/).

const RED = '#e5243f'; // бренд: --color-rendit-job в style.scss и BRAND_COLOR в src/config/site.ts
const RED_LIGHT = '#f6455c';
const RED_DARK = '#d81b43';

// сердце в рамке 100×100: левый и правый мазок
const HEART = [
    'M54 23C45 9 24 6 12 19C-1 33 6 55 22 69C31 77 41 83 48 90C43 81 36 73 30 66C19 53 17 37 25 28C33 19 46 18 54 23Z',
    'M50 32C57 14 79 8 90 21C101 35 93 57 78 70C69 78 59 85 54 94C58 83 65 75 72 67C83 54 85 38 78 29C70 20 57 21 50 32Z',
];
// то же сердце одной залитой фигурой: внешние края обоих мазков
const HEART_SOLID = 'M54 23C45 9 24 6 12 19C-1 33 6 55 22 69C31 77 42 84 51 93C58 85 69 78 78 70C93 57 101 35 90 21C79 8 57 14 50 32Z';

// буква «Р» кистью, рамка 40×54: ножка-мазок с хвостиком влево и петля-полумесяц, которая начинается левее ножки
const LETTER = [
    'M14 5C18 15 18 32 12 44C10 48 6 51 1 52C7 46 9 38 9 28C9 19 10.5 11 14 5Z',
    'M2 11C14 -3 40 -1 40 16C40 31 23 34 12 31C23 30 32 26 32 16C32 5 16 4 2 11Z',
];
// та же буква плотнее — для залитого сердца и мелких размеров
const LETTER_BOLD = [
    'M13 5C19 15 19 34 10 53C7 37 6 17 13 5Z',
    'M3 10C15 -4 41 -1 41 16C41 31 24 35 12 31C22 29 31 26 31 16C31 6 17 5 3 10Z',
];

const paths = (list, fill) => list.map((d) => `<path fill="${fill}" d="${d}"/>`).join('');
const heart = (fill) => paths(HEART, fill);
// буква в нужном месте: x, y — левый верхний угол рамки буквы, scale — размер (1 = 40×54)
const letter = (x, y, scale, fill, list = LETTER) => `<g transform="translate(${x} ${y}) scale(${scale})">${paths(list, fill)}</g>`;
const gradient = `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${RED_LIGHT}"/><stop offset="1" stop-color="${RED_DARK}"/></linearGradient></defs>`;
// фон значка: квадрат со скруглением rx (50 — круг)
const plate = (rx) => `${gradient}<rect width="100" height="100" rx="${rx}" fill="url(#g)"/>`;
const inside = (x, y, scale, inner) => `<g transform="translate(${x} ${y}) scale(${scale})">${inner}</g>`;

// имя файла → рисунок в рамке 100×100
const LOGOS = {
    // ── сердце ──
    heart: heart(RED),
    'heart-solid': `<path fill="${RED}" d="${HEART_SOLID}"/>`,
    // ── сердце и «Р» ──
    'heart-r': heart(RED) + letter(36.5, 35.5, 0.68, RED),
    'heart-solid-r': `<path fill="${RED}" d="${HEART_SOLID}"/>${letter(37, 37, 0.66, '#fff', LETTER_BOLD)}`,
    // ── сердце и «РР» (РенДит Работа) ──
    'heart-rr': heart(RED) + letter(30.5, 40, 0.47, RED) + letter(49, 40, 0.47, RED),
    'heart-solid-rr': `<path fill="${RED}" d="${HEART_SOLID}"/>${letter(29, 38, 0.5, '#fff', LETTER_BOLD)}${letter(49, 38, 0.5, '#fff', LETTER_BOLD)}`,
    // ── монограммы ──
    // просто буква кистью
    r: letter(21, 8, 1.55, RED),
    // две буквы — «РенДит Работа»
    rr: letter(6, 18, 1.18, RED) + letter(46, 18, 1.18, RED),
    // «Р» с сердечком в петле
    'r-heart': letter(21, 8, 1.55, RED) + inside(45.5, 25.5, 0.17, `<path fill="${RED}" d="${HEART_SOLID}"/>`),
    // ── значки: белый знак на красном ──
    'badge-heart': plate(24) + inside(19, 20, 0.62, heart('#fff')),
    'badge-heart-r': plate(24) + inside(19, 20, 0.62, heart('#fff') + letter(36.5, 35.5, 0.68, '#fff', LETTER_BOLD)),
    'badge-r': plate(24) + letter(31, 22, 1.05, '#fff', LETTER_BOLD),
    'circle-heart-r': plate(50) + inside(22, 24, 0.56, heart('#fff') + letter(36.5, 35.5, 0.68, '#fff', LETTER_BOLD)),
    // тёмная плашка — для тёмных аватаров и подложек
    'badge-dark-heart': `<rect width="100" height="100" rx="24" fill="#111114"/>${inside(19, 20, 0.62, heart(RED))}`,
};

module.exports = { RED, HEART, HEART_SOLID, LOGOS, heart };

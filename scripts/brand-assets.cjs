// Файлы бренда «РенДит Работа». Рисунки (сердце в два мазка, залитое сердце, буква «Р» кистью) — в scripts/brand-logos.cjs.
// Запуск из корня проекта: node scripts/brand-assets.cjs
// Создаёт: src/assets/svg/logo.svg (шапка — сердце в два мазка), значки сайта из залитого сердца —
// src/app/{icon.svg,favicon.ico,apple-icon.png} (вкладка браузера и iOS) и public/icons/* (манифест: «установить на экран»),
// public/og.jpg (превью ссылок, 1200×630).
// С флагом --logos дополнительно выгружает все варианты логотипа (SVG и PNG 1024 px) в папку brand-logos/ в корне
// проекта — для аватаров, соцсетей, печати; на сайт они не попадают.
// Поменяли рисунок или цвет — правьте scripts/brand-logos.cjs (и BRAND_HEART / BRAND_COLOR в src/config/site.ts — для
// картинок превью городов) и запустите заново.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const { RED, HEART_SOLID, LOGOS, heart } = require('./brand-logos.cjs');

// цвет раздела (здесь — об Ozon): фон картинки превью; = SECTION_COLOR / SECTION_GRADIENT в src/config/site.ts
const SECTION = ['#0a44c0', '#0d5ef5', '#4a9cff'];

const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${inner}</svg>\n`;
// значок сайта — залитое красное сердце: scale — размер в рамке, background — подложка (без неё фон прозрачный)
const icon = (scale = 1, background = '') =>
    svg(
        `${background ? `<rect width="100" height="100" fill="${background}"/>` : ''}<g transform="translate(${50 - 50 * scale} ${50 - 50 * scale}) scale(${scale})"><path fill="${RED}" d="${HEART_SOLID}"/></g>`,
    );

const png = (source, size) => sharp(Buffer.from(source), { density: 600 }).resize(size, size).png().toBuffer();

// .ico — контейнер с PNG внутри (так умеют все браузеры): заголовок, по записи на размер, затем сами PNG
function ico(images) {
    const header = Buffer.alloc(6);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(images.length, 4);
    let offset = 6 + images.length * 16;
    const entries = images.map(({ size, data }) => {
        const entry = Buffer.alloc(16);
        entry.writeUInt8(size === 256 ? 0 : size, 0);
        entry.writeUInt8(size === 256 ? 0 : size, 1);
        entry.writeUInt16LE(1, 4);
        entry.writeUInt16LE(32, 6);
        entry.writeUInt32LE(data.length, 8);
        entry.writeUInt32LE(offset, 12);
        offset += data.length;
        return entry;
    });
    return Buffer.concat([header, ...entries, ...images.map((image) => image.data)]);
}

(async () => {
    const write = (file, data) => {
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, data);
        console.log(file, `${(data.length / 1024).toFixed(1)} КБ`);
    };

    // логотип в шапке — красное сердце в два мазка, без фона
    write('src/assets/svg/logo.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 100 100">${heart(RED)}</svg>\n`);

    // вкладка браузера — залитое сердце на прозрачном фоне
    write('src/app/icon.svg', icon());
    write('src/app/favicon.ico', ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(icon(), size) })))));
    // iOS прозрачность заливает чёрным и сам скругляет значок — подложка белая, во весь квадрат
    write('src/app/apple-icon.png', await png(icon(0.68, '#fff'), 180));

    // манифест: any — сердце на прозрачном фоне; maskable — белая подложка во весь квадрат, сердце в «безопасной зоне»
    // (центральные 80 %): Android обрезает такой значок кругом или скруглённым квадратом
    write('public/icons/icon-192.png', await png(icon(0.9), 192));
    write('public/icons/icon-512.png', await png(icon(0.9), 512));
    write('public/icons/icon-maskable-512.png', await png(icon(0.56, '#fff'), 512));

    // по просьбе (--logos) — все варианты логотипа в папку brand-logos/: SVG (вектор) и PNG 1024 px с прозрачным фоном
    if (process.argv.includes('--logos')) {
        fs.rmSync('brand-logos', { recursive: true, force: true });
        for (const [name, inner] of Object.entries(LOGOS)) {
            write(`brand-logos/${name}.svg`, svg(inner));
            write(`brand-logos/${name}.png`, await png(svg(inner), 1024));
        }
    }

    // превью ссылок: фон — цвет раздела, знак и название бренда, заголовок, справа — 3D-фигурка из «Ozon в цифрах»
    const W = 1200;
    const H = 630;
    const font = `font-family="Segoe UI, Arial, sans-serif"`;
    const og = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
        <defs>
            <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${SECTION[0]}"/><stop offset="0.55" stop-color="${SECTION[1]}"/><stop offset="1" stop-color="${SECTION[2]}"/></linearGradient>
            <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff" stop-opacity="0.26"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
        </defs>
        <rect width="${W}" height="${H}" fill="url(#bg)"/>
        <circle cx="960" cy="330" r="330" fill="url(#glow)"/>
        <circle cx="140" cy="640" r="260" fill="url(#glow)" opacity="0.6"/>
        <g transform="translate(72 62) scale(0.5)">${heart('#fff')}</g>
        <text x="134" y="100" ${font} font-size="34" font-weight="700" fill="#fff">РенДит Работа</text>
        <text x="72" y="268" ${font} font-size="58" font-weight="700" fill="#fff">Работа на складах Ozon</text>
        <text x="72" y="342" ${font} font-size="58" font-weight="700" fill="#fff">в вашем городе</text>
        <text x="72" y="408" ${font} font-size="28" fill="#fff" fill-opacity="0.92">Адреса складов, условия и доход по данным Ozon</text>
        <rect x="72" y="478" width="486" height="56" rx="28" fill="#fff" fill-opacity="0.18"/>
        <text x="98" y="515" ${font} font-size="24" font-weight="600" fill="#fff">Независимый сайт · не является Ozon</text>
    </svg>`;
    const figure = await sharp('src/assets/img/advantages/1.webp').resize({ height: 430 }).png().toBuffer();
    const figureMeta = await sharp(figure).metadata();
    write(
        'public/og.jpg',
        await sharp(Buffer.from(og))
            .composite([{ input: figure, left: W - figureMeta.width - 70, top: Math.round((H - 430) / 2) + 10 }])
            .jpeg({ quality: 86, mozjpeg: true })
            .toBuffer(),
    );
})();

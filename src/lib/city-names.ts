// Названия городов и регионов на разных языках. Только для сервера (вызывается из lib/sklad.ts).
//
// В данных (cities.json) названия русские. На языках с латиницей (en, uz, az) показываем латинское: люди ищут
// «Kazan», «Qozon», а не «Казань». Общепринятые формы (Moscow, Saint Petersburg, Qozon, …) и регионы — вручную,
// остальные города — транслитерацией по правилам языка. На остальных языках (кириллица, ka, hy) — русское название.

export type NameLocale = 'en' | 'uz' | 'az';

/** Регион (область, край, республика, округ), а не город — у регионов нет «г.» перед названием */
export function isRegion(name: string): boolean {
    return /(област|край|Республика|автономный округ)/i.test(name.replace(/\(.*\)/, ''));
}

type Names = Record<NameLocale, string>;

// «Основа» региона: Московская → Moscow / Moskva / Moskva (тип — область, край — добавляется ниже)
const REGION_BASES: Record<string, Names> = {
    Амурская: { en: 'Amur', uz: 'Amur', az: 'Amur' },
    Владимирская: { en: 'Vladimir', uz: 'Vladimir', az: 'Vladimir' },
    Волгоградская: { en: 'Volgograd', uz: 'Volgograd', az: 'Volqoqrad' },
    Воронежская: { en: 'Voronezh', uz: 'Voronej', az: 'Voronej' },
    Ивановская: { en: 'Ivanovo', uz: 'Ivanovo', az: 'İvanovo' },
    Кемеровская: { en: 'Kemerovo', uz: 'Kemerovo', az: 'Kemerovo' },
    Кировская: { en: 'Kirov', uz: 'Kirov', az: 'Kirov' },
    Костромская: { en: 'Kostroma', uz: 'Kostroma', az: 'Kostroma' },
    Ленинградская: { en: 'Leningrad', uz: 'Leningrad', az: 'Leninqrad' },
    Липецкая: { en: 'Lipetsk', uz: 'Lipetsk', az: 'Lipetsk' },
    Московская: { en: 'Moscow', uz: 'Moskva', az: 'Moskva' },
    Нижегородская: { en: 'Nizhny Novgorod', uz: 'Nijniy Novgorod', az: 'Nijni Novqorod' },
    Новосибирская: { en: 'Novosibirsk', uz: 'Novosibirsk', az: 'Novosibirsk' },
    Пензенская: { en: 'Penza', uz: 'Penza', az: 'Penza' },
    Ростовская: { en: 'Rostov', uz: 'Rostov', az: 'Rostov' },
    Рязанская: { en: 'Ryazan', uz: 'Ryazan', az: 'Ryazan' },
    Самарская: { en: 'Samara', uz: 'Samara', az: 'Samara' },
    Свердловская: { en: 'Sverdlovsk', uz: 'Sverdlovsk', az: 'Sverdlovsk' },
    Тамбовская: { en: 'Tambov', uz: 'Tambov', az: 'Tambov' },
    Тверская: { en: 'Tver', uz: 'Tver', az: 'Tver' },
    Тульская: { en: 'Tula', uz: 'Tula', az: 'Tula' },
    Тюменская: { en: 'Tyumen', uz: 'Tyumen', az: 'Tyumen' },
    Челябинская: { en: 'Chelyabinsk', uz: 'Chelyabinsk', az: 'Çelyabinsk' },
    Ярославская: { en: 'Yaroslavl', uz: 'Yaroslavl', az: 'Yaroslavl' },
    Краснодарский: { en: 'Krasnodar', uz: 'Krasnodar', az: 'Krasnodar' },
    Красноярский: { en: 'Krasnoyarsk', uz: 'Krasnoyarsk', az: 'Krasnoyarsk' },
    Хабаровский: { en: 'Khabarovsk', uz: 'Xabarovsk', az: 'Xabarovsk' },
};

const REGION_TYPES: Record<'oblast' | 'krai', Names> = {
    oblast: { en: '{base} Oblast', uz: '{base} viloyati', az: '{base} vilayəti' },
    krai: { en: '{base} Krai', uz: "{base} o'lkasi", az: '{base} diyarı' },
};

// Республики и всё, что не укладывается в «основа + тип»
const SPECIAL: Record<string, Names> = {
    'Республика Татарстан': { en: 'Republic of Tatarstan', uz: 'Tatariston Respublikasi', az: 'Tatarıstan Respublikası' },
    'Республика Башкортостан': { en: 'Republic of Bashkortostan', uz: 'Boshqirdiston Respublikasi', az: 'Başqırdıstan Respublikası' },
    'Чеченская Республика': { en: 'Chechen Republic', uz: 'Checheniston Respublikasi', az: 'Çeçenistan Respublikası' },
    // города с устоявшимся названием на языке
    Москва: { en: 'Moscow', uz: 'Moskva', az: 'Moskva' },
    'Санкт-Петербург': { en: 'Saint Petersburg', uz: 'Sankt-Peterburg', az: 'Sankt-Peterburq' },
    Казань: { en: 'Kazan', uz: 'Qozon', az: 'Kazan' },
    'Нижний Новгород': { en: 'Nizhny Novgorod', uz: 'Nijniy Novgorod', az: 'Nijni Novqorod' },
    'Великий Новгород': { en: 'Veliky Novgorod', uz: 'Velikiy Novgorod', az: 'Velikiy Novqorod' },
    'Ростов-на-Дону': { en: 'Rostov-on-Don', uz: 'Rostov-na-Donu', az: 'Rostov-na-Donu' },
    Екатеринбург: { en: 'Yekaterinburg', uz: 'Yekaterinburg', az: 'Yekaterinburq' },
    Артём: { en: 'Artyom', uz: 'Artyom', az: 'Artyom' },
};

// Транслитерация: общая основа + отличия языков (uz — узбекская латиница, az — азербайджанский алфавит)
const BASE: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
    н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch',
    ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};
const TABLES: Record<NameLocale, Record<string, string>> = {
    en: BASE,
    uz: { ...BASE, ж: 'j', х: 'x', ы: 'i' },
    az: { ...BASE, г: 'q', ж: 'j', х: 'x', ч: 'ç', ш: 'ş', щ: 'şç', ы: 'ı' },
};

const VOWELS = 'аеёиоуыэюя';

function transliterate(text: string, locale: NameLocale): string {
    const table = TABLES[locale];
    let out = '';

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const lower = char.toLowerCase();
        if (!(lower in table)) {
            out += char;
            continue;
        }
        const prev = text[i - 1]?.toLowerCase() ?? '';
        const next = text[i + 1]?.toLowerCase() ?? '';
        // «е» в начале слова и после гласной/ъ/ь — «ye» (Yelets, Kireyevsk)
        let value = lower === 'е' && (!prev || !/[а-яё]/.test(prev) || VOWELS.includes(prev) || prev === 'ъ' || prev === 'ь') ? 'ye' : table[lower];
        // окончание «-ий»/«-ый» в английском — «-y» (Nizhny, Novy): «и/ы» перед конечной «й» пропускаем
        if (locale === 'en' && (lower === 'и' || lower === 'ы') && next === 'й' && !/[а-яё]/.test(text[i + 2]?.toLowerCase() ?? '')) value = '';
        if (char !== lower && value) {
            value = locale === 'az' && value === 'i' ? 'İ' : value[0].toUpperCase() + value.slice(1);
        }
        out += value;
    }

    return out;
}

function regionName(name: string, locale: NameLocale): string | undefined {
    if (SPECIAL[name]) return SPECIAL[name][locale];
    const match = name.match(/^(\S+)\s+(область|край)$/);
    if (!match) return undefined;
    const base = REGION_BASES[match[1]];
    if (!base) return undefined;
    return REGION_TYPES[match[2] === 'край' ? 'krai' : 'oblast'][locale].replace('{base}', base[locale]);
}

/** Название на языке с латиницей: «Казань» → Kazan / Qozon / Kazan; «Благовещенск (Амурская область)» → «Blagoveshchensk (Amur Oblast)» */
export function latinName(name: string, locale: NameLocale): string {
    const known = SPECIAL[name]?.[locale] ?? regionName(name, locale);
    if (known) return known;

    const paren = name.match(/^(.*?)\s*\((.+)\)$/);
    if (paren) {
        const inner = regionName(paren[2], locale) ?? transliterate(paren[2], locale);
        return `${latinName(paren[1], locale)} (${inner})`;
    }

    return transliterate(name, locale);
}

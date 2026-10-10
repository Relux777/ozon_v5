// Данные раздела «Склады». Только для сервера: JSON не попадает в клиентский бандл,
// клиентским компонентам передаётся уже урезанная проекция (см. getCityIndex).
import citiesData from '@/data/sklad/cities.json';
import warehousesData from '@/data/sklad/warehouses.json';
import { isRegion, latinName, type NameLocale } from '@/lib/city-names';

export const PERKS = ['transport', 'training', 'meal', 'dms'] as const;
export type Perk = (typeof PERKS)[number];

/** Хотя бы одно из полей заполнено: «до N», «от N» или «от N до M» */
export type Income = { from?: number; to?: number };

export type Warehouse = {
    /** адрес как на career.ozon.ru (краткий, иногда без региона) — он же уникальный ключ записи */
    address: string;
    /** полный адрес: регион, район/город, населённый пункт, улица, дом — его показываем, копируем и ищем на карте */
    fullAddress: string;
    income: Income;
    perks: Perk[];
};

type RawWarehouse = Warehouse & {
    /** slug'и городов, на страницах которых показывается склад (см. cities.json) */
    cities: string[];
};

export type City = {
    /** slug в наших URL: нижний регистр, без подчёркиваний */
    slug: string;
    /** название по-русски, как в cities.json; на языке страницы — getCityName() */
    name: string;
    /** область, край, республика — у них в текстах нет «г.» перед названием (см. getCityPlace) */
    region: boolean;
    /** slug на career.ozon.ru — нужен только для ссылки на первоисточник */
    ozonSlug: string;
    warehouses: Warehouse[];
};

export type CityStats = {
    count: number;
    /** нижняя граница — только если склад указывает её явно («от … до …») */
    min?: number;
    max?: number;
    /** среднее по верхним границам дохода, округлено до 1 000 ₽ */
    average?: number;
    perks: Perk[];
    /** на скольких складах города есть каждое из удобств */
    perkCounts: Record<Perk, number>;
};

/** Сводка по всей базе (все склады из warehouses.json) — для сравнения города со средним */
export type NationalStats = {
    count: number;
    /** среднее по верхним границам дохода, округлено до 1 000 ₽ */
    average: number;
};

/** name — на языке страницы, search — русское название (ищем по обоим: «Kazan» и «Казань») */
export type CityIndexItem = { slug: string; name: string; search: string; count: number; region: boolean };

const toUrlSlug = (ozonSlug: string) => ozonSlug.toLowerCase().replace(/_/g, '-');

const warehousesBySlug = new Map<string, Warehouse[]>();

for (const { cities, ...warehouse } of warehousesData.warehouses as RawWarehouse[]) {
    for (const slug of cities) {
        warehousesBySlug.set(slug, [...(warehousesBySlug.get(slug) ?? []), warehouse]);
    }
}

const CITIES: City[] = (citiesData as [string, string][]).map(([ozonSlug, name]) => {
    const slug = toUrlSlug(ozonSlug);
    return { slug, name, region: isRegion(name), ozonSlug, warehouses: warehousesBySlug.get(slug) ?? [] };
});

/** языки с латиницей — им латинское название города (Kazan, Qozon); остальным — русское */
const LATIN_LOCALES: readonly string[] = ['en', 'uz', 'az'] satisfies NameLocale[];

/** Название города/региона на языке страницы: «Казань» → «Kazan» (en), «Qozon» (uz); на кириллице, ka и hy — по-русски */
export function getCityName(city: Pick<City, 'name'>, locale: string): string {
    return LATIN_LOCALES.includes(locale) ? latinName(city.name, locale as NameLocale) : city.name;
}

const CITIES_BY_SLUG = new Map(CITIES.map((city) => [city.slug, city]));

// Опечатка в slug'е склада иначе молча выбросила бы его со всех страниц — падаем при сборке
for (const slug of warehousesBySlug.keys()) {
    if (!CITIES_BY_SLUG.has(slug)) {
        throw new Error(`warehouses.json: города «${slug}» нет в cities.json`);
    }
}

export const DATA_UPDATED_AT = warehousesData.updatedAt;

export function getCity(slug: string): City | undefined {
    return CITIES_BY_SLUG.get(slug);
}

/** среднее, округлённое до 1 000 ₽ */
const roundedAverage = (values: number[]) =>
    Math.round(values.reduce((sum, value) => sum + value, 0) / values.length / 1000) * 1000;

export function getCityStats(city: City): CityStats | null {
    const { warehouses } = city;
    if (warehouses.length === 0) return null;

    const bottoms = warehouses.flatMap((w) => (w.income.from ? [w.income.from] : []));
    const tops = warehouses.flatMap((w) => (w.income.to ? [w.income.to] : []));
    const perkCounts = Object.fromEntries(
        PERKS.map((perk) => [perk, warehouses.filter((w) => w.perks.includes(perk)).length])
    ) as Record<Perk, number>;

    return {
        count: warehouses.length,
        min: bottoms.length > 0 ? Math.min(...bottoms) : undefined,
        max: tops.length > 0 ? Math.max(...tops) : undefined,
        average: tops.length > 0 ? roundedAverage(tops) : undefined,
        perks: PERKS.filter((perk) => perkCounts[perk] > 0),
        perkCounts,
    };
}

// Считается один раз при загрузке модуля: каждый склад в warehouses.json — одна запись,
// даже если он показывается на страницах нескольких городов
const ALL_WAREHOUSES = warehousesData.warehouses as RawWarehouse[];
const NATIONAL_STATS: NationalStats = {
    count: ALL_WAREHOUSES.length,
    average: roundedAverage(ALL_WAREHOUSES.flatMap((w) => (w.income.to ? [w.income.to] : []))),
};

export function getNationalStats(): NationalStats {
    return NATIONAL_STATS;
}

/**
 * Соседние страницы: города и регионы, на которых показываются те же склады (агломерация, область).
 * Сначала те, у кого общих складов больше. Нужны для перелинковки «Соседние города и районы».
 */
export function getRelatedCities(city: City): City[] {
    const shared = new Map<string, number>();

    for (const warehouse of ALL_WAREHOUSES) {
        if (!warehouse.cities.includes(city.slug)) continue;
        for (const slug of warehouse.cities) {
            if (slug !== city.slug) shared.set(slug, (shared.get(slug) ?? 0) + 1);
        }
    }

    return [...shared.entries()]
        .flatMap(([slug, count]) => {
            const related = CITIES_BY_SLUG.get(slug);
            return related ? [{ related, count }] : [];
        })
        .sort((a, b) => b.count - a.count || a.related.name.localeCompare(b.related.name, 'ru'))
        .map(({ related }) => related);
}

/** Города, для которых есть адреса складов: их индексируем и включаем в sitemap */
export function getCitiesWithWarehouses(): City[] {
    return CITIES.filter((city) => city.warehouses.length > 0);
}

/**
 * Лёгкая проекция для клиентского поиска: без адресов и доходов. Названия — на языке страницы.
 * Сначала города со складами (по убыванию), затем остальные по алфавиту.
 */
export function getCityIndex(locale: string): CityIndexItem[] {
    return CITIES.map((city) => ({
        slug: city.slug,
        name: getCityName(city, locale),
        search: city.name,
        count: city.warehouses.length,
        region: city.region,
    })).sort(
        (a, b) => b.count - a.count || a.name.localeCompare(b.name, locale)
    );
}

// «д. 457» — номер дома, а не деревня; «с. п.» — сельское поселение (район), а не село
const SETTLEMENT = /^(г|с|д|пос|п|х|рп|пгт)\.\s(?!п\.)(?!\d)/;
const DISTRICT = /(р-н|г\.о\.)/;

/**
 * Где находятся склады города — населённые пункты из полных адресов, без повторов:
 * «с. Новая Тура (Зеленодольский р-н)», «пос. Шушары», «Раменский г.о.». Для текста «где склады» на странице города.
 */
export function getCityLocalities(city: City): string[] {
    const localities = new Set<string>();

    for (const { fullAddress } of city.warehouses) {
        const parts = fullAddress.split(', ');
        let index = -1;
        parts.forEach((part, i) => {
            if (SETTLEMENT.test(part)) index = i;
        });

        if (index >= 0) {
            const before = parts[index - 1] ?? '';
            localities.add(DISTRICT.test(before) ? `${parts[index]} (${before})` : parts[index]);
        } else {
            // поселения в адресе нет (технопарк, трасса) — хотя бы район
            const district = parts.find((part) => DISTRICT.test(part));
            if (district) localities.add(district);
        }
    }

    return [...localities];
}

export function getOzonCityUrl(city: City): string {
    return `https://career.ozon.ru/${city.ozonSlug}/sklad`;
}

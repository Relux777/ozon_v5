// Данные раздела «Склады». Только для сервера: JSON не попадает в клиентский бандл,
// клиентским компонентам передаётся уже урезанная проекция (см. getCityIndex).
import citiesData from '@/data/sklad/cities.json';
import warehousesData from '@/data/sklad/warehouses.json';

export const PERKS = ['transport', 'training', 'meal', 'dms'] as const;
export type Perk = (typeof PERKS)[number];

/** Хотя бы одно из полей заполнено: «до N», «от N» или «от N до M» */
export type Income = { from?: number; to?: number };

export type Warehouse = {
    address: string;
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
    name: string;
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
};

export type CityIndexItem = { slug: string; name: string; count: number };

const toUrlSlug = (ozonSlug: string) => ozonSlug.toLowerCase().replace(/_/g, '-');

const warehousesBySlug = new Map<string, Warehouse[]>();

for (const { cities, ...warehouse } of warehousesData.warehouses as RawWarehouse[]) {
    for (const slug of cities) {
        warehousesBySlug.set(slug, [...(warehousesBySlug.get(slug) ?? []), warehouse]);
    }
}

const CITIES: City[] = (citiesData as [string, string][]).map(([ozonSlug, name]) => {
    const slug = toUrlSlug(ozonSlug);
    return { slug, name, ozonSlug, warehouses: warehousesBySlug.get(slug) ?? [] };
});

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

export function getCityStats(city: City): CityStats | null {
    const { warehouses } = city;
    if (warehouses.length === 0) return null;

    const bottoms = warehouses.flatMap((w) => (w.income.from ? [w.income.from] : []));
    const tops = warehouses.flatMap((w) => (w.income.to ? [w.income.to] : []));

    return {
        count: warehouses.length,
        min: bottoms.length > 0 ? Math.min(...bottoms) : undefined,
        max: tops.length > 0 ? Math.max(...tops) : undefined,
        average:
            tops.length > 0
                ? Math.round(tops.reduce((sum, value) => sum + value, 0) / tops.length / 1000) * 1000
                : undefined,
        perks: PERKS.filter((perk) => warehouses.some((w) => w.perks.includes(perk))),
    };
}

/** Города, для которых есть адреса складов: их индексируем и включаем в sitemap */
export function getCitiesWithWarehouses(): City[] {
    return CITIES.filter((city) => city.warehouses.length > 0);
}

/**
 * Лёгкая проекция для клиентского поиска: без адресов и доходов.
 * Сначала города со складами (по убыванию), затем остальные по алфавиту.
 */
export function getCityIndex(): CityIndexItem[] {
    return CITIES.map(({ slug, name, warehouses }) => ({ slug, name, count: warehouses.length })).sort(
        (a, b) => b.count - a.count || a.name.localeCompare(b.name, 'ru')
    );
}

export function getOzonCityUrl(city: City): string {
    return `https://career.ozon.ru/${city.ozonSlug}/sklad`;
}

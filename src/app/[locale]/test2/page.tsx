// ТЕСТ 2 — дизайн страницы города (пример: Казань).
// Тексты и данные прямо в файле, без переводов: потом переносятся в основные файлы.
// Картинки заменены блоками-заглушками (.ph). Форма — макет (без отправки).
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import CopyCode from '../_test/CopyCode';
import styles from './test2.module.scss';

export const metadata: Metadata = {
    title: 'Test 2 — страница города (дизайн)',
    robots: { index: false, follow: false },
};

// ── Данные, которые вы будете менять ─────────────────────────────────────────
const SITE_NAME = 'Озон Работа';
const CITY = 'Казань';

const PROMO = {
    code: 'J485DG', // пример — подставьте свой промокод
    bonus: '2 000 ₽',
    appUrl: '#',
};

const CARD = {
    url: '#', // реферальная ссылка на оформление Ozon Карты
    promo: 'CARD-XXXX', // что ввести при оформлении, если акция требует (заглушка)
};

type Perk = 'Транспорт' | 'Обучение' | 'Питание' | 'ДМС';

const WAREHOUSES: { name: string; address: string; income: string; max: number; perks: Perk[] }[] = [
    {
        name: 'Склад · Зеленодольск',
        address: 'г. Зеленодольск, Новая Тура, ул. Промзона, 19',
        income: 'от 90 000 до 160 000 ₽/мес',
        max: 160000,
        perks: ['Транспорт', 'Обучение', 'Питание', 'ДМС'],
    },
    {
        name: 'Склад · Зеленодольск',
        address: 'г. Зеленодольск, Новая Тура, ул. Промзона, 25',
        income: 'до 116 000 ₽/мес',
        max: 116000,
        perks: ['Транспорт', 'Обучение', 'Питание', 'ДМС'],
    },
    {
        name: 'Склад · Столбище',
        address: 'с. Столбище, ул. Взлётная, 28',
        income: 'до 106 000 ₽/мес',
        max: 106000,
        perks: ['Транспорт', 'Питание', 'ДМС'],
    },
];

const OFFERS = [
    'Выплаты ежедневно или еженедельно — зависит от формы договора',
    'Оформление по ТК РФ, ГПХ или как самозанятый',
    'Удобный график: дневные выходы, частичная занятость, короткие смены',
    'Современный тёплый склад класса А',
    'Обучение с первого дня вместе с наставником',
    'Опыт не нужен, возраст от 18 лет',
];

const FACTS = [
    { value: String(WAREHOUSES.length), label: 'склада рядом с вами' },
    { value: 'от 90 000 ₽', label: 'доход в месяц, вилка*' },
    { value: '≈ 127 000 ₽', label: 'в среднем «до» по складам*' },
    { value: PROMO.bonus, label: 'бонус по промокоду**' },
];

const BENEFITS = [
    { title: 'Выплаты без задержек', text: 'Ежедневно или еженедельно — зависит от того, как вы оформлены: ГПХ, самозанятость или ТК РФ.' },
    { title: 'Транспорт до склада', text: 'Корпоративный транспорт из вашего города и обратно — уточняйте маршрут у рекрутера.' },
    { title: 'Обучение с первого дня', text: 'Наставник, практика на месте и понятные задачи на смене. Опыт не нужен.' },
    { title: 'Питание', text: 'Комплексные обеды или компенсация питания — по условиям конкретной площадки.' },
    { title: 'ДМС', text: 'Добровольное медицинское страхование при оформлении в штат — после испытательного срока.' },
    { title: 'Гибкий график', text: 'Дневные выходы, частичная занятость, короткие смены — можно совмещать с учёбой.' },
];

const STEPS = [
    { title: 'Оставьте заявку', text: 'Заполните форму ниже — вам перезвонят.' },
    { title: 'Обсудите детали', text: 'Узнайте про график, склад и формат оформления.' },
    { title: 'Оформитесь', text: 'Подскажем, какие документы взять с собой.' },
    { title: 'Выходите на смену', text: 'Первый день — с наставником и обучением.' },
];

const DOCS = ['Паспорт', 'ИНН и СНИЛС', 'Реквизиты банковской карты для выплат', 'Статус самозанятого — если оформляетесь по ГПХ'];
const REQUIREMENTS = ['Возраст от 18 лет', 'Готовность к работе на производстве', 'Опыт не обязателен', 'Ответственность и внимательность'];

const EARN_MORE = [
    { title: 'Смены через Ozon Job', text: 'Дополнительные выходы в удобные дни — выбираете сами в приложении.', tag: 'подработка' },
    { title: 'Бонус за друга', text: 'Приведите знакомого — Ozon выплачивает вознаграждение за рекомендацию.', tag: 'до 50 000 ₽*' },
    { title: 'Курьер в свободное время', text: 'Доставка заказов пешком, на велосипеде или авто — график свободный.', tag: 'гибкий график' },
    { title: 'Ozon Карта', text: 'Выплаты за смены на карту, кешбэк и накопительный счёт.', tag: 'реклама' },
];

const NEARBY = [
    ['zelenodolsk', 'Зеленодольск'],
    ['respublika-tatarstan', 'Республика Татарстан'],
    ['naberezhnye-chelny', 'Набережные Челны'],
    ['arsk', 'Арск'],
    ['laishevo', 'Лаишево'],
] as const;

const FAQ = [
    { q: `Как добраться до склада из города ${CITY}?`, a: 'Для большинства площадок есть корпоративный транспорт до склада и обратно. Маршруты и время отправления уточнит рекрутер после заявки.' },
    { q: 'Когда придёт первая выплата?', a: 'Зависит от формы оформления. По ГПХ и самозанятости выплаты могут приходить чаще, по ТК РФ — по графику компании.' },
    { q: 'Что делать с промокодом?', a: 'Установите приложение, зарегистрируйтесь и введите код в разделе акций. Условия начисления бонуса — в приложении.' },
    { q: 'Можно ли работать без опыта?', a: 'Да. Обучение проходит с первого дня рядом с наставником.' },
    { q: 'Это официальный сайт Ozon?', a: 'Нет, это независимый информационный сайт. Вакансии и условия публикует Ozon на career.ozon.ru.' },
];

export default function Test2Page() {
    return (
        <main className={styles.page}>
            {/* ───────── 1. HERO (структура как на главной) ───────── */}
            <section className={styles.hero}>
                <div className="container flex align-center">
                    <div className="f-w-7">
                        <nav aria-label="Навигационная цепочка" className="mb-15">
                            <ol className={`flex gap-7 ${styles.crumbs}`}>
                                <li>
                                    <Link href="/">Главная</Link>
                                </li>
                                <li>
                                    <Link href="/sklad">Склады</Link>
                                </li>
                                <li>
                                    <span aria-current="page">{CITY}</span>
                                </li>
                            </ol>
                        </nav>

                        <p className="color-5-100">{SITE_NAME}</p>

                        <h1 className={styles.title}>
                            {SITE_NAME} — вакансия оператора склада, г. {CITY}
                        </h1>

                        <p className={styles.lead}>
                            Оператор склада Ozon, г. {CITY} — доход от 90 000 до 160 000 ₽/мес. Оформление на выбор, обучение с
                            первого дня, опыт не нужен.
                        </p>

                        <ul className={styles.offers} aria-label="Условия работы">
                            {OFFERS.map((offer) => (
                                <li key={offer}>{offer}</li>
                            ))}
                        </ul>

                        <div className={`flex gap-10 ${styles.actions}`}>
                            <a href="#apply" className={`${styles.btn} ${styles.btnPrimary}`}>
                                Оставить заявку
                            </a>
                            <a href="#warehouses" className={`${styles.btn} ${styles.btnGhost}`}>
                                Адреса складов
                            </a>
                        </div>
                    </div>

                    <div className="f-w-5">
                        <div className={styles.heroCard}>
                            <div className={`${styles.ph} ${styles.phHero}`}>Фото / иллюстрация: склад в г. {CITY}</div>

                            <a href="#promo" className={styles.floatPromo}>
                                <span className={styles.floatLabel}>Бонус за установку приложения</span>
                                <b className={styles.floatSum}>+ {PROMO.bonus}</b>
                                <span className={styles.floatCode}>{PROMO.code}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────── 2. КЛЮЧЕВЫЕ ФАКТЫ ───────── */}
            <section className={styles.section}>
                <div className="container">
                    <dl className={`grid ${styles.facts}`}>
                        {FACTS.map((fact) => (
                            <div key={fact.label} className={`bg-3-100 br-20 border-1px-2-10 ${styles.fact}`}>
                                <dt>{fact.label}</dt>
                                <dd>{fact.value}</dd>
                            </div>
                        ))}
                    </dl>
                    <p className={styles.note}>
                        * По данным официальной страницы вакансий Ozon; сумма зависит от склада, графика и формы оформления,
                        доход не гарантирован. ** Условия акции определяет организатор.
                    </p>
                </div>
            </section>

            {/* ───────── 3. ПРЕИМУЩЕСТВА ───────── */}
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.head}>
                        <p className={styles.kicker}>Почему Ozon</p>
                        <h2 className={styles.h2}>Что вы получаете, работая в г. {CITY}</h2>
                        <p>Условия зависят от конкретного склада и формы оформления — ниже то, что чаще всего есть на площадках.</p>
                    </div>

                    <ul className={`grid ${styles.benefits}`}>
                        {BENEFITS.map((item, index) => (
                            <li key={item.title} className={`bg-3-100 br-20 border-1px-2-10 ${styles.benefit}`}>
                                <span className={styles.icon}>{index + 1}</span>
                                <h3 className={styles.h3}>{item.title}</h3>
                                <p>{item.text}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ───────── 4. АДРЕСА СКЛАДОВ + КАРТА ───────── */}
            <section className={styles.section} id="warehouses">
                <div className="container">
                    <div className={styles.head}>
                        <p className={styles.kicker}>Адреса</p>
                        <h2 className={styles.h2}>Склады Ozon рядом с г. {CITY}</h2>
                    </div>

                    <div className={`grid ${styles.whLayout}`}>
                        <ul className={styles.whList}>
                            {WAREHOUSES.map((wh) => (
                                <li key={wh.address} className={`bg-3-100 br-20 border-1px-2-10 ${styles.wh}`}>
                                    <div className={`flex nowrap justify-between gap-10 ${styles.whTop}`}>
                                        <span className={styles.whName}>{wh.name}</span>
                                        <span className={styles.whIncome}>{wh.income}</span>
                                    </div>
                                    <p className={styles.address}>{wh.address}</p>
                                    <ul className={`flex gap-5 ${styles.perks}`}>
                                        {wh.perks.map((perk) => (
                                            <li key={perk} className={styles.perk}>
                                                {perk}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className={`flex gap-10 ${styles.whActions}`}>
                                        <a href="#apply" className={`${styles.btnSm} ${styles.btnPrimary}`}>
                                            Откликнуться
                                        </a>
                                        <a href="#map" className={`${styles.btnSm} ${styles.btnGhost}`}>
                                            Как добраться
                                        </a>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div id="map" className={`${styles.ph} ${styles.phMap}`}>
                            Карта: точки складов и остановки транспорта
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────── 5. ДОХОД ПО СКЛАДАМ ───────── */}
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.head}>
                        <p className={styles.kicker}>Доход</p>
                        <h2 className={styles.h2}>Сколько можно получать по складам</h2>
                        <p className={styles.note}>Верхняя граница по данным Ozon, ₽ в месяц. Фактический доход зависит от смен и выработки.</p>
                    </div>

                    <ul className={`bg-3-100 br-20 border-1px-2-10 ${styles.bars}`}>
                        {WAREHOUSES.map((wh) => (
                            <li key={wh.address}>
                                <span className={styles.barLabel}>{wh.address.replace(/^(г\.|с\.)\s*/, '')}</span>
                                <span className={styles.barTrack}>
                                    <span className={styles.barFill} style={{ width: `${(wh.max / 160000) * 100}%` }} />
                                </span>
                                <b className={styles.barValue}>до {wh.max.toLocaleString('ru-RU')} ₽</b>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ───────── 6. ПРОМОКОД ───────── */}
            <section className={styles.section} id="promo">
                <div className="container">
                    <div className={styles.promo}>
                        <div className="flex align-center">
                            <div className="f-w-8">
                                <p className={styles.promoKicker}>Акция для новых пользователей · {CITY}</p>
                                <h2 className={styles.promoTitle}>
                                    Скачайте приложение, введите промокод и получите {PROMO.bonus}
                                </h2>
                                <p className={styles.promoText}>
                                    Приложение Ozon Job позволяет выбирать смены на складах самостоятельно. Установите его, введите
                                    код — и получите бонус по условиям акции.
                                </p>

                                <div className={`flex align-center gap-10 ${styles.promoActions}`}>
                                    <CopyCode code={PROMO.code} />
                                    <a
                                        href={PROMO.appUrl}
                                        className={`${styles.btn} ${styles.btnLight}`}
                                        target="_blank"
                                        rel="sponsored nofollow noopener noreferrer"
                                    >
                                        Скачать приложение
                                    </a>
                                </div>
                            </div>

                            <div className="f-w-4">
                                <div className={`${styles.ph} ${styles.phQr}`}>QR-код</div>
                            </div>
                        </div>

                        <ol className={`grid ${styles.promoSteps}`}>
                            <li>
                                <span className={styles.promoNum}>1</span>Скачайте приложение
                            </li>
                            <li>
                                <span className={styles.promoNum}>2</span>Зарегистрируйтесь
                            </li>
                            <li>
                                <span className={styles.promoNum}>3</span>Введите промокод
                            </li>
                            <li>
                                <span className={styles.promoNum}>4</span>Получите {PROMO.bonus}
                            </li>
                        </ol>

                        <p className={styles.promoNote}>
                            Реклама. Мы — независимый информационный сайт, не Ozon; за приглашение по промокоду получаем
                            вознаграждение. Условия акции определяет организатор и они могут измениться. [Данные рекламодателя]
                        </p>
                    </div>
                </div>
            </section>

            {/* ───────── 7. ЕЩЁ ЗАРАБОТОК ───────── */}
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.head}>
                        <p className={styles.kicker}>Больше возможностей</p>
                        <h2 className={styles.h2}>Ещё способы заработать с Ozon</h2>
                    </div>

                    <ul className={`grid ${styles.earn}`}>
                        {EARN_MORE.map((item) => (
                            <li key={item.title} className={`bg-3-100 br-20 border-1px-2-10 ${styles.earnItem}`}>
                                <span className={styles.tag}>{item.tag}</span>
                                <h3 className={styles.h3}>{item.title}</h3>
                                <p>{item.text}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ───────── 8. OZON КАРТА ───────── */}
            <section className={styles.section}>
                <div className="container">
                    <div className={`${styles.cardBanner}`}>
                        <div className={styles.cardMini}>
                            <span className={styles.cardChip} />
                            <span>Ozon Карта</span>
                        </div>

                        <div className={styles.cardBody}>
                            <p className={styles.kicker}>Реклама · Ozon Банк</p>
                            <h2 className={styles.h3}>Получайте выплаты за смены на карту каждый день</h2>
                            <p className="mb-15">
                                Оформите Ozon Карту по ссылке: выплаты приходят на неё, а кешбэк и накопительный счёт работают по
                                условиям тарифа.
                            </p>
                            <div className={`flex align-center gap-10 ${styles.actions}`}>
                                <a
                                    href={CARD.url}
                                    className={`${styles.btn} ${styles.btnPrimary}`}
                                    target="_blank"
                                    rel="sponsored nofollow noopener noreferrer"
                                >
                                    Оформить карту
                                </a>
                                <span className={styles.cardPromo}>
                                    В акции укажите: <b>{CARD.promo}</b>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────── 9. ДОКУМЕНТЫ И ТРЕБОВАНИЯ ───────── */}
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.head}>
                        <p className={styles.kicker}>Оформление</p>
                        <h2 className={styles.h2}>Что нужно для трудоустройства</h2>
                    </div>

                    <div className={`grid ${styles.two}`}>
                        <div className={`bg-3-100 br-20 border-1px-2-10 ${styles.panel}`}>
                            <h3 className={styles.h3}>Документы</h3>
                            <ul className={styles.checks}>
                                {DOCS.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                            <p className={styles.note}>Точный список подтвердит рекрутер.</p>
                        </div>
                        <div className={`bg-3-100 br-20 border-1px-2-10 ${styles.panel}`}>
                            <h3 className={styles.h3}>Требования</h3>
                            <ul className={styles.checks}>
                                {REQUIREMENTS.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────── 10. ШАГИ ───────── */}
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.head}>
                        <p className={styles.kicker}>Как это работает</p>
                        <h2 className={styles.h2}>4 шага до первой смены</h2>
                    </div>

                    <ol className={`grid ${styles.steps}`}>
                        {STEPS.map((step, index) => (
                            <li key={step.title} className={`bg-3-100 br-20 border-1px-2-10 ${styles.step}`}>
                                <span className={styles.stepNum}>{index + 1}</span>
                                <h3 className={styles.h3}>{step.title}</h3>
                                <p>{step.text}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* ───────── 11. ЗАЯВКА (макет формы) ───────── */}
            <section className={styles.section} id="apply">
                <div className="container">
                    <div className={`grid ${styles.applyWrap}`}>
                        <div>
                            <p className={styles.kicker}>Заявка</p>
                            <h2 className={styles.h2}>Оставьте заявку на склад в г. {CITY}</h2>
                            <p className="mb-15">Мы обязательно свяжемся с вами. Заполнение занимает меньше минуты.</p>
                            <div className={`${styles.ph} ${styles.phSmall}`}>Фото: рекрутер / менеджер</div>
                        </div>

                        <div className={`bg-3-100 br-20 border-1px-2-10 ${styles.form}`}>
                            <label className={styles.field}>
                                <span>Фамилия Имя</span>
                                <input type="text" placeholder="Иванов Иван" autoComplete="name" />
                            </label>
                            <label className={styles.field}>
                                <span>Телефон</span>
                                <input type="tel" placeholder="+7 999 999-99-99" autoComplete="tel" inputMode="tel" />
                            </label>
                            <label className={styles.field}>
                                <span>Город проживания</span>
                                <input type="text" defaultValue={CITY} autoComplete="address-level2" />
                            </label>
                            <label className={styles.field}>
                                <span>Формат оформления</span>
                                <select defaultValue="gph">
                                    <option value="tk">ТК РФ (в штат)</option>
                                    <option value="gph">ГПХ / самозанятость</option>
                                </select>
                            </label>

                            <label className={styles.consent}>
                                <input type="checkbox" />
                                <span>Я даю согласие на обработку персональных данных [ссылка на политику]</span>
                            </label>

                            {/* макет: type="button", отправку подключите позже */}
                            <button type="button" className={`${styles.btn} ${styles.btnPrimary} ${styles.submit}`}>
                                Отправить заявку
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────── 12. РЯДОМ + FAQ ───────── */}
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.head}>
                        <p className={styles.kicker}>Рядом</p>
                        <h2 className={styles.h2}>Работа в соседних городах</h2>
                    </div>

                    <ul className={`flex gap-7 mb-15 ${styles.chips}`}>
                        {NEARBY.map(([slug, name]) => (
                            <li key={slug}>
                                <Link href={`/sklad/${slug}`} className={styles.chip}>
                                    {name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className={styles.section}>
                <div className="container">
                    <div className={styles.head}>
                        <p className={styles.kicker}>Вопросы</p>
                        <h2 className={styles.h2}>Часто задаваемые вопросы</h2>
                    </div>

                    <div className={styles.faq}>
                        {FAQ.map((item) => (
                            <details key={item.q} className={`bg-3-100 br-20 border-1px-2-10 ${styles.faqItem}`}>
                                <summary>{item.q}</summary>
                                <p>{item.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───────── 13. ФИНАЛ ───────── */}
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.cta}>
                        <h2 className={styles.ctaTitle}>Начните работать в г. {CITY} уже на этой неделе</h2>
                        <div className={`flex justify-center gap-10 ${styles.actions}`}>
                            <a href="#apply" className={`${styles.btn} ${styles.btnLight}`}>
                                Оставить заявку
                            </a>
                            <a href="#promo" className={`${styles.btn} ${styles.btnOutline}`}>
                                Промокод {PROMO.bonus}
                            </a>
                        </div>
                    </div>

                    <p className={`${styles.note} ${styles.legal}`}>
                        Информационный сайт. Не является официальным сайтом Ozon. Ozon — товарный знак ООО «Интернет Решения».
                        Актуальные вакансии — на career.ozon.ru.{' '}
                        <a href="#" rel="nofollow noopener noreferrer">
                            Смотреть на официальном сайте
                        </a>
                    </p>
                </div>
            </section>
        </main>
    );
}

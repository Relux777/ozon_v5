// ТЕСТ 1 — дизайн главной страницы (привлечение клиентов).
// Тексты и данные прямо в файле, без переводов: потом переносятся в основные файлы.
// Картинки заменены блоками-заглушками (.ph).
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import CopyCode from '../_test/CopyCode';
import styles from './test1.module.scss';

export const metadata: Metadata = {
    title: 'Test 1 — главная (дизайн)',
    robots: { index: false, follow: false },
};

// ── Данные, которые вы будете менять ─────────────────────────────────────────
const SITE_NAME = 'Озон Работа';

const PROMO = {
    code: 'J485DG', // пример — подставьте свой промокод
    bonus: '2 000 ₽', // сколько получает пользователь (проверьте по правилам акции)
    appUrl: '#', // ссылка на скачивание приложения Ozon Job (реферальная)
};

const CARD = {
    url: '#', // реферальная ссылка на оформление Ozon Карты
    promo: 'CARD-XXXX', // что ввести при оформлении, если акция требует (заглушка)
};

const HERO_CHECKS = [
    'Выплаты ежедневно или еженедельно — зависит от формы оформления',
    'Оформление на выбор: ТК РФ, ГПХ или самозанятость',
    'Обучение с первого дня, опыт не нужен',
    'Транспорт до склада из вашего города',
];

const TRUST = ['18+', 'Без опыта', 'Сменный график', 'Склады по всей России'];

const STATS = [
    { value: '50+', label: 'складов Ozon в нашей базе' },
    { value: '40+', label: 'городов и регионов' },
    { value: 'до 126 000 ₽', label: 'доход оператора склада в месяц*' },
    { value: PROMO.bonus, label: 'бонус за промокод в приложении**' },
];

const EARN = [
    {
        no: '01',
        title: 'Оператор склада',
        text: 'Приёмка, сортировка и упаковка заказов на складе Ozon. Оформление по ТК РФ, ГПХ или как самозанятый.',
        badge: 'до 126 000 ₽/мес*',
        href: '/sklad',
        link: 'Города и адреса',
    },
    {
        no: '02',
        title: 'Подработка в Ozon Job',
        text: 'Сами выбираете склад, день и количество часов. Можно совмещать с учёбой или основной работой.',
        badge: 'выплаты на карту',
        href: '#promo',
        link: 'Как получить бонус',
    },
    {
        no: '03',
        title: 'Курьер',
        text: 'Доставка заказов пешком, на велосипеде или на автомобиле. Свободный график и еженедельные выплаты.',
        badge: 'свободный график',
        href: '#steps',
        link: 'С чего начать',
    },
    {
        no: '04',
        title: 'Водитель-экспедитор',
        text: 'Доставка на автомобиле компании, работа с документами и общение с клиентами. Есть вакансии на технике на складе.',
        badge: 'ТК РФ, соцпакет',
        href: '#steps',
        link: 'С чего начать',
    },
    {
        no: '05',
        title: 'Удалённые задания',
        text: 'Небольшие задания со смартфона из любого места — как дополнительный доход.',
        badge: 'по данным Ozon ~20 000 ₽/мес*',
        href: '#steps',
        link: 'Подробнее',
    },
    {
        no: '06',
        title: 'Приведи друга',
        text: 'Реферальная программа: бонус за каждого друга, который стал сотрудником или партнёром по вашей рекомендации.',
        badge: 'до 50 000 ₽ за друга*',
        href: '#faq',
        link: 'Условия',
    },
    {
        no: '07',
        title: 'Ozon Карта',
        text: 'Выплаты за смены на карту, кешбэк за покупки и накопительный счёт — условия по тарифу банка.',
        badge: 'реклама',
        href: '#card',
        link: 'Оформить карту',
    },
    {
        no: '08',
        title: 'Свой бизнес на Ozon',
        text: 'Продавайте товары на маркетплейсе или откройте пункт выдачи заказов рядом с домом.',
        badge: 'для предпринимателей',
        href: '#faq',
        link: 'Узнать больше',
    },
];

const PROMO_STEPS = [
    { title: 'Скачайте приложение', text: 'Установите Ozon Job из App Store, Google Play или RuStore.' },
    { title: 'Зарегистрируйтесь', text: 'Подключитесь, пройдите обучение и примите договор-оферту прямо в приложении.' },
    { title: 'Введите промокод', text: 'В разделе с акциями укажите код — он ниже, нажмите «Скопировать».' },
    { title: `Получите ${PROMO.bonus}`, text: 'После выполнения условий акции бонус придёт на ваш счёт.' },
];

const CARD_FEATURES = [
    'Выплаты за смены приходят на карту',
    'Кешбэк баллами за покупки на Ozon',
    'Бесплатные переводы и снятие наличных — в рамках тарифа',
    'Накопительный счёт: проценты — по условиям банка',
];

const STEPS = [
    { title: 'Подайте заявку', text: 'Выберите город и склад, оставьте заявку — вам перезвонят.' },
    { title: 'Обсудите детали', text: 'Узнайте условия вакансии, график и формат оформления.' },
    { title: 'Оформляйтесь', text: 'Поможем сделать это быстро: список документов пришлют заранее.' },
    { title: 'Первый день', text: 'Наставник, обучение на месте и понятные задачи на смене.' },
];

const CITIES = [
    ['moscow', 'Москва'],
    ['saint-petersburg', 'Санкт-Петербург'],
    ['kazan', 'Казань'],
    ['yekaterinburg', 'Екатеринбург'],
    ['nizhny-novgorod', 'Нижний Новгород'],
    ['novosibirsk', 'Новосибирск'],
    ['krasnodar', 'Краснодар'],
    ['rostov-on-don', 'Ростов-на-Дону'],
    ['samara', 'Самара'],
    ['voronezh', 'Воронеж'],
    ['yaroslavl', 'Ярославль'],
    ['tver', 'Тверь'],
] as const;

const REVIEWS = [
    'Место для отзыва: что понравилось, как проходило обучение, сколько времени заняло оформление.',
    'Место для отзыва: график, дорога до склада, выплаты — как на практике.',
    'Место для отзыва: совмещение с учёбой или основной работой, советы новичкам.',
];

const FAQ = [
    {
        q: 'Это официальный сайт Ozon?',
        a: 'Нет. Это независимый информационный сайт. Актуальные вакансии и условия публикует Ozon на career.ozon.ru — ссылка есть на каждой странице города.',
    },
    {
        q: 'Как работает промокод и когда придёт бонус?',
        a: 'Вы устанавливаете приложение, регистрируетесь и вводите промокод. Сумма и условия начисления зависят от акции — они указаны в приложении и могут меняться.',
    },
    {
        q: 'Какие документы нужны для оформления?',
        a: 'Обычно паспорт, ИНН и СНИЛС, реквизиты банковской карты для выплат. Для ГПХ — статус самозанятого. Точный список подтвердит рекрутер.',
    },
    {
        q: 'Как часто платят?',
        a: 'Зависит от формы оформления: при ГПХ или самозанятости выплаты чаще (вплоть до ежедневных), при ТК РФ — по графику компании.',
    },
    {
        q: 'Можно совмещать с учёбой или основной работой?',
        a: 'Да, для подработки через приложение вы сами выбираете дни и время выхода.',
    },
    {
        q: 'Нужен ли опыт?',
        a: 'Нет. Обучение проходит на рабочем месте вместе с наставником.',
    },
];

export default function Test1Page() {
    return (
        <main className={styles.page}>
            {/* ───────── 1. HERO ───────── */}
            <section className={styles.hero}>
                <div className="container flex align-center">
                    <div className="f-w-7">
                        <p className={styles.badge}>Независимый информационный сайт · не Ozon</p>

                        <p className="color-5-100 font-w-500">{SITE_NAME}</p>
                        <h1 className={styles.title}>Работа на складах Ozon: заработок от смены до бонуса</h1>

                        <p className={styles.lead}>
                            Подберите склад в своём городе, узнайте реальные адреса и условия, а после установки
                            приложения получите бонус <b>{PROMO.bonus}</b> по промокоду.
                        </p>

                        <ul className={styles.checks}>
                            {HERO_CHECKS.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>

                        <div className={`flex gap-10 mb-15 ${styles.actions}`}>
                            <Link href="/sklad" className={`${styles.btn} ${styles.btnPrimary}`}>
                                Выбрать город
                            </Link>
                            <a href="#promo" className={`${styles.btn} ${styles.btnGhost}`}>
                                Получить {PROMO.bonus}
                            </a>
                        </div>

                        <ul className={`flex gap-7 ${styles.trust}`}>
                            {TRUST.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="f-w-5">
                        <div className={styles.heroCard}>
                            <div className={`${styles.ph} ${styles.phHero}`}>Фото / иллюстрация: сотрудник склада</div>

                            <div className={styles.floatPromo}>
                                <span className={styles.floatLabel}>Промокод</span>
                                <b className={styles.floatCode}>{PROMO.code}</b>
                                <span className={styles.floatSum}>+ {PROMO.bonus}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────── 2. ЦИФРЫ ───────── */}
            <section className={styles.section}>
                <div className="container">
                    <ul className={`grid ${styles.stats}`}>
                        {STATS.map((stat) => (
                            <li key={stat.label} className={`bg-3-100 br-20 border-1px-2-10 ${styles.stat}`}>
                                <b className={styles.statValue}>{stat.value}</b>
                                <span>{stat.label}</span>
                            </li>
                        ))}
                    </ul>
                    <p className={`${styles.note} mb-0`}>
                        * По данным официальных страниц Ozon; сумма зависит от склада, графика и формы оформления, дохода не гарантируем.
                        ** Условия акции определяет организатор.
                    </p>
                </div>
            </section>

            {/* ───────── 3. КАК ЗАРАБОТАТЬ ───────── */}
            <section className={styles.section} id="earn">
                <div className="container">
                    <div className={styles.head}>
                        <p className={styles.kicker}>Возможности</p>
                        <h2 className={styles.h2}>Как заработать с Ozon</h2>
                        <p>
                            Работа на складе — только один из вариантов. Выберите формат под ваш график: от постоянной занятости
                            до дополнительного дохода на смартфоне.
                        </p>
                    </div>

                    <ul className={`grid ${styles.cards}`}>
                        {EARN.map((item) => (
                            <li key={item.no} className={`bg-3-100 br-20 border-1px-2-10 ${styles.card}`}>
                                <div className={`flex nowrap justify-between align-center ${styles.cardTop}`}>
                                    <span className={styles.icon}>{item.no}</span>
                                    <span className={styles.tag}>{item.badge}</span>
                                </div>
                                <h3 className={styles.h3}>{item.title}</h3>
                                <p>{item.text}</p>
                                {item.href.startsWith('/') ? (
                                    <Link href={item.href} className={styles.more}>
                                        {item.link} →
                                    </Link>
                                ) : (
                                    <a href={item.href} className={styles.more}>
                                        {item.link} →
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ───────── 4. ПРОМОКОД ───────── */}
            <section className={styles.section} id="promo">
                <div className="container">
                    <div className={styles.promo}>
                        <div className="flex align-center">
                            <div className="f-w-7">
                                <p className={styles.promoKicker}>Акция для новых пользователей</p>
                                <h2 className={styles.promoTitle}>
                                    Скачайте приложение, введите промокод — получите {PROMO.bonus}
                                </h2>
                                <p className={styles.promoText}>
                                    Установите Ozon Job, зарегистрируйтесь и введите код при регистрации или в разделе акций.
                                    Приложение подскажет, какие условия нужно выполнить.
                                </p>

                                <div className={`flex align-center gap-10 mb-15 ${styles.promoActions}`}>
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

                                <ul className={`flex gap-7 ${styles.stores}`}>
                                    <li>App Store</li>
                                    <li>Google Play</li>
                                    <li>RuStore</li>
                                    <li>AppGallery</li>
                                </ul>
                            </div>

                            <div className="f-w-5">
                                <div className={styles.qrWrap}>
                                    <div className={`${styles.ph} ${styles.phQr}`}>QR-код на скачивание</div>
                                    <p className={styles.qrText}>Наведите камеру телефона</p>
                                </div>
                            </div>
                        </div>

                        <ol className={`grid ${styles.promoSteps}`}>
                            {PROMO_STEPS.map((step, index) => (
                                <li key={step.title}>
                                    <span className={styles.promoNum}>{index + 1}</span>
                                    <b>{step.title}</b>
                                    <span>{step.text}</span>
                                </li>
                            ))}
                        </ol>

                        <p className={styles.promoNote}>
                            Реклама. Мы — независимый информационный сайт, не Ozon. За приглашение по этому промокоду мы получаем
                            вознаграждение. Размер бонуса и условия его получения определяет организатор акции, они могут
                            измениться — проверяйте их в приложении. [Данные рекламодателя: ФИО/наименование, ИНН]
                        </p>
                    </div>
                </div>
            </section>

            {/* ───────── 5. OZON КАРТА ───────── */}
            <section className={styles.section} id="card">
                <div className="container">
                    <div className={`flex align-center ${styles.cardBlock}`}>
                        <div className="f-w-6">
                            <div className={styles.cardVisual}>
                                <span className={styles.cardChip} />
                                <span className={styles.cardBrand}>Ozon Карта</span>
                                <span className={styles.cardNumber}>•••• •••• •••• 0000</span>
                            </div>
                        </div>

                        <div className="f-w-6">
                            <p className={styles.kicker}>Реклама · Ozon Банк</p>
                            <h2 className={styles.h2}>Ozon Карта: получайте выплаты каждый день</h2>
                            <p className="mb-15">
                                Заработанное с приложения приходит на карту. Оформите карту по ссылке — и вы сможете тратить,
                                копить и выводить деньги без лишних шагов.
                            </p>

                            <ul className={`${styles.checks} ${styles.checksDark}`}>
                                {CARD_FEATURES.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>

                            <div className={`flex align-center gap-10 mb-15 ${styles.actions}`}>
                                <a
                                    href={CARD.url}
                                    className={`${styles.btn} ${styles.btnPrimary}`}
                                    target="_blank"
                                    rel="sponsored nofollow noopener noreferrer"
                                >
                                    Оформить Ozon Карту
                                </a>
                                <span className={styles.cardPromo}>
                                    В акции укажите: <b>{CARD.promo}</b>
                                </span>
                            </div>

                            <p className={styles.note}>
                                Реклама. Условия обслуживания, кешбэк и проценты — по тарифам Ozon Банка. [Наименование
                                рекламодателя, реквизиты, данные о лицензии банка — по требованиям закона о рекламе.]
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────── 6. КАК НАЧАТЬ ───────── */}
            <section className={styles.section} id="steps">
                <div className="container">
                    <div className={styles.head}>
                        <p className={styles.kicker}>Просто начать</p>
                        <h2 className={styles.h2}>Как начать работать</h2>
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

            {/* ───────── 7. ГОРОДА ───────── */}
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.head}>
                        <p className={styles.kicker}>Города</p>
                        <h2 className={styles.h2}>Выберите свой город</h2>
                        <p>Покажем адреса складов, доход и что есть на каждом: транспорт, питание, ДМС.</p>
                    </div>

                    <ul className={`flex gap-7 mb-15 ${styles.chips}`}>
                        {CITIES.map(([slug, name]) => (
                            <li key={slug}>
                                <Link href={`/sklad/${slug}`} className={styles.chip}>
                                    {name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <Link href="/sklad" className={`${styles.btn} ${styles.btnGhost}`}>
                        Все города →
                    </Link>
                </div>
            </section>

            {/* ───────── 8. ГАЛЕРЕЯ ───────── */}
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.head}>
                        <p className={styles.kicker}>Как выглядит работа</p>
                        <h2 className={styles.h2}>Склад изнутри</h2>
                    </div>

                    <div className={`grid ${styles.gallery}`}>
                        <div className={`${styles.ph} ${styles.phTall}`}>Фото: склад</div>
                        <div className={styles.ph}>Фото: терминал сбора данных</div>
                        <div className={styles.ph}>Фото: столовая</div>
                        <div className={styles.ph}>Фото: автобус до склада</div>
                        <div className={styles.ph}>Фото: обучение</div>
                        <div className={styles.ph}>Фото: зона отдыха</div>
                        <div className={styles.ph}>Фото: команда смены</div>
                    </div>
                </div>
            </section>

            {/* ───────── 9. ОТЗЫВЫ (заглушки) ───────── */}
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.head}>
                        <p className={styles.kicker}>Отзывы</p>
                        <h2 className={styles.h2}>Что говорят те, кто уже работает</h2>
                        <p className={styles.note}>Здесь должны быть только настоящие отзывы с согласия авторов.</p>
                    </div>

                    <ul className={`grid ${styles.reviews}`}>
                        {REVIEWS.map((text, index) => (
                            <li key={text} className={`bg-3-100 br-20 border-1px-2-10 ${styles.review}`}>
                                <div className={`flex nowrap align-center gap-10 mb-15`}>
                                    <span className={styles.avatar} />
                                    <span>
                                        <b className={styles.strong}>Имя, город</b>
                                        <br />
                                        <span className={styles.note}>Работает {index + 1} мес.</span>
                                    </span>
                                </div>
                                <p>{text}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ───────── 10. FAQ ───────── */}
            <section className={styles.section} id="faq">
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

            {/* ───────── 11. ФИНАЛЬНЫЙ CTA ───────── */}
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.cta}>
                        <h2 className={styles.ctaTitle}>Готовы начать?</h2>
                        <p className={styles.ctaText}>Выберите город, найдите ближайший склад и получите бонус за установку приложения.</p>
                        <div className={`flex justify-center gap-10 ${styles.actions}`}>
                            <Link href="/sklad" className={`${styles.btn} ${styles.btnLight}`}>
                                Выбрать город
                            </Link>
                            <a href="#promo" className={`${styles.btn} ${styles.btnOutline}`}>
                                Промокод {PROMO.bonus}
                            </a>
                        </div>
                    </div>

                    <p className={`${styles.note} ${styles.legal}`}>
                        Информационный сайт. Не является официальным сайтом Ozon и не предлагает трудоустройство от имени
                        компании. Ozon — товарный знак ООО «Интернет Решения». Актуальные вакансии — на career.ozon.ru.
                    </p>
                </div>
            </section>
        </main>
    );
}

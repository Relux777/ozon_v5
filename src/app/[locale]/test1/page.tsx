// ТЕСТ 1 — дизайн главной страницы (привлечение клиентов).
// Тексты и данные прямо в файле, без переводов: потом переносятся в основные файлы.
// Картинки заменены блоками-заглушками (.ph).
//
// Факты про Ozon Job сверены со справкой https://docs.ozon.ru/job-ff-help/ (дата сверки: 2026-09-21).
// Всё, что зависит от склада/уровня, помечено звёздочками — условия у Ozon меняются.
import type { Metadata } from 'next';
import { Fragment, type CSSProperties } from 'react';
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
    code: 'J485DG', // пример — подставьте свой код приглашения
    // ВНИМАНИЕ: в справке Ozon Job (раздел «Приведите друга») суммы вознаграждения не указаны, а награду за
    // выполнение условий получает пригласивший. Размер бонуса для пользователя и условия его получения
    // обязательно подтвердите правилами акции, прежде чем публиковать.
    bonus: '2 000 ₽',
    appUrl: '#', // ссылка на скачивание приложения Ozon Job (реферальная)
};

const CARD = {
    url: '#', // реферальная ссылка на оформление Ozon Карты
    promo: 'CARD-XXXX', // что ввести при оформлении, если акция требует (заглушка)
};

const DOCS_URL = 'https://docs.ozon.ru/job-ff-help';

// Hero: 4 коротких пункта
const HERO_CHECKS = [
    'Выплата после смены: на карту Ozon Банка — через 3 часа**',
    'ГПХ, самозанятость или ИП; в штат — по заявке',
    'Оплачиваемое обучение в первый день, опыт не нужен',
    'Смены 4–12 часов: склад и день выбираете сами',
];

const TRUST = ['С 16 лет (граждане РФ)', 'Без опыта', 'Оплачиваемое обучение', '53 склада в 65 городах'];

// 8 блоков цифр (выбирайте и переносите)
const STATS = [
    { value: 'до 160 000 ₽', label: 'доход в месяц на лучших складах*' },
    { value: '43 из 53', label: 'складов с доходом до 100 000 ₽ и выше*' },
    { value: '53', label: 'склада Ozon в нашей базе' },
    { value: '65', label: 'городов и регионов с адресами складов' },
    { value: '3 часа', label: 'и деньги на карте Ozon Банка после смены**' },
    { value: 'каждый час', label: 'вывод денег для уровня «Бриллиант» (карта Ozon Банка)**' },
    { value: 'с 16 лет', label: 'подработка для граждан РФ (без ночных слотов)**' },
    { value: '150 баллов', label: 'за слот на мини-складах Ozon fresh, 1 балл = 1 ₽**' },
];

const EARN = [
    {
        no: '01',
        title: 'Оператор склада',
        text: 'Приёмка, подбор, сортировка и упаковка заказов с терминалом сбора данных. Выходите на слоты 4–12 часов.',
        badge: 'до 160 000 ₽/мес*',
        href: '/sklad',
        link: 'Города и адреса',
    },
    {
        no: '02',
        title: 'Подработка в Ozon Job',
        text: 'Сами выбираете склад, день и продолжительность слота. Можно совмещать с учёбой и основной работой.',
        badge: 'график на выбор',
        href: '#promo',
        link: 'Как начать',
    },
    {
        no: '03',
        title: 'Приведи друга',
        text: 'Реферальная программа Ozon Job: вознаграждение, когда друг выполнит условия акции. Сумма зависит от склада.',
        badge: 'сумма зависит от склада**',
        href: '#promo',
        link: 'Как это работает',
    },
    {
        no: '04',
        title: 'Акции за «пики»',
        text: 'Дополнительные награды за производительность на складе («Спидометр» и другие) и акция для новичков «Поддержка на старте».',
        badge: 'бонус к выплате**',
        href: '#pay',
        link: 'Как считаются выплаты',
    },
    {
        no: '05',
        title: 'Переход в штат',
        text: 'Опытным исполнителям — трудовой договор и фиксированный график на один объект. Заявка подаётся в приложении.',
        badge: 'ТК РФ',
        href: '#types',
        link: 'Типы оформления',
    },
    {
        no: '06',
        title: 'Баллы и скидки',
        text: 'Баллы Ozon fresh за смены (можно оплатить до 90% товаров с витрины) и скидки от партнёров — по уровню рейтинга.',
        badge: 'по рейтингу**',
        href: '#faq',
        link: 'Подробнее',
    },
    {
        no: '07',
        title: 'Ozon Карта',
        text: 'Выплаты приходят быстрее, а «Бриллиант» может выводить деньги каждый час. Кешбэк и проценты — по тарифу банка.',
        badge: 'реклама',
        href: '#card',
        link: 'Оформить карту',
    },
];

// Раздел «Первые шаги»: путь новичка от регистрации до первой смены (по справке Ozon Job)
const FLOW = [
    {
        title: 'Регистрация',
        text: 'В приложении Ozon Job: вход через Госуслуги или Ozon Банк. Выберите склад — регион определится сам.',
        needs: ['Госуслуги или Ozon Банк', 'ИНН и СНИЛС'],
    },
    {
        title: 'Тип сотрудничества и реквизиты',
        text: 'Выберите ГПХ, самозанятость или ИП и укажите реквизиты счёта. Анкета уйдёт на проверку — результат придёт в приложение.',
        needs: ['ГПХ · самозанятость · ИП', 'Карта Ozon Банка — выплаты быстрее**'],
    },
    {
        title: 'Запись на слот',
        text: 'После проверки бронируйте слот на 4–12 часов и примите договор-оферту. Документы возьмите с собой.',
        needs: ['Слот 4–12 часов', 'Паспорт, СНИЛС, ИНН'],
    },
    {
        title: 'Обучение и первая смена',
        text: 'Первый день — офлайн-обучение на складе, оно оплачивается. Затем терминал сбора данных — и работа.',
        needs: ['Оплачиваемый первый день', 'Выплата от 3 часов**'],
    },
];

const PROMO_STEPS = [
    { title: 'Скачайте Ozon Job', text: 'Откройте приложение и нажмите «Присоединиться».' },
    { title: 'Зарегистрируйтесь', text: 'Через Госуслуги или Ozon Банк, укажите ИНН и СНИЛС, выберите склад.' },
    { title: 'Введите код', text: 'На главной, на странице акции или в Профиль → Приведите друга.' },
    { title: 'Выполните условия', text: 'Запишитесь на слот и выполните задания на сумму, указанную в акции.' },
];

// Условия участия (по справке Ozon Job, раздел «Приведите друга»)
const PROMO_TERMS = [
    'Раньше не работали в Ozon',
    'Код вводится в приложении',
    'Задания на сумму, зависящую от склада',
];

// ── «Приведите друга» (справка Ozon Job, benefits/refferal, сверено 2026-09-22) ──
const REF_INVITED = [
    { title: 'Зарегистрируйтесь в Ozon Job', text: 'Через Госуслуги или Ozon Банк — приглашённым может быть тот, кто раньше не работал в Ozon.' },
    { title: 'Примените код', text: 'На главной, на странице акции или в Главная → Профиль → Приведите друга: введите код и нажмите «Применить».' },
    { title: 'Запишитесь на слоты', text: 'После применения кода записывайтесь на слоты и выполняйте операции на складе.' },
    { title: 'Следите за прогрессом', text: 'Сколько осталось до нужной суммы — на странице акции в приложении.' },
];

const REF_INVITER = [
    { title: 'Выйдите на слот', text: 'Отправить приглашение можно, когда вы выполнили задания хотя бы на одном слоте.' },
    { title: 'Откройте акцию', text: 'В личном кабинете нажмите на акцию «Приведите друга».' },
    { title: 'Отправьте код или приглашение', text: 'Другу подойдёт код или приглашение из акции.' },
    { title: 'Получите вознаграждение', text: 'Когда друг выполнит операции на нужную сумму. Оно приходит за вычетом налогов — смотрите в Выплаты → Операции.' },
];

const REF_RULES = [
    { title: 'Сумма зависит от склада', text: 'Друг должен выполнить операции на определённую сумму. Засчитываются операции на складе, который он выбрал для первой записи.' },
    { title: 'Склад вышел из акции', text: 'Прогресс сохранится — задания продолжат засчитываться.' },
    { title: 'Друг не набрал сумму', text: 'Если сумма не набрана, а договор расторгнут, вознаграждения не будет.' },
    { title: 'Новый договор — новый код', text: 'При переподписании договора код меняется. За друзей, приглашённых по старому коду, вознаграждение не начисляется.' },
];

// ── Выплаты (справка Ozon Job: payments/payout/*, payments/tariffs, сверено 2026-09-22) ──
const PAY_FORMULA = [
    { title: 'Пики', text: 'Каждая операция на терминале сбора данных — один «пик»' },
    { title: 'Тариф', text: 'Зависит от размера, объёма и веса товара. Тарифы динамические' },
    { title: 'Вознаграждение', text: 'Сумма за слот — до вычета налогов и удержаний' },
] as const;

const PAY_OPS = ['×', '='] as const;

const PAY_TIMES = [
    { big: '3 ч', title: '«Новичок» и «Бриллиант»', text: 'Деньги приходят сами на карту Ozon Банка через 3 часа после окончания слота.', tag: '' },
    { big: '12 ч', title: 'Другие уровни рейтинга', text: 'На карту Ozon Банка — через 12 часов после окончания слота.', tag: '' },
    { big: '1 ч', title: '«Бриллиант»: вывод вручную', text: 'Раз в час: Выплаты → «Вывести деньги». Поступление в течение 5 минут. Нужна карта Ozon Банка.', tag: 'быстрее всего' },
    { big: 'Вт', title: 'Карты других банков', text: 'Раз в неделю, по вторникам. Если вторник — праздник, выплата придёт в первый рабочий день после него.', tag: '' },
] as const;

const PAY_TIPS = [
    { title: 'Ожидаемая выплата', text: 'На карточке склада — за 1 час и за 12-часовой слот, по среднему доходу уровня «Бриллиант». Для своего уровня — кнопка «Тариф» при записи. Это не гарантия.' },
    { title: 'Детализация', text: 'Подробный расчёт появляется в приложении на следующий день после слота.' },
    { title: 'Первый день', text: 'Обучение оплачивается по акции «Поддержка на старте» — не как полный слот. Онлайн-курсы до выхода помогают сделать больше пиков.' },
    { title: 'Таймер', text: 'Операции по времени оплачиваются почасово: запустите таймер в начале и остановите после — иначе выплата не придёт.' },
    { title: 'Тарифы меняются', text: 'Платят по тарифу на момент оказания услуги, а не на момент записи: он растёт и падает вместе с нагрузкой на склад.' },
    { title: 'Уровень рейтинга', text: 'От «Новичка» до «Бриллианта»: от него зависят сроки выплат. Уровень виден после 55 часов на объектах, баллы считаются за последние 30 дней.' },
] as const;

// ── Кто может работать (только склады; справка: conditions/basic-rules, personal-account/*) ──
const WHO = [
    { title: 'Граждане РФ', tag: 'с 16 лет', text: 'Для 16–17 лет ограничено время работы и недоступны ночные слоты. Нужны медицинская справка и согласие родителей или опекунов.' },
    { title: 'Иностранные граждане', tag: 'уточняйте', text: 'Зарегистрироваться можно (патент нужно продлевать и оплачивать), но по справке записи сейчас открыты только для велодоставки — на склад записаться пока не получится.' },
    { title: 'Работали в Ozon раньше', tag: 'ГПХ или ИП', text: 'Если последние 2 года вы работали в группе Ozon, самозанятость недоступна: сотрудничать можно по договору ГПХ или как ИП.' },
    { title: 'Есть основная работа', tag: 'можно', text: 'Можно работать по трудовому договору и одновременно сотрудничать по договору ГПХ — график вы выбираете сами.' },
    { title: 'Здоровье', tag: 'важно', text: 'Работа — это переноска тяжёлых грузов и внимание к сигналам погрузочных машин. С ограничениями по здоровью услуги на складах оказывать нельзя.' },
] as const;

const DOCS = [
    { name: 'Паспорт', note: '' },
    { name: 'СНИЛС', note: 'можно в электронном виде' },
    { name: 'ИНН', note: 'можно в электронном виде' },
    { name: 'Документ о временной регистрации', note: 'если есть' },
    { name: 'Справка №086У и согласие родителей', note: 'только если вам меньше 18 (шаблон согласия — в оферте)' },
] as const;

const DAY_ONE = [
    { title: 'Онлайн-курсы', text: 'Пройдите назначенные курсы в приложении (Главная → Обязательное обучение). Если у курса есть срок — не позже чем за 3 часа до записи, иначе она отменится.' },
    { title: 'Дорога', text: 'Приезжайте за 30 минут до слота: нужно пройти проходную и переодеться. До склада можно добраться самому или на транспорте — если у склада есть бейдж.' },
    { title: 'Пропуск', text: 'В отделе пропусков получите временный пропуск — там подскажут, как попасть в отдел обучения.' },
    { title: 'Обучение и ТСД', text: 'Правила склада и выбранные операции; затем выдадут терминал сбора данных. Забыли документы — запишитесь на слот повторно и принесите их.' },
] as const;

const TYPES = [
    { name: 'ГПХ', tax: 'Налоги удерживает и платит Ozon', note: 'Договор с Ozon; после слота формируются акты оказанных услуг.' },
    { name: 'Самозанятость', tax: 'Налоги платите сами (ФНС, «Мой налог»)', note: 'До 8 слотов на складах в месяц; недоступна, если 2 года назад работали в Ozon.' },
    { name: 'ИП', tax: 'Налоги платите сами', note: 'Статус нужно оформить заранее в ФНС, через Госуслуги или банк.' },
    { name: 'Штат (ТК РФ)', tax: 'Работодатель', note: 'Для опытных исполнителей: граждане РФ старше 18 лет, фиксированный график на один объект.' },
];

const CARD_FEATURES = [
    'Выплаты за слоты — на карту Ozon Банка, через 3 часа**',
    '«Бриллиант» выводит деньги каждый час, поступление — в течение 5 минут**',
    'Ozon Банк платит и в праздничные дни; другие банки — по вторникам**',
    'Кешбэк и проценты — по тарифам банка',
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
        a: 'Нет. Это независимый информационный сайт. Актуальные вакансии публикует Ozon на career.ozon.ru, правила работы через приложение — в справке Ozon Job (docs.ozon.ru).',
    },
    {
        q: 'Как работает код приглашения и когда придёт бонус?',
        a: 'Код вводят в приложении Ozon Job. Вознаграждение начисляется, когда приглашённый выполнит условия акции: задания на определённую сумму на выбранном складе (она зависит от склада). Приглашённым может быть тот, кто раньше не работал в Ozon. Условия и суммы могут меняться — смотрите на странице акции в приложении.',
    },
    {
        q: 'Можно ли подрабатывать с 16 лет?',
        a: 'Да, но только гражданам РФ. Для несовершеннолетних ограничено время услуг, ночные слоты недоступны; нужны медицинская справка и согласие родителей или опекунов.',
    },
    {
        q: 'Подойдёт ли это иностранным гражданам?',
        a: 'Зарегистрироваться можно (нужно основание нахождения в РФ, при патенте — его продление и оплата), но по справке Ozon Job записи для иностранных граждан сейчас открыты только для велодоставки. Уточняйте актуальную ситуацию в приложении.',
    },
    {
        q: 'Какие документы нужны на первый выход?',
        a: 'Паспорт, СНИЛС и ИНН (СНИЛС и ИНН можно в электронном виде), при наличии — документ о временной регистрации; если вам меньше 18 — справка №086У и согласие родителей. Медицинская книжка для складов не требуется.',
    },
    {
        q: 'Когда придут деньги?',
        a: 'Для карты Ozon Банка — через 3 часа после слота (уровни «Новичок» и «Бриллиант») или через 12 часов (остальные уровни). На карты других банков — раз в неделю по вторникам. Отсчёт идёт от окончания слота.',
    },
    {
        q: 'Чем отличаются ГПХ, самозанятость и ИП?',
        a: 'По ГПХ налоги удерживает и платит Ozon. Самозанятые и ИП платят налоги сами; у самозанятых лимит — 8 слотов на складах в месяц, при превышении три месяца подряд предложат перейти на ГПХ.',
    },
    {
        q: 'Оплачивается ли обучение?',
        a: 'Да. Первый день на складе — обучение, оно проходит офлайн и оплачивается; для новичков действует акция «Поддержка на старте». После обучения выдают терминал сбора данных.',
    },
];

const SOURCES = [
    ['Приведите друга', `${DOCS_URL}/benefits/refferal/`],
    ['Регистрация', `${DOCS_URL}/personal-account/registration/`],
    ['Регистрация иностранных граждан', `${DOCS_URL}/personal-account/registration-foreigners/`],
    ['Условия сотрудничества', `${DOCS_URL}/conditions/basic-rules/`],
    ['График выплат', `${DOCS_URL}/payments/payout/payment-schedule/`],
    ['Расчёт выплат', `${DOCS_URL}/payments/payout/rewards/`],
    ['Документы для первого выхода', `${DOCS_URL}/shifts/documents/`],
    ['Уровни и баллы', `${DOCS_URL}/rating/rating/`],
] as const;

export default function Test1Page() {
    return (
        <main className={styles.page}>
            {/* ───────── 1. HERO ───────── */}
            <section className={styles.hero}>
                <div className="container flex align-center">
                    <div className="f-w-7">
                        <p className={styles.badge}>Независимый информационный сайт · не Ozon</p>

                        <p className="color-5-100 font-w-500">{SITE_NAME}</p>
                        <h1 className={styles.title}>Вакансия оператора склада Ozon: работа с ежедневными выплатами</h1>

                        <p className={styles.lead}>
                            Подберите склад в своём городе и узнайте реальные адреса и условия. Оформитесь в приложении Ozon Job
                            по коду приглашения — бонус <b>{PROMO.bonus}</b>* начисляется после выполнения условий акции.
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
                                Как получить бонус
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
                                <span className={styles.floatLabel}>Код приглашения</span>
                                <b className={styles.floatCode}>{PROMO.code}</b>
                                <span className={styles.floatSum}>бонус {PROMO.bonus}*</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────── 2. ЦИФРЫ (8 блоков на выбор) ───────── */}
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
                        * По данным официальных страниц career.ozon.ru; доход зависит от склада, графика и формы оформления, не
                        гарантирован. ** По справке Ozon Job (docs.ozon.ru), сверено 21.09.2026; условия могут меняться.
                    </p>
                </div>
            </section>

            {/* ───────── 3. КАК ЗАРАБОТАТЬ ───────── */}
            <section className={styles.section} id="earn">
                <div className="container">
                    <div className={styles.head}>
                        <p className={styles.kicker}>Возможности</p>
                        <h2 className={styles.h2}>Как заработать с Ozon Job</h2>
                        <p>
                            Работа на складе — не единственный формат. Выберите вариант под свой график: от разовых смен до
                            постоянной занятости в штате.
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

            {/* ───────── 4. КОД ПРИГЛАШЕНИЯ / БОНУС ───────── */}
            <section className={styles.section} id="promo">
                <div className="container">
                    <div className={styles.promo}>
                        <div className={`flex align-center ${styles.promoTop}`}>
                            <div className="f-w-7">
                                <p className={styles.promoKicker}>
                                    <span className={styles.adBadge}>Реклама</span>
                                    Реферальная программа Ozon Job
                                </p>
                                <h2 className={styles.promoTitle}>Регистрируйтесь по коду приглашения — бонус после выполнения условий</h2>
                                <p className={styles.promoText}>
                                    Код приглашения вводится в приложении. Вознаграждение начисляется не за установку, а когда
                                    вы выполните задания на нужную сумму на выбранном складе — она указана в акции и зависит от
                                    склада.
                                </p>

                                {/* «купон»: подпись, код с кнопкой копирования и подсказка, где его вводить */}
                                <div className={styles.coupon}>
                                    <p className={styles.couponLabel}>Ваш код приглашения</p>
                                    <CopyCode code={PROMO.code} />
                                    <p className={styles.couponHint}>Где ввести: на главной, на странице акции или в Профиль → Приведите друга</p>
                                </div>

                                <div className={`flex align-center gap-10 mb-15 ${styles.promoActions}`}>
                                    <a
                                        href={PROMO.appUrl}
                                        className={`${styles.btn} ${styles.btnLight}`}
                                        target="_blank"
                                        rel="sponsored nofollow noopener noreferrer"
                                    >
                                        Скачать приложение
                                    </a>
                                </div>

                                <ul className={`flex gap-7 ${styles.stores}`} aria-label="Где скачать">
                                    <li>App Store</li>
                                    <li>Google Play</li>
                                    <li>RuStore</li>
                                    <li>AppGallery</li>
                                </ul>
                            </div>

                            <div className="f-w-5">
                                <div className={styles.qrCard}>
                                    {/* заглушка: замените на настоящий QR-код с реферальной ссылкой */}
                                    <div className={styles.qrFrame} role="img" aria-label="Место для QR-кода на скачивание приложения">
                                        <span>QR-код</span>
                                    </div>
                                    <p className={styles.qrText}>Наведите камеру телефона</p>
                                </div>
                            </div>
                        </div>

                        <ol className={styles.promoSteps}>
                            {PROMO_STEPS.map((step, index) => (
                                <li key={step.title} style={{ '--i': index } as CSSProperties}>
                                    <span className={styles.promoGhost} aria-hidden="true">{index + 1}</span>
                                    <span className={styles.promoNum} aria-hidden="true">{index + 1}</span>
                                    <b>{step.title}</b>
                                    <span>{step.text}</span>
                                </li>
                            ))}
                        </ol>

                        <ul className={styles.terms} aria-label="Условия участия">
                            {PROMO_TERMS.map((term) => (
                                <li key={term}>{term}</li>
                            ))}
                        </ul>

                        <p className={styles.promoWarn}>
                            Важно: участвовать может тот, кто раньше не работал в Ozon. Если вы уже сотрудничали с Ozon — акция
                            недоступна. Условия и суммы определяет Ozon и могут измениться.
                        </p>

                        <p className={styles.promoNote}>
                            Реклама. Мы — независимый информационный сайт, не Ozon. Если вы регистрируетесь по нашему коду, мы можем
                            получить вознаграждение от Ozon. [Данные рекламодателя: ФИО/наименование, ИНН]
                        </p>
                    </div>
                </div>
            </section>

            {/* ───────── 4а. ПРИВЕДИТЕ ДРУГА: как это работает ───────── */}
            <section className={styles.section} id="friend">
                <div className="container">
                    <div className={styles.head}>
                        <p className={styles.kicker}>Программа «Приведите друга»</p>
                        <h2 className={styles.h2}>Как работает приглашение по коду</h2>
                        <p>Порядок действий и правила — по справке Ozon Job. Ниже — для двух сторон: тех, кого пригласили, и тех, кто приглашает.</p>
                    </div>

                    <div className={styles.roles}>
                        <article className={`bg-3-100 br-20 border-1px-2-10 ${styles.role}`}>
                            <header className={styles.roleHead}>
                                <span className={styles.icon3d} aria-hidden="true">3D</span>
                                <div>
                                    <p className={styles.roleKicker}>Вас пригласили</p>
                                    <h3 className={styles.h3}>Как применить код</h3>
                                </div>
                            </header>
                            <ol className={styles.miniSteps}>
                                {REF_INVITED.map((step) => (
                                    <li key={step.title}>
                                        <b className={styles.strong}>{step.title}</b>
                                        <span>{step.text}</span>
                                    </li>
                                ))}
                            </ol>
                        </article>

                        <article className={`bg-3-100 br-20 border-1px-2-10 ${styles.role}`}>
                            <header className={styles.roleHead}>
                                <span className={styles.icon3d} aria-hidden="true">3D</span>
                                <div>
                                    <p className={styles.roleKicker}>Вы приглашаете</p>
                                    <h3 className={styles.h3}>Как получить вознаграждение</h3>
                                </div>
                            </header>
                            <ol className={styles.miniSteps}>
                                {REF_INVITER.map((step) => (
                                    <li key={step.title}>
                                        <b className={styles.strong}>{step.title}</b>
                                        <span>{step.text}</span>
                                    </li>
                                ))}
                            </ol>
                        </article>
                    </div>

                    <h3 className={styles.subTitle}>Что важно знать</h3>
                    <ul className={styles.rules}>
                        {REF_RULES.map((rule) => (
                            <li key={rule.title} className={`bg-3-100 br-20 border-1px-2-10 ${styles.rule}`}>
                                <span className={styles.icon3d} aria-hidden="true">3D</span>
                                <b className={styles.strong}>{rule.title}</b>
                                <span>{rule.text}</span>
                            </li>
                        ))}
                    </ul>

                    <p className={styles.note}>
                        Размер вознаграждения и условия зависят от склада и акции — смотрите их в приложении. В справке Ozon
                        вознаграждение описано для пригласившего.{' '}
                        <a href={`${DOCS_URL}/benefits/refferal/`} target="_blank" rel="noopener noreferrer">
                            Условия и список складов-участников →
                        </a>
                    </p>
                </div>
            </section>

            {/* ───────── 5. КАК НАЧАТЬ ───────── */}
            <section className={styles.section} id="steps">
                <div className="container">
                    <div className={styles.head}>
                        <p className={styles.kicker}>Первые шаги</p>
                        <h2 className={styles.h2}>Как выйти на первую смену</h2>
                    </div>

                    <div className={styles.flowWrap}>
                        <ol className={styles.flow}>
                            {FLOW.map((step, index) => (
                                <li key={step.title} className={styles.flowItem} style={{ '--i': index } as CSSProperties}>
                                    {/* номер — украшение: порядок и «Шаг N из M» читают скринридеры из списка и подписи */}
                                    <span className={styles.node} aria-hidden="true">
                                        {index + 1}
                                    </span>

                                    <div className={`bg-3-100 br-20 border-1px-2-10 ${styles.flowCard}`}>
                                        <span className={styles.stepLabel}>
                                            Шаг {index + 1} из {FLOW.length}
                                        </span>
                                        <h3 className={styles.h3}>{step.title}</h3>
                                        <p>{step.text}</p>
                                        <ul className={`flex gap-5 ${styles.needs}`} aria-label="Что понадобится">
                                            {step.needs.map((need) => (
                                                <li key={need}>{need}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            ))}
                        </ol>

                        <div className={`flex align-center gap-10 ${styles.flowCta}`}>
                            <a
                                href={PROMO.appUrl}
                                className={`${styles.btn} ${styles.btnPrimary}`}
                                target="_blank"
                                rel="sponsored nofollow noopener noreferrer"
                            >
                                Начать регистрацию
                            </a>
                            <a href="#who" className={`${styles.btn} ${styles.btnGhost}`}>
                                Проверить документы
                            </a>
                            <span className={styles.note}>По справке Ozon Job, сверено 21.09.2026</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────── 6. ВЫПЛАТЫ ───────── */}
            <section className={styles.section} id="pay">
                <div className="container">
                    <div className={styles.head}>
                        <p className={styles.kicker}>Деньги</p>
                        <h2 className={styles.h2}>Как считаются и когда приходят выплаты</h2>
                        <p>По справке Ozon Job. Сроки зависят от уровня рейтинга и банка карты.</p>
                    </div>

                    {/* формула: пики × тариф = вознаграждение */}
                    <div className={`bg-3-100 br-20 border-1px-2-10 ${styles.formulaWrap}`}>
                        <ol className={styles.formula} aria-label="Как считается выплата за слот">
                            {PAY_FORMULA.map((item, index) => (
                                <Fragment key={item.title}>
                                    {index > 0 && (
                                        <li className={styles.op} aria-hidden="true">
                                            {PAY_OPS[index - 1]}
                                        </li>
                                    )}
                                    <li className={styles.formulaItem}>
                                        <span className={styles.icon3d} aria-hidden="true">3D</span>
                                        <b className={styles.strong}>{item.title}</b>
                                        <span>{item.text}</span>
                                    </li>
                                </Fragment>
                            ))}
                        </ol>
                        <p className={styles.taxLine}>
                            <b className={styles.strong}>Из итога вычитаются налоги и удержания.</b> По ГПХ налог удерживает и платит
                            Ozon, самозанятые и ИП платят сами.
                        </p>
                    </div>

                    <h3 className={styles.subTitle}>Когда придут деньги</h3>
                    <ul className={styles.timeGrid}>
                        {PAY_TIMES.map((item) => (
                            <li key={item.title} className={`bg-3-100 br-20 border-1px-2-10 ${styles.timeCard}`}>
                                <div className={`flex nowrap justify-between align-center ${styles.cardTop}`}>
                                    <span className={styles.icon3d} aria-hidden="true">3D</span>
                                    {item.tag && <span className={styles.tag}>{item.tag}</span>}
                                </div>
                                <b className={styles.big}>{item.big}</b>
                                <b className={styles.strong}>{item.title}</b>
                                <span>{item.text}</span>
                            </li>
                        ))}
                    </ul>
                    <p className={styles.note}>
                        Ozon Банк платит и в праздничные дни. Отсчёт идёт от окончания слота.
                    </p>

                    <h3 className={styles.subTitle}>На что обратить внимание</h3>
                    <ul className={styles.tips}>
                        {PAY_TIPS.map((tip) => (
                            <li key={tip.title} className={`bg-3-100 br-20 border-1px-2-10 ${styles.tip}`}>
                                <span className={styles.icon3d} aria-hidden="true">3D</span>
                                <div>
                                    <b className={styles.strong}>{tip.title}</b>
                                    <span>{tip.text}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <p className={styles.note}>По справке Ozon Job (docs.ozon.ru), сверено 22.09.2026. Условия могут меняться.</p>
                </div>
            </section>

            {/* ───────── 7. КТО МОЖЕТ / ДОКУМЕНТЫ ───────── */}
            <section className={styles.section} id="who">
                <div className="container">
                    <div className={styles.head}>
                        <p className={styles.kicker}>Требования</p>
                        <h2 className={styles.h2}>Кто может работать и что взять с собой</h2>
                        <p>Про работу на складах: что важно по возрасту, документам и здоровью.</p>
                    </div>

                    <ul className={styles.whoGrid}>
                        {WHO.map((item) => (
                            <li key={item.title} className={`bg-3-100 br-20 border-1px-2-10 ${styles.whoCard}`}>
                                <div className={`flex nowrap justify-between align-center ${styles.cardTop}`}>
                                    <span className={styles.icon3d} aria-hidden="true">3D</span>
                                    <span className={styles.tag}>{item.tag}</span>
                                </div>
                                <b className={styles.strong}>{item.title}</b>
                                <span>{item.text}</span>
                            </li>
                        ))}
                    </ul>

                    <div className={styles.docsRow}>
                        {/* чек-лист: галочки работают без JS, счётчик «собрано» — на CSS-счётчиках */}
                        <div className={`bg-3-100 br-20 border-1px-2-10 ${styles.docsCard}`} style={{ '--total': `"${DOCS.length}"` } as CSSProperties}>
                            <div className={`flex nowrap align-center ${styles.docsHead}`}>
                                <span className={styles.icon3d} aria-hidden="true">3D</span>
                                <h3 className={styles.h3}>Документы для первого выхода</h3>
                            </div>
                            <ul className={styles.docs}>
                                {DOCS.map((doc) => (
                                    <li key={doc.name}>
                                        <label className={styles.doc}>
                                            <input type="checkbox" />
                                            <span className={styles.docBox} aria-hidden="true" />
                                            <span className={styles.docText}>
                                                <b>{doc.name}</b>
                                                {doc.note && <small>{doc.note}</small>}
                                            </span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                            <p className={styles.docsProgress}>
                                Собрано: <span className={styles.docsCount} />
                            </p>
                            <p className={styles.note}>
                                Иностранным гражданам — паспорт и документ, подтверждающий основание нахождения в РФ. Медицинская
                                книжка для складов не требуется; если она есть — возьмите с собой.
                            </p>
                        </div>

                        <div className={`bg-3-100 br-20 border-1px-2-10 ${styles.dayCard}`}>
                            <div className={`flex nowrap align-center ${styles.docsHead}`}>
                                <span className={styles.icon3d} aria-hidden="true">3D</span>
                                <h3 className={styles.h3}>Перед выходом и в первый день</h3>
                            </div>
                            <ol className={styles.miniSteps}>
                                {DAY_ONE.map((step) => (
                                    <li key={step.title}>
                                        <b className={styles.strong}>{step.title}</b>
                                        <span>{step.text}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                    <p className={styles.note}>
                        По справке Ozon Job (docs.ozon.ru), сверено 22.09.2026: «Документы для первого выхода», «Первый выход»,
                        «Условия сотрудничества».
                    </p>
                </div>
            </section>

            {/* ───────── 8. ТИПЫ СОТРУДНИЧЕСТВА ───────── */}
            <section className={styles.section} id="types">
                <div className="container">
                    <div className={styles.head}>
                        <p className={styles.kicker}>Оформление</p>
                        <h2 className={styles.h2}>ГПХ, самозанятость, ИП или штат</h2>
                    </div>

                    <div className={`bg-3-100 br-20 border-1px-2-10 ${styles.tableWrap}`}>
                        <table className={styles.table}>
                            <caption className="sr-only">Типы сотрудничества</caption>
                            <thead>
                                <tr>
                                    <th scope="col">Тип</th>
                                    <th scope="col">Налоги</th>
                                    <th scope="col">Что важно</th>
                                </tr>
                            </thead>
                            <tbody>
                                {TYPES.map((row) => (
                                    <tr key={row.name}>
                                        <th scope="row">{row.name}</th>
                                        <td>{row.tax}</td>
                                        <td>{row.note}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ───────── 9. OZON КАРТА ───────── */}
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
                            <h2 className={styles.h2}>Ozon Карта: деньги за смену — быстрее</h2>
                            <p className="mb-15">
                                Если в приложении указаны реквизиты карты Ozon Банка, выплаты за слоты приходят в срок от 3 часов, а не
                                раз в неделю, как на карты других банков.
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

            {/* ───────── 10. ГОРОДА ───────── */}
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

            {/* ───────── 11. ГАЛЕРЕЯ ───────── */}
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

            {/* ───────── 12. ОТЗЫВЫ (заглушки) ───────── */}
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

            {/* ───────── 13. FAQ ───────── */}
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

            {/* ───────── 14. ИСТОЧНИКИ + ФИНАЛ ───────── */}
            <section className={styles.section}>
                <div className="container">
                    <div className={`bg-3-100 br-20 border-1px-2-10 ${styles.panel} ${styles.sources}`}>
                        <h3 className={styles.h3}>Источники (справка Ozon Job, сверено 21.09.2026)</h3>
                        <ul className="flex gap-7">
                            {SOURCES.map(([title, href]) => (
                                <li key={href}>
                                    <a href={href} className={styles.chip} target="_blank" rel="nofollow noopener noreferrer">
                                        {title} ↗
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.cta}>
                        <h2 className={styles.ctaTitle}>Готовы начать?</h2>
                        <p className={styles.ctaText}>Выберите город, найдите ближайший склад и зарегистрируйтесь в Ozon Job по коду приглашения.</p>
                        <div className={`flex justify-center gap-10 ${styles.actions}`}>
                            <Link href="/sklad" className={`${styles.btn} ${styles.btnLight}`}>
                                Выбрать город
                            </Link>
                            <a href="#promo" className={`${styles.btn} ${styles.btnOutline}`}>
                                Как получить бонус
                            </a>
                        </div>
                    </div>

                    <p className={`${styles.note} ${styles.legal}`}>
                        Информационный сайт. Не является официальным сайтом Ozon и не предлагает трудоустройство от имени
                        компании. Ozon — товарный знак ООО «Интернет Решения». Актуальные вакансии — на career.ozon.ru, правила
                        сотрудничества — в справке Ozon Job.
                    </p>
                </div>
            </section>
        </main>
    );
}

# Запуск проекта: полный гайд

> Составлено 2026-09-26. Порядок действий перед публичным запуском сайта: юридическая часть, домен, хостинг,
> что заполнить в коде, как выложить на VPS и что проверить после запуска.
> Юридические пункты — не консультация юриста: итоговые документы и схему работы с рекламой лучше показать юристу.

---

## 0. Порядок запуска коротко

| # | Что сделать | Раздел | Зачем |
|---|---|---|---|
| 1 | Оформить самозанятость (НПД) | [1.1](#11-самозанятость-нпд) | Законный доход от рефералов и заказов |
| 2 | Купить домен на своё имя и подтвердить через Госуслуги | [2](#2-домен) | С 01.09.2026 без этого домен .ru не зарегистрировать и не продлить |
| 3 | Арендовать VPS **в России** | [3](#3-хостинг-vps-в-россии) | Данные россиян должны храниться в РФ (Vercel — за рубежом) |
| 4 | Заполнить конфиги в коде | [4](#4-что-заполнить-в-коде) | Адрес сайта, хостинг, ключи аналитики, erid |
| 5 | Подать уведомление в Роскомнадзор | [1.2](#12-уведомление-в-роскомнадзор) | Обязательно для оператора персональных данных |
| 6 | Решить вопрос с маркировкой рекламы (erid) | [1.3](#13-маркировка-рекламы-erid-ord) | Реклама в интернете должна быть промаркирована |
| 7 | Проверить сборку локально | [5](#5-проверка-перед-выкладкой) | Не выкладывать сломанное |
| 8 | Настроить сервер, Nginx, HTTPS | [6](#6-сервер-пошагово)–[7](#7-nginx-и-https) | Сам запуск |
| 9 | Подключить Метрику, Вебмастер, Search Console | [8](#8-аналитика-и-поисковики) | Статистика и индексация |
| 10 | Проверки после запуска | [10](#10-проверки-после-запуска) | Убедиться, что всё работает |

---

## 1. Юридическая часть (до запуска)

### 1.1. Самозанятость (НПД)

- Для владения сайтом регистрироваться не нужно. Но доход от реферальных программ и заказов сайтов — это регулярная деятельность.
- Оформить: приложение **«Мой налог»** (ФНС) → регистрация по паспорту или через Госуслуги. Бесплатно, около 10 минут.
- Налог: **4%** с доходов от физлиц, **6%** — от компаний и ИП. Лимит — 2,4 млн ₽ в год. Чек формируется в приложении на каждое поступление.
- Ozon Blogger без статуса самозанятого не работает.
- По реферальным выплатам банков уточните в правилах программы, как платят: некоторые удерживают НДФЛ сами, некоторые требуют самозанятость.
- Без регистрации доход всё равно облагается НДФЛ 13% (декларация 3-НДФЛ до 30 апреля следующего года). Регулярная деятельность без регистрации — штраф по ст. 14.1 КоАП.

### 1.2. Уведомление в Роскомнадзор

Нужно, потому что сайт обрабатывает персональные данные: обращения по почте, телефону и в Telegram, а после подключения — данные Метрики.
Подавать **после** выбора домена и российского хостинга (в уведомлении указывается, где лежат данные), но **до** публичного запуска и до подключения Метрики.
Если сведения потом изменятся — в течение 10 рабочих дней нужно подать информационное письмо об изменениях. Штраф гражданину за неподачу — 5–10 тыс. ₽ (ст. 13.11 КоАП).

1. Откройте [pd.rkn.gov.ru](https://pd.rkn.gov.ru) → «Подать уведомление» → вход через Госуслуги (учётная запись должна быть подтверждённой).
2. **Оператор:** «Физическое лицо». ФИО, ИНН, паспорт, адрес регистрации. Часть сведений попадает в открытый реестр — перед отправкой посмотрите, что именно.
3. **Цели обработки:** статистика посещаемости сайта; ответы на обращения; подготовка и исполнение договоров на разработку сайтов.
4. **Категории данных:** ФИО, телефон, адрес электронной почты, имя пользователя в Telegram; идентификаторы cookie, IP-адрес, сведения о браузере и устройстве.
5. **Категории субъектов:** посетители сайта; лица, обратившиеся к оператору; заказчики.
6. **Правовые основания:** 152-ФЗ, ст. 6 ч. 1: п. 1 (согласие), п. 5 (договор), п. 7 (законный интерес оператора).
7. **Действия и способ:** сбор, запись, систематизация, накопление, хранение, уточнение, извлечение, использование, передача (предоставление), блокирование, удаление, уничтожение; смешанная обработка, с передачей по сети интернет.
8. **Меры защиты (ст. 18.1, 19):** ответственный за обработку — сам оператор; политика опубликована на сайте; пароли и двухфакторная аутентификация; антивирус; доступ только у оператора.
9. **Место хранения:** Россия; адрес дата-центра хостинга (узнать у провайдера) и почты Mail (Москва).
10. **Трансграничная передача:** «нет» (если не подключаете Google Analytics — см. 8.3).
11. Дата начала обработки — дата запуска; условие прекращения — ликвидация сайта / отзыв согласия.
12. Отправить. Запись в реестре появляется примерно через месяц, номер сохраните.

После подачи: в `src/config/legal.ts` ничего менять не нужно, но включите на почте и хостинге двухфакторную аутентификацию (в уведомлении вы это заявляете).

### 1.3. Маркировка рекламы (erid, ОРД)

- Реферальные ссылки и код приглашения на публичном сайте — это реклама (ст. 18.1 ФЗ «О рекламе»). У каждой уже есть пометка «Реклама» и рекламодатель.
- Идентификатор рекламы (erid) выдаёт оператор рекламных данных (ОРД). Сначала спросите в каждой программе, не выдают ли erid они сами. Например, Ozon Blogger выдаёт токены своим участникам. Если не выдают — зарегистрироваться в одной из аккредитованных ОРД (список — на сайте Роскомнадзора) и регистрировать креативы самому.
- Куда вписать erid, когда получите:
  - код Ozon Job — `CODE_ERID` в `src/config/promo.ts`;
  - Ozon Карта — `CARD.erid` там же;
  - программы в «Акциях» — поле `erid` у каждой строки в `src/config/referrals.ts`.
  Он сам появится рядом с пометкой «Реклама».
- Уточните у юриста или в ОРД, касается ли вас **сбор 3%** с доходов от интернет-рекламы (с 01.04.2025).
- Прочитайте правила каждой реферальной программы. У Ozon Банка в правилах есть оговорка про «продвижение продуктов банка»: публичная реклама ссылок может быть запрещена или лишить вознаграждения. PDF правил: `finance.ozon.ru/documents/mgm`.

### 1.4. Название и бренд

- Название «Озон Работа» и синий круглый логотип легко принять за официальный сайт Ozon. «Ozon» — товарный знак ООО «Интернет Решения».
- **Домен без слова «ozon»** надёжнее: иначе возможны претензии правообладателя и споры о домене.
- Если будете менять название: `Metadata.siteName`, `Header.title`, `ManifestGlobal.*` во всех `messages/*.json`, логотип `src/assets/svg/logo.svg`, затем перегенерировать иконки и `public/og.jpg` (см. раздел 16 в CLAUDE.md).

### 1.5. Документы сайта

Готовы и лежат в меню («О сайте и документы»):

| Страница | Файл | Что проверить |
|---|---|---|
| Политика обработки персональных данных | `src/app/[locale]/menu/privacy/page.tsx` | Срок хранения журналов сервера «до 30 дней» совпадает с настройками хостинга (см. 6.9) |
| Cookie и согласие на аналитику | `src/app/[locale]/menu/cookies/page.tsx` | Список cookie, если подключите что-то ещё |
| Пользовательское соглашение | `src/app/[locale]/menu/terms/page.tsx` | — |
| О проекте, Реклама и вознаграждение | `…/menu/about`, `…/menu/ads` | Контакты, рекламодатели |

- Владелец, контакты и хостинг берутся из `src/config/legal.ts` — править там.
- **Меняете текст документа — обновите `LEGAL_UPDATED_AT`** в `src/config/legal.ts` (дата редакции на страницах).
- Документы стоит один раз показать юристу. Переводы сайта — носителям языков (особенно hy, ka, ky, kk).

---

## 2. Домен

1. Выберите домен (лучше без «ozon», см. 1.4) в зоне .ru / .рф.
2. Регистратор: REG.RU, RU-CENTER (nic.ru), Timeweb и т. п. Регистрируйте **на своё имя**, не на посредника.
3. С **01.09.2026** администратор домена .ru/.рф/.su обязан пройти идентификацию через Госуслуги (569-ФЗ). В личном кабинете регистратора пройдите подтверждение через Госуслуги, иначе домен не зарегистрируют и не продлят.
4. Включите автопродление и двухфакторный вход в кабинете регистратора.
5. DNS-записи — после аренды сервера (см. 6.8).

---

## 3. Хостинг: VPS в России

- **Почему не Vercel:** серверы Vercel за рубежом, в их журналах остаются IP-адреса посетителей. С 01.07.2025 первичный сбор данных россиян должен идти в базы в России (ч. 5 ст. 18 152-ФЗ, крупные штрафы). Vercel оставьте для тестов.
- **Где взять VPS в РФ:** Timeweb Cloud, Selectel, REG.RU, Yandex Cloud, Beget, FirstVDS — главное, дата-центр в России.
- **Минимум:** Ubuntu 24.04 LTS, 2 vCPU, **2 ГБ RAM**, 20–30 ГБ SSD. Сборка `next build` на 1 ГБ RAM может падать — тогда обязательно добавить swap (6.3).
- При заказе сразу добавьте свой SSH-ключ (если нет: на своём компьютере `ssh-keygen -t ed25519`, публичный ключ — файл `~/.ssh/id_ed25519.pub`).
- После выбора: в `src/config/legal.ts` заполнить

  ```ts
  export const HOSTING = {
      name: 'Timeweb Cloud (ООО «Таймвэб.Клауд»)', // ваш провайдер
      inRussia: true,
  };
  ```

  Политика сама напишет, что данные хранятся в России.

---

## 4. Что заполнить в коде

### 4.1. Адрес сайта — `.env.production` (обязательно)

Без него canonical, hreflang, sitemap и превью ссылок указывают на запасной `https://ozon-rabota.ru` из кода.

```bash
# файл .env.production в корне проекта (в git не попадает — .gitignore: .env*)
NEXT_PUBLIC_SITE_URL=https://ваш-домен.ru
```

- Без `/` в конце, с `https://`.
- Переменная с `NEXT_PUBLIC_` **вшивается при сборке**: после изменения — заново `npm run build`.
- На сервере файл создаётся вручную (см. 6.6).

### 4.2. Конфиги

| Файл | Что | Сейчас | Что сделать |
|---|---|---|---|
| `src/config/legal.ts` | `OWNER` — ФИО оператора | заполнено | — |
|  | `CONTACTS` — почта, телефон, Telegram, часы (МСК) | заполнено | при смене — здесь |
|  | `HOSTING` | пусто | вписать провайдера, `inRussia: true` (раздел 3) |
|  | `YANDEX_METRIKA_ID` | `''` | номер счётчика (8.1), **после** уведомления РКН |
|  | `GOOGLE_ANALYTICS_ID` | `''` | лучше оставить пустым (8.3) |
|  | `LEGAL_UPDATED_AT` | `2026-09-25` | обновлять при правке документов |
| `src/config/site.ts` | `SEARCH_VERIFICATION.yandex / .google` | пусто | коды из Вебмастера и Search Console (8.2) |
|  | `HOME_CHECKED_AT`, `SUPPORT_CHECKED_AT` | даты сверки | обновлять при каждой сверке со справкой Ozon |
| `src/config/promo.ts` | `CODE` — код приглашения Ozon Job | `QK3HMR42` | проверить, что код ещё действует |
|  | `USER_BONUS` — сумма на главной («Получить 2 000 ₽») | 2000, **пример** | сверить: бонус новичку от 1 000 до 5 000 ₽ в зависимости от склада; решить, какую сумму показывать или убрать сумму |
|  | `APP_URL` | пусто → job.ozon.ru/app | можно вписать свою реферальную ссылку |
|  | `CODE_ERID`, `CARD.erid` | пусто | erid из ОРД (1.3) |
|  | `CARD.url` — ссылка на Ozon Карту | настоящая | при смене — **перегенерировать QR** (ниже) |
| `src/config/referrals.ts` | ссылки Ozon Банка, Ozon Blogger, `erid` | ссылки настоящие, erid пусто | проверить, что ссылки открываются; erid; `REFERRALS_CHECKED_AT` |
| `src/data/sklad/warehouses.json` | склады, `updatedAt` | данные на 2026-09-19 | периодически сверять с career.ozon.ru |

**QR-код Ozon Карты** — статический файл. Если поменяли `CARD.url`:

```bash
npx qrcode -t svg -o src/assets/svg/card-qr.svg "https://новая-ссылка"
```

### 4.3. Тексты

- Все тексты — `messages/*.json` (ru — главный, плюс 6 языков). Добавили ключ в `ru.json` — добавьте во все 7 файлов, иначе сборка упадёт.
- Перед запуском пролистайте главную, `/stocks`, `/menu/support`, `/menu/cooperation` на каждом языке. Переводы делал ИИ — нужна вычитка носителями.
- Условия Ozon меняются: перед запуском сверьте ключевые цифры (выплаты 3/12 ч, бонусы, рейтинг) со [справкой Ozon Job](https://docs.ozon.ru/job-ff-help/) и обновите даты сверки.

---

## 5. Проверка перед выкладкой (на своём компьютере)

```bash
npm ci
npx tsc --noEmit
npm run build
npx next start -p 3495
```

Откройте `http://localhost:3495` и проверьте:

- [ ] главная, `/sklad`, страница любого города, `/stocks`, `/menu`, `/menu/level`, `/menu/support`, `/menu/cooperation`;
- [ ] переключение языков, тёмная тема;
- [ ] баннер cookie: «Принять» и «Отклонить» работают, на `/menu/cookies` кнопка «Изменить выбор cookie» открывает его снова;
- [ ] телефон (в DevTools — режим устройства 375 px): ничего не вылезает за экран;
- [ ] `http://localhost:3495/sitemap.xml` и `/robots.txt` — адреса с вашим доменом (если задан `.env.production`).

> `npm run lint` сейчас показывает несколько старых ошибок в `Modal`, `CitySearch`, `CopyCode`, `Header`, `JsonLd` — на сборку и работу они не влияют.

Закоммитьте и отправьте на GitHub (`Relux777/ozon_v5`) — сервер будет забирать код оттуда.

---

## 6. Сервер пошагово

Ниже `example.ru` — ваш домен, `1.2.3.4` — IP сервера, `deploy` — пользователь для сайта.

### 6.1. Первый вход и обновление

```bash
ssh root@1.2.3.4
apt update && apt upgrade -y
timedatectl set-timezone Europe/Moscow
```

### 6.2. Пользователь и безопасный SSH

```bash
adduser deploy
usermod -aG sudo deploy
mkdir -p /home/deploy/.ssh
cp /root/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh && chmod 600 /home/deploy/.ssh/authorized_keys
```

Проверьте в **новом** окне, что `ssh deploy@1.2.3.4` пускает по ключу. Только потом запретите вход по паролю и под root:

```bash
sudo nano /etc/ssh/sshd_config
#   PermitRootLogin no
#   PasswordAuthentication no
sudo systemctl restart ssh
```

Файрвол и защита от перебора паролей:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'   # сработает после установки nginx (6.7); можно выполнить позже
sudo ufw enable
sudo apt install -y fail2ban
```

### 6.3. Swap (если RAM 2 ГБ и меньше)

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 6.4. Node.js 24 LTS и git

Next.js 16 требует Node ≥ 20.9.

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x -o nodesource_setup.sh
sudo -E bash nodesource_setup.sh
sudo apt install -y nodejs git
node -v
```

### 6.5. Доступ сервера к GitHub (если репозиторий приватный)

```bash
ssh-keygen -t ed25519 -C "deploy@example.ru" -f ~/.ssh/github_deploy -N ""
cat ~/.ssh/github_deploy.pub
```

Скопируйте ключ в GitHub → репозиторий → **Settings → Deploy keys → Add deploy key** (только чтение). Затем:

```bash
cat >> ~/.ssh/config <<'EOF'
Host github.com
  IdentityFile ~/.ssh/github_deploy
  IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config
```

### 6.6. Код и первая сборка

```bash
sudo mkdir -p /var/www/ozon && sudo chown deploy:deploy /var/www/ozon
git clone git@github.com:Relux777/ozon_v5.git /var/www/ozon
cd /var/www/ozon
echo 'NEXT_PUBLIC_SITE_URL=https://example.ru' > .env.production
npm ci
npm run build
```

Проверка, что сервер Next поднимается (Ctrl+C для выхода):

```bash
npx next start -p 3000 -H 127.0.0.1
```

`-H 127.0.0.1` — Next слушает только локально, снаружи к нему ходит Nginx.

### 6.7. Автозапуск через systemd

```bash
sudo nano /etc/systemd/system/ozon.service
```

```ini
[Unit]
Description=Ozon Rabota (Next.js)
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/var/www/ozon
Environment=NODE_ENV=production
ExecStart=/usr/bin/node node_modules/next/dist/bin/next start -p 3000 -H 127.0.0.1
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now ozon
sudo systemctl status ozon
journalctl -u ozon -f          # логи, выход — Ctrl+C
```

### 6.8. DNS

У регистратора домена:

| Тип | Имя | Значение |
|---|---|---|
| A | `@` | `1.2.3.4` |
| A | `www` | `1.2.3.4` |

Обновляется от нескольких минут до суток. Проверка: `ping example.ru` показывает IP сервера.

### 6.9. Журналы и персональные данные

В политике написано: журналы сервера хранятся **не дольше 30 дней**. В Ubuntu Nginx по умолчанию хранит журналы 14 дней (`/etc/nginx/logrotate` → `/etc/logrotate.d/nginx`, `rotate 14`) — это подходит, не увеличивайте больше 30.
Журнал systemd можно ограничить: в `/etc/systemd/journald.conf` строка `MaxRetentionSec=30day`, затем `sudo systemctl restart systemd-journald`.

---

## 7. Nginx и HTTPS

### 7.1. Установка и временный конфиг

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
sudo ufw allow 'Nginx Full'
sudo nano /etc/nginx/sites-available/ozon
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.ru www.example.ru;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/ozon /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

### 7.2. Сертификат Let's Encrypt

```bash
sudo certbot --nginx -d example.ru -d www.example.ru
sudo certbot renew --dry-run
```

Сертификат продлевается сам (таймер certbot).

### 7.3. Итоговый конфиг

Замените содержимое `/etc/nginx/sites-available/ozon` (пути к сертификатам certbot уже создал):

```nginx
upstream ozon_next {
    server 127.0.0.1:3000;
    keepalive 32;
}

# http → https, www → без www
server {
    listen 80;
    listen [::]:80;
    server_name example.ru www.example.ru;
    return 301 https://example.ru$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.example.ru;

    ssl_certificate /etc/letsencrypt/live/example.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.ru/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://example.ru$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name example.ru;

    ssl_certificate /etc/letsencrypt/live/example.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.ru/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # включить, когда убедитесь, что https работает везде (браузеры запомнят на год)
    # add_header Strict-Transport-Security "max-age=31536000" always;

    client_max_body_size 2m;

    gzip on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/javascript application/json application/xml image/svg+xml;

    location / {
        proxy_pass http://ozon_next;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # потоковая отдача страниц Next (streaming) без буфера
        proxy_buffering off;
    }
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Кэш статики (`/_next/static/…`) Next отдаёт сам с заголовком `immutable`, отдельных правил не нужно.

---

## 8. Аналитика и поисковики

### 8.1. Яндекс Метрика (после уведомления РКН)

1. [metrika.yandex.ru](https://metrika.yandex.ru) → «Добавить счётчик» → адрес сайта `https://example.ru`.
2. Настройки: **Вебвизор — выключить** (в политике и согласии он не описан), карта кликов и точный показатель отказов — можно оставить.
3. Скопируйте **номер счётчика** (цифры) и вставьте в `src/config/legal.ts`:

   ```ts
   export const YANDEX_METRIKA_ID = '12345678';
   ```

   Код счётчика вставлять в страницы **не нужно**: он уже встроен и включается только после «Принять» в баннере.
4. Пересобрать и выложить (раздел 9). Проверить: открыть сайт в режиме инкогнито → «Принять» → в Метрике «Посещаемость» появится визит (через несколько минут).

### 8.2. Яндекс Вебмастер и Google Search Console

1. [webmaster.yandex.ru](https://webmaster.yandex.ru) → добавить сайт → способ «Мета-тег». Из тега `<meta name="yandex-verification" content="abc123">` скопируйте значение `content`.
2. [search.google.com/search-console](https://search.google.com/search-console) → «Ресурс с префиксом URL» → способ «Тег HTML». Скопируйте `content`.
3. Впишите в `src/config/site.ts`:

   ```ts
   export const SEARCH_VERIFICATION = {
       yandex: 'abc123',
       google: 'xyz789',
   };
   ```

4. Пересоберите, выложите, нажмите «Проверить» в обеих панелях.
5. В обеих панелях добавьте карту сайта: `https://example.ru/sitemap.xml`.
6. В Вебмастере: «Региональность» — Россия; «Переезд сайта» — главное зеркало `https://example.ru` без www.

### 8.3. Google Analytics — не рекомендую

Место под ключ есть (`GOOGLE_ANALYTICS_ID = 'G-XXXXXXXXXX'` в `src/config/legal.ts`), но данные уходят на серверы Google в США:
это трансграничная передача (отдельное уведомление в РКН) и нарушение требования о первичном сборе в российские базы.
Если всё же включите — политика и страница cookie сами покажут Google; уведомление РКН нужно будет дополнить.

---

## 9. Обновление сайта

На сервере создайте скрипт один раз:

```bash
nano ~/deploy.sh
```

```bash
#!/usr/bin/env bash
# Обновление сайта: забрать код, собрать, перезапустить. Сборка — до перезапуска, поэтому простой — пара секунд.
set -euo pipefail
cd /var/www/ozon
git pull --ff-only
npm ci
npm run build
sudo systemctl restart ozon
echo "Готово: $(git log -1 --format='%h %s')"
```

```bash
chmod +x ~/deploy.sh
```

Дальше каждое обновление: закоммитить и отправить на GitHub → на сервере `~/deploy.sh`.
Если сборка упала — скрипт остановится, а работающий сайт останется на старой версии.

Изменили `.env.production` или любой `NEXT_PUBLIC_*` — нужна пересборка (`~/deploy.sh`), простой перезапуск не поможет.

---

## 10. Проверки после запуска

- [ ] `https://example.ru` открывается, `http://` и `www.` перенаправляют на `https://example.ru`;
- [ ] замок в адресной строке, сертификат действующий;
- [ ] все языки: `/uz`, `/hy`, `/az`, `/ka`, `/ky`, `/kk`;
- [ ] `https://example.ru/robots.txt` — строка `Sitemap: https://example.ru/sitemap.xml`;
- [ ] `https://example.ru/sitemap.xml` — все адреса с вашим доменом (не `ozon-rabota.ru`);
- [ ] в коде страницы (Ctrl+U) `<link rel="canonical">` и `hreflang` — ваш домен;
- [ ] несуществующий адрес (`/abc`) показывает страницу 404;
- [ ] баннер cookie появляется в режиме инкогнито;
- [ ] превью ссылки в Telegram/WhatsApp (картинка `og.jpg`, заголовок);
- [ ] [PageSpeed Insights](https://pagespeed.web.dev) для главной и страницы города (телефон);
- [ ] реферальные ссылки в «Акциях» открывают страницы Ozon Банка и Ozon Blogger;
- [ ] телефон, почта, Telegram на `/menu/support` и `/menu/cooperation` открываются.

Мониторинг: бесплатный сервис проверки доступности (например, UptimeRobot) — письмо, если сайт упал.
Резервные копии: весь сайт — в git, базы данных нет; на сервере важен только `.env.production` — сохраните его копию у себя.

---

## 11. Регулярно

| Как часто | Что |
|---|---|
| Раз в месяц | Сверить условия Ozon Job (выплаты, бонусы, рейтинг) и Ozon Банка — обновить тексты и даты сверки (`HOME_CHECKED_AT`, `SUPPORT_CHECKED_AT`, `RATING_CHECKED_AT`, `REFERRALS_CHECKED_AT`) |
| Раз в 1–2 месяца | Сверить склады с career.ozon.ru, обновить `warehouses.json` и `updatedAt` |
| Раз в месяц | `sudo apt update && sudo apt upgrade -y` на сервере; `npm outdated` — обновления Next.js (с проверкой сборки) |
| При изменениях | Новый сервис, форма, хостинг → обновить политику, `LEGAL_UPDATED_AT` и подать в РКН письмо об изменениях (10 рабочих дней) |
| Раз в год | Продление домена (с подтверждением через Госуслуги), проверка, что код приглашения и реферальные ссылки ещё действуют |
| До 30 апреля | Если нет самозанятости — декларация 3-НДФЛ за прошлый год |

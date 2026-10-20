# Проверка Event Radar — 20 октября 2026

Проверены все 213 ранее опубликованных записей планирования на 2027 год. В календаре оставлены **212 записей: 161 с точными датами, 30 с анонсированным выпуском и ожидающими датами, 21 серия без подтверждённого выпуска 2027**. Одна запись временно вынесена на повторную проверку.

Проверены HTTP-ответы, перенаправления и адрес назначения всех **325 исходных уникальных ссылок** в обоих годах, затем отдельно — новые адреса после исправлений. Рабочий HTTP 200 сам по себе не считался подтверждением даты или реальности анонса: сверялись название, год, даты и место на официальных страницах/календарях, в официальных публикациях или в браузере для динамических сайтов. HTTP 403/405 с anti-bot, ошибки TLS старого клиента и таймауты не приравнивались к несуществующему событию.

## Исправления 2027

- **GDC:** 1–4 марта вместо 1–5. В текущем [FAQ](https://gdconf.com/faq/) есть прямое объяснение перехода с пяти дней на четыре; устаревший поисковый сниппет отвергнут.
- **gamescom:** выставка 25–29 августа; конференция разработчиков 23–24 августа уже имеет отдельную карточку. Разные периоды разделены по [пресс-релизу организатора](https://www.gamescom.global/en/gamescom-2026-expands-leading-position-more-exhibitors-bigger-indie-area-and-strong-international-presence).
- **Portside:** прежнее противоречие устранено — [главная](https://portsideassembly.com/) и [About](https://portsideassembly.com/about-portside/) теперь показывают 1–2 июля. Точные даты возвращены; ограничения доступа для руководителей indie-студий уточнены по странице билетов.
- **IAB Connected Commerce:** выпуск 2027 существует, но дата 20 апреля осталась только в старой индексированной копии; текущая [страница организатора](https://www.iab.com/events/2027-iab-connected-commerce-summit/) её не показывает. Дата снята до повторного подтверждения.
- **App Growth Summit Paris:** [страница 2027](https://appgrowthsummit.com/events/app-growth-summit-paris-2027/) возвращает 404, включая в обычном браузере; [текущий календарь](https://appgrowthsummit.com/events/) не содержит Paris. Запись временно исключена, а исходные данные сохранены в карантине. Это не утверждение, что конференция никогда не существовала.
- **SiGMA North America:** неправильная ссылка на азиатскую выставку заменена на [нужный региональный саммит](https://sigma.world/summits/north-america/). Даты SiGMA сверены с официальным календарём; для Asia и North America сохранены только опубликованные месяцы, без выдуманных дней.
- **The MarTech Summit:** даты всех 16 выпусков сверены с [официальным туром 2027](https://themartechsummit.com/summit-dates/); источником дат теперь служит этот календарь.
- **Affiliate World:** три будущих выпуска и города подтверждены на загруженном JavaScript-календаре организатора; у каждого остаётся статус ожидания точных дат.
- Для Programmatic & Beyond и PI LIVE не перенесено прошлогоднее место как подтверждённая площадка 2027; прежняя локация раскрыта в примечании.

## Архив 2026

Архив также проверен по адресам и исправлен по обнаруженным фактам. **Полная историческая перепроверка дат всех архивных событий не выполнена**: многие официальные главные страницы уже заменены выпусками 2027. Такой архив не назван полностью верифицированным; ограничение видно в интерфейсе.

- [GiGA Expo](https://giga-expo.com/) и [ASEAN Gaming Summit](https://aseangaming.com/) помечены как отменённые; даты обозначены как первоначально планировавшиеся.
- [Unreal Fest Chicago](https://www.unrealengine.com/news/apply-to-present-at-unreal-fest-chicago-2026): 16–18 июня вместо 18 июля.
- [Serious Play](https://seriousplayconf.com/homepage/): 5–7 августа вместо 1–2 августа.
- IEEE CoG переведён на [реальный сайт 2026](https://www.cog2026.org/); Programmatic I/O больше не ведёт на выпуск 2025.
- Ссылки на общий каталог PocketGamer заменены на страницы нужных событий/организаторов или официальных площадок.
- India Game Developer Conference: город Chennai вместо названия штата Tamil Nadu; отделены профессиональные и публичные дни.
- Два архивных события — IRCE + RetailX и датированный Mumbai Mobile & Digital Marketing Summit — временно исключены: достаточный официальный источник для заявленных выпусков не найден.
- Устаревшие метки Upcoming/Ongoing пересчитаны на день проверки; отмены сохранены.

## Карантин

Исходные записи сохранены в [verification-quarantine.json](verification-quarantine.json); они не загружаются приложением.

| ID | Запись | Причина |
| --- | --- | --- |
| E27-124 | App Growth Summit Paris 2027 | 2027 edition page returns HTTP 404 and a rendered 404 page; current upcoming calendar omits Paris. Older indexed organizer snapshot is not sufficient for a current dated listing. |
| E26-071 | IRCE + RetailX 2026 | Could not verify a 2026 IRCE + RetailX edition. The old retailx.com domain redirects to a retail news publisher, not this conference. |
| E26-223 | Mobile & Digital Marketing Summit Mumbai | Only generic third-party listings found for the November 25 date; current organizer site does not confirm the dated edition. Original destination was a generic third-party calendar. |

## Заменённые адреса кнопки Visit Website

| ID | Событие | Старый адрес | Новый адрес |
| --- | --- | --- | --- |
| E26-009 | MARCC Denver 2026 | https://www.amnavigator.com/affiliate-marketing-conferences/ | [Официальный адрес](https://martechrecord.com/past-events/marcc-denver/) |
| E26-240 | ASEAN Gaming Summit 2026 | https://www.aseangaming.com/ | [Официальный адрес](https://aseangaming.com/) |
| E26-063 | NEXT.io Valletta 2026 | https://next.io/events/next-valletta/ | [Официальный адрес](https://next.io/summits/valletta/) |
| E26-077 | GiGA Expo 2026 | https://www.gigaexpo.com/ | [Официальный адрес](https://giga-expo.com/) |
| E26-080 | Serious Play Europe 2026 | https://www.pocketgamer.biz/events/ | [Официальный адрес](https://seriousplayconf.com/wp-content/uploads/2025/10/SPC_PRESSKIT_NA.pdf) |
| E26-082 | Game Con Canada 2026 | https://www.pocketgamer.biz/events/ | [Официальный адрес](https://gameconcanada.com/) |
| E26-085 | CommerceNext Growth Show 2026 | https://commercenext.com/events/the-commerce-next-growth-show/ | [Официальный адрес](https://growthshow.commercenext.com/) |
| E26-086 | Game Quality Forum 2026 | https://www.pocketgamer.biz/events/ | [Официальный адрес](https://www.gqforum.com/) |
| E26-087 | Game Production Summit 2026 | https://www.pocketgamer.biz/events/ | [Официальный адрес](https://www.iqpc.com/events-gameproductionsummit) |
| E26-089 | GIC Sprint Katowice 2026 | https://www.pocketgamer.biz/events/ | [Официальный адрес](https://www.mckkatowice.pl/pl/wydarzenia-archiwum/5/) |
| E26-090 | Portside Game Assembly 2026 | https://www.pocketgamer.biz/events/ | [Официальный адрес](https://portsideassembly.com/portside-26/) |
| E26-091 | Search 'n Stuff London Conference 2026 | https://searchnstuff.co.uk/conference/ | [Официальный адрес](https://searchnstuff.co.uk/) |
| E26-092 | Global Games Show Saudi Arabia 2026 | https://www.pocketgamer.biz/events/ | [Официальный адрес](https://www.globalgamesshow.com/) |
| E26-096 | Guadalindie 2026 | https://www.pocketgamer.biz/events/ | [Официальный адрес](https://guadalindie.com/en/) |
| E26-101 | GameIs Conference 2026 | https://www.pocketgamer.biz/events/ | [Официальный адрес](https://www.gameisconf.com/) |
| E26-104 | Taipei Game Developers Forum 2026 | https://www.pocketgamer.biz/events/ | [Официальный адрес](https://2026.tgdf.tw/en/) |
| E26-105 | Vietnam Game Connect 2026 | https://www.pocketgamer.biz/events/ | [Официальный адрес](https://www.vietnamgameconnect.com/) |
| E26-106 | Unreal Fest Chicago 2026 | https://www.pocketgamer.biz/events/ | [Официальный адрес](https://www.unrealengine.com/news/apply-to-present-at-unreal-fest-chicago-2026) |
| E26-108 | Games for Change Festival 2026 | https://www.gamesforchange.org/festival/ | [Официальный адрес](https://festival.gamesforchange.org/) |
| E26-110 | Gaming Community Expo 2026 | https://www.pocketgamer.biz/events/ | [Официальный адрес](https://gcxevent.com/) |
| E26-111 | Philippine GameDev Expo 2026 | https://www.pocketgamer.biz/events/ | [Официальный адрес](https://www.pgdx.ph/) |
| E26-117 | Serious Play Conference 2026 | https://www.seriousplayconf.com/ | [Официальный адрес](https://seriousplayconf.com/homepage/) |
| E26-123 | BIC Festival 2026 | https://www.pocketgamer.biz/events/ | [Официальный адрес](https://bicfest.org/tickets) |
| E26-124 | MAGWest 2026 | https://www.pocketgamer.biz/events/ | [Официальный адрес](https://magwest.org/) |
| E26-125 | Replaying Japan 2026 | https://www.pocketgamer.biz/events/ | [Официальный адрес](https://replaying.jp/) |
| E26-136 | IEEE Conference on Games 2026 | https://2026.ieee-cog.org/ | [Официальный адрес](https://www.cog2026.org/) |
| E26-148 | Game Publishing, Marketing & Community 2026 | https://www.pocketgamer.biz/events/ | [Официальный адрес](https://www.iqpc.com/events-game-publishing-marketing-community) |
| E26-149 | Live Service Gaming Summit Europe 2026 | https://www.pocketgamer.biz/events/ | [Официальный адрес](https://www.iqpc.com/events-live-service-gaming-summit/agenda-at-a-glance) |
| E26-168 | Programmatic I/O New York 2026 | https://programmatic.io/ | [Официальный адрес](https://www.adexchanger.com/marketers/2026-events-award-deadlines/) |
| E26-180 | Barcelona Game Fest 2026 | https://www.pocketgamer.biz/events/ | [Официальный адрес](https://sagabarcelonagamefest.cat/en/press-release-30-07-2026/) |
| E26-188 | GameDev Connect 2026 | https://www.pocketgamer.biz/events/ | [Официальный адрес](https://game-connect.cz/) |
| E26-193 | Pocket Gamer Connects Nordics | https://www.pocketgamer.biz/events/pocket-gamer-connects-nordics-2026/ | [Официальный адрес](https://www.pgconnects.com/nordics/) |
| E26-198 | GamesForum Vancouver 2026 | https://www.globalgamesforum.com/ | [Официальный адрес](https://www.globalgamesforum.com/vancouver) |
| E26-199 | GamesForum San Francisco 2026 | https://www.globalgamesforum.com/ | [Официальный адрес](https://www.globalgamesforum.com/san-francisco) |
| E26-200 | India Game Developer Conference 2026 | https://www.igdc.in/ | [Официальный адрес](https://gdai.in/) |
| E26-215 | Game Conference MX 2026 | https://www.pocketgamer.biz/events/ | [Официальный адрес](https://www.gameconferencemx.com/) |
| E26-220 | WePlay Expo 2026 | https://www.pocketgamer.biz/events/ | [Официальный адрес](https://www.weplaymore.com/english) |
| E26-222 | GamesForum Vietnam 2026 | https://www.globalgamesforum.com/ | [Официальный адрес](https://www.globalgamesforum.com/vietnam) |
| E27-008 | SiGMA Africa 2027 | https://sigma.world/ | [Официальный адрес](https://sigma.world/summits/africa/) |
| E27-016 | SiGMA Eurasia 2027 | https://sigma.world/ | [Официальный адрес](https://sigma.world/summits/eurasia/) |
| E27-025 | SiGMA South America 2027 | https://sigma.world/ | [Официальный адрес](https://sigma.world/summits/south-america/) |
| E27-032 | SiGMA Europe 2027 | https://sigma.world/ | [Официальный адрес](https://sigma.world/summits/europe/) |
| E27-036 | Shoptalk Europe 2027 | https://europe.shoptalk.com/ | [Официальный адрес](https://europe.shoptalk.com/home) |
| E27-046 | Groceryshop 2027 | https://groceryshop.com/ | [Официальный адрес](https://groceryshop.com/home) |
| E27-086 | Web Summit Rio 2027 | https://rio.websummit.com/ | [Официальный адрес](https://rio.websummit.com/en/) |
| E27-090 | gamescom 2027 | https://www.gamescom.global/en/info/press-and-creator/participation-for-media-representatives | [Официальный адрес](https://www.gamescom.global/en/gamescom-2026-expands-leading-position-more-exhibitors-bigger-indie-area-and-strong-international-presence) |
| E27-135 | Game Camp France 2027 | https://fr.linkedin.com/company/game-camp-france | [Официальный адрес](https://gamecamp.fr/) |
| E27-172 | SiGMA Asia 2027 | https://sigma.world/summits/asia/exhibit/ | [Официальный адрес](https://sigma.world/summits/asia/) |
| E27-173 | SiGMA North America 2027 | https://sigma.world/summits/asia/exhibit/ | [Официальный адрес](https://sigma.world/summits/north-america/) |
| E27-174 | Affiliate World Dubai 2027 | https://www.affiliateworldevents.com/ | [Официальный адрес](https://www.affiliateworldevents.com/dubai) |
| E27-175 | Affiliate World Europe 2027 | https://www.affiliateworldevents.com/ | [Официальный адрес](https://www.affiliateworldevents.com/europe) |
| E27-176 | Affiliate World Americas 2027 | https://www.affiliateworldevents.com/ | [Официальный адрес](https://www.affiliateworldevents.com/americas) |
| E27-182 | Sports Betting West Africa+ Summit 2027 | https://www.eventus-international.com/ | [Официальный адрес](https://www.sportsbettingevents.com/sbwa) |
| E27-183 | Gaming Event Francophone Africa 2027 | https://www.eventus-international.com/ | [Официальный адрес](https://www.sportsbettingevents.com/gefa) |

| E26-017 | Performance Marketing World Unlocked 2026 | https://www.performancemarketingworld.com/ | [Официальный адрес](https://www.performancemarketingunlocked.com/) |

## Как читать результаты

- Существование сайта и опубликованного анонса подтверждает то, что организатор заявляет событие. Это не гарантия проведения в будущем, наличия билетов или допуска поставщиков.
- Watchlist — существующая серия; выпуск 2027 не подтверждён. Локации относятся к последнему опубликованному выпуску. Эти карточки не входят в число анонсированных конференций.
- Описания, категории, Best For и теги — редакционная классификация по материалам организатора, а не независимые обещания результатов.
- Подробная сверка каждого опубликованного выпуска 2027: [2027-verification.json](2027-verification.json). Снимки HTTP-ответов, заметки браузера и полный diff сохранены локально в папке `outputs/event-radar-2027/verification-2026-10-20/`.
- Внешние сайты могут менять данные после 20 октября; проверка фиксирует состояние источников на этот день.

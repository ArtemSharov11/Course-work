(() => {
    const STORAGE_KEY = 'selectedLang';

    const dictionary = {
        'language': 'language',
        'язык': 'language',
        'theme': 'theme',
        'тема': 'theme',
        'accessibility': 'accessibility',
        'версия для слабовидящих': 'accessibility version',
        'font size': 'font size',
        'размер шрифта': 'font size',
        'color scheme': 'color scheme',
        'цветовая схема': 'color scheme',
        'hide images': 'hide images',
        'отключить изображения': 'hide images',
        'включить': 'enable',
        'выключить': 'disable',
        'светлая': 'light',
        'темная': 'dark',
        'черный фон, белый текст': 'black background, white text',
        'черный фон, зеленый текст': 'black background, green text',
        'белый фон, черный текст': 'white background, black text',
        'бежевый фон, коричневый текст': 'beige background, brown text',
        'голубой фон, темно-синий текст': 'blue background, navy text',
        'сбросить настройки': 'reset settings',
        'открыть меню': 'open menu',
        'закрыть меню': 'close menu',

        'neff - кухни и шкафы': 'NEFF - kitchens and wardrobes',
        'neff - каталог': 'NEFF - catalog',
        'neff - портфолио': 'NEFF - portfolio',
        'neff - акции': 'NEFF - promotions',
        'neff - статьи': 'NEFF - articles',
        'neff - отзывы': 'NEFF - reviews',
        'neff - вход': 'NEFF - sign in',
        'neff - регистрация': 'NEFF - registration',
        'document': 'NEFF',

        'кухни и шкафы': 'kitchens and wardrobes',
        'франшиза': 'franchise',
        'застройщику': 'builders',
        'дизайнеру': 'designers',
        'обратная связь': 'feedback',
        'кухни': 'kitchens',
        'шкафы': 'wardrobes',
        'спальни': 'bedrooms',
        'ванные': 'bathrooms',
        'портфолио': 'portfolio',
        'акции': 'promotions',
        'покупателям': 'buyers',
        'статьи': 'articles',
        'отзывы': 'reviews',
        'войти': 'sign in',
        'выйти': 'sign out',
        'главная': 'home',
        'задать вопрос': 'ask a question',
        'заказать проект': 'order project',
        'оставить заявку': 'request',
        'отправить заявку': 'send request',
        'смотреть еще': 'show more',
        'подробнее': 'learn more',
        'перейти': 'go',
        'назад': 'back',
        'вперед': 'next',
        'пред.': 'prev.',
        'след.': 'next',
        'начало': 'start',
        'конец': 'end',
        'выбор': 'choice',
        'дизайн': 'design',
        'разбор': 'analysis',
        'тренды': 'trends',
        'уход': 'care',
        'дайджест': 'digest',
        'выставки': 'exhibitions',
        'достижения': 'achievements',
        'мария в сми': 'NEFF in media',
        'полезные статьи': 'useful articles',
        'данные о проведении соут': 'workplace assessment data',
        'политика конфиденциальности': 'privacy policy',
        'лицензионным соглашением': 'license agreement',
        'пользовательским соглашением': 'user agreement',
        'согласен с обработкой персональных данных в соответствии с': 'I agree with the',
        'я прочитал и согласен с': 'I agree with the',
        'обращаем ваше внимание!': 'please note',
        'звонок по россии бесплатно': 'free calls within Russia',
        'офис в г. москва: 115280, г. москва, ул. ленинская слобода, д.19, бц омега плаза, 4 этаж, офис 4066': 'Moscow office: 115280, Moscow, Leninskaya Sloboda St., 19, Omega Plaza business center, 4th floor, office 4066',
        'для направления запросов на изготовление мебели (юридические лица, застройщики):': 'for B2B furniture requests:',
        'для направления предложений о сотрудничестве с ооо «neff»:': 'for partnership offers:',
        'copyright © 2002–2023 мебельная фабрика neff — кухонная мебель, дизайн кухни, каталог кухонной мебели.': 'Copyright © 2002-2023 NEFF furniture factory.',
        'актуальную информацию по доступности элементов кухни, цветовых решений, а также товаров для комплектации уточняйте у менеджеров—дизайнеров в студиях или онлайн консультанта. на сайте указана средняя стоимость моделей в базовой компоновке по россии и странам снг. точная стоимость выбранной вами кухни определяется регионом, в котором осуществляется продажа, и комплектацией гарнитура. компания «neff» осуществляет взаимодействие с клиентами через партнерскую розничную сеть, расчет стоимости модели и приобретение продукции возможно в любой выбранной вами кухонной студии.': 'Check availability, colors, accessories, and final prices with a studio designer or online consultant. Prices on the site are average base model prices; the final price depends on region and configuration.',

        'суперрассрочка': 'super installment plan',
        'суперрассрочка 0/0/12': 'super installment plan 0/0/12',
        'мебель «neff» без первоначального взноса и переплаты на 12 месяцев.': 'NEFF furniture: 12 months, no down payment.',
        'мебель «neff» без первоначального взноса и переплаты на 12 месяцев': 'NEFF furniture: 12 months, no down payment',
        'кухни на заказ от': 'custom kitchens from',
        'фабрики «neff»': 'the NEFF factory',
        'кухни на заказ от фабрики neff': 'custom kitchens from the NEFF factory',
        'мебельная фабрика neff. мы занимаемся разработкой, производством и реализацией мебели в москве и рф. изготовим мебель для вас за 14 дней. вся мебель изготавливается': 'NEFF designs and makes custom furniture in Russia. Your furniture is ready in 14 days',
        'по индивидуальному проекту.': 'from an individual project.',
        'заказов выполнено с 2008 года': 'orders since 2008',
        'бесплатный дизайн-проект': 'free design',
        'каталог': 'catalog',
        'процесс': 'process',
        'акции и скидки на кухни': 'kitchen deals',
        'отзывы звезд': 'star reviews',
        'отзывы клиентов': 'client reviews',
        'проекты «кухня на заказ»': 'custom kitchen projects',
        'телепроекты': 'TV projects',
        'лучшее': 'best',
        '3d тур': '3D tour',
        'хочу проект ›': 'I want a project ›',
        'читать полностью': 'read full story',
        'перейти в каталог кухонь': 'go to catalog',
        'все акции': 'all promotions',
        'все проекты': 'all projects',
        'все студии': 'all studios',
        'адреса': 'addresses',
        'популярное': 'popular',
        'проект месяца': 'project of the month',
        'выполненные проекты': 'projects',
        'выполненные проекты в г. москва': 'Moscow projects',
        'кухни наших сотрудников': 'team kitchens',
        'почему кухню стоит заказать у нас?': 'why choose us?',
        'почему кухню стоит': 'why choose',
        'заказать в «neff»?': 'NEFF?',
        'широкий выбор моделей, материалов, возможностей для дизайна, а также собственное производство — всё это позволяет создавать действительно уникальные проекты с учетом пожеланий заказчика индивидуально. многолетний опыт и надежные партнеры дают нам уверенность в качестве нашей продукции, именно поэтому мы даем гарантию 20 лет на наши кухни.': 'A wide choice of models, materials, and finishes plus our own production lets us make individual projects. Our experience and partners let us give a 20-year kitchen warranty.',
        'компания «neff» создает мебель, которая в радость!': 'NEFF creates furniture that brings joy.',
        'нас знают и любят в 130 городах россии и стран снг. вместе принесли счастье в более чем 500 000 семей, создав индивидуальные проекты кухонь, шкафов и мебели для ванных комнат.': 'NEFF is known in 130 cities and has completed more than 500,000 custom kitchen, wardrobe, and bathroom projects.',
        'создать интерьер дома в едином стиле с компанией «neff» очень просто! кухни, шкафы, мебель для ванных комнат — разработаем индивидуальный проект, предложим возможность реализовать заказ от начала и до конца удаленно, привезем и установим точно в срок.': 'NEFF makes kitchens, wardrobes, and bathroom furniture in one style: design, remote order support, delivery, and installation.',
        'чтобы купить мебель для кухни на заказ в москве, регионах рф и снг или задать тематические вопросы специалисту, обратитесь к нам по контактному телефону или через интернет, используя форму онлайн-связи. хотите лично осмотреть гарнитуры, которые мы выпускаем? на официальном сайте кухонь «neff» вы найдете адреса наших салонов. приезжайте, мы будем рады вашему визиту.': 'To order a custom kitchen or ask a specialist a question, contact us by phone or through the online form. Showroom addresses are listed on the site.',

        'подарок': 'gift',
        'рассрочка': 'installment plan',
        'комплект': 'bundle',
        '2+2 акция': '2+2 promotion',
        '2+2: варочная панель и вытяжка в подарок': '2+2: cooktop and hood as a gift',
        'дарим технику при покупке кухни «neff»!': 'appliances as a gift',
        'больше техники – больше скидка на кухню!': 'more appliances, bigger discount',
        'больше техники — больше скидка на кухню!': 'more appliances, bigger discount',
        'кухня и техника: вместе выгодно!': 'kitchen plus appliances',
        'срок действия': 'validity period',
        'срок действия акций': 'promotion period',

        'красивые проекты': 'beautiful projects',
        'звездные кухни': 'celebrity kitchens',
        'голубая кухня': 'blue kitchen',
        'голубые кухни: дизайн, фото в интерьере': 'blue kitchen ideas',
        'маленькая кухня': 'small kitchen',
        'маленькая кухня: 6 способов сделать ее удобной': '6 small kitchen tips',
        'кухни п-образной планировки': 'U-shaped kitchens',
        '5 идей фартука для белой кухни': '5 backsplash ideas for a white kitchen',
        'бестселлеры-2022': 'bestsellers 2022',
        '7 советов, как создать на кухне уют и красоту': '7 kitchen comfort tips',
        'категории статей': 'article categories',
        'список статей': 'article list',
        'пагинация статей': 'article pagination',
        '1 - 18 из 292': '1 - 18 of 292',
        '2 142 просмотров': '2,142 views',
        'кухонный интерьер': 'kitchen interior',
        'дизайн кухни': 'kitchen design',

        'кухня nicolle': 'Nicolle kitchen',
        'кухня teramo': 'Teramo kitchen',
        'кухня antro': 'Antro kitchen',
        'кухня mix 22': 'Mix 22 kitchen',
        'кухня spark': 'Spark kitchen',
        'кухня': 'kitchen',
        'мдф': 'MDF',
        'неоклассика': 'neoclassic',
        'современные': 'modern',
        'классические': 'classic',
        'кухни неоклассика': 'neoclassic kitchens',
        'мебель для ванных': 'bathroom furniture',
        'бронзовый спарк': 'Bronze Spark',
        'лофт': 'loft',
        'скандинавский': 'Scandinavian',
        'эклектика': 'eclectic',
        'современный стиль': 'modern style',
        'неоклассический стиль': 'neoclassical style',
        'классический стиль': 'classic style',
        'распашные': 'hinged',
        'купе': 'sliding door',
        'гардеробные': 'walk-in closets',
        'диваны': 'sofas',
        'детские': 'kids rooms',

        'кухня для ксении собчак': 'Ksenia Sobchak kitchen',
        'кухня для резидентов comedy club: стекло, дерево и бетон': 'Comedy Club kitchen: glass, wood, concrete',
        'кухня для резидента comedy club: стекло, дерево и бетон': 'Comedy Club kitchen: glass, wood, concrete',
        'место, где рождается энергия': 'a place of energy',
        'место энергии': 'place of energy',
        'проект собчак': 'Sobchak project',
        'звездный проект': 'celebrity project',
        'планировка': 'layout',
        'продукт': 'product',
        'модель': 'model',
        'цвет': 'color',
        'размер помещения': 'room size',
        'еще фильтры': 'more filters',
        'применить': 'apply',
        'дизайнер: дизайн-бюро "neff"': 'designer: NEFF design bureau',
        'дизайнер: марина максимова': 'designer: Marina Maksimova',
        'максимова марина': 'Marina Maksimova',
        'хващевская татьяна': 'Tatyana Khvashchevskaya',
        '"neff" дизайн-бюро': 'NEFF design bureau',

        'получите': 'get',
        'бесплатный': 'free',
        'дизайн-проект': 'design project',
        'вашу мебель': 'your furniture',
        'поможем выбрать': 'we will help you choose',
        'ваше имя': 'your name',
        'имя': 'name',
        'телефон': 'phone',
        'город': 'city',
        'москва': 'Moscow',
        'москва и область': 'Moscow and region',
        'санкт-петербург': 'Saint Petersburg',
        'в г. москва': 'in Moscow',
        'варшавское ш., д. 82': 'Varshavskoe highway, 82',
        'м. варшавская': 'Varshavskaya metro station',
        'пн-вс: 10.00 - 22.00': 'Mon-Sun: 10:00 - 22:00',
        'студия': 'studio',
        'студия на варшавском': 'studio on Varshavskoe',
        '48 студий': '48 studios',

        'вход': 'sign in',
        'нет аккаунта?': 'no account?',
        'зарегистрироваться': 'register',
        'регистрация': 'registration',
        'уже есть аккаунт?': 'already have an account?',
        'фио': 'full name',
        'телефон (только рб)': 'phone (Belarus only)',
        'дата рождения (от 16 лет)': 'date of birth (16+)',
        'никнейм': 'nickname',
        'пароль': 'password',
        'повторите пароль': 'repeat password',
        'от 8 до 20 символов': '8 to 20 characters',
        'введите пароль': 'enter password',
        'введите пароль еще раз': 'enter password again',
        'иванов иван иванович': 'Ivanov Ivan Ivanovich',

        'анна': 'Anna',
        'анна хилькевич': 'Anna Khilkevich',
        'ксения собчак': 'Ksenia Sobchak',
        'актриса': 'actress',
        'актер': 'actor',
        'журналист и телеведущая': 'journalist and TV host',
        'кухни neff - отзывы клиентов в г. москва': 'NEFF kitchen reviews in Moscow',
        'анна хилькевич на своей новой белой кухне neff': 'Anna Khilkevich in her white NEFF kitchen',
        'вертикальные шкафы-пеналы со встроенной техникой': 'built-in appliance towers',
        'выдвижной механизм lemans для углового шкафа': 'Lemans corner pull-out',
        'получилось именно так, как я хотела. кухня моя – светлая, легкая, уютная. здесь много воздуха и все вокруг радует глаз, вдохновляет, приносит удовольствие!': 'It turned out exactly as I wanted: bright, light, and cozy.',
        'первое, что говорят мои друзья, когда заходят в мой дом: «боже, какая у тебя невероятная кухня! – признается ксения. – наверное, это самая главная и важная часть дома, где мы проводим больше всего времени.': 'Friends always notice the kitchen first. It is the main place at home.',
        'еще': 'more',

        '15 лет на рынке': '15 years on the market',
        'мебель за 14 дней': 'furniture in 14 days',
        'гарантия 2 года': '2-year warranty',
        'собственное производство.': 'own production.',
        'разработаем проект мечты.': 'we will design your dream project.',
        'доставим бережно и в срок.': 'we will deliver carefully and on time.',
        'профессиональный монтаж.': 'professional installation.',
        'производство мебели': 'furniture production',
        'создание дизайн-проекта кухни': 'kitchen design project creation',
        'доставка': 'delivery',
        'сборка': 'assembly',
        'бесплатный замер': 'free measurement',
        'бесплатный дизайн-проект и визуализация': 'free design and render',
        'качество': 'quality',
        'опыт': 'experience',
        'гарантия': 'warranty',
        'сроки': 'timing',
        'высокое качество': 'high quality',
        'гарантии качества кухни от производителя': 'manufacturer quality guarantee',
        'наши замерщики приедут в удобное для вас время': 'we measure at a convenient time',
        'мы изготовили более 500 тысяч кухонь по индивидуальному проекту': '500,000+ custom kitchens made',
        'мы уверены в своих кухнях благодаря каркасам: больше никто из российских производителей не дает такой гарантии': 'our frames let us give a rare long warranty',
        'наши решения для хранения позволяют вместить все от столовых приборов до бытовой техники и посуды': 'our storage fits cutlery, appliances, and dishes',
        'элитные гарнитуры от фабрики «neff» обладают ярким дизайном. в продаже представлен широкий ассортимент моделей от модерна до классики. стильные кухни от производителя характеризуются эргономичностью, функциональностью и удобством, что достигается посредством использования высококачественных комплектующих.': 'Premium NEFF sets combine expressive design, ergonomics, and high-quality components.',
        'лучшие кухни создаются нами совместно с ведущими итальянскими дизайнерами, в частности из компании adriani & rossi. европейские специалисты разрабатывают стильный индивидуальный дизайн мебели, подбирают материалы, встраиваемую технику, аксессуары. в результате получается гармоничная и завершенная кухонная композиция для вашего дома.': 'Our best kitchens are designed with Italian specialists who select materials, appliances, and accessories for a complete home composition.',
        'качество наших гарнитуров подтверждается сертификатом соответствия, выданным по итогам испытаний соответствующей службой цсмс. мы производим бюджетные и элитные кухни на заказ из экологичных материалов. об этом свидетельствует полученный нами гигиенический сертификат, который был выдан санитарно-эпидемиологической службой. также безопасность и удобство кухонь «neff» подтверждены опытом потребителей, которые пользуются нашей стильной мебелью вот уже 23 года.': 'NEFF quality is confirmed by certificates and long customer experience. We make custom kitchens from eco-friendly materials.',
        'чтобы кухонная мебель идеально вписалась в имеющееся пространство, наши мастера бесплатно выполнят замеры помещения, зафиксируют расположение дверей, окон и коммуникаций, другие особенности. после снятия замеров с вами побеседует дизайнер нашей фабрики кухонной мебели. он уточнит модель, выбранную вами, и ваши пожелания. когда вы приедете к нам в студию, вас уже будет ожидать несколько проектов стильных и функциональных кухонь, разработанных бесплатно.': 'We measure the room for free, note all details, and prepare several stylish and functional kitchen projects before your studio visit.',
        'изготовление кухни — это сложный многоступенчатый процесс. но для наших клиентов — это всего четыре простых шага в сопровождении персонального дизайнера.': 'For clients, kitchen production is four simple steps with a personal designer.',
        'воспользуйтесь личным кабинетом, чтобы спланировать кухню, заключить договор и оплатить покупку удаленно': 'use your account to plan, sign, and pay remotely',
        'еще до начала ремонта дизайнер предложила нестандартный вариант планировки, который очень привлек нас большим открыты...': 'even before renovation began, the designer suggested an unusual layout option that strongly attracted us...',
        'ваш комментарий...': 'your comment...'
    };

    const originalText = new WeakMap();
    const originalAttrs = new WeakMap();
    let applying = false;

    function normalize(value) {
        return value.replace(/\s+/g, ' ').trim();
    }

    function hasCyrillic(value) {
        return /[\u0400-\u04ff]/.test(value);
    }

    function isUpper(value) {
        const letters = value.replace(/[^\u0400-\u04ffA-Za-z]/g, '');
        return letters.length > 1 && letters === letters.toUpperCase();
    }

    function isCapitalized(value) {
        const first = value.trim()[0];
        return first && first === first.toUpperCase() && first !== first.toLowerCase();
    }

    function formatCase(source, translated) {
        if (isUpper(source)) return translated.toUpperCase();
        if (isCapitalized(source)) return translated.charAt(0).toUpperCase() + translated.slice(1);
        return translated;
    }

    function translateValue(value, lang) {
        if (lang === 'ru') return value;

        const normalized = normalize(value);
        const key = normalized.toLowerCase();
        let translated = dictionary[key];

        if (!translated && normalized.startsWith('Изображение:')) {
            translated = normalized.replace('Изображение:', 'Image:');
        }

        if (!translated) return value;
        return value.replace(normalized, formatCase(normalized, translated));
    }

    function translateTextNode(node, lang) {
        if (!originalText.has(node)) {
            originalText.set(node, node.nodeValue);
        }
        const source = originalText.get(node);
        if (!hasCyrillic(source)) return;
        node.nodeValue = translateValue(source, lang);
    }

    function translateAttributes(element, lang) {
        const attrs = ['placeholder', 'alt', 'title', 'aria-label', 'value'];
        attrs.forEach(attr => {
            if (!element.hasAttribute(attr)) return;
            if (attr === 'value' && !['BUTTON', 'OPTION', 'INPUT'].includes(element.tagName)) return;

            let saved = originalAttrs.get(element);
            if (!saved) {
                saved = {};
                originalAttrs.set(element, saved);
            }
            if (!saved[attr]) {
                saved[attr] = element.getAttribute(attr);
            }

            const source = saved[attr];
            if (hasCyrillic(source)) {
                element.setAttribute(attr, translateValue(source, lang));
            }
        });
    }

    function walk(root, lang) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
            {
                acceptNode(node) {
                    const parent = node.parentElement;
                    if (parent && ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let node = walker.currentNode;
        while (node) {
            if (node.nodeType === Node.TEXT_NODE) {
                translateTextNode(node, lang);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                translateAttributes(node, lang);
            }
            node = walker.nextNode();
        }
    }

    function setActiveLanguage(lang) {
        document.documentElement.lang = lang;
        document.querySelectorAll('.lang-btn').forEach(button => {
            button.classList.toggle('is-active', button.dataset.lang === lang);
        });
    }

    function applyLanguage(lang) {
        applying = true;
        localStorage.setItem(STORAGE_KEY, lang);
        walk(document.body, lang);
        translateAttributes(document.querySelector('title'), lang);
        document.title = translateValue(originalTitle, lang);
        setActiveLanguage(lang);
        applying = false;
    }

    const originalTitle = document.title;

    window.NeffI18n = {
        setLanguage: applyLanguage,
        refresh() {
            applyLanguage(localStorage.getItem(STORAGE_KEY) || 'ru');
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        const urlLang = new URLSearchParams(window.location.search).get('lang');
        const savedLang = ['ru', 'en'].includes(urlLang) ? urlLang : (localStorage.getItem(STORAGE_KEY) || 'ru');
        applyLanguage(savedLang);

        const observer = new MutationObserver(mutations => {
            if (applying) return;
            const lang = localStorage.getItem(STORAGE_KEY) || 'ru';
            if (lang === 'ru') return;

            applying = true;
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                        walk(node, lang);
                    }
                });
            });
            setActiveLanguage(lang);
            applying = false;
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });
})();

// Заголовки (title) и описания (description) страниц для поиска.
// Бренд « | VIVA Ästhetik » добавляется к title автоматически (кроме главной).
// Описания держим до ~155 символов, title — до ~45 (с брендом ~60).
//
// Про слово «Botox»: это название рецептурного препарата, реклама которого перед публикой
// ограничена законом (§ 10 HWG). Поэтому в заголовках основное слово — «Botulinum(toxin)»,
// а «Botox®» стоит в скобках, как справочное название.

type Pair = { de: { title: string; description: string }; ru: { title: string; description: string } };

export const pageSeo: Record<string, Pair> = {
  home: {
    de: {
      title: 'Ästhetische Medizin in Kassel – VIVA Ästhetik | Natalya Schnal',
      description:
        'Ästhetische Medizin in Kassel: Faltenbehandlung mit Botulinum (Botox®) & Hyaluron, Mesotherapie, PRP u. a. bei Ärztin Natalya Schnal. Termin online buchen.',
    },
    ru: {
      title: 'Эстетическая медицина в Касселе – VIVA Ästhetik',
      description:
        'Эстетическая медицина в Касселе у врача Натальи Шналь: ботулинотерапия (Botox®), филлеры, мезотерапия, PRP, нитевой лифтинг. Запись онлайн.',
    },
  },
  services: {
    de: {
      title: 'Leistungen – Ästhetische Behandlungen in Kassel',
      description:
        'Alle Behandlungen im Überblick: Botulinum, Hyaluron, Lippen, Mesotherapie, PRP, Fadenlifting, Lipolyse und Intimlifting in Kassel.',
    },
    ru: {
      title: 'Услуги – эстетическая медицина в Касселе',
      description:
        'Все процедуры: ботулинотерапия, гиалуроновые филлеры, губы, мезотерапия, PRP, нитевой лифтинг, липолиз. Практика эстетической медицины в Касселе.',
    },
  },
  prices: {
    de: {
      title: 'Preise für ästhetische Behandlungen in Kassel',
      description:
        'Preisübersicht für Botulinum, Hyaluron, Mesotherapie, PRP und mehr in Kassel. Den endgültigen Preis besprechen wir nach der persönlichen Beratung.',
    },
    ru: {
      title: 'Цены на процедуры эстетической медицины в Касселе',
      description:
        'Ориентировочные цены на ботулинотерапию, филлеры, мезотерапию, PRP и другие процедуры в Касселе. Окончательную стоимость называем после консультации.',
    },
  },
  about: {
    de: {
      title: 'Ärztin Natalya Schnal – ästhetische Medizin in Kassel',
      description:
        'Lernen Sie Natalya Schnal kennen: Ärztin (Innere Medizin) mit Praxis für ästhetische Medizin in Kassel – Werdegang, Philosophie und Behandlungsansatz.',
    },
    ru: {
      title: 'Врач Наталья Шналь – эстетическая медицина в Касселе',
      description:
        'Познакомьтесь с Натальей Шналь: врач (терапевт), практика эстетической медицины в Касселе – образование, опыт и подход к лечению.',
    },
  },
  contact: {
    de: {
      title: 'Kontakt & Anfahrt – Königstor 47, Kassel',
      description:
        'VIVA Ästhetik, Königstor 47, 34117 Kassel: Telefon +49 179 9004902, WhatsApp, E-Mail und Öffnungszeiten. Jetzt Termin vereinbaren oder Nachricht senden.',
    },
    ru: {
      title: 'Контакты и как добраться – Königstor 47, Кассель',
      description:
        'VIVA Ästhetik, Königstor 47, 34117 Кассель: телефон +49 179 9004902, WhatsApp, e-mail и часы работы. Запишитесь на приём или напишите нам.',
    },
  },
  faq: {
    de: {
      title: 'Häufige Fragen zu Botulinum, Hyaluron & Mesotherapie',
      description:
        'Antworten auf häufige Fragen zu Faltenbehandlung, Hyaluron, Mesotherapie, PRP und Lipolyse: Ablauf, Wirkung, Nachsorge und Risiken.',
    },
    ru: {
      title: 'Частые вопросы: ботулинотерапия, филлеры, мезотерапия',
      description:
        'Ответы на частые вопросы о коррекции морщин, гиалуроновых филлерах, мезотерапии, PRP и липолизе: ход процедуры, эффект, уход и риски.',
    },
  },
  tips: {
    de: {
      title: 'Empfehlungen zur Pflege nach der Behandlung',
      description:
        'Praktische Empfehlungen von Ärztin Natalya Schnal: wie Sie Ihre Haut nach Hyaluron, Botulinum, Mesotherapie und anderen Behandlungen richtig pflegen.',
    },
    ru: {
      title: 'Советы по уходу за кожей после процедур',
      description:
        'Рекомендации врача Натальи Шналь: как правильно ухаживать за кожей после гиалуроновых филлеров, ботулинотерапии, мезотерапии и других процедур.',
    },
  },
  booking: {
    de: {
      title: 'Termin online buchen',
      description:
        'Buchen Sie Ihren Termin für ästhetische Medizin in Kassel online: Behandlung, Datum und Uhrzeit wählen – schnell und unkompliziert.',
    },
    ru: {
      title: 'Онлайн-запись на приём',
      description:
        'Запишитесь на приём по эстетической медицине в Касселе онлайн: выберите процедуру, дату и время – быстро и просто.',
    },
  },
  impressum: {
    de: { title: 'Impressum', description: 'Impressum und Anbieterkennzeichnung von VIVA Ästhetik, Praxis für ästhetische Medizin in Kassel.' },
    ru: { title: 'Импрессум', description: 'Импрессум и данные о поставщике услуг VIVA Ästhetik, практика эстетической медицины в Касселе.' },
  },
  datenschutz: {
    de: { title: 'Datenschutzerklärung', description: 'Informationen zum Datenschutz auf der Website von VIVA Ästhetik, Praxis für ästhetische Medizin in Kassel.' },
    ru: { title: 'Политика конфиденциальности', description: 'Информация о защите данных на сайте VIVA Ästhetik, практика эстетической медицины в Касселе.' },
  },
  agb: {
    de: { title: 'Allgemeine Geschäftsbedingungen (AGB)', description: 'Allgemeine Geschäftsbedingungen von VIVA Ästhetik, Praxis für ästhetische Medizin in Kassel.' },
    ru: { title: 'Общие условия (AGB)', description: 'Общие условия оказания услуг VIVA Ästhetik, практика эстетической медицины в Касселе.' },
  },
};

export const serviceSeo: Record<string, Pair> = {
  botox: {
    de: {
      title: 'Botulinum (Botox®) Kassel – Faltenbehandlung',
      description:
        'Faltenbehandlung mit Botulinumtoxin (Botox®) in Kassel: Ablauf, Wirkung und Dauer erklärt. Persönliche Beratung bei Ärztin Natalya Schnal.',
    },
    ru: {
      title: 'Ботулинотерапия (Botox®) в Касселе',
      description:
        'Коррекция мимических морщин ботулотоксином (Botox®) в Касселе: ход процедуры, эффект, длительность. Консультация врача Натальи Шналь, запись онлайн.',
    },
  },
  faltenunterspritzung: {
    de: {
      title: 'Hyaluron-Faltenunterspritzung in Kassel',
      description:
        'Faltenunterspritzung mit Hyaluronsäure in Kassel: Nasolabialfalten, Wangen, Lippen u. a. Ablauf, Haltbarkeit und Nachsorge. Beratung bei Ärztin Natalya Schnal.',
    },
    ru: {
      title: 'Гиалуроновые филлеры в Касселе',
      description:
        'Контурная пластика морщин гиалуроновой кислотой в Касселе: носогубные складки, скулы, губы и др. Ход процедуры, эффект, уход. Запись на консультацию.',
    },
  },
  lippenkorrektur: {
    de: {
      title: 'Lippen aufspritzen mit Hyaluron in Kassel',
      description:
        'Lippenkorrektur und Lippenaufbau mit Hyaluronsäure in Kassel: natürliche Ergebnisse, ausführliche Beratung, Ablauf und Nachsorge. Jetzt Termin buchen.',
    },
    ru: {
      title: 'Увеличение губ гиалуроном в Касселе',
      description:
        'Коррекция и увеличение губ гиалуроновой кислотой в Касселе: естественный результат, подробная консультация, ход процедуры и уход. Запись онлайн.',
    },
  },
  biorevitalisierung: {
    de: {
      title: 'Biorevitalisierung & Skinbooster in Kassel',
      description:
        'Biorevitalisierung mit Hyaluronsäure in Kassel: Feuchtigkeit, Elastizität und ein frisches Hautbild. Ablauf, Kur und Wirkung erklärt. Termin online buchen.',
    },
    ru: {
      title: 'Биоревитализация в Касселе',
      description:
        'Биоревитализация гиалуроновой кислотой в Касселе: увлажнение, упругость и свежий вид кожи. Курс, ход процедуры, эффект. Запись на консультацию.',
    },
  },
  mesotherapie: {
    de: {
      title: 'Mesotherapie in Kassel – Gesicht & Haare',
      description:
        'Mesotherapie mit der Mesopistole in Kassel: Wirkstoffe für Gesicht, Hals und Kopfhaut. Ablauf, Anzahl der Sitzungen und Nachsorge – Termin buchen.',
    },
    ru: {
      title: 'Мезотерапия в Касселе – лицо и волосы',
      description:
        'Мезотерапия мезопистолетом в Касселе: коктейли для лица, шеи и кожи головы. Ход процедуры, число сеансов, уход. Запись онлайн.',
    },
  },
  vampirlifting: {
    de: {
      title: 'Vampirlifting (PRP) in Kassel – Eigenplasma',
      description:
        'Vampirlifting / PRP-Therapie mit Eigenplasma in Kassel: Hautbild, Narben, Augenringe, Haare. Ablauf, Wirkung, Gegenanzeigen. Beratung bei Ärztin Natalya Schnal.',
    },
    ru: {
      title: 'Вампир-лифтинг (PRP) в Касселе',
      description:
        'PRP-терапия собственной плазмой в Касселе: качество кожи, рубцы, тёмные круги, волосы. Ход процедуры, эффект, противопоказания. Консультация врача.',
    },
  },
  radiesse: {
    de: {
      title: 'Radiesse Kollagenstimulation in Kassel',
      description:
        'Kollagenstimulation mit Radiesse® in Kassel: sanftes Volumen, Straffung und bessere Hautstruktur. Information und Beratung bei Ärztin Natalya Schnal.',
    },
    ru: {
      title: 'Radiesse – стимуляция коллагена в Касселе',
      description:
        'Стимуляция коллагена с Radiesse® в Касселе: мягкий объём, подтяжка и лучшая структура кожи. Информация и консультация врача Натальи Шналь.',
    },
  },
  fadenlifting: {
    de: {
      title: 'Fadenlifting in Kassel – sanftes Lifting',
      description:
        'Fadenlifting in Kassel: minimalinvasives Anheben und Straffen von Wangen, Kinn und Hals. Ablauf, Risiken und Haltbarkeit. Termin zur Beratung buchen.',
    },
    ru: {
      title: 'Нитевой лифтинг в Касселе',
      description:
        'Нитевой лифтинг в Касселе: малоинвазивная подтяжка щёк, подбородка и шеи. Ход процедуры, риски, длительность эффекта. Запись на консультацию.',
    },
  },
  haarausfall: {
    de: {
      title: 'Haarausfall-Behandlung Kassel – Mesotherapie',
      description:
        'Mesotherapie bei Haarausfall in Kassel: Wirkstoffe direkt in die Kopfhaut, ohne Ausfallzeit. Beratung und Behandlung bei Ärztin Natalya Schnal.',
    },
    ru: {
      title: 'Лечение выпадения волос в Касселе',
      description:
        'Мезотерапия при выпадении волос в Касселе: активные вещества прямо в кожу головы, без времени на восстановление. Консультация врача Натальи Шналь.',
    },
  },
  'prp-kopfhaut': {
    de: {
      title: 'PRP-Therapie für Haare in Kassel',
      description:
        'PRP-Therapie mit Eigenplasma für die Kopfhaut in Kassel – bei Haarausfall und für kräftigeres Haar. Ablauf und Vorteile. Termin online buchen.',
    },
    ru: {
      title: 'PRP-терапия для волос в Касселе',
      description:
        'PRP-терапия собственной плазмой для кожи головы в Касселе – при выпадении волос и для их укрепления. Ход процедуры и преимущества. Запись онлайн.',
    },
  },
  lipolyse: {
    de: {
      title: 'Fett-weg-Spritze (Lipolyse) in Kassel',
      description:
        'Injektionslipolyse in Kassel: gezielte Fettreduktion an Doppelkinn, Bauch, Hüften u. a. Ablauf, Wirkung und Nebenwirkungen. Beratung bei Ärztin Natalya Schnal.',
    },
    ru: {
      title: 'Инъекционный липолиз в Касселе',
      description:
        'Инъекционный липолиз в Касселе: целенаправленное уменьшение жировых отложений – двойной подбородок, живот, бока. Ход процедуры, эффект, побочные эффекты.',
    },
  },
  intimlifting: {
    de: {
      title: 'Intimlifting in Kassel',
      description:
        'Intimlifting in Kassel: minimalinvasive, diskrete Straffung und Verjüngung des Intimbereichs. Information und persönliche Beratung – Termin buchen.',
    },
    ru: {
      title: 'Интимный лифтинг в Касселе',
      description:
        'Интимный лифтинг в Касселе: малоинвазивное, деликатное подтягивание и омоложение интимной зоны. Информация и личная консультация, запись онлайн.',
    },
  },
};

// Названия страниц для «хлебных крошек» (BreadcrumbList).
export const crumbNames: Record<string, { de: string; ru: string }> = {
  home: { de: 'Startseite', ru: 'Главная' },
  services: { de: 'Leistungen', ru: 'Услуги' },
  prices: { de: 'Preise', ru: 'Цены' },
  about: { de: 'Über mich', ru: 'Обо мне' },
  contact: { de: 'Kontakt', ru: 'Контакты' },
  faq: { de: 'FAQ', ru: 'Частые вопросы' },
  tips: { de: 'Empfehlungen', ru: 'Советы' },
  booking: { de: 'Terminbuchung', ru: 'Запись' },
  impressum: { de: 'Impressum', ru: 'Импрессум' },
  datenschutz: { de: 'Datenschutz', ru: 'Конфиденциальность' },
  agb: { de: 'AGB', ru: 'AGB' },
};

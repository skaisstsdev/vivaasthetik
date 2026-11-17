// Отзывы из профиля Google (VIVA Ästhetik Kassel). Снято 17.11.2026, всего 20 оценок (все 5 звёзд),
// из них 15 с текстом. Тексты не редактировались: исходный язык отзыва — в поле `lang`,
// второй язык — машинный перевод Google (помечается на сайте как «Übersetzt von Google»).
//
// Чтобы обновить: добавьте объект в начало списка. Чтобы скрыть отзыв, поставьте hidden.
// Имена сокращены до имени и первой буквы фамилии.
//
// ВАЖНО: отзывы, где пациенты называют препарат «Botox», по умолчанию скрыты (hidden: 'botox'):
// отзывы третьих лиц о рецептурном препарате могут нарушать § 11 HWG. Если решите показывать их
// на свой риск, уберите поле hidden у нужных записей.

export type Review = {
  id: string;
  name: string;
  rating: 5;
  /** Язык оригинала */
  lang: 'de' | 'ru';
  /** Текст на каждом языке: на языке оригинала — оригинал, на другом — перевод Google */
  text: { de: string; ru: string };
  hidden?: 'botox' | 'other';
};

export const GOOGLE_RATING = { score: 5.0, count: 20 } as const;

export const reviews: Review[] = [
  {
    id: 'alena-s',
    name: 'Alena S.',
    rating: 5,
    lang: 'de',
    text: {
      de: 'Ich komme regelmäßig in die Praxis und fühle mich jedes Mal bestens aufgehoben. Meiner Ärztin vertraue ich voll und ganz: Ich äußere meine Wünsche, und sie empfiehlt mir ehrlich und kompetent, welche Behandlung sinnvoll ist und zu mir passt. Alles wird verständlich erklärt und individuell abgestimmt. Die Ergebnisse übertreffen immer wieder meine Erwartungen – eine absolute Herzensempfehlung!',
      ru: 'Я регулярно посещаю эту клинику и всегда чувствую себя в надежных руках. Я полностью доверяю своему врачу: я высказываю свои пожелания, и она честно и компетентно рекомендует подходящее именно мне лечение. Все объясняется четко и с учетом моих индивидуальных потребностей. Результаты неизменно превосходят мои ожидания – я от всей души рекомендую ее!',
    },
  },
  {
    id: 'hilola-k',
    name: 'Hilola K.',
    rating: 5,
    lang: 'de',
    text: {
      de: 'Ich bin sehr zufrieden mit meiner Erfahrung bei VIVA Ästhetik in Kassel. Die Atmosphäre ist angenehm und professionell. Ich habe mich gut aufgehoben und beraten gefühlt. Die Behandlung wurde sorgfältig durchgeführt und ich habe mich während des Termins wohlgefühlt. Ich kann VIVA Ästhetik auf jeden Fall weiterempfehlen und komme gerne wieder!',
      ru: 'Я очень довольна своим визитом в VIVA Aesthetics в Касселе. Атмосфера приятная и профессиональная. Я чувствовала себя окруженной заботой и получила полезные советы. Процедура была проведена тщательно, и я чувствовала себя комфортно на протяжении всего приема. Я определенно могу рекомендовать VIVA Aesthetics и с удовольствием вернусь!',
    },
  },
  {
    id: 'svetlana-w',
    name: 'Svetlana W.',
    rating: 5,
    lang: 'de',
    text: {
      de: 'Ich bin absolut begeistert von VIVA Ästhetik Kassel! Natascha hat bei mir die Behandlung durchgeführt und alles perfekt gemacht. Sie arbeitet hoch professionell, ist super freundlich und nimmt sich viel Zeit für ihre Kunden. Ich habe mich rundum wohlgefühlt und das Ergebnis ist fantastisch. Vielen Dank, liebe Natascha! Ich komme auf jeden Fall wieder. Svetlana',
      ru: 'Я в полном восторге от VIVA Aesthetics Kassel! Наташа провела мне процедуру и сделала все идеально. Она очень профессиональна, невероятно дружелюбна и уделяет своим клиентам много времени. Я чувствовала себя совершенно комфортно, а результат просто фантастический. Огромное спасибо, дорогая Наташа! Я обязательно вернусь. Светлана',
    },
  },
  {
    id: 'ignat',
    name: 'Ignat',
    rating: 5,
    lang: 'de',
    text: {
      de: 'Ich habe mich für eine Mesotherapie bei VIVA Ästhetik entschieden und bin absolut begeistert! Schon bei der ersten Beratung fühlte ich mich sehr gut aufgehoben. Das Team ist äußerst professionell, freundlich und nimmt sich viel Zeit, um alle Fragen zu beantworten. Die Behandlung selbst war nahezu schmerzfrei, da die Expertinnen sehr behutsam und präzise arbeiten. Bereits nach ein paar Tagen konnte ich erste positive Ergebnisse sehen: meine Haut wirkte frischer, strahlender und deutlich hydratisierter. Ich kann VIVA Ästhetik jedem empfehlen, der nach einer effektiven und sicheren Methode zur Hautverbesserung sucht. Vielen Dank an das ganze Team – ich komme gerne wieder!',
      ru: 'Я выбрала мезотерапию в VIVA Aesthetics, и я в полном восторге! С первой же консультации я почувствовала, что нахожусь в надежных руках. Команда невероятно профессиональна и дружелюбна, и они уделяют достаточно времени, чтобы ответить на все мои вопросы. Сама процедура была практически безболезненной, так как специалисты работают очень бережно и точно. Уже через несколько дней я увидела первые положительные результаты: моя кожа выглядела свежее, сияющей и заметно более увлажненной. Я настоятельно рекомендую VIVA Aesthetics всем, кто ищет эффективный и безопасный способ улучшить состояние своей кожи. Огромное спасибо всей команде – я обязательно вернусь!',
    },
  },
  {
    id: 'lukas-b',
    name: 'Lukas B.',
    rating: 5,
    lang: 'de',
    text: {
      de: 'Die Beratung ist sehr umfangreich. Als Patient wird man immer wieder in die Behandlung mit einbezogen. Das Ergebnis ist sehr natürlich und sieht sehr gut aus. Ich komme jederzeit gerne wieder.',
      ru: 'Консультация очень подробная. Как пациент, вы постоянно вовлечены в процесс лечения. Результат очень естественный и выглядит великолепно. Я с удовольствием вернусь в любое время.',
    },
  },
  {
    id: 'edita-k',
    name: 'Edita K.',
    rating: 5,
    lang: 'de',
    text: {
      de: 'Ich bin sehr zufrieden mit der Behandlung bei Natalya Shnal. Die Beratung war sehr professionell und freundlich. Die Verschönerung wirkt sehr natürlich und überhaupt nicht künstlich. Besonders begeistert bin ich vom Ergebnis meiner Hände. Auch mein Gesicht wirkt nach der Behandlung deutlich jünger – bestimmt 10 Jahre. Ich kann sie nur weiterempfehlen!',
      ru: 'Я очень довольна процедурой, которую мне провела Наталья Шнал. Консультация была очень профессиональной и дружелюбной. Результаты выглядят очень естественно и совсем не искусственно. Особенно меня радуют результаты на руках. Мое лицо тоже выглядит значительно моложе после процедуры – определенно на 10 лет. Я настоятельно рекомендую её!',
    },
  },
  {
    id: 'irina-g',
    name: 'Irina G.',
    rating: 5,
    lang: 'de',
    text: {
      de: 'Hervorragende Leistung und einfach pure ästhetische Freude! Wenn ästhetische Medizin, dann für mich nur hier.',
      ru: 'Превосходное качество и истинное эстетическое наслаждение! Если мне и нужна эстетическая медицина, то это единственное место, куда я могу обратиться.',
    },
  },
  {
    id: 'elena',
    name: 'Elena',
    rating: 5,
    lang: 'ru',
    text: {
      de: 'Ein herzliches Dankeschön an Kosmetikerin Natalia für ihre Professionalität und die qualitativ hochwertigen Behandlungen!',
      ru: 'Огромная благодарность врачу-косметологу Наталье за профессионализм и качественно выполненные процедуры!',
    },
  },
  {
    id: 'annel-a',
    name: 'Annel A.',
    rating: 5,
    lang: 'ru',
    text: {
      de: 'Ich lasse mich regelmäßig von Natalia Shnal behandeln und meine Haut regenerieren, um Akne und Pigmentstörungen behandeln zu lassen. Ich sehe schon seit Langem, von Anfang an, positive Ergebnisse.',
      ru: 'регулярно обращаюсь к Наталье Шналь за услугами лечение и восстановление кожи после акне и пигментирования. очень давально результатом даже с начала прохождения процедур',
    },
  },
  {
    id: 'mimi-o',
    name: 'Mimi O.',
    rating: 5,
    lang: 'de',
    text: {
      de: 'Ich bin sehr zufrieden. Man nimmt sich super viel Zeit für die Beratung und es wird sich viel Mühe gegeben. Ich freue mich schon auf die nächste Behandlung.',
      ru: 'Я очень довольна. Они уделили много времени консультации и приложили много усилий. Я уже с нетерпением жду следующей процедуры.',
    },
  },
  {
    id: 'irina-ge',
    name: 'Irina G.',
    rating: 5,
    lang: 'de',
    text: {
      de: 'Super Beratung, Ergebnis natürlich, aber mit Erfolg. Danke Natalia, das wir länger schön sein dürfen.',
      ru: 'Отличный совет, результат естественный, но успешный. Спасибо, Наталья, за то, что помогаешь нам дольше оставаться красивыми.',
    },
  },

  // ---- Скрыты по умолчанию: в тексте названо рецептурное средство «Botox» (§ 10/§ 11 HWG) ----
  {
    id: 'hel-f',
    name: 'Hel F.',
    rating: 5,
    lang: 'de',
    hidden: 'botox',
    text: {
      de: 'Ich bin wirklich begeistert! Nach einer leider nicht gelungenen Botox-Behandlung, die ich bei einer anderen Praxis hatte, war ich zur Korrektur bei Natalya. Sie hat mich unglaublich freundlich, kompetent und ausführlich beraten, sich viel Zeit genommen und sich genau überlegt, wie sie das beste und natürlichste Ergebnis erzielen kann – und das ist ihr absolut gelungen! Besonders schön fand ich, dass sie sich sogar im Nachhinein noch persönlich erkundigt hat, ob alles in Ordnung ist. Man fühlt sich bei ihr einfach rundum gut aufgehoben. Ich komme definitiv wieder und kann sie von Herzen weiterempfehlen!',
      ru: 'Я в полном восторге! После неудачной процедуры ботокса в другой клинике я обратилась к Наталье за коррекцией. Она была невероятно дружелюбна, компетентна и внимательна во время консультации, уделила много времени и тщательно продумала, как добиться наилучших и наиболее естественных результатов – и ей это абсолютно удалось! Что мне особенно понравилось, так это то, что она даже лично перезвонила, чтобы узнать, всё ли в порядке. С ней чувствуешь себя совершенно комфортно. Я обязательно вернусь и от всей души рекомендую её!',
    },
  },
  {
    id: 'katja-w',
    name: 'Katja W.',
    rating: 5,
    lang: 'de',
    hidden: 'botox',
    text: {
      de: 'Ich war zur Botox Behandlung da und bin sehr begeistert. Gute Beratung, sauberes Arbeiten, schönes Ambiente und das wichtigste: absolut tolles Ergebnis. Ich bin mehr als zufrieden und komme regelmäßig.',
      ru: 'Я прошла процедуру ботокса и в полном восторге. Консультация была превосходной, работа выполнена чисто, атмосфера — приятной, а главное — результат просто потрясающий. Я более чем довольна и буду приходить регулярно.',
    },
  },
  {
    id: 'ekaterina-s',
    name: 'Ekaterina S.',
    rating: 5,
    lang: 'ru',
    hidden: 'botox',
    text: {
      de: 'Ich habe mir von Natalia Botox in die Stirn und um die Augen spritzen lassen und war sehr zufrieden. Natalia bot ein kostenloses Erstgespräch an, beantwortete alle meine Fragen ausführlich und war sehr freundlich und einfühlsam. Die Behandlung selbst fand zwei Wochen nach dem Beratungsgespräch statt, und weitere zwei Wochen später hatte ich eine Nachkontrolle und eine kleine Korrektur. Jetzt sehe ich schön und glücklich aus und hoffe, dass das Ergebnis lange anhält.',
      ru: 'Делала у Натальи ботокс лба и области вокруг глаз, и осталась очень довольна. Наталья провела первую консультацию бесплатно, при этом подробно ответила на все мои вопросы, была очень доброжелательна и тактична. Саму процедуру провели через 2 недели после консультации, и еще через 2 недели была проверка результата и небольшая корректировка. Теперь я хожу красивая и счастливая, и надеюсь, что результат будет радовать меня еще долго.',
    },
  },
  // ---- Скрыт: в тексте другое название клиники («Vita Klinik») — похоже на прежнее имя или ошибку ----
  {
    id: 'diana-v',
    name: 'Diana V.',
    rating: 5,
    lang: 'de',
    hidden: 'other',
    text: {
      de: 'War wegen Botox Behandlung in der Vita Klinik. Ich wurde professionell und verständlich über die Behandlung aufgeklärt, Frau Schnall hat die Behandlung steril durchgeführt, war auch schmerzlos. Innerhalb von paar Wochen hatte ich schon Ergebnis gesehen und bin damit sehr zufrieden. Ich kann Vita Klinik nur weiterempfehlen',
      ru: 'Я прошла процедуру ботокса в клинике Vita. Мне профессионально и понятно объяснили всю процедуру. Г-жа Шналл провела процедуру с использованием стерильных методов, и она была безболезненной. Результаты я увидела уже через несколько недель и очень довольна. Я настоятельно рекомендую клинику Vita.',
    },
  },
];

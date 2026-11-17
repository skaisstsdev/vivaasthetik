// Группы услуг: общий порядок и состав для страницы услуг и страницы цен.
// Услуга, которой нет ни в одной группе, попадёт в «Weitere» — так она не пропадёт.
export const serviceGroups: { title: { de: string; ru: string }; slugs: string[] }[] = [
  {
    title: { de: 'Falten & Volumen', ru: 'Морщины и объём' },
    slugs: ['botox', 'faltenunterspritzung', 'lippenkorrektur'],
  },
  {
    title: { de: 'Hautqualität & Lifting', ru: 'Качество кожи и лифтинг' },
    slugs: ['biorevitalisierung', 'mesotherapie', 'vampirlifting', 'radiesse', 'fadenlifting'],
  },
  {
    title: { de: 'Haare', ru: 'Волосы' },
    slugs: ['haarausfall', 'prp-kopfhaut'],
  },
  {
    title: { de: 'Körper & Intimbereich', ru: 'Тело и интимная зона' },
    slugs: ['lipolyse', 'intimlifting'],
  },
];

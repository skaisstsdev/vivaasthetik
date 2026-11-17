// Цены для страницы «Preise». Суммы взяты из поля cost у каждой услуги
// (bookingDetails.cost) — перед публикацией проверьте их и при необходимости поправьте здесь.
// from: true  → «ab X €» (минимальная цена), false → точная сумма, null price → «после консультации».
export type PriceInfo = {
  price: number | null;
  from: boolean;
  /** От чего зависит итоговая цена. */
  basis?: { de: string; ru: string };
};

const material = { de: 'nach Materialverbrauch', ru: 'по расходу препарата' };
const areaAmount = { de: 'nach Areal und Produktmenge', ru: 'по зоне обработки и объёму препарата' };

export const prices: Record<string, PriceInfo> = {
  botox: { price: 100, from: true, basis: material },
  faltenunterspritzung: { price: 150, from: true, basis: material },
  lippenkorrektur: { price: 150, from: true, basis: material },
  biorevitalisierung: {
    price: 150,
    from: true,
    basis: { de: 'nach Produkt und Behandlungsregion', ru: 'по препарату и зоне обработки' },
  },
  mesotherapie: { price: 150, from: true, basis: areaAmount },
  vampirlifting: { price: 300, from: true, basis: { de: 'individuell', ru: 'индивидуально' } },
  radiesse: { price: null, from: true },
  fadenlifting: { price: 200, from: true, basis: { de: 'individuell, ca.', ru: 'индивидуально, ориентировочно' } },
  haarausfall: { price: 150, from: true, basis: areaAmount },
  'prp-kopfhaut': { price: 200, from: false },
  lipolyse: { price: 150, from: true, basis: material },
  intimlifting: {
    price: 300,
    from: true,
    basis: { de: 'nach Materialverbrauch und Behandlungsziel', ru: 'по объёму препарата и цели лечения' },
  },
};

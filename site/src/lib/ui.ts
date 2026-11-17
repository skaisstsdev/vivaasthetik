/**
 * Единые стили кнопок сайта. Раньше «золотые» кнопки были разной высоты
 * (42/54/62 px), с разными полями, размером и жирностью шрифта.
 *
 * Размер: h-14 (56 px) — основные кнопки, h-12 (48 px) — в карточках,
 * h-11 (44 px) — в шапке. Типографика у всех одна: uppercase,
 * xs→sm, разрядка 0.2em, начертание 500.
 */
const base =
  'inline-flex items-center justify-center text-center uppercase tracking-[0.2em] font-medium text-xs md:text-sm transition-colors duration-300';

/** Золотая рамка на тёмном фоне — главная кнопка записи. */
export const btnGold = `${base} h-14 px-10 md:px-12 border border-[#c9a84c] text-[#f5e198] hover:bg-[#c9a84c] hover:text-white`;

/** Рамка на светлом фоне — второстепенная кнопка. */
export const btnOutlineDark = `${base} h-14 px-10 md:px-12 border border-gray-300 text-gray-800 hover:border-gray-900 hover:text-gray-900`;

/** Кнопки внутри карточек услуг (тёмный фон). */
export const btnCardGold = `${base} h-12 w-full px-4 border border-[#c9a84c] text-[#f5e198] hover:bg-[#c9a84c] hover:text-white`;
export const btnCardLight = `${base} h-12 w-full px-4 bg-white/10 border border-white/20 text-white hover:bg-white hover:text-gray-900`;

/** Тёмная заливка на светлом фоне (модалки). */
export const btnDark = `${base} h-14 px-10 md:px-12 bg-[#061220] text-white hover:bg-[#0d2a6e]`;

/** Компактная кнопка записи в строке списка услуг (светлый фон). */
export const btnRowGold = `${base} h-11 px-6 whitespace-nowrap border border-[#c9a84c] text-[#8a6327] hover:bg-[#c9a84c] hover:text-white`;

/** Второстепенная кнопка на тёмном фоне (хиро): тонкая светлая рамка. */
export const btnGhostLight = `${base} h-14 px-10 md:px-12 border border-white/40 text-white hover:bg-white hover:text-gray-900`;

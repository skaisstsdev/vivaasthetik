/**
 * Статичная копия фирменного фона шейдера (тёмно-синий с чёрной «волной»)
 * для второстепенных блоков — CTA внизу страниц. Чистый CSS: без WebGL,
 * без JS, не нагружает телефон при прокрутке. Анимированный шейдер
 * остаётся только в главном хиро каждой страницы.
 */
export default function StaticGradient() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background: [
          'radial-gradient(55% 85% at 35% 70%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 70%)',
          'radial-gradient(60% 90% at 85% 15%, rgba(26,58,143,0.9) 0%, rgba(26,58,143,0) 65%)',
          'linear-gradient(135deg, #061220 0%, #0d2a6e 60%, #1a3a8f 100%)',
        ].join(', '),
      }}
    />
  );
}

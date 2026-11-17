import { ServiceLayoutLocale } from '@/data/services/types';

const prose =
  'prose prose-gray prose-base md:prose-lg max-w-none text-gray-700 prose-p:leading-relaxed prose-p:my-4 prose-strong:text-gray-900 prose-li:marker:text-[#c9a84c] prose-ul:my-4 prose-ol:my-4';

// Ручная раскладка услуги: вводный экран, области применения по категориям,
// блоки с заголовком по центру и противопоказания отдельным блоком.
export default function ServiceLayout({ layout, loc }: { layout: ServiceLayoutLocale; loc: 'de' | 'ru' }) {
  void loc;
  const { intro, areas, blocks, contraindications } = layout;

  return (
    <>
      {/* Что это такое */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-8 py-20 md:py-28 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-tight mb-8 md:mb-10 break-words">
            {intro.title}
          </h2>
          <div
            className="text-lg md:text-xl text-gray-600 leading-relaxed [&>p+p]:mt-6 [&>p:first-child]:text-xl md:[&>p:first-child]:text-2xl"
            dangerouslySetInnerHTML={{ __html: intro.html }}
          />
        </div>
      </section>

      {/* Области применения */}
      {areas && (
        <section className="bg-gray-50 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-28">
            <h2 className="text-3xl md:text-4xl text-gray-900 leading-tight text-center mb-12 md:mb-16 break-words">
              {areas.title}
            </h2>
            <div
              className={`grid grid-cols-[minmax(0,1fr)] gap-6 md:gap-8 ${
                areas.groups.length === 1
                  ? 'max-w-2xl mx-auto'
                  : areas.groups.length === 3
                    ? 'md:grid-cols-2 xl:grid-cols-3'
                    : 'md:grid-cols-2 xl:grid-cols-4'
              }`}
            >
              {areas.groups.map((group) => (
                <div key={group.title || 'g'} className="bg-white border border-gray-100 p-7 md:p-8">
                  {group.title && (
                    <h3 className="text-sm md:text-base tracking-[0.2em] text-[#8a6327] pb-5 mb-5 border-b border-gray-200">
                      {group.title}
                    </h3>
                  )}
                  <ul className="flex flex-col gap-3">
                    {group.items.map((item) => (
                      <li key={item} className="relative pl-5 text-gray-700 leading-snug">
                        <span aria-hidden="true" className="absolute left-0 top-[0.55em] h-1.5 w-1.5 rounded-full bg-[#c9a84c]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Блоки: заголовок по центру, под ним текст */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          {blocks.map((block) => (
            <article key={block.title} className="py-16 md:py-20 border-b border-gray-200 last:border-b-0">
              <h3 className="text-2xl md:text-3xl font-medium text-gray-900 !normal-case !tracking-normal leading-snug text-center mb-8 md:mb-10 break-words">
                {block.title}
              </h3>
              <div className={prose} dangerouslySetInnerHTML={{ __html: block.html }} />
            </article>
          ))}
        </div>
      </section>

      {/* Противопоказания */}
      {contraindications && (
        <section className="bg-white pb-20 md:pb-28">
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <div className="bg-[#faf6ea] border-l-2 border-[#c9a84c] p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl text-gray-900 leading-tight text-center mb-8 md:mb-10 break-words">
                {contraindications.title}
              </h2>
              <ul className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-2 gap-x-10 gap-y-4">
                {contraindications.items.map((item) => (
                  <li key={item} className="relative pl-5 text-gray-800 leading-snug">
                    <span aria-hidden="true" className="absolute left-0 top-[0.55em] h-1.5 w-1.5 rounded-full bg-[#c9a84c]" />
                    {item}
                  </li>
                ))}
              </ul>
              {contraindications.note && (
                <p className="mt-8 pt-6 border-t border-[#e6dcb8] text-gray-700 leading-relaxed">
                  {contraindications.note}
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

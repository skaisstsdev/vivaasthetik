import type { ReactNode } from 'react';
import StaticGradient from '@/components/home/StaticGradient';

// Мини-хиро для всех страниц, кроме главной: только название раздела
// на статичном фирменном градиенте (как в нижнем блоке «Bereit für…»).
export default function PageHero({ title, top }: { title: ReactNode; top?: ReactNode }) {
  return (
    <section data-chat-dark className="relative w-full overflow-hidden bg-[#061220] text-white">
      <StaticGradient />
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-8 min-h-[310px] md:min-h-[430px] pt-28 pb-12 md:pt-32 md:pb-16 flex flex-col items-center justify-center text-center">
        {top}
        <h1 className="relative inline-block max-w-full pb-4 md:pb-5 after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:w-2/5 after:bottom-0 after:h-[0.5px] after:bg-gradient-to-r after:from-[#a67c00] after:via-[#fceab8] after:to-[#a67c00] page-hero-title md:text-6xl lg:text-7xl font-light leading-tight break-words hyphens-manual [text-wrap:balance]">
          {title}
        </h1>
      </div>
    </section>
  );
}

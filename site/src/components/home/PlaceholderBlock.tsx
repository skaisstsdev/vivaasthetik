'use client';

import { useEffect, useRef } from 'react';

type Props = {
  desktopVideo: string;
  mobileVideo: string;
  titleLine1?: string;
  titleLine2?: string;
};

export default function PlaceholderBlock({ desktopVideo, mobileVideo, titleLine1, titleLine2 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // Force play on all videos in this block to handle Next.js client-side navigation
    const videos = containerRef.current.querySelectorAll('video');
    videos.forEach(video => {
      video.defaultMuted = true;
      video.muted = true;
      video.play().catch(() => {});
    });
  }, []);

  return (
    <section 
      className="relative w-full h-[100svh] md:h-[85vh] flex items-center justify-center overflow-hidden py-4 px-4 sm:py-8 sm:px-8 lg:py-12 lg:px-16 xl:px-24"
      style={{
        backgroundColor: '#0a192f',
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(96, 165, 250, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(29, 78, 216, 0.5) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(10, 25, 47, 0.8) 0%, transparent 70%)
        `
      }}
    >
      <div className="relative w-full h-full max-w-7xl mx-auto rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl bg-black/20">
        <div 
          ref={containerRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          dangerouslySetInnerHTML={{
            __html: `
              <video autoplay loop muted playsinline preload="auto" class="absolute inset-0 w-full h-full object-cover hidden md:block" src="${desktopVideo}"></video>
              <video autoplay loop muted playsinline preload="auto" class="absolute inset-0 w-full h-full object-cover md:hidden" src="${mobileVideo}"></video>
            `
          }}
        />
        
        {(titleLine1 || titleLine2) && (
          <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-10 pointer-events-none flex flex-col gap-2">
            {titleLine1 && (
              <h3 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                {titleLine1}
              </h3>
            )}
            {titleLine2 && (
              <h3 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] ml-12 md:ml-24">
                {titleLine2}
              </h3>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

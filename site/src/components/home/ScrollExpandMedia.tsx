'use client';

import { ReactNode } from 'react';
import ShaderBackground from './ShaderBackground';

interface Props {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  mobileMediaSrc?: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  scrollToExpand?: string;
  children?: ReactNode;
}

export default function ScrollExpandMedia({
  title,
  children,
}: Props) {
  const words     = (title ?? '').split(' ');
  const mid       = Math.ceil(words.length / 2);
  const firstWord = words.slice(0, mid).join(' ');
  const rest      = words.slice(mid).join(' ');

  return (
    <>
      <div className="relative w-full h-[100svh] overflow-hidden bg-[#080d1a] flex items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <ShaderBackground isStatic={true} />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Title */}
        <div className="relative z-10 flex flex-col items-center text-center pointer-events-none">
          <div className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-snug px-4 text-white drop-shadow-xl">
            {firstWord}
          </div>
          <div className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-snug px-4 text-white drop-shadow-xl">
            {rest}
          </div>
        </div>
      </div>

      {children && (
        <div className="bg-white relative z-30">
          {children}
        </div>
      )}
    </>
  );
}

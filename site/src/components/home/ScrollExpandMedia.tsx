'use client';

import { useRef, ReactNode } from 'react';
import Image from 'next/image';
import ShaderBackground from './ShaderBackground';
import {
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';

interface Props {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  mediaPoster?: string;
  mobileMediaSrc?: string;
  mobileMediaPoster?: string;
  bgImageSrc: string;
  title?: string;
  scrollToExpand?: string;
  children?: ReactNode;
}

export default function ScrollExpandMedia({
  mediaType = 'video',
  mediaSrc,
  mobileMediaSrc,
  bgImageSrc,
  title,
  children,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll position of THIS specific element as it moves through viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Text stays centered until the block is fully in view (v=0.45), 
  // then splits apart as the user scrolls past it (v=0.45 to 0.7)
  const mediaScale  = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const text1X      = useTransform(scrollYProgress, [0, 0.45, 0.7, 1], ['0vw', '0vw', '-60vw', '-60vw']);
  const text2X      = useTransform(scrollYProgress, [0, 0.45, 0.7, 1], ['0vw', '0vw',  '60vw',  '60vw']);
  const opacityText = useTransform(scrollYProgress, [0, 0.45, 0.6, 1], [1, 1, 0, 0]);

  const words     = (title ?? '').split(' ');
  const mid       = Math.ceil(words.length / 2);
  const firstWord = words.slice(0, mid).join(' ');
  const rest      = words.slice(mid).join(' ');

  return (
    <>
      <section 
        ref={containerRef} 
        className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden bg-[#080d1a]"
      >
        {/* Background photo */}
        <div className="absolute inset-0 z-0">
          <ShaderBackground isStatic={true} />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Video Container */}
        <div
          className="relative z-10 w-[92vw] h-[86dvh] md:w-[80vw] md:h-[75dvh] rounded-[24px] overflow-hidden"
          style={{ transform: 'translateZ(0)' }}
        >
          <motion.div
            style={{
              width: '100%',
              height: '100%',
              scale: mediaScale,
              willChange: 'transform',
            }}
          >
            {mediaType === 'video' ? (
              <>
                <video
                  src={mobileMediaSrc || mediaSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className={mobileMediaSrc ? "block md:hidden object-cover w-full h-full" : "block object-cover w-full h-full"}
                />
                {mobileMediaSrc && (
                  <video
                    src={mediaSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="hidden md:block object-cover w-full h-full"
                  />
                )}
              </>
            ) : (
              <Image src={mediaSrc} alt="" fill style={{ objectFit: 'cover' }} />
            )}
          </motion.div>
        </div>

        {/* Floating Text */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center pointer-events-none gap-2 md:gap-4">
          <motion.div
            style={{ x: text1X, opacity: opacityText, willChange: 'transform, opacity' }}
            className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
          >
            {firstWord}
          </motion.div>
          <motion.div
            style={{ x: text2X, opacity: opacityText, willChange: 'transform, opacity' }}
            className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
          >
            {rest}
          </motion.div>
        </div>
      </section>

      {children && (
        <div className="bg-white relative z-30">
          {children}
        </div>
      )}
    </>
  );
}

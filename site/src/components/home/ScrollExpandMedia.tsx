'use client';

import { useRef, ReactNode, useState, useEffect } from 'react';
import Image from 'next/image';
import ShaderBackground from './ShaderBackground';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion';

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
  mediaType = 'video',
  mediaSrc,
  mobileMediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  scrollToExpand,
  children,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // 1. ADD SPRING PHYSICS for buttery smooth gliding on mobile/desktop
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Eager preload hint as fallback
    if (mediaSrc && typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = window.innerWidth < 768 && mobileMediaSrc ? mobileMediaSrc : mediaSrc;
      document.head.appendChild(link);
    }
    
    // Force video to play aggressively 
    const tryPlay = () => {
      if (videoWrapperRef.current) {
        const video = videoWrapperRef.current as unknown as HTMLVideoElement;
        if (video.paused) {
          video.play().catch(() => {});
        }
      }
    };
    
    tryPlay();
    const interval = setInterval(tryPlay, 500);

    return () => {
      clearInterval(interval);
    };
  }, [mediaSrc, mobileMediaSrc, mediaType]);

  // COMBINED TRANSFORM FOR WRAPPER (GPU Accelerated) - USING smoothProgress
  const combinedTransform = useTransform(smoothProgress, (v) => {
    if (!isMounted || typeof window === 'undefined') return 'translateZ(0) scale(1, 1)';
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    if (w >= 768) {
      return 'translateZ(0) scale(1, 1)';
    } else {
      const targetW = w * 0.95;
      const startW = 260; 
      const currentW = startW + v * (targetW - startW);
      const sX = currentW / targetW;
      
      const targetH = h * 0.88;
      const startH = 320; 
      const currentH = startH + v * (targetH - startH);
      const sY = currentH / targetH;
      
      return `translateZ(0) scale(${sX}, ${sY})`;
    }
  });

  // COMBINED TRANSFORM FOR INNER WRAPPER (Inverse Scale) - USING smoothProgress
  const innerCombinedTransform = useTransform(smoothProgress, (v) => {
    if (!isMounted || typeof window === 'undefined') return 'scale(1, 1)';
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    if (w >= 768) {
      return 'scale(1, 1)';
    } else {
      const targetW = w * 0.95;
      const startW = 260; 
      const currentW = startW + v * (targetW - startW);
      const sX = currentW / targetW;
      
      const targetH = h * 0.88;
      const startH = 320; 
      const currentH = startH + v * (targetH - startH);
      const sY = currentH / targetH;
      
      return `scale(${1 / sX}, ${1 / sY})`;
    }
  });

  // COMBINED CLIP PATH (Only for Desktop) - USING smoothProgress
  const combinedClipPath = useTransform(smoothProgress, (v) => {
    if (!isMounted || typeof window === 'undefined') {
      return 'inset(30% 35% round 16px)';
    }
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    if (w < 768) {
      return 'none';
    } else {
      const targetW = w * 0.95;
      const targetH = h * 0.88;
      const startW = 360;
      const startH = 420;
      const currentW = startW + v * (targetW - startW);
      const currentH = startH + v * (targetH - startH);
      const insetX = (w - currentW) / 2;
      const insetY = (h - currentH) / 2;
      return `inset(${insetY}px ${insetX}px round 16px)`;
    }
  });

  // Shared parallax/fade - USING smoothProgress
  const mediaScale     = useTransform(smoothProgress, [0, 1], [1.2, 1]);
  const bgOpacity      = useTransform(smoothProgress, [0, 0.7],  [1, 0]);
  const text1X         = useTransform(smoothProgress, [0, 0.85], ['0vw', '-45vw']);
  const text2X         = useTransform(smoothProgress, [0, 0.85], ['0vw',  '45vw']);
  const hintOpacity    = useTransform(smoothProgress, [0, 0.08], [1, 0]);

  const words     = (title ?? '').split(' ');
  const mid       = Math.ceil(words.length / 2);
  const firstWord = words.slice(0, mid).join(' ');
  const rest      = words.slice(mid).join(' ');

  return (
    <>
      <div ref={containerRef} style={{ height: '220dvh', position: 'relative', zIndex: 10 }}>
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100dvh',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Base dark bg */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              backgroundColor: '#080d1a',
            }}
          />

          {/* Background photo — fades out */}
          <motion.div
            style={{
              opacity: bgOpacity,
              zIndex: 1,
              position: 'absolute',
              inset: 0,
            }}
          >
            {/* Animated Shader Background Frozen */}
            <ShaderBackground isStatic={true} />
            <div className="absolute inset-0 bg-black/10" />
          </motion.div>

          {/* Expanding media wrapper */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            {/* Hybrid Desktop (clip-path) / Mobile (scale) Wrapper */}
            <motion.div
              className="w-[95vw] h-[88dvh] md:w-full md:h-full rounded-2xl md:rounded-none"
              style={{
                position: 'relative',
                overflow: 'hidden',
                willChange: 'transform, clip-path',
                transformOrigin: 'center center',
                transform: combinedTransform,
                clipPath: combinedClipPath,
                WebkitClipPath: combinedClipPath,
              }}
            >
              {/* Inner wrapper for inverse scaling on mobile */}
              <motion.div
                style={{
                  width: '100%',
                  height: '100%',
                  willChange: 'transform',
                  transformOrigin: 'center center',
                  transform: innerCombinedTransform,
                }}
              >
                {/* Parallax wrapper */}
                <motion.div
                  style={{
                    width: '100%',
                    height: '100%',
                    scale: mediaScale,
                    willChange: 'transform',
                    transformOrigin: 'center center',
                  }}
                >
                  {mediaType === 'video' ? (
                    <video
                      ref={videoWrapperRef as any}
                      src={mediaSrc}
                      poster={posterSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image src={mediaSrc} alt="" fill style={{ objectFit: 'cover' }} />
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Title — splits apart on scroll */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              pointerEvents: 'none',
              transform: 'translateZ(1px)', // Fix Safari bug where text disappears
            }}
          >
            <motion.div
              style={{ x: text1X, willChange: 'transform' }}
              className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-snug px-4 text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
            >
              {firstWord}
            </motion.div>
            <motion.div
              style={{ x: text2X, willChange: 'transform' }}
              className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-snug px-4 text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
            >
              {rest}
            </motion.div>

            {scrollToExpand && (
              <motion.p
                style={{ opacity: hintOpacity, willChange: 'opacity' }}
                className="mt-8 text-[10px] uppercase tracking-[0.3em] text-white/50"
              >
                {scrollToExpand}
              </motion.p>
            )}
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

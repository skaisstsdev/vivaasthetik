'use client';

import { useRef, ReactNode, useState, useEffect } from 'react';
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

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Eager preload hint
    if (mediaSrc && typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = window.innerWidth < 768 && mobileMediaSrc ? mobileMediaSrc : mediaSrc;
      document.head.appendChild(link);
    }
    
    // Force video to load and play aggressively to bypass iOS client-side routing blocks
    const timer = setTimeout(() => {
      if (videoWrapperRef.current) {
        const video = videoWrapperRef.current.querySelector('video');
        if (video) {
          video.play().catch(() => {});
          const onCanPlay = () => video.play().catch(() => {});
          video.addEventListener('canplay', onCanPlay);
          // Only load() if it hasn't started natively
          if (video.readyState === 0) {
            video.load();
          }
          return () => video.removeEventListener('canplay', onCanPlay);
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [mediaSrc, mobileMediaSrc]);

  // DESKTOP: clip-path calculations
  const clipPath = useTransform(scrollYProgress, (v) => {
    if (!isMounted || typeof window === 'undefined') {
      return 'inset(30% 35% round 16px)';
    }
    const w = window.innerWidth;
    const h = window.innerHeight;
    const targetW = w * 0.95;
    const targetH = h * 0.88;
    const startW = w < 768 ? 260 : 360;
    const startH = w < 768 ? 320 : 420;
    const currentW = startW + v * (targetW - startW);
    const currentH = startH + v * (targetH - startH);
    const insetX = (w - currentW) / 2;
    const insetY = (h - currentH) / 2;
    return `inset(${insetY}px ${insetX}px round 16px)`;
  });

  // MOBILE: inverse scale calculations
  const scaleX = useTransform(scrollYProgress, (v) => {
    if (!isMounted || typeof window === 'undefined') return 1;
    const w = window.innerWidth;
    const targetW = w * 0.95;
    const startW = 260; // Mobile start width
    const currentW = startW + v * (targetW - startW);
    return currentW / targetW;
  });

  const scaleY = useTransform(scrollYProgress, (v) => {
    if (!isMounted || typeof window === 'undefined') return 1;
    const h = window.innerHeight;
    const targetH = h * 0.88;
    const startH = 320; // Mobile start height
    const currentH = startH + v * (targetH - startH);
    return currentH / targetH;
  });

  const invScaleX = useTransform(scaleX, (s) => 1 / s);
  const invScaleY = useTransform(scaleY, (s) => 1 / s);

  // Shared parallax/fade
  const mediaScale     = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  const bgOpacity      = useTransform(scrollYProgress, [0, 0.7],  [1, 0]);
  const text1X         = useTransform(scrollYProgress, [0, 0.85], ['0vw', '-45vw']);
  const text2X         = useTransform(scrollYProgress, [0, 0.85], ['0vw',  '45vw']);
  const hintOpacity    = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  const words     = (title ?? '').split(' ');
  const mid       = Math.ceil(words.length / 2);
  const firstWord = words.slice(0, mid).join(' ');
  const rest      = words.slice(mid).join(' ');

  // Dangerously inject video to completely bypass React hydration bugs and iOS Safari client-side route autoplay blockers
  const videoHTML = `
    <video
      ${posterSrc ? `poster="${posterSrc}"` : ''}
      autoplay
      muted
      loop
      playsinline
      preload="auto"
      class="block object-cover w-full h-full"
    >
      ${mobileMediaSrc ? `<source src="${mobileMediaSrc}" media="(max-width: 767px)" />` : ''}
      <source src="${mediaSrc}" />
    </video>
  `;

  return (
    <>
      <style>{`
        .smart-video-wrapper {
          clip-path: var(--clip-path);
          -webkit-clip-path: var(--clip-path);
          width: 100% !important;
          height: 100% !important;
          border-radius: 0 !important;
        }
        .smart-video-inner {
          transform: none !important;
        }
        @media (max-width: 767px) {
          .smart-video-wrapper {
            clip-path: none !important;
            -webkit-clip-path: none !important;
            width: 95vw !important;
            height: 88dvh !important;
            border-radius: 16px !important;
            transform: translateZ(0) scale(var(--scale-x), var(--scale-y)) !important;
          }
          .smart-video-inner {
            transform: scale(var(--inv-scale-x), var(--inv-scale-y)) !important;
          }
        }
      `}</style>

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
              className="smart-video-wrapper"
              style={{
                position: 'relative',
                overflow: 'hidden',
                willChange: 'transform, clip-path',
                transformOrigin: 'center center',
                transform: 'translateZ(0)', // Force GPU layer
                // Pass motion values as CSS vars
                '--clip-path': clipPath,
                '--scale-x': scaleX,
                '--scale-y': scaleY,
              } as any}
            >
              {/* Inner wrapper for inverse scaling on mobile */}
              <motion.div
                className="smart-video-inner"
                style={{
                  width: '100%',
                  height: '100%',
                  willChange: 'transform',
                  transformOrigin: 'center center',
                  '--inv-scale-x': invScaleX,
                  '--inv-scale-y': invScaleY,
                } as any}
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
                    <div 
                      ref={videoWrapperRef} 
                      className="w-full h-full"
                      dangerouslySetInnerHTML={{ __html: videoHTML }} 
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

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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [isMounted, setIsMounted] = useState(false);
  const [isMobileSize, setIsMobileSize] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsMounted(true);

    // Force eager preloading of the video file (fixes slow appearance on services page)
    if (mediaSrc && typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = isMobileSize && mobileMediaSrc ? mobileMediaSrc : mediaSrc;
      document.head.appendChild(link);
    }

    const checkMobile = () => {
      setIsMobileSize(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const video = videoRef.current;
    if (video) {
      // Try to play immediately
      video.play().catch(() => {});
      // Also play when enough data is available (handles slow networks)
      const onCanPlay = () => video.play().catch(() => {});
      video.addEventListener('canplay', onCanPlay);
      video.load();
      return () => {
        video.removeEventListener('canplay', onCanPlay);
        window.removeEventListener('resize', checkMobile);
      };
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // We revert to `clip-path` because inverse scaling with different X/Y ratios distorts the video.
  // Since we fixed the double-video decoding issue, clip-path is now buttery smooth.
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

  // Parallax scale effect: media slightly zooms out as the mask expands
  const mediaScale     = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  const bgOpacity      = useTransform(scrollYProgress, [0, 0.7],  [1, 0]);
  const text1X         = useTransform(scrollYProgress, [0, 0.85], ['0vw', '-45vw']);
  const text2X         = useTransform(scrollYProgress, [0, 0.85], ['0vw',  '45vw']);
  const hintOpacity    = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  const words     = (title ?? '').split(' ');
  const mid       = Math.ceil(words.length / 2);
  const firstWord = words.slice(0, mid).join(' ');
  const rest      = words.slice(mid).join(' ');

  return (
    <>
      <div ref={containerRef} style={{ height: '220vh' }}>
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
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
            {/* Animated Shader Background */}
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
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 10,
                clipPath,
                WebkitClipPath: clipPath,
                willChange: 'clip-path',
                transform: 'translateZ(0)', // Force GPU layer
              }}
            >
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
                  key={isMobileSize ? 'mobile' : 'desktop'} // Force remount when changing source type to ensure it plays
                  ref={videoRef}
                  src={isMobileSize && mobileMediaSrc ? mobileMediaSrc : mediaSrc}
                  poster={posterSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="block object-cover w-full h-full"
                />
              ) : (
                <Image src={mediaSrc} alt="" fill style={{ objectFit: 'cover' }} />
              )}
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
              transform: 'translateZ(1px)', // Fix Safari bug where text disappears behind GPU-accelerated video
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

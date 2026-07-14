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
  scrollToExpand,
  children,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [isMounted, setIsMounted] = useState(false);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsMounted(true);
    // Force play on mount to ensure they play immediately
    if (mobileVideoRef.current) {
      mobileVideoRef.current.play().catch(() => {});
    }
    if (desktopVideoRef.current) {
      desktopVideoRef.current.play().catch(() => {});
    }
  }, []);

  // Removed scaling of the video entirely as requested.
  // Kept parallax and text split animations.
  const mediaScale     = useTransform(smoothProgress, [0, 1], [1.1, 1]);
  const bgOpacity      = useTransform(smoothProgress, [0, 0.7],  [1, 0]);
  const text1X         = useTransform(smoothProgress, [0, 0.85], ['0vw', '-50vw']);
  const text2X         = useTransform(smoothProgress, [0, 0.85], ['0vw',  '50vw']);
  const hintOpacity    = useTransform(smoothProgress, [0, 0.08], [1, 0]);

  const words     = (title ?? '').split(' ');
  const mid       = Math.ceil(words.length / 2);
  const firstWord = words.slice(0, mid).join(' ');
  const rest      = words.slice(mid).join(' ');

  return (
    <>
      <div ref={containerRef} style={{ height: '160dvh' }}>
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100dvh',
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
            <ShaderBackground isStatic={true} />
            <div className="absolute inset-0 bg-black/10" />
          </motion.div>

          {/* Static Rounded Video Container (No expansion) */}
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
            <div
              className="w-[92vw] h-[86dvh] md:w-[95vw] md:h-[88dvh]"
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                position: 'relative',
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
                  <>
                    <video
                      ref={mobileMediaSrc ? mobileVideoRef : desktopVideoRef}
                      src={mobileMediaSrc || mediaSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className={mobileMediaSrc ? "block md:hidden object-cover w-full h-full" : "block object-cover w-full h-full"}
                    />
                    {mobileMediaSrc && (
                      <video
                        ref={desktopVideoRef}
                        src={mediaSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="hidden md:block object-cover w-full h-full"
                      />
                    )}
                  </>
                ) : (
                  <Image src={mediaSrc} alt="" fill style={{ objectFit: 'cover' }} />
                )}
              </motion.div>
            </div>
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

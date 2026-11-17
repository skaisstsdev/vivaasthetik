"use client";
import * as React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { useLocale } from 'next-intl';

export default function ParallaxMarquee() {
  const locale = useLocale();
  const text = locale === 'ru' ? "ЕСТЕСТВЕННАЯ КРАСОТА" : "NATÜRLICHE SCHÖNHEIT";
  
  const containerRef = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // High stiffness + critical damping (mass 0.1) removes discrete mouse wheel stair-step jitter
  // while following page scroll instantly with ZERO lag/inertia when scrolling stops.
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 40,
    mass: 0.1,
    restDelta: 0.0001
  });
  
  // Бесконечная лента: все надписи одинаковые, поэтому сдвиг берётся по модулю
  // ширины одной надписи — шов не виден, лента едет влево при прокрутке вниз
  // и вправо при прокрутке вверх. Когда блок посередине экрана (progress 0.5),
  // надпись начинается ровно с «N».
  const firstRef = React.useRef<HTMLSpanElement>(null);
  const SPEED = 500; // сколько пикселей проезжает лента за полный проход блока по экрану
  const x = useTransform(smoothScroll, (p) => {
    const w = firstRef.current?.offsetWidth || 0;
    if (!w) return 0;
    const d = (p - 0.5) * SPEED;
    return -(((d % w) + w) % w);
  });

  return (
    <section ref={containerRef} className="relative w-full bg-white overflow-hidden pt-0 md:pt-4">
      
      {/* Marquee Background */}
      <div className="absolute top-[35%] md:top-[45%] -translate-y-1/2 left-0 w-full z-0 pointer-events-none">
        <div className="flex whitespace-nowrap overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap"
            style={{ 
              x, 
              willChange: "transform",
              transform: "translateZ(0)"
            }}
          >
            {[...Array(8)].map((_, i) => (
              <span 
                key={i}
                ref={i === 0 ? firstRef : undefined}
                className="text-[4.5rem] sm:text-[5.5rem] md:text-[4.8rem] lg:text-[6rem] leading-none px-6 md:px-8 font-light opacity-90 select-none"
                style={{ 
                  fontFamily: "var(--font-bodoni), Georgia, serif",
                  backgroundImage: "linear-gradient(to right, #b8860b, #e0c273, #d4af37, #b8860b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {text}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Foreground Image */}
      <div className="relative z-10 w-full md:w-2/3 mx-auto h-full flex justify-center items-end">
        {/* Mobile Image */}
        <Image
          src="/images/mobile.webp"
          alt="Natalya Schnal"
          width={2620}
          height={2640}
          className="object-cover w-full h-auto block md:hidden"
          // Видна только на телефоне — на десктопе браузер возьмёт крошечный вариант
          sizes="(max-width: 767px) 100vw, 1px"
        />
        {/* Desktop Image (Cropped 0.5% at bottom) */}
        <div 
          className="hidden md:block w-full relative overflow-hidden"
          style={{ aspectRatio: "1920/1074.6" }}
        >
          <Image
            src="/images/desktop.webp"
            alt="Natalya Schnal"
            fill
            className="object-cover object-top"
            // Видна только от md — на телефоне браузер возьмёт крошечный вариант
            sizes="(min-width: 768px) 67vw, 1px"
          />
        </div>
      </div>
      
    </section>
  );
}

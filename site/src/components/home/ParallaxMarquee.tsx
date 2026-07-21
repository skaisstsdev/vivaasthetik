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
  
  // As the user scrolls down, the text moves left strictly tied to the scroll
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <section ref={containerRef} className="relative w-full bg-white overflow-hidden pt-0 md:pt-4">
      
      {/* Marquee Background */}
      <div className="absolute top-[35%] md:top-[45%] -translate-y-1/2 left-0 w-full z-0 pointer-events-none">
        <div className="flex whitespace-nowrap overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap"
            style={{ x, willChange: "transform" }}
          >
            {[...Array(8)].map((_, i) => (
              <span 
                key={i}
                className="text-[4.5rem] sm:text-[5.5rem] md:text-[8rem] lg:text-[10rem] leading-none px-6 md:px-12 font-light text-transparent bg-clip-text opacity-90"
                style={{ 
                  fontFamily: "var(--font-bodoni), Georgia, serif",
                  backgroundImage: "linear-gradient(to right, #b8860b, #e0c273, #d4af37, #b8860b)",
                  WebkitBackgroundClip: "text",
                }}
              >
                {text}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Foreground Image */}
      <div className="relative z-10 w-full h-full flex justify-center items-end">
        {/* Mobile Image */}
        <Image
          src="/images/mobile.webp"
          alt="Natalya Schnal"
          width={1080}
          height={1920}
          className="object-cover w-full h-auto block md:hidden"
          priority
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
            priority
          />
        </div>
      </div>
      
    </section>
  );
}

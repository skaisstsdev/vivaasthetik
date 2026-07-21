"use client";
import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale } from 'next-intl';

export default function ParallaxMarquee() {
  const locale = useLocale();
  const text = locale === 'ru' ? "ЭСТЕТИКА В ДЕТАЛЯХ • " : "BEAUTY IN DETAILS • ";
  
  return (
    <section className="relative w-full bg-white overflow-hidden pt-12 md:pt-24">
      
      {/* Marquee Background */}
      <div className="absolute top-[50%] md:top-[45%] -translate-y-1/2 left-0 w-full z-0 pointer-events-none">
        <div className="flex whitespace-nowrap overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
            style={{ willChange: "transform" }}
          >
            {[...Array(6)].map((_, i) => (
              <span 
                key={i}
                className="text-[3rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[7rem] leading-none px-4 font-light text-transparent bg-clip-text opacity-90"
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
        {/* Desktop Image */}
        <Image
          src="/images/desktop.webp"
          alt="Natalya Schnal"
          width={1920}
          height={1080}
          className="object-cover w-full h-auto hidden md:block"
          priority
        />
      </div>
      
    </section>
  );
}

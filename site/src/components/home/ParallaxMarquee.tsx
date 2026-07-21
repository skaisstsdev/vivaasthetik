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
      <div className="relative z-10 w-full max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto flex justify-center items-end px-4 md:px-0">
        <Image
          src="/images/hero-no-bg-v2.webp"
          alt="Natalya Schnal"
          width={1600}
          height={1000}
          className="object-contain w-full h-auto block"
          priority
        />
      </div>
      
    </section>
  );
}

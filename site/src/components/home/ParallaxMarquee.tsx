"use client";
import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useLocale } from 'next-intl';

export default function ParallaxMarquee() {
  const locale = useLocale();
  const text = locale === 'ru' ? "ЭСТЕТИКА В ДЕТАЛЯХ • " : "BEAUTY IN DETAILS • ";
  
  // Subtle parallax effect on the image
  const { scrollYProgress } = useScroll();
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] min-h-[400px] bg-white overflow-hidden flex flex-col justify-end pt-12">
      
      {/* Marquee Background */}
      <div className="absolute top-1/3 md:top-1/2 -translate-y-1/2 left-0 w-full z-0 pointer-events-none">
        <div className="flex whitespace-nowrap overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          >
            {[...Array(6)].map((_, i) => (
              <span 
                key={i}
                className="text-[6rem] sm:text-[10rem] md:text-[14rem] lg:text-[16rem] leading-none px-4 font-light text-transparent bg-clip-text opacity-90"
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
      <motion.div 
        className="relative z-10 w-full h-full max-h-[85%] md:max-h-[90%] mx-auto flex justify-center items-end"
        style={{ y: imageY }}
      >
        <Image
          src="/images/hero-no-bg.png"
          alt="Natalya Schnal"
          width={1200}
          height={800}
          className="object-contain object-bottom w-auto h-full max-w-full drop-shadow-[0_10px_35px_rgba(0,0,0,0.15)]"
          priority
        />
      </motion.div>
      
      {/* Bottom gradient to blend smoothly into the next section */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />
    </section>
  );
}

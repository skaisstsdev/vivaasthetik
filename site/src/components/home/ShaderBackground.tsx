'use client';

import { MeshGradient } from "@paper-design/shaders-react"
import { useEffect, useRef, useState } from "react";

export default function ShaderBackground({ isStatic = false }: { isStatic?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isStatic) return; // No need to observe if already static
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isStatic]);

  return (
    // bg-[#0a192f] is painted immediately (CSS, no JS needed) — no flash
    <div ref={containerRef} className="absolute inset-0 z-0 bg-[#0a192f] overflow-hidden pointer-events-none">
      <MeshGradient
        className="w-full h-full absolute inset-0"
        colors={["#000000", "#0a192f", "#1d4ed8", "#60a5fa"]}
        speed={isStatic || !isVisible ? 0 : 1.2}
      />
    </div>
  );
}

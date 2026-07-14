'use client';

import { MeshGradient } from "@paper-design/shaders-react"

export default function ShaderBackground({ isStatic = false }: { isStatic?: boolean }) {
  return (
    // bg-[#0a192f] is painted immediately (CSS, no JS needed) — no flash
    <div className="absolute inset-0 z-0 bg-[#0a192f] overflow-hidden pointer-events-none">
      <MeshGradient
        className="w-full h-full absolute inset-0"
        colors={["#000000", "#0a192f", "#1d4ed8", "#60a5fa"]}
        speed={isStatic ? 0 : 1.2}
      />
    </div>
  );
}


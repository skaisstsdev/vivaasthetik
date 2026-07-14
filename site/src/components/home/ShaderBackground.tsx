'use client';

import { MeshGradient } from "@paper-design/shaders-react"

export default function ShaderBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-[#111111] overflow-hidden pointer-events-none">
      <MeshGradient
        className="w-full h-full absolute inset-0"
        colors={["#000000", "#0a192f", "#1d4ed8", "#60a5fa"]}
        speed={1.2}
      />
    </div>
  );
}

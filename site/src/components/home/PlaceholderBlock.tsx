'use client';

import ShaderBackground from '@/components/home/ShaderBackground';

export default function PlaceholderBlock() {
  return (
    <section className="relative w-full h-[100svh] md:h-[100vh] flex items-center justify-center overflow-hidden bg-gray-900">
      <ShaderBackground />
    </section>
  );
}

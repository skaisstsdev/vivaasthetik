'use client';

export default function ShaderBackground() {
  return (
    <div 
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      style={{
        backgroundColor: '#0a192f',
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(96, 165, 250, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(29, 78, 216, 0.5) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(10, 25, 47, 0.8) 0%, transparent 70%)
        `
      }}
    />
  );
}


export default function PlaceholderBlock() {
  return (
    <section 
      className="relative w-full h-[100svh] md:h-[100vh] flex items-center justify-center overflow-hidden"
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

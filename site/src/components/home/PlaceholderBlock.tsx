'use client';

type Props = {
  desktopVideo: string;
  mobileVideo: string;
};

export default function PlaceholderBlock({ desktopVideo, mobileVideo }: Props) {
  return (
    <section 
      className="relative w-full h-[100svh] md:h-[85vh] flex items-center justify-center overflow-hidden py-4 px-4 sm:py-8 sm:px-8 lg:py-12 lg:px-16 xl:px-24"
      style={{
        backgroundColor: '#0a192f',
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(96, 165, 250, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(29, 78, 216, 0.5) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(10, 25, 47, 0.8) 0%, transparent 70%)
        `
      }}
    >
      <div 
        className="relative w-full h-full max-w-7xl mx-auto rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl bg-black/20"
        dangerouslySetInnerHTML={{
          __html: `
            <video
              autoplay
              loop
              muted
              playsinline
              preload="auto"
              class="absolute inset-0 w-full h-full object-cover"
            >
              <source src="${mobileVideo}" media="(max-width: 767px)" type="video/mp4" />
              <source src="${desktopVideo}" media="(min-width: 768px)" type="video/mp4" />
            </video>
          `
        }}
      />
    </section>
  );
}

import { useState, useRef, useEffect, useCallback } from 'react';
import { siteContent } from '../content/siteContent';

const VIDEOS = [
  { src: '/bg1-web.mp4', poster: '/bg1-poster.jpg', alt: 'Hot air balloons at dawn' },
  { src: '/bg2-web.mp4', poster: '/bg2-poster.jpg', alt: 'Sunset over Durham' },
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activePanel, setActivePanel] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const wheelLockRef = useRef(false);
  const panelCount = 2;

  // Play the current video
  const playCurrent = useCallback(async () => {
    const video = videoRefs.current[currentIndex];
    if (video) {
      video.currentTime = 0;
      try {
        await video.play();
      } catch (e) {
        console.warn('Video play failed:', e);
      }
    }
  }, [currentIndex]);

  // Switch video
  const switchVideo = useCallback((direction = 1) => {
    setCurrentIndex((prev) => (prev + direction + VIDEOS.length) % VIDEOS.length);
  }, []);

  // Jump to specific video
  const jumpTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const switchPanel = useCallback((direction = 1) => {
    setActivePanel((prev) => Math.max(0, Math.min(panelCount - 1, prev + direction)));
  }, [panelCount]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        switchVideo(1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        switchVideo(-1);
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        switchPanel(1);
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        switchPanel(-1);
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 18 || wheelLockRef.current) return;
      event.preventDefault();
      wheelLockRef.current = true;
      switchPanel(event.deltaY > 0 ? 1 : -1);
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 760);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [switchPanel, switchVideo]);

  // Play video when currentIndex changes
  useEffect(() => {
    playCurrent();
  }, [currentIndex, playCurrent]);

  // Pause all non-current videos
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentIndex) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex]);

  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        backgroundColor: '#1a1025',
        backgroundImage: "url('/bg1-poster.jpg')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      {/* Video Backgrounds with crossfade */}
      <div className="absolute inset-0 z-0">
        {VIDEOS.map((video, index) => (
          <video
            key={video.src}
            ref={(el) => { videoRefs.current[index] = el; }}
            muted
            loop={false}
            playsInline
            autoPlay={index === currentIndex}
            preload={index === 0 ? 'auto' : 'metadata'}
            poster={video.poster}
            aria-label={video.alt}
            onEnded={() => switchVideo(1)}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transition: 'opacity 0.6s ease-in-out',
              opacity: index === currentIndex ? 1 : 0,
              zIndex: index === currentIndex ? 1 : 0,
              filter: 'contrast(1.06) saturate(1.08)',
            }}
          >
            <source src={video.src} type="video/mp4" />
          </video>
        ))}
      </div>

      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,8,20,0.35) 0%, rgba(10,8,20,0.1) 40%, rgba(10,8,20,0.1) 60%, rgba(10,8,20,0.5) 100%)',
        }}
      />

      {/* Vignette edges */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 150px rgba(0,0,0,0.5)',
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center px-6 flex-1 py-[90px]">
        <div className="relative w-full min-h-[430px] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 flex flex-col justify-center items-center"
            style={{
              opacity: activePanel === 0 ? 1 : 0,
              transform: activePanel === 0 ? 'translate3d(0, 0, 0)' : 'translate3d(0, -18px, 0)',
              transitionProperty: 'opacity, transform',
              transitionDuration: '420ms',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: 'opacity, transform',
              pointerEvents: activePanel === 0 ? 'auto' : 'none',
            }}
          >
            <h1
              className="animate-fade-rise text-5xl sm:text-7xl md:text-8xl font-normal leading-[0.95] tracking-[-2.46px] max-w-7xl drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {siteContent.hero.title}
            </h1>
            <p className="animate-fade-rise-delay text-white/60 text-base sm:text-lg max-w-2xl mt-8 leading-relaxed drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
              {siteContent.hero.subtitle}
            </p>

            <button
              type="button"
              onClick={() => switchPanel(1)}
              className="animate-fade-rise-delay-2 liquid-glass px-14 py-5 text-base text-foreground mt-12 cursor-pointer"
              aria-label="进入项目"
            >
              {siteContent.hero.cta}
            </button>
          </div>

          <div
            className="absolute inset-0 flex flex-col justify-center items-center"
            style={{
              opacity: activePanel === 1 ? 1 : 0,
              transform: activePanel === 1 ? 'translate3d(0, 0, 0)' : 'translate3d(0, 18px, 0)',
              transitionProperty: 'opacity, transform',
              transitionDuration: '420ms',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: 'opacity, transform',
              pointerEvents: activePanel === 1 ? 'auto' : 'none',
            }}
          >
            <h1
              className="text-5xl sm:text-7xl md:text-8xl font-normal leading-[0.95] tracking-[-2.46px] max-w-7xl drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Projects
            </h1>
            <p className="text-white/60 text-base sm:text-lg max-w-2xl mt-8 leading-relaxed drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
              Stiles
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
              {siteContent.projects.map((project) => (
                <a
                  key={project.title}
                  href={project.href}
                  className="liquid-glass project-entry-glass min-w-[252px] px-8 py-4 text-base text-foreground cursor-pointer"
                  aria-label={project.title}
                >
                  <span className="block text-base text-white/78">{project.subtitle}</span>
                  <span className="mt-1 block text-base text-white">{project.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Video progress dots */}
        <div className="flex items-center gap-3 mt-10 animate-fade-rise-delay-2">
          {VIDEOS.map((_, index) => (
            <button
              key={index}
              onClick={() => jumpTo(index)}
              className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/30 w-2 hover:bg-white/50'
              }`}
              aria-label={`Switch to video ${index + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => switchPanel(1)}
          className={`absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-white/60 drop-shadow-[0_2px_14px_rgba(0,0,0,0.75)] transition-all duration-500 hover:text-white ${
            activePanel === 0
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-3 pointer-events-none'
          }`}
          aria-label="向下滚动查看项目"
        >
          <span>Scroll</span>
          <span className="scroll-cue-line" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

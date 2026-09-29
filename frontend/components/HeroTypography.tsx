'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroTypography() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    // Parallax effect on the whole block
    gsap.to('.hero-text-block', {
      yPercent: 50,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    // Typography animation removed
  }, { scope: containerRef });

  return (
    <div ref={containerRef} style={{ position: 'relative', zIndex: 10 }}>
      <div className="hero-text-block">
        {/* Giant INKER ROBOTICS text removed */}
        <div className="hero-subtext-left reveal reveal-up">
          An AI Assistant that works as fast as your mind, no fuss, no limits.
        </div>
      </div>
    </div>
  );
}

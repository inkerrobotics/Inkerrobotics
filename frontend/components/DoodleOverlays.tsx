'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function DoodleOverlays() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const paths = gsap.utils.toArray<SVGPathElement>('.doodle-path');
    
    paths.forEach(path => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: path,
          start: "top 80%",
          end: "bottom 50%",
          scrub: 1,
        }
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} style={{ pointerEvents: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 50 }}>
      {/* Tiny Doodle 1 */}
      <svg style={{ position: 'absolute', top: '30%', left: '5%', width: '20px', height: '20px', opacity: 0.6 }} viewBox="0 0 100 100">
        <path className="doodle-path" d="M10,90 Q50,10 90,90" fill="none" stroke="var(--color-violet)" strokeWidth="3" />
        <circle cx="90" cy="90" r="4" fill="var(--color-violet)" />
      </svg>

      {/* Tiny Doodle 2 */}
      <svg style={{ position: 'absolute', top: '70%', right: '5%', width: '24px', height: '24px', opacity: 0.6 }} viewBox="0 0 100 100">
        <path className="doodle-path" d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="var(--color-lime)" strokeWidth="3" />
        <path className="doodle-path" d="M10,10 L90,90" fill="none" stroke="var(--color-lime)" strokeWidth="3" />
      </svg>
    </div>
  );
}

'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitChars, splitWords, EASE } from '@/lib/motion';
import { prefersReducedMotion } from '@/lib/smoothScroll';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function KineticShiftTypography() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      /* --- display headline: per-character kinetic entrance --- */
      gsap.utils.toArray<HTMLElement>('.hm-editorial-title .line').forEach((line, i) => {
        const chars = splitChars(line);
        if (!chars.length) return;
        gsap.set(line, { opacity: 1 });
        gsap.from(chars, {
          yPercent: 105,
          opacity: 0,
          filter: 'blur(14px)',
          duration: 1.1,
          ease: EASE.out,
          stagger: 0.028,
          scrollTrigger: { trigger: containerRef.current, start: 'top 78%', toggleActions: 'play none none reverse' },
          delay: i * 0.12,
        });
      });

      /* --- sub-headline: masked words --- */
      const sub = containerRef.current?.querySelector<HTMLElement>('.hm-editorial-sub');
      if (sub) {
        const words = splitWords(sub);
        gsap.set(sub, { opacity: 1 });
        gsap.from(words, {
          yPercent: 116,
          duration: 1,
          ease: EASE.out,
          stagger: 0.03,
          scrollTrigger: { trigger: sub, start: 'top 88%', toggleActions: 'play none none reverse' },
        });
      }

      /* --- headline drifts up faster than the columns below it --- */
      gsap.to('.hm-editorial-title', {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to('.hm-editorial-sub', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.4,
        },
      });

      /* --- columns --- */
      gsap.from('.hm-editorial-col', {
        y: 44,
        opacity: 0,
        duration: 1,
        ease: EASE.out,
        stagger: 0.12,
        scrollTrigger: { trigger: '.hm-editorial-grid', start: 'top 85%', toggleActions: 'play none none reverse' },
      });

      /* --- doodles --- */
      gsap.utils.toArray<SVGPathElement>('.hm-doodle path').forEach((path, i) => {
        if (typeof path.getTotalLength !== 'function') return;
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: `top ${85 - i * 3}%`,
            end: 'center 55%',
            scrub: 1.2,
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="hm-editorial">
      {/* depth scenery */}
      <div className="cg-depth" aria-hidden="true">
        <span
          className="cg-ghost-type"
          data-parallax="0.32"
          data-parallax-x="0.2"
          data-parallax-trigger="self"
        >
          INKER
        </span>
        <span
          className="cg-mark cg-mark-b"
          data-parallax="0.55"
          data-parallax-rotate="26"
          data-parallax-trigger="self"
        />
        <span className="cg-rule cg-rule-a" data-parallax="0.42" data-parallax-trigger="self" />
        <span className="cg-rule cg-rule-c" data-parallax="0.26" data-parallax-trigger="self" />
      </div>

      {/* doodles */}
      <svg
        className="hm-doodle violet hide-sm"
        style={{ top: '18%', left: '4%', width: 110, height: 110 }}
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        <path d="M10,96 C30,30 70,110 92,40" strokeWidth="2" />
        <path d="M78,36 L94,38 L90,54" strokeWidth="2" />
      </svg>

      <svg
        className="hm-doodle lime"
        style={{ top: '48%', left: '8%', width: 64, height: 64 }}
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <path
          d="M14,52 C14,26 38,10 54,18 C74,28 72,60 52,70 C36,78 14,72 14,52 Z"
          strokeWidth="2.2"
        />
      </svg>

      <svg
        className="hm-doodle ink hide-sm"
        style={{ bottom: '22%', right: '4%', width: 130, height: 54 }}
        viewBox="0 0 160 60"
        aria-hidden="true"
      >
        <path d="M6,32 C40,4 76,58 112,26 C130,10 146,26 154,34" strokeWidth="1.6" />
      </svg>

      <div className="hm-editorial-inner">
        <h2 className="hm-editorial-title">
          <span className="line">Robotic</span>
          <span className="line thin">Culture</span>
        </h2>

        <p className="hm-editorial-sub">
          The next generation of sonic robotics and intelligent acoustic technology.
        </p>

        <div className="hm-editorial-grid">
          <div className="hm-editorial-col">
            <h4>Tholpava Kooth</h4>
            <p>Kerala&apos;s shadow puppetry, automated — heritage performed by machines.</p>
          </div>
          <div className="hm-editorial-col">
            <h4>Onam Sadhya</h4>
            <p>A robotic Onam feast that put Inker on the front page of Manorama.</p>
          </div>
          <div className="hm-editorial-col">
            <h4>Kunjiraman</h4>
            <p>The robot built for Flowers TV, performing live on national television.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitWords, EASE } from '@/lib/motion';
import { prefersReducedMotion } from '@/lib/smoothScroll';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function PostScrollTypography() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      /* --- headline: masked word reveal --- */
      const title = containerRef.current?.querySelector<HTMLElement>('.hm-panel-title');
      if (title) {
        const words = splitWords(title);
        gsap.set(title, { opacity: 1 });
        gsap.from(words, {
          yPercent: 116,
          rotate: 2.5,
          duration: 1.05,
          ease: EASE.out,
          stagger: 0.05,
          scrollTrigger: { trigger: containerRef.current, start: 'top 82%', toggleActions: 'play none none reverse' },
        });
      }

      /* --- everything else rises in sequence --- */
      gsap.from('.sleek-text-item', {
        y: 34,
        opacity: 0,
        duration: 0.9,
        ease: EASE.out,
        stagger: 0.09,
        scrollTrigger: { trigger: containerRef.current, start: 'top 82%', toggleActions: 'play none none reverse' },
      });

      /* --- doodles sketch themselves in on scroll --- */
      gsap.utils.toArray<SVGPathElement>('.hm-doodle path').forEach((path, i) => {
        if (typeof path.getTotalLength !== 'function') return;
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: `top ${88 - i * 4}%`,
            end: 'bottom 55%',
            scrub: 1.1,
          },
        });
      });

      /* --- the panel itself drifts against the scroll --- */
      gsap.fromTo(
        containerRef.current,
        { yPercent: 4 },
        {
          yPercent: -4,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="hm-panel hm-glass">
      {/* ---------- doodles ---------- */}
      <svg
        className="hm-doodle lime"
        style={{ top: '8%', left: '5%', width: 78, height: 78 }}
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <path d="M8,62 C22,18 44,84 58,34 C68,4 84,44 94,26" strokeWidth="2.4" />
      </svg>

      <svg
        className="hm-doodle violet hide-sm"
        style={{ top: '14%', right: '6%', width: 62, height: 62 }}
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <path d="M50,8 A42,42 0 1 1 49.6,8" strokeWidth="2.2" />
        <path d="M32,50 L46,64 L70,36" strokeWidth="2.6" />
      </svg>

      <svg
        className="hm-doodle ink hide-sm"
        style={{ bottom: '9%', left: '9%', width: 96, height: 46 }}
        viewBox="0 0 140 60"
        aria-hidden="true"
      >
        <path d="M4,44 C34,10 66,58 96,22 L128,34" strokeWidth="1.8" />
        <path d="M116,24 L130,34 L114,44" strokeWidth="1.8" />
      </svg>

      <svg
        className="hm-doodle lime"
        style={{ bottom: '16%', right: '8%', width: 54, height: 54 }}
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <path d="M50,10 L50,90 M10,50 L90,50 M22,22 L78,78 M78,22 L22,78" strokeWidth="2" />
      </svg>

      {/* ---------- content ---------- */}
      <div className="hm-panel-inner">
        <span className="hm-pill sleek-text-item">01 — Engineering</span>

        <h3 className="hm-panel-title">
          Humanoids, kiosks and automation built for the real world
        </h3>

        <p className="hm-panel-sub sleek-text-item">
          From the Inker Alton humanoid to the Federal Bank robotic kiosk — designed,
          built and deployed in-house.
        </p>

        <div className="hm-metrics sleek-text-item">
          <div className="hm-metric">
            <div className="hm-metric-label">Deployments</div>
            <div className="hm-metric-value">6+</div>
          </div>
          <div className="hm-metric">
            <div className="hm-metric-label">AI systems</div>
            <div className="hm-metric-value lime">25+</div>
          </div>
          <div className="hm-metric">
            <div className="hm-metric-label">Students</div>
            <div className="hm-metric-value violet">200K+</div>
          </div>
        </div>

        <div className="hm-status sleek-text-item">
          <span>
            <i className="hm-dot" />
            Kerala, India
          </span>
          <i className="sep" />
          <span className="lime">Since 2020</span>
          <i className="sep" />
          <span className="violet">Engineer the future</span>
        </div>
      </div>
    </section>
  );
}

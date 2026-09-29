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

const FEATURES = [
  {
    badge: '01 — Robotics',
    title: 'Machines that work',
    description:
      'Humanoids, robotic kiosks, serving robots and automation systems deployed in the field.',
    accent: 'lime' as const,
    doodle: (
      <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" strokeWidth="1.6" strokeLinecap="round" />
    ),
  },
  {
    badge: '02 — AI solutions',
    title: 'Engagement that converts',
    description:
      'WhatsApp-first customer management, digital lucky draws and campaign analytics.',
    accent: 'violet' as const,
    doodle: (
      <path d="M4 4h6v6H4zM14 14h6v6h-6zM4 14l16-10" strokeWidth="1.6" strokeLinecap="round" />
    ),
  },
  {
    badge: '03 — EduTech',
    title: 'Skills for what is next',
    description:
      'Workshops, internships, Robo Clubs and innovation labs across schools and colleges.',
    accent: 'lime' as const,
    doodle: (
      <path d="M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5" strokeWidth="1.6" strokeLinecap="round" />
    ),
  },
];

export default function GlassFeatureCards() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      /* --- section heading --- */
      const title = sectionRef.current?.querySelector<HTMLElement>('.hm-features-title');
      if (title) {
        const words = splitWords(title);
        gsap.set(title, { opacity: 1 });
        gsap.from(words, {
          yPercent: 116,
          duration: 1.05,
          ease: EASE.out,
          stagger: 0.045,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        });
      }

      gsap.from('.hm-features-head .hm-pill', {
        y: 20,
        opacity: 0,
        duration: 0.85,
        ease: EASE.out,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
      });

      /* --- cards deal in with a slight 3D tilt --- */
      gsap.from('.hm-feature-card', {
        y: 74,
        opacity: 0,
        rotateX: 14,
        transformOrigin: 'center bottom',
        duration: 1.05,
        ease: EASE.out,
        stagger: 0.13,
        scrollTrigger: { trigger: '.hm-feature-grid', start: 'top 84%', toggleActions: 'play none none reverse' },
      });

      /* --- cards drift at slightly different rates --- */
      gsap.utils.toArray<HTMLElement>('.hm-feature-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { yPercent: 3 + i * 2 },
          {
            yPercent: -3 - i * 2,
            ease: 'none',
            scrollTrigger: {
              trigger: '.hm-feature-grid',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2 + i * 0.25,
            },
          }
        );
      });

      /* --- doodles --- */
      gsap.utils.toArray<SVGPathElement>('.hm-doodle path, .hm-feature-icon path').forEach(
        (path, i) => {
          if (typeof path.getTotalLength !== 'function') return;
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top ${86 - (i % 4) * 3}%`,
              end: 'center 50%',
              scrub: 1.2,
            },
          });
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="hm-features">
      {/* depth scenery */}
      <div className="cg-depth" aria-hidden="true">
        <span className="cg-mark cg-mark-a" data-parallax="0.5" data-parallax-rotate="28" data-parallax-trigger="self" />
        <span className="cg-mark cg-mark-c" data-parallax="0.36" data-parallax-rotate="-22" data-parallax-trigger="self" />
        <span className="cg-rule cg-rule-b" data-parallax="0.44" data-parallax-trigger="self" />
      </div>

      {/* doodles */}
      <svg
        className="hm-doodle lime hide-sm"
        style={{ top: '4%', left: '2%', width: 88, height: 60 }}
        viewBox="0 0 120 80"
        aria-hidden="true"
      >
        <path d="M6,60 C26,10 58,72 78,26 L110,40" strokeWidth="2" />
        <path d="M98,30 L112,40 L96,50" strokeWidth="2" />
      </svg>

      <svg
        className="hm-doodle violet hide-sm"
        style={{ top: '2%', right: '3%', width: 70, height: 70 }}
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <path d="M20,80 C0,40 40,4 66,20 C92,36 88,84 56,88" strokeWidth="2" />
      </svg>

      <div className="hm-features-head">
        <span className="hm-pill">✦ Core capabilities</span>
        <h2 className="hm-features-title">
          Architected for unmatched precision
        </h2>
      </div>

      <div className="hm-feature-grid">
        {FEATURES.map((feat) => (
          <article
            key={feat.badge}
            className={`hm-feature-card hm-glass ${feat.accent === 'lime' ? 'accent-lime' : ''}`}
          >
            <div className="hm-feature-top">
              <span className="hm-feature-badge">{feat.badge}</span>
              <svg
                className="hm-feature-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={feat.accent === 'lime' ? 'var(--c-lime)' : 'var(--c-violet)'}
                aria-hidden="true"
              >
                {feat.doodle}
              </svg>
            </div>

            <h3>{feat.title}</h3>
            <p>{feat.description}</p>

            <div className="hm-feature-foot">
              <span>
                <i className="hm-dot" />
                Status: online
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M14 5l7 7-7 7M21 12H3" />
              </svg>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

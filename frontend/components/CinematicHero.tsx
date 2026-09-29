'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import RobotSequenceCanvas from './RobotSequenceCanvas';

/**
 * The reference site's signature opening: a 400vh scroll shaft with a
 * pinned frame-sequence robot inside it. Copy fades through three beats
 * as the sequence advances, then the whole stage dims and hands off to
 * the page below.
 */
export default function CinematicHero() {
  const shaftRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = shaftRef.current;
      if (!el) return;
      const scrollable = el.clientHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const p = Math.min(Math.max(-el.getBoundingClientRect().top / scrollable, 0), 1);
      setProgress(p);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  /* Three copy beats, cross-faded across the shaft. */
  const beat = (from: number, to: number) => {
    const fade = 0.07;
    if (progress < from - fade || progress > to + fade) return 0;
    if (progress < from) return (progress - (from - fade)) / fade;
    if (progress > to) return 1 - (progress - to) / fade;
    return 1;
  };

  const beats = [
    { o: beat(0.0, 0.28), kicker: 'Robotics · AI · EduTech', title: <>Building the Future with <em>Robotics, AI</em> &amp; Intelligent Experiences.</> },
    { o: beat(0.36, 0.62), kicker: 'Engineered in Kerala', title: <>Real products. <em>Real deployments.</em> Real impact.</> },
    { o: beat(0.72, 1.0), kicker: 'Engineer the Future', title: <>From humanoids to <em>innovation labs</em>, we build what comes next.</> },
  ];

  return (
    <div className="cin-shaft" ref={shaftRef}>
      <div className="cin-glows" aria-hidden="true">
        <span className="cin-glow cin-glow-violet" />
        <span className="cin-glow cin-glow-lime" />
      </div>

      <div className="cin-stage">
        <div className="cin-visual" aria-hidden="true">
          <RobotSequenceCanvas />
        </div>

        <div className="cin-copy">
          {beats.map((b, i) => (
            <div className="cin-beat" key={i} style={{ opacity: b.o, pointerEvents: b.o > 0.5 ? 'auto' : 'none' }}>
              <span className="kicker">{b.kicker}</span>
              <h1>{b.title}</h1>
            </div>
          ))}

          <div className="cin-actions" style={{ opacity: progress > 0.9 ? 1 : beats[0].o }}>
            <Link className="btn btn-primary" href="/robotics">Explore Solutions <span className="arrow">→</span></Link>
            <Link className="btn btn-ghost" href="/contact">Talk to Us</Link>
          </div>
        </div>

        <div className="cin-hud" aria-hidden="true">
          <span className="cin-hud-num">{String(Math.round(progress * 100)).padStart(3, '0')}</span>
          <span className="cin-hud-rail"><span style={{ transform: `scaleY(${progress})` }} /></span>
          <span className="cin-hud-label">SEQUENCE</span>
        </div>

        <div className="cin-scroll-hint" style={{ opacity: progress > 0.06 ? 0 : 1 }} aria-hidden="true">
          <span>SCROLL</span>
          <i />
        </div>
      </div>
    </div>
  );
}

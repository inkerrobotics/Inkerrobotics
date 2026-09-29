'use client';

import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import dynamic from 'next/dynamic';
import AutoImg from '@/components/AutoImg';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useSmoothScroll, prefersReducedMotion, getLenis } from '@/lib/smoothScroll';
import { initMotion, EASE } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/* The shader layer that the gallery already uses. It finds every element
   marked `data-webgl`, draws a GL plane over it and drives distortion
   from scroll velocity. Split out so three.js stays off the critical
   path, and it degrades to the plain DOM image when WebGL is missing or
   the user has asked for reduced motion. */
const WebGLImages = dynamic(() => import('@/components/WebGLImages'), { ssr: false });

export interface Showcase {
  title: string;
  description: string;
  image: string;
  bullets?: string[];
}

export interface Spec {
  value: string;
  suffix?: string;
  label: string;
}

export interface Voice {
  quote: string;
  name: string;
  role: string;
}

export interface SolutionPageProps {
  ghost: string;
  eyebrow: string;
  title: string;
  heroImage: string;
  /** Render the hero image through the WebGL shader layer. */
  heroWebgl?: boolean;
  heroStat: { value: string; suffix?: string; label: ReactNode };
  tabs: string[];
  aboutEyebrow: string;
  aboutTitle: string;
  aboutBody: string;
  aboutImage: string;
  showcaseTitle: string;
  showcase: Showcase[];
  specs?: Spec[];
  limitlessTitle: string;
  limitlessTags: string[];
  limitlessImage: string;
  articleTitle: string;
  articleBody: string;
  voices?: Voice[];
  diveTitle: string;
  diveImage: string;
}

function Brackets() {
  return (
    <div className="sv-brackets" aria-hidden="true">
      <i /><i /><i /><i />
    </div>
  );
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

/**
 * The reference site's service page, generalised.
 *
 * Robotics, AI Solutions, RoboParks and EduTech all share this exact
 * layout and motion — hero with wiped media and an overhanging stat,
 * a split "about", a pinned scroll-driven showcase, the limitless
 * block, testimonials and the full-bleed dive. Only the content differs.
 */
export default function SolutionPage(p: SolutionPageProps) {
  const mainRef = useRef<HTMLElement>(null);
  const showcaseRef = useRef<HTMLElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);

  useSmoothScroll();

  const goTo = useCallback((idx: number) => {
    const clamped = (idx + p.showcase.length) % p.showcase.length;
    const st = stRef.current;
    if (!st) {
      setActive(clamped);
      return;
    }
    const span = st.end - st.start;
    const y = st.start + ((clamped + 0.5) / p.showcase.length) * span;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 0.9 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  }, [p.showcase.length]);

  useGSAP(() => {
    const cleanup = initMotion(mainRef.current);
    if (prefersReducedMotion()) return cleanup;

    gsap.to('.sv-hero-media img', {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: { trigger: '.sv-hero', start: 'top top', end: 'bottom top', scrub: true },
    });

    gsap.to('.sv-hero-copy', {
      yPercent: -14,
      opacity: 0.25,
      ease: 'none',
      scrollTrigger: { trigger: '.sv-hero', start: 'top top', end: 'bottom top', scrub: true },
    });

    gsap.from('.sv-stat', { y: 40, opacity: 0, duration: 1, ease: EASE.out, delay: 0.5 });

    const showcase = showcaseRef.current;
    if (showcase && window.matchMedia('(min-width: 1001px)').matches) {
      let last = -1;
      stRef.current = ScrollTrigger.create({
        trigger: showcase,
        start: 'top top',
        end: () => `+=${window.innerHeight * (p.showcase.length - 0.35)}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const idx = Math.min(p.showcase.length - 1, Math.floor(self.progress * p.showcase.length));
          if (idx !== last) {
            last = idx;
            setActive(idx);
          }
        },
      });
    }

    gsap.from('.sv-tag', {
      scale: 0.82, opacity: 0, duration: 0.7, ease: EASE.out, stagger: 0.07,
      scrollTrigger: { trigger: '.sv-tags', start: 'top 88%', toggleActions: 'play none none reverse' },
    });

    gsap.from('.sv-quote', {
      y: 56, opacity: 0, duration: 1, ease: EASE.out, stagger: 0.14,
      scrollTrigger: { trigger: '.sv-quotes', start: 'top 82%', toggleActions: 'play none none reverse' },
    });

    gsap.fromTo('.sv-dive-media img',
      { scale: 1.16, yPercent: -5 },
      { scale: 1, yPercent: 5, ease: 'none',
        scrollTrigger: { trigger: '.sv-dive', start: 'top bottom', end: 'bottom top', scrub: 1.2 } }
    );

    return () => {
      stRef.current = null;
      cleanup();
    };
  }, { scope: mainRef });

  /* The hero and the "about" block are static, but `active` updates on
     every scroll tick of the pinned showcase. The hero title is split
     into per-character spans by lib/motion — which empties the element
     and rebuilds its children behind React's back — so re-diffing that
     subtree risks the same insertBefore NotFoundError the gallery hit.
     Memoise it so React reuses the element and never re-diffs it. */
  const staticTop = useMemo(
    () => (
      <>
      {/* ── 1 · HERO ── */}
      <section className="sv-hero">
        <Brackets />

        <div className="cg-depth" aria-hidden="true">
          <span className="cg-ghost-type" data-parallax="0.3" data-parallax-x="0.18" data-parallax-trigger="self">
            {p.ghost}
          </span>
          <span className="cg-mark cg-mark-a" data-parallax="0.55" data-parallax-rotate="28" data-parallax-trigger="self" />
          <span className="cg-rule cg-rule-b" data-parallax="0.36" data-parallax-trigger="self" />
        </div>

        <div className="sv-hero-grid">
          <div className="sv-hero-copy">
            <p className="cine-eyebrow" data-anim="fade-up">{p.eyebrow}</p>
            <h1 className="sv-hero-title" data-anim="chars" data-anim-stagger="0.035">{p.title}</h1>
            <div className="sv-hero-actions" data-anim="fade-up" data-anim-delay="0.25">
              <Link className="cine-btn" href="/contact" data-magnetic="0.3"><span className="dot" />Talk to us</Link>
              <Link className="cine-btn" href="/gallery" data-magnetic="0.3">See it in action</Link>
            </div>
          </div>

          <div className={`sv-hero-visual ${p.heroWebgl ? 'is-webgl' : ''}`}>
            <div className="sv-hero-media" {...(p.heroWebgl ? { 'data-webgl': '' } : {})}>
              <AutoImg src={p.heroImage} alt={p.title} />
            </div>

            <div className="sv-stat hm-glass accent-lime">
              <b>{p.heroStat.value}<span>{p.heroStat.suffix ?? '+'}</span></b>
              <small>{p.heroStat.label}</small>
            </div>
          </div>
        </div>

        <div className="sv-hero-rail">
          <div className="sv-tabs">
            {p.tabs.map((t, i) => (
              <button key={t} className={`sv-tab ${i === 0 ? 'active' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                  <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
                {t}
              </button>
            ))}
          </div>
          <div className="cg-scroll-hint"><i />Scroll</div>
        </div>
      </section>

      {/* ── 2 · ABOUT ── */}
      <section className="sv-section">
        <div className="cg-depth" aria-hidden="true">
          <span className="cg-ghost-type right" data-parallax="0.26" data-parallax-x="-0.2" data-parallax-trigger="self">
            INKER
          </span>
          <span className="cg-mark cg-mark-c" data-parallax="0.5" data-parallax-rotate="-24" data-parallax-trigger="self" />
          <span className="cg-rule cg-rule-a" data-parallax="0.4" data-parallax-trigger="self" />
        </div>

        <div className="sv-inner sv-split">
          <div className="sv-media" data-wipe="left">
            <AutoImg src={p.aboutImage} alt={p.aboutTitle} data-parallax="0.1" />
          </div>

          <div className="sv-copy">
            <p className="cine-eyebrow" data-anim="fade-up">{p.aboutEyebrow}</p>
            <h2 className="sv-title" data-anim="words">{p.aboutTitle}</h2>
            <div className="sv-divider" />
            <p className="cine-body" data-anim="fade-up" data-anim-delay="0.14">{p.aboutBody}</p>
          </div>
        </div>

        {p.specs && p.specs.length > 0 && (
          <div className="sv-inner">
            <div className="ink-specs" data-anim="stagger">
              {p.specs.map((s) => (
                <div className="ink-spec" key={s.label}>
                  <b>{s.value}<i>{s.suffix ?? '+'}</i></b>
                  <small>{s.label}</small>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [p.ghost, p.eyebrow, p.title, p.heroImage, p.heroWebgl, p.tabs,
     p.aboutEyebrow, p.aboutTitle, p.aboutBody, p.aboutImage, p.specs]
  );

  return (
    <main ref={mainRef} className="sv-page">
      {p.heroWebgl && <WebGLImages />}
      {staticTop}

      {/* Wrapper exists purely to absorb ScrollTrigger's pin-spacer.
          `pin: true` does not just position the element — it creates a
          `.pin-spacer` div, inserts it where the element was, and moves
          the element inside it. That reparents a node React is tracking,
          so the next time React reconciles this list it calls
          insertBefore against a child its parent no longer directly
          contains, and throws NotFoundError.
          Giving the pinned section its own wrapper means the spacer is
          created *inside* a div whose child list React never changes.
          React keeps managing the contents of the section; it just never
          has to move the section itself. */}
      <div className="pin-host">
        {/* ── 3 · SHOWCASE (pinned) ── */}
        <section className="sv-showcase" ref={showcaseRef}>
          <Brackets />

          <header className="sv-showcase-head">
            <div>
              <p className="cine-eyebrow">What we build</p>
              <h2 className="sv-title" style={{ marginTop: '0.7rem' }}>{p.showcaseTitle}</h2>
            </div>

            <div className="sv-nav">
              <button className="sv-arrow" onClick={() => goTo(active - 1)} aria-label="Previous">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button className="sv-arrow" onClick={() => goTo(active + 1)} aria-label="Next">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="9 6 15 12 9 18" /></svg>
              </button>
            </div>
          </header>

          <div className="sv-stage">
            <div className="sv-panels">
              {p.showcase.map((s, i) => (
                <article key={s.title} className={`sv-panel ${i === active ? 'active' : ''}`} aria-hidden={i !== active}>
                  <span className="sv-panel-index">{(i + 1).toString().padStart(2, '0')}</span>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                  {s.bullets && (
                    <ul className="ink-list">
                      {s.bullets.map((b) => <li key={b}>{b}</li>)}
                    </ul>
                  )}
                </article>
              ))}
            </div>

            <div className="sv-visuals">
              {p.showcase.map((s, i) => (
                <div key={s.image + i} className={`sv-visual ${i === active ? 'active' : ''}`}>
                  <AutoImg src={s.image} alt={s.title} />
                </div>
              ))}
            </div>
          </div>

          <div className="sv-rail">
            {p.showcase.map((s, i) => (
              <button key={s.title} className={i === active ? 'active' : i < active ? 'done' : ''} onClick={() => goTo(i)} aria-label={`Go to ${s.title}`}>
                <i />
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* ── 4 · LIMITLESS ── */}
      <section className="sv-section">
        <div className="cg-depth" aria-hidden="true">
          <span className="cg-mark cg-mark-b" data-parallax="0.52" data-parallax-rotate="26" data-parallax-trigger="self" />
          <span className="cg-rule cg-rule-c" data-parallax="0.38" data-parallax-trigger="self" />
        </div>

        <div className="sv-inner">
          <div className="sv-limitless-head">
            <h2 className="sv-title" data-anim="words" data-anim-stagger="0.05">{p.limitlessTitle}</h2>
            <div className="sv-tags">
              {p.limitlessTags.map((t) => <span className="sv-tag" key={t}>{t}</span>)}
            </div>
          </div>

          <div className="sv-limitless-body">
            <div className="sv-media" style={{ aspectRatio: '16 / 11' }} data-wipe="right">
              <AutoImg src={p.limitlessImage} alt={p.limitlessTitle} data-parallax="0.1" />
            </div>

            <div className="sv-article hm-glass">
              <h3 data-anim="words">{p.articleTitle}</h3>
              <p data-anim="fade-up" data-anim-delay="0.12">{p.articleBody}</p>
              <Link className="sv-link" href="/contact">Talk to us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5 · VOICES ── */}
      {p.voices && p.voices.length > 0 && (
        <section className="sv-section">
          <div className="cg-depth" aria-hidden="true">
            <span className="cg-ghost-type right" data-parallax="0.26" data-parallax-x="-0.22" data-parallax-trigger="self">
              VOICES
            </span>
            <span className="cg-rule cg-rule-a" data-parallax="0.4" data-parallax-trigger="self" />
          </div>

          <div className="sv-inner sv-voices">
            <div className="sv-voices-copy">
              <p className="cine-eyebrow" data-anim="fade-up">In the field</p>
              <h2 className="sv-title" data-anim="words">WHAT PARTNERS SAY</h2>
              <p className="cine-body" data-anim="fade-up" data-anim-delay="0.12">
                Institutions, brands and broadcasters who put Inker&apos;s work in front of real audiences.
              </p>
            </div>

            <div className="sv-quotes">
              {p.voices.map((t) => (
                <figure className="sv-quote hm-glass" key={t.name}>
                  <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="sv-quote-by">
                    <span className="sv-avatar" aria-hidden="true">{initials(t.name)}</span>
                    <span>
                      <span className="sv-quote-name">{t.name}</span>
                      <span className="sv-quote-role">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6 · DIVE ── */}
      <section className="sv-dive">
        <Brackets />
        <div className="sv-dive-media" aria-hidden="true">
          <AutoImg src={p.diveImage} alt="" />
        </div>
        <h2 className="sv-dive-title" data-anim="chars" data-anim-stagger="0.03">{p.diveTitle}</h2>
      </section>
    </main>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSmoothScroll } from '@/lib/smoothScroll';
import { initMotion } from '@/lib/motion';
import Navbar from './Navbar';
import ChatBot from './ChatBot/ChatBot';

/**
 * Cinematic shell.
 *
 * Wraps every route with the reference UI's chrome: a black intro hold,
 * film grain, a vignette, and a five-panel curtain that sweeps on route
 * change. It also owns the two global behaviours the reference relies on —
 * Lenis smooth scrolling and the declarative `data-anim` / `data-parallax`
 * motion scanner — so individual pages only have to write the attributes.
 *
 * Deliberately *not* ported from the reference: its wheel-at-bottom
 * auto-advance to the next route. That site had five pages in a fixed
 * sequence; this one has nine plus a dropdown nav, so hijacking the wheel
 * would fight the user rather than guide them.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();
  const firstPaint = useRef(true);
  const wrapRef = useRef<HTMLDivElement>(null);

  /* The admin panel is a working tool, not a showreel — it keeps the dark
     theme but opts out of the intro hold, grain, vignette and curtain. */
  const isAdmin = pathname?.startsWith('/admin') ?? false;

  useSmoothScroll();

  /* Intro hold — long enough for the logo animation to resolve. */
  useEffect(() => {
    if (isAdmin) {
      setIsLoading(false);
      return;
    }
    const t = setTimeout(() => setIsLoading(false), 1600);
    return () => clearTimeout(t);
  }, [isAdmin]);

  /* Curtain sweeps on every route change after the first. */
  useEffect(() => {
    if (firstPaint.current) {
      firstPaint.current = false;
      return;
    }
    setIsTransitioning(true);
    const t = setTimeout(() => setIsTransitioning(false), 620);
    return () => clearTimeout(t);
  }, [pathname]);

  /* Lock the page while the intro is up. */
  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  /* The halftone wash is painted by body::after, which a descendant can't
     reach — so flag the body itself when we're inside the admin panel. */
  useEffect(() => {
    document.body.classList.toggle('is-admin', isAdmin);
    return () => document.body.classList.remove('is-admin');
  }, [isAdmin]);

  /* Re-scan for motion attributes whenever the route's DOM changes. */
  useEffect(() => {
    const cleanup = initMotion(wrapRef.current);
    return cleanup;
  }, [pathname]);

  if (isAdmin) {
    return <div ref={wrapRef} className="admin-root">{children}</div>;
  }

  return (
    <>
      <div
        aria-hidden={!isLoading}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#000',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isLoading ? 1 : 0,
          visibility: isLoading ? 'visible' : 'hidden',
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.8s',
          pointerEvents: isLoading ? 'all' : 'none',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/loading.gif" alt="" style={{ maxWidth: 240, height: 'auto', display: 'block' }} />
      </div>

      {/* Ambient field. One fixed layer behind every page — the section
          wrappers are all transparent, so this shows through the whole
          site rather than needing per-section treatments. Pure CSS on
          transform and opacity only: no canvas, no JS, no repaints. */}
      <div className="ambient-field" aria-hidden="true">
        <span className="af-blob af-blob-violet" />
        <span className="af-blob af-blob-lime" />
        <span className="af-blob af-blob-deep" />
        <span className="af-grid" />
        <span className="af-scan" />
      </div>

      <Navbar />

      <div className="cine-grain" aria-hidden="true" />
      <div className="cine-vignette" aria-hidden="true" />

      <div className={`page-curtain ${isTransitioning ? 'active' : ''}`} aria-hidden="true">
        <span className="page-curtain-panel" />
        <span className="page-curtain-panel" />
        <span className="page-curtain-panel" />
        <span className="page-curtain-panel" />
        <span className="page-curtain-panel" />
        <span className="page-curtain-label">INKER — LINKING NEXT NODE</span>
      </div>

      <div
        ref={wrapRef}
        className={`page-transition-wrapper ${isTransitioning ? 'transition-out' : 'transition-in'}`}
      >
        {children}
      </div>

      <ChatBot />
    </>
  );
}

'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ------------------------------------------------------------------ *
 * Singleton Lenis instance.
 *
 * Previously every page created its own Lenis + gsap.ticker callback,
 * and the cleanup removed a *different* function reference than the one
 * that was added — so raf callbacks accumulated on every navigation and
 * scrolling got progressively heavier. This module keeps exactly one
 * instance alive for the lifetime of the app and hands out a ref count.
 * ------------------------------------------------------------------ */

let lenis: Lenis | null = null;
let rafHandler: ((time: number) => void) | null = null;
let refCount = 0;

export function getLenis() {
  return lenis;
}

function createLenis() {
  lenis = new Lenis({
    duration: 1.15,
    // expo-out: fast start, long cinematic glide
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
  });

  lenis.on('scroll', ScrollTrigger.update);

  rafHandler = (time: number) => {
    lenis?.raf(time * 1000);
  };

  gsap.ticker.add(rafHandler);
  gsap.ticker.lagSmoothing(0);

  // No scrollerProxy needed: Lenis drives the real window scroll position,
  // so ScrollTrigger's default scroller works — including pinning.
}

function destroyLenis() {
  if (rafHandler) gsap.ticker.remove(rafHandler);
  rafHandler = null;
  lenis?.destroy();
  lenis = null;
}

/**
 * Mount smooth scrolling. Safe to call from every page — the underlying
 * Lenis instance is shared and only torn down when the last consumer
 * unmounts.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    refCount += 1;
    if (!lenis) createLenis();

    // A fresh page means fresh layout: let ScrollTrigger recompute once
    // the DOM has painted.
    const id = requestAnimationFrame(() => {
      lenis?.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
    });

    // Pin start/end positions are measured from layout, and layout keeps
    // moving for a while after mount: images decode, and AppShell holds
    // an intro curtain with `body { overflow: hidden }` for ~2.2s. Without
    // these follow-up refreshes the pinned sections latch onto stale
    // measurements and jump on first scroll.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    const settle = window.setTimeout(onLoad, 2500);

    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(settle);
      window.removeEventListener('load', onLoad);
      refCount -= 1;
      if (refCount <= 0) {
        refCount = 0;
        destroyLenis();
      }
    };
  }, []);
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

'use client';

import React, { useEffect, useRef, useState } from 'react';

const TOTAL_FRAMES = 240;

/* Every PNG has a 1440px WebP twin sitting next to it — 60 KB against
   1.4 MB, so the full sequence is 15 MB instead of 476 MB. The PNGs are
   still on disk and are still used verbatim by anything that can't take
   WebP. */
let webpSupported: boolean | null = null;

function supportsWebP() {
  if (webpSupported !== null) return webpSupported;
  if (typeof document === 'undefined') return false;
  const c = document.createElement('canvas');
  webpSupported = c.getContext?.('2d')
    ? c.toDataURL('image/webp').startsWith('data:image/webp')
    : false;
  return webpSupported;
}

const frameName = (index: number) =>
  `ezgif-frame-${(index + 1).toString().padStart(3, '0')}`;

const getFrameUrl = (index: number) =>
  `/robot-sequence/${frameName(index)}.${supportsWebP() ? 'webp' : 'png'}`;

/* Load order. The scrub has to feel alive before the whole sequence is
   down, so we fetch a sparse skeleton first — every 8th frame, 30 images,
   under 2 MB — which drawFrame's nearest-neighbour fallback can already
   scrub against. Then we halve the gap repeatedly, so detail fills in
   evenly across the whole timeline rather than sweeping left to right. */
function buildLoadOrder(total: number): number[] {
  const order: number[] = [];
  const seen = new Set<number>();
  for (let step = 8; step >= 1; step = Math.floor(step / 2)) {
    for (let i = 0; i < total; i += step) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
    if (step === 1) break;
  }
  for (let i = 0; i < total; i++) {
    if (!seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  }
  return order;
}

/** Browsers stall past ~6 connections per host; queueing beats thrashing. */
const MAX_CONCURRENT = 6;

export default function RobotSequenceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawFrame = (index: number) => {
      const targetIndex = Math.min(Math.max(index, 0), TOTAL_FRAMES - 1);
      currentFrameRef.current = targetIndex;
      let img = imagesRef.current[targetIndex];

      // Fallback to nearest loaded frame
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let i = targetIndex - 1; i >= 0; i--) {
          if (imagesRef.current[i] && imagesRef.current[i].complete && imagesRef.current[i].naturalWidth > 0) {
            img = imagesRef.current[i];
            break;
          }
        }
      }

      if (img && img.complete && img.naturalWidth > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
        const x = canvas.width / 2 - (img.naturalWidth / 2) * scale;
        const y = canvas.height / 2 - (img.naturalHeight / 2) * scale;
        ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(currentFrameRef.current);
    };

    /* Progressive preload.

       The previous version fired all 240 `new Image()` requests on mount.
       That queued the entire sequence — 476 MB of PNG — before the first
       scroll, saturating the connection pool and starving everything else
       on the page. Every frame is still loaded; they are just fetched in
       an order that makes the scrub usable almost immediately, and no
       more than MAX_CONCURRENT are ever in flight. */
    let count = 0;
    let cursor = 0;
    let inFlight = 0;
    let cancelled = false;
    const order = buildLoadOrder(TOTAL_FRAMES);

    const pump = () => {
      while (!cancelled && inFlight < MAX_CONCURRENT && cursor < order.length) {
        const i = order[cursor++];
        if (imagesRef.current[i]) continue;

        const img = new Image();
        // hint the decoder to stay off the main thread
        img.decoding = 'async';
        imagesRef.current[i] = img;
        inFlight++;

        const done = (ok: boolean) => {
          inFlight--;
          if (cancelled) return;
          if (ok) {
            count++;
            setLoadedCount(count);
            // repaint if this is the frame currently on screen, or if it's
            // a better match than whatever the fallback settled for
            if (Math.abs(currentFrameRef.current - i) <= 4) {
              drawFrame(currentFrameRef.current);
            }
          }
          pump();
        };

        img.onload = () => done(true);
        img.onerror = () => {
          // a missing WebP twin should never cost us the frame
          if (img.src.endsWith('.webp')) {
            img.onerror = () => done(false);
            img.src = `/robot-sequence/${frameName(i)}.png`;
            return;
          }
          done(false);
        };
        img.src = getFrameUrl(i);
      }
    };

    pump();

    resizeCanvas();

    /* Scroll → frame.

       Two things kept this from being cheap:

       1. It drew straight out of the scroll event. Scroll can fire far
          more often than the display refreshes, so frames were being
          composited and thrown away. Now the event only records where we
          are and a single rAF does the drawing.

       2. It called setScrollProgress on every event, re-rendering this
          component ~60 times a second to recompute three booleans. The
          progress value is still tracked exactly as before, but React is
          only told when the value crosses a phase boundary — which is all
          isPhase1/2/3 can actually observe. Two renders per pass instead
          of hundreds. */
    let rafId = 0;
    let pendingFrame = -1;
    let lastPhase = -1;

    const phaseOf = (p: number) => (p < 0.33 ? 0 : p < 0.66 ? 1 : 2);

    const flush = () => {
      rafId = 0;
      if (pendingFrame >= 0 && pendingFrame !== currentFrameRef.current) {
        drawFrame(pendingFrame);
      }
    };

    const handleScroll = () => {
      const heroContainer = document.querySelector('.cin-shaft, .hero-scroll-container');
      if (!heroContainer) return;

      const rect = heroContainer.getBoundingClientRect();
      const totalScrollable = heroContainer.clientHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);

      const phase = phaseOf(progress);
      if (phase !== lastPhase) {
        lastPhase = phase;
        setScrollProgress(progress);
      }

      pendingFrame = Math.floor(progress * (TOTAL_FRAMES - 1));
      if (!rafId) rafId = requestAnimationFrame(flush);
    };

    /* Resizing reallocates the backing store, which is expensive; wait
       for the drag to settle rather than doing it on every pixel. */
    let resizeTimer = 0;
    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resizeCanvas, 120);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Compute active phase based on scroll progress (0.0 to 1.0)
  // Phase 1: 0.0 - 0.33
  // Phase 2: 0.33 - 0.66
  // Phase 3: 0.66 - 1.0
  const isPhase1 = scrollProgress < 0.33;
  const isPhase2 = scrollProgress >= 0.33 && scrollProgress < 0.66;
  const isPhase3 = scrollProgress >= 0.66;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'cover',
          maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
        }}
      />



      {loadedCount < TOTAL_FRAMES && (
        <div className="sequence-loader-badge">
          Loading sequence: {loadedCount} / {TOTAL_FRAMES}
        </div>
      )}
    </div>
  );
}

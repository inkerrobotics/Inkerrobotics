'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './smoothScroll';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const EASE = {
  out: 'power4.out',
  inOut: 'power3.inOut',
  expo: 'expo.out',
  soft: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

/* ================================================================== *
 * Text splitting (no premium SplitText plugin required)
 * ================================================================== */

/**
 * Splits an element's text into per-word spans wrapped in overflow-hidden
 * line boxes, so words can be masked upward. Idempotent — re-running on an
 * already-split element is a no-op.
 */
/**
 * Blanks whatever the element currently contains WITHOUT detaching it.
 *
 * This is the whole trick. `el.textContent = ''` removes React's text
 * nodes, but React keeps pointing at them; the next time it reconciles
 * that subtree it calls insertBefore against a node that is no longer a
 * child and throws:
 *
 *   NotFoundError: Failed to execute 'insertBefore' on 'Node'
 *
 * Emptying a text node's `data` leaves the node itself in place, so every
 * reference React holds stays valid. The split spans are then *appended*
 * — appending is safe, because React only ever inserts relative to nodes
 * it created, and all of those still exist.
 */
function blankInPlace(el: HTMLElement) {
  el.childNodes.forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE) {
      (n as Text).data = '';
    } else if (n instanceof HTMLElement && !n.classList.contains('m-split')) {
      n.style.display = 'none';
    }
  });
}

export function splitWords(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === 'true') {
    return Array.from(el.querySelectorAll<HTMLElement>('.m-word'));
  }

  const source = el.textContent ?? '';
  if (!source.trim()) return [];

  el.dataset.split = 'true';
  el.setAttribute('aria-label', source);
  blankInPlace(el);

  const host = document.createElement('span');
  host.className = 'm-split';
  host.setAttribute('aria-hidden', 'true');

  const words: HTMLElement[] = [];

  source.split(/(\s+)/).forEach((chunk) => {
    if (!chunk.trim()) {
      host.appendChild(document.createTextNode(' '));
      return;
    }
    const mask = document.createElement('span');
    mask.className = 'm-word-mask';
    mask.setAttribute('aria-hidden', 'true');

    const word = document.createElement('span');
    word.className = 'm-word';
    word.textContent = chunk;

    mask.appendChild(word);
    host.appendChild(mask);
    words.push(word);
  });

  el.appendChild(host);
  return words;
}

/**
 * Splits into individual characters — for short display headings only.
 *
 * Characters are grouped inside per-word wrappers. This matters a lot:
 *
 *   · An `inline-block` span is a valid line-break opportunity, so
 *     appending every character straight onto the element allowed the
 *     line breaker to split words down the middle — "ROBOTICS" wrapping
 *     as "ROBOT / ICS".
 *   · Spaces were being replaced with U+00A0, which never breaks, so the
 *     only places the line *could* break were mid-word.
 *
 * Together those produced shattered headings. Wrapping each word in a
 * `nowrap` box and putting ordinary spaces back as text nodes restores
 * normal word-level breaking.
 */
export function splitChars(el: HTMLElement): HTMLElement[] {
  if (el.dataset.splitChars === 'true') {
    return Array.from(el.querySelectorAll<HTMLElement>('.m-char'));
  }

  const source = el.textContent ?? '';
  if (!source.trim()) return [];

  el.dataset.splitChars = 'true';
  el.setAttribute('aria-label', source.replace(/\s+/g, ' ').trim());
  blankInPlace(el);

  const host = document.createElement('span');
  host.className = 'm-split';
  host.setAttribute('aria-hidden', 'true');

  const chars: HTMLElement[] = [];

  source.split(/(\s+)/).forEach((chunk) => {
    if (!chunk) return;

    // whitespace stays a real text node so it collapses and wraps normally
    if (!chunk.trim()) {
      host.appendChild(document.createTextNode(' '));
      return;
    }

    const word = document.createElement('span');
    word.className = 'm-word-c';
    word.setAttribute('aria-hidden', 'true');

    Array.from(chunk).forEach((c) => {
      const span = document.createElement('span');
      span.className = 'm-char';
      span.textContent = c;
      word.appendChild(span);
      chars.push(span);
    });

    host.appendChild(word);
  });

  el.appendChild(host);
  return chars;
}

/* ================================================================== *
 * Declarative scroll animations
 *
 * Usage in JSX:
 *   <h2 data-anim="words">Curated Collections</h2>
 *   <div data-anim="clip" data-anim-delay="0.15" />
 *   <img data-parallax="0.18" />
 *   <button data-magnetic />
 * ================================================================== */

type AnimKind =
  | 'words'
  | 'chars'
  | 'fade-up'
  | 'fade'
  | 'clip'
  | 'scale'
  | 'slide-left'
  | 'slide-right'
  | 'stagger';

function num(el: HTMLElement, key: string, fallback: number) {
  const raw = el.dataset[key];
  const parsed = raw != null ? parseFloat(raw) : NaN;
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildAnim(el: HTMLElement) {
  const kind = (el.dataset.anim ?? 'fade-up') as AnimKind;
  const delay = num(el, 'animDelay', 0);
  const stagger = num(el, 'animStagger', 0.045);
  const start = el.dataset.animStart ?? 'top 82%';

  /* onEnter / onLeave / onEnterBack / onLeaveBack.
     `play none none reverse` means: play on the way down, and rewind
     when the element leaves back off the top. Because these are all
     `from` tweens, rewinding restores the hidden start state, so the
     reveal plays again the next time you scroll down to it — rather
     than firing once and staying put for the rest of the session. */
  const st = {
    trigger: el,
    start,
    toggleActions: 'play none none reverse',
  };

  switch (kind) {
    case 'words': {
      const words = splitWords(el);
      if (!words.length) return;
      gsap.set(el, { opacity: 1 });
      gsap.from(words, {
        yPercent: 118,
        rotate: 3,
        duration: 1.05,
        ease: EASE.out,
        stagger,
        delay,
        scrollTrigger: st,
        /* Promote only while moving. A permanent will-change puts every
           word on its own compositor layer, which disables subpixel
           antialiasing and leaves the text looking thin and misaligned
           long after the animation is over. */
        onStart: () => gsap.set(words, { willChange: 'transform' }),
        /* Only willChange is cleared, not transform. Clearing transform
           would strip the state the tween needs to rewind, and these now
           rewind every time the heading leaves the top of the viewport.
           Dropping willChange is what fixes the antialiasing anyway —
           it is the layer promotion that thins the glyphs, not the
           transform itself. */
        onComplete: () => gsap.set(words, { willChange: 'auto' }),
      });
      break;
    }

    case 'chars': {
      const chars = splitChars(el);
      if (!chars.length) return;
      gsap.set(el, { opacity: 1 });
      gsap.from(chars, {
        yPercent: 90,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.9,
        ease: EASE.out,
        stagger: stagger * 0.6,
        delay,
        scrollTrigger: st,
        /* Same reasoning as words, and more urgent here: a display
           heading can be 30+ characters, so 30+ layers each rendering
           its glyph with different subpixel rounding. Clearing the
           transform lets the line settle back onto one layer and snap
           into alignment. */
        onStart: () => gsap.set(chars, { willChange: 'transform, opacity, filter' }),
        onComplete: () => gsap.set(chars, { willChange: 'auto' }),
      });
      break;
    }

    case 'clip': {
      gsap.fromTo(
        el,
        { clipPath: 'inset(0% 0% 100% 0%)', scale: 1.06 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          duration: 1.3,
          ease: EASE.out,
          delay,
          scrollTrigger: st,
        }
      );
      break;
    }

    case 'scale': {
      gsap.from(el, {
        scale: 0.88,
        opacity: 0,
        duration: 1.1,
        ease: EASE.out,
        delay,
        scrollTrigger: st,
      });
      break;
    }

    case 'slide-left': {
      gsap.from(el, {
        x: -70,
        opacity: 0,
        duration: 1.1,
        ease: EASE.out,
        delay,
        scrollTrigger: st,
      });
      break;
    }

    case 'slide-right': {
      gsap.from(el, {
        x: 70,
        opacity: 0,
        duration: 1.1,
        ease: EASE.out,
        delay,
        scrollTrigger: st,
      });
      break;
    }

    case 'stagger': {
      const children = Array.from(el.children) as HTMLElement[];
      if (!children.length) return;
      gsap.from(children, {
        y: 46,
        opacity: 0,
        duration: 0.95,
        ease: EASE.out,
        stagger: stagger * 3,
        delay,
        scrollTrigger: st,
      });
      break;
    }

    case 'fade': {
      gsap.from(el, {
        opacity: 0,
        duration: 1.1,
        ease: 'none',
        delay,
        scrollTrigger: st,
      });
      break;
    }

    case 'fade-up':
    default: {
      gsap.from(el, {
        y: 52,
        opacity: 0,
        duration: 1.05,
        ease: EASE.out,
        delay,
        scrollTrigger: st,
      });
    }
  }
}

/* ---- parallax --------------------------------------------------
 *
 *   data-parallax="0.2"          vertical drift, in fractions of height
 *   data-parallax-x="0.3"        horizontal drift, in % of own width
 *   data-parallax-rotate="6"     degrees swept across the scroll range
 *   data-parallax-scale="0.15"   scales from 1-n to 1+n
 *   data-parallax-scrub="1.5"    how lazily it chases the scrollbar
 *   data-parallax-trigger="self" measure against itself, not its parent
 *                                (use for full-bleed background layers)
 * ---------------------------------------------------------------- */

function buildParallax(el: HTMLElement) {
  const y = num(el, 'parallax', 0.15) * 100;
  const x = num(el, 'parallaxX', 0) * 100;
  const rotate = num(el, 'parallaxRotate', 0);
  const scale = num(el, 'parallaxScale', 0);
  const scrub = num(el, 'parallaxScrub', 1.1);

  const trigger =
    el.dataset.parallaxTrigger === 'self' ? el : el.parentElement ?? el;

  const from: gsap.TweenVars = { yPercent: -y / 2 };
  const to: gsap.TweenVars = { yPercent: y / 2, ease: 'none' };

  if (x) {
    from.xPercent = -x / 2;
    to.xPercent = x / 2;
  }
  if (rotate) {
    from.rotate = -rotate / 2;
    to.rotate = rotate / 2;
  }
  if (scale) {
    from.scale = 1 - scale;
    to.scale = 1 + scale;
  }

  gsap.fromTo(el, from, {
    ...to,
    scrollTrigger: {
      trigger,
      start: 'top bottom',
      end: 'bottom top',
      scrub,
      invalidateOnRefresh: true,
    },
  });
}

/* ---- scroll-linked section wipes -------------------------------
 *
 *   data-wipe            reveals the element behind a clip-path that
 *                        opens as it enters and closes as it leaves
 *   data-wipe="up"       direction: up (default) | down | left | right
 * ---------------------------------------------------------------- */

const WIPE_FROM: Record<string, string> = {
  up: 'inset(0% 0% 100% 0%)',
  down: 'inset(100% 0% 0% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
};

function buildWipe(el: HTMLElement) {
  const dir = el.dataset.wipe || 'up';

  gsap.fromTo(
    el,
    { clipPath: WIPE_FROM[dir] ?? WIPE_FROM.up },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top 92%',
        end: 'top 45%',
        scrub: 0.8,
      },
    }
  );
}

/* ---- magnetic hover -------------------------------------------- */

function buildMagnetic(el: HTMLElement, cleanups: Array<() => void>) {
  const power = num(el, 'magnetic', 0.35);
  const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: EASE.out });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: EASE.out });

  const onMove = (e: MouseEvent) => {
    const r = el.getBoundingClientRect();
    xTo((e.clientX - (r.left + r.width / 2)) * power);
    yTo((e.clientY - (r.top + r.height / 2)) * power);
  };
  const onLeave = () => {
    xTo(0);
    yTo(0);
  };

  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', onLeave);

  cleanups.push(() => {
    el.removeEventListener('mousemove', onMove);
    el.removeEventListener('mouseleave', onLeave);
  });
}

/* ---- scroll-linked line draw ----------------------------------- */

function buildDraw(el: SVGPathElement) {
  if (typeof el.getTotalLength !== 'function') return;
  const length = el.getTotalLength();
  gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
  gsap.to(el, {
    strokeDashoffset: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: el.ownerSVGElement ?? el,
      start: 'top 92%',
      end: 'bottom 55%',
      scrub: 1.2,
    },
  });
}

/* ================================================================== *
 * Entry point
 * ================================================================== */

/**
 * Marks an element as wired and reports whether it already was.
 *
 * This guard is essential, not defensive. initMotion runs twice on every
 * page: AppShell scans the whole route on navigation, and each page also
 * calls it from its own useGSAP. Without the guard, a second
 * `gsap.from(...)` on the same element records whatever the *first*
 * animation happens to be showing at that instant as its end state — so
 * a heading caught mid-reveal freezes there permanently. Combined with
 * cinematic.css starting `[data-anim="words"|"chars"]` at opacity 0, the
 * visible result was headings rendering only their first letter or two,
 * and staggered grids never fading in at all.
 */
function claim(el: Element, key: string, claimed: Array<[HTMLElement, string]>): boolean {
  const flag = `motion${key}`;
  const set = (el as HTMLElement).dataset;
  if (set[flag] === '1') return false;
  set[flag] = '1';
  claimed.push([el as HTMLElement, flag]);
  return true;
}

/**
 * Scans `scope` for declarative motion attributes and wires everything up.
 * Call inside `useGSAP(() => initMotion(ref.current), { scope: ref })` —
 * useGSAP reverts the tweens; the returned function cleans up listeners.
 *
 * Safe to call more than once on the same DOM: elements are only ever
 * wired a single time.
 */
export function initMotion(scope?: HTMLElement | null): () => void {
  const cleanups: Array<() => void> = [];
  /* Every element this particular call wires up. Released on cleanup —
     see the note on the return statement. */
  const claimed: Array<[HTMLElement, string]> = [];
  const root: ParentNode = scope ?? document;

  if (prefersReducedMotion()) {
    // Make sure nothing is left clipped or invisible when motion is off.
    root.querySelectorAll<HTMLElement>('[data-anim]').forEach((el) => {
      gsap.set(el, { clearProps: 'all', opacity: 1 });
    });
    root.querySelectorAll<HTMLElement>('[data-wipe]').forEach((el) => {
      gsap.set(el, { clipPath: 'none' });
    });
    return () => {};
  }

  root.querySelectorAll<HTMLElement>('[data-anim]').forEach((el) => {
    if (claim(el, 'Anim', claimed)) buildAnim(el);
  });
  root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    if (claim(el, 'Parallax', claimed)) buildParallax(el);
  });
  root.querySelectorAll<HTMLElement>('[data-wipe]').forEach((el) => {
    if (claim(el, 'Wipe', claimed)) buildWipe(el);
  });
  root.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    if (claim(el, 'Magnetic', claimed)) buildMagnetic(el, cleanups);
  });
  root.querySelectorAll<SVGPathElement>('[data-draw]').forEach((el) => {
    if (claim(el, 'Draw', claimed)) buildDraw(el);
  });

  /* Last line of defence. A split heading sits at opacity 0 until its
     tween plays; if a ScrollTrigger never fires — bad measurement after
     a pin, an image resizing late, a thrown error upstream — the copy
     would stay invisible with no way back. Anything still hidden a beat
     after wiring gets shown. */
  const safety = window.setTimeout(() => {
    root.querySelectorAll<HTMLElement>('[data-anim="words"], [data-anim="chars"]').forEach((el) => {
      if (getComputedStyle(el).opacity === '0') {
        gsap.set(el, { opacity: 1 });
        gsap.set(el.querySelectorAll('.m-word, .m-char'), {
          clearProps: 'transform,opacity,filter,willChange',
        });
      }
    });
  }, 2600);
  cleanups.push(() => window.clearTimeout(safety));

  // Fonts settle after first paint and change text metrics — refresh once.
  if (typeof document !== 'undefined' && 'fonts' in document) {
    document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
  }

  return () => {
    cleanups.forEach((fn) => fn());
    /* Release the claims.
       This matters more than it looks. useGSAP reverts its context on
       cleanup, which kills every tween it created. If the marks stayed,
       a re-mount would find each element already claimed, skip it, and
       the page would sit there with no animation at all — reverted
       tweens and nothing to replace them.
       React Strict Mode makes that the *normal* path in development:
       mount, clean up, mount again. Which is why the site looked like
       the animations had been stripped out. */
    claimed.forEach(([el, flag]) => {
      delete el.dataset[flag];
    });
  };
}

/* ================================================================== *
 * Scroll velocity — consumed by the WebGL layer for shader distortion
 * ================================================================== */

let velocity = 0;
let velocityBound = false;

export function bindScrollVelocity() {
  if (velocityBound || typeof window === 'undefined') return;
  velocityBound = true;

  let last = window.scrollY;
  const onScroll = () => {
    const now = window.scrollY;
    velocity = gsap.utils.clamp(-120, 120, now - last);
    last = now;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

export function getScrollVelocity() {
  // decay toward rest so the shader eases out instead of snapping
  velocity *= 0.9;
  return velocity;
}

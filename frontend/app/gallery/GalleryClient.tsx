'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import AutoImg from '@/components/AutoImg';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import dynamic from 'next/dynamic';
import { useSmoothScroll, prefersReducedMotion } from '@/lib/smoothScroll';
import { initMotion, splitChars, EASE } from '@/lib/motion';

/** Roughly how long AppShell holds the intro curtain up. */
const INTRO_MS = 1700;

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/* three.js is ~150 KB gzipped and the shader layer is decorative — it
   renders over images that are already visible. Splitting it out keeps
   it off the critical path; the gallery paints, then the WebGL layer
   fades in on top exactly as before. */
const WebGLImages = dynamic(() => import('@/components/WebGLImages'), { ssr: false });

type Shot = {
  src: string;
  title: string;
  tag: string;
};

/* Inker's real archive. Order matters: the editorial rows below pull
   SHOTS[7], SHOTS[4] and SHOTS[11] by index, so the three hero plates
   sit at those positions deliberately. */
const SHOTS: Shot[] = [
  { src: '/images/Gallery/Robots%20and%20Technology/FC__3253.JPG', title: 'Inker platform', tag: 'Robots' },
  { src: '/images/Gallery/Robots%20and%20Technology/FC__3270.JPG', title: 'Build and assembly', tag: 'Robots' },
  { src: '/images/Gallery/Robots%20and%20Technology/IMG_20190906_153059.jpg', title: 'Field deployment', tag: 'Robots' },
  { src: '/images/Gallery/Robots%20and%20Technology/IMG-20190425-WA0009.jpg', title: 'Workshop floor', tag: 'Robots' },
  { src: '/images/Gallery/Evnets%20and%20Exhibitions/Event%201.JPG', title: 'Technology expo', tag: 'Expos' },
  { src: '/images/Gallery/Evnets%20and%20Exhibitions/Event%202.JPG', title: 'Exhibition stand', tag: 'Expos' },
  { src: '/images/Gallery/Evnets%20and%20Exhibitions/Event%203.jpg', title: 'Live demonstration', tag: 'Expos' },
  { src: '/images/Gallery/Robots%20and%20Technology/Tharoor.jpg', title: 'Shashi Tharoor with Inker', tag: 'Robots' },
  { src: '/images/Gallery/Evnets%20and%20Exhibitions/Event%204.JPG', title: 'Public engagement', tag: 'Expos' },
  { src: '/images/Gallery/Evnets%20and%20Exhibitions/Event%205.JPG', title: 'Crowd interaction', tag: 'Expos' },
  { src: '/images/Gallery/News%20Paper%20Media/Inker%20Robotics%20-%20%20Robotic%20Onam%20Sadhya.jpg', title: 'Robotic Onam Sadhya', tag: 'Press' },
  { src: '/images/Gallery/News%20Paper%20Media/Inker%20Drones%20-%20Article%20on%20Manorama.jpg', title: 'Malayala Manorama feature', tag: 'Press' },
  { src: '/images/Gallery/News%20Paper%20Media/Inker%20Sanbot%20-%20Celebrity%20Robot.jpg', title: 'Inker Sanbot', tag: 'Press' },
  { src: '/images/Gallery/News%20Paper%20Media/ner%20Expo%20Mathrubhumi.jpg', title: 'Mathrubhumi expo coverage', tag: 'Press' },
  { src: '/images/Gallery/News%20Paper%20Media/COCON%20XI%20-%20Event.jpg', title: 'COCON XI', tag: 'Press' },
  { src: '/images/Gallery/News%20Paper%20Media/d4ea9ea6-d49d-472c-9b9a-47f753b65304.JPG', title: 'Media coverage', tag: 'Press' },
  { src: '/images/Gallery/Office%20and%20Team/IMG_20190909_140932.jpg', title: 'The team at work', tag: 'Team' },
  { src: '/images/Gallery/Office%20and%20Team/IMG_20190909_165159.jpg', title: 'Inside the workshop', tag: 'Team' },
  { src: '/images/Gallery/Office%20and%20Team/IMG_20190909_171028.jpg', title: 'Engineering bay', tag: 'Team' },
  { src: '/images/Gallery/Office%20and%20Team/IMG_20200108_185241.jpg', title: 'Team session', tag: 'Team' },
  { src: '/images/Gallery/Office%20and%20Team/IMG_20200108_185325.jpg', title: 'Build review', tag: 'Team' },
  { src: '/images/Gallery/Programs%20and%20Workshops/wp6.jpg', title: 'Student workshop', tag: 'Workshops' },
];

const STRIP_WORDS = ['ARCHIVE', 'INKER', 'ROBOTICS', 'EXPOS', 'PRESS', 'KERALA'];

/* ------------------------------------------------------------------
   Hero collage layout.

   Hand-placed rather than randomised so the composition is stable
   across renders (no hydration mismatch) and the centre stays clear
   for the wordmark. x/y/w are percentages of the stage; `d` is a depth
   band from 1 (closest, largest, sharpest, fastest) to 4 (far back,
   small, blurred, slow).
   ------------------------------------------------------------------ */
type Tile = { x: number; y: number; w: number; ratio: number; d: 1 | 2 | 3 | 4 };

const COLLAGE: Tile[] = [
  // ── top band ──
  { x: 1, y: 7, w: 12, ratio: 1.25, d: 2 },
  { x: 14, y: 1, w: 10, ratio: 0.8, d: 3 },
  { x: 25, y: 9, w: 11, ratio: 1.1, d: 1 },
  { x: 38, y: 2, w: 12, ratio: 0.75, d: 2 },
  { x: 52, y: 8, w: 10, ratio: 1.15, d: 3 },
  { x: 64, y: 1, w: 13, ratio: 0.85, d: 1 },
  { x: 79, y: 8, w: 11, ratio: 1.2, d: 2 },
  { x: 90, y: 2, w: 9, ratio: 1.0, d: 4 },

  // ── upper flanks ──
  { x: 0, y: 26, w: 11, ratio: 1.3, d: 3 },
  { x: 12, y: 22, w: 10, ratio: 0.95, d: 1 },
  { x: 76, y: 23, w: 12, ratio: 1.05, d: 1 },
  { x: 89, y: 28, w: 10, ratio: 1.25, d: 3 },

  // ── mid flanks (centre kept clear for the wordmark) ──
  { x: 2, y: 45, w: 12, ratio: 1.15, d: 1 },
  { x: 15, y: 41, w: 8, ratio: 1.35, d: 4 },
  { x: 78, y: 43, w: 11, ratio: 1.2, d: 2 },
  { x: 90, y: 49, w: 9, ratio: 1.1, d: 4 },

  // ── lower flanks ──
  { x: 1, y: 65, w: 10, ratio: 1.2, d: 2 },
  { x: 13, y: 70, w: 11, ratio: 0.9, d: 3 },
  { x: 75, y: 65, w: 12, ratio: 1.0, d: 3 },
  { x: 88, y: 71, w: 10, ratio: 1.3, d: 1 },

  // ── bottom band ──
  { x: 5, y: 86, w: 11, ratio: 0.85, d: 4 },
  { x: 19, y: 88, w: 12, ratio: 0.7, d: 2 },
  { x: 33, y: 82, w: 10, ratio: 1.05, d: 3 },
  { x: 45, y: 89, w: 11, ratio: 0.75, d: 1 },
  { x: 58, y: 82, w: 12, ratio: 0.95, d: 2 },
  { x: 71, y: 88, w: 10, ratio: 0.8, d: 4 },
  { x: 82, y: 83, w: 12, ratio: 1.0, d: 3 },
];

/** How hard each depth band flies outward as the hero scrolls away. */
const DEPTH_PUSH: Record<Tile['d'], number> = { 1: 1.5, 2: 1.0, 3: 0.62, 4: 0.34 };

/** Resting opacity per band. Lives here rather than in CSS so the scroll
 *  timeline can state its start value explicitly instead of capturing
 *  whatever happens to be on screen mid-intro. */
const DEPTH_OPACITY: Record<Tile['d'], number> = { 1: 1, 2: 0.92, 3: 0.78, 4: 0.6 };

/* ------------------------------------------------------------------
   PRESS COLLAGE
   A second, deliberately different collage: newspaper cuttings pinned
   to a board rather than tiles flying through space. Each clipping is
   set as an actual newsprint sheet — masthead rule, Didone headline,
   dateline, drop-capped lede and two justified columns — so the copy
   reads with the texture of a real cutting rather than a caption.

   Motion: a layered fan. Columns counter-drift sideways while the
   resting tilts settle toward zero — the opposite gesture to the
   hero's radial explosion.

   ── ACCURACY NOTE ──────────────────────────────────────────────────
   Publication names are taken from the source image filenames and are
   reliable. Everything else — headline, subhead, lede and body — is
   written by us as a description of the coverage, NOT transcribed from
   the printed article. `dateline` carries a place only; no dates or
   reporter bylines are asserted, because we do not have them. Replace
   this array with the real transcriptions before launch.
   ------------------------------------------------------------------ */
type Clipping = {
  src: string;
  paper: string;
  kind: string;
  /** place only — we don't assert publication dates we can't verify */
  dateline: string;
  headline: string;
  subhead: string;
  /** opening paragraph, set with a drop cap */
  lede: string;
  /** continues into two justified columns */
  body: string[];
  jump: string;
  /** 1 = front layer (large, fast, sharp) → 3 = back layer (small, slow) */
  z: 1 | 2 | 3;
  /** resting tilt in degrees */
  tilt: number;
};

const PRESS: Clipping[] = [
  {
    src: '/images/Gallery/News%20Paper%20Media/Inker%20Drones%20-%20Article%20on%20Manorama.jpg',
    paper: 'Malayala Manorama',
    kind: 'Newspaper feature',
    dateline: 'KOCHI',
    headline: 'Drones Built in Kerala Take to the State Daily',
    subhead: 'Inker Robotics’ unmanned systems reach one of India’s largest newspaper readerships',
    lede: 'For a workshop that had spent its first years talking mostly to engineers, the Manorama feature marked a change of audience.',
    body: [
      'The coverage placed Inker’s drone work in front of a readership counted in millions — readers who had no particular interest in flight controllers or airframes, but a considerable interest in what was being built down the road from them.',
      'It is the moment a piece of hardware stops being a project and becomes a local story.',
    ],
    jump: 'Continued in the archive',
    z: 1,
    tilt: -3.2,
  },
  {
    src: '/images/Gallery/News%20Paper%20Media/Inker%20Robotics%20-%20%20Robotic%20Onam%20Sadhya.jpg',
    paper: 'Regional Press',
    kind: 'Cultural feature',
    dateline: 'KERALA',
    headline: 'A Robot Serves the Onam Sadhya',
    subhead: 'The state’s most familiar meal, plated by machine — and the picture that travelled furthest',
    lede: 'Robotics rarely makes the culture pages. Serving a sadhya did what no specification sheet could.',
    body: [
      'The sadhya is not a neutral setting. It is the meal every household in Kerala can picture without being told, which is exactly why a machine placing food on a banana leaf reads as remarkable rather than routine.',
      'The story ran well outside the technology section — the clearest evidence Inker has that robotics lands hardest when it arrives inside something people already love.',
    ],
    jump: 'Continued in the archive',
    z: 1,
    tilt: 2.4,
  },
  {
    src: '/images/Gallery/News%20Paper%20Media/ner%20Expo%20Mathrubhumi.jpg',
    paper: 'Mathrubhumi',
    kind: 'Expo coverage',
    dateline: 'KERALA',
    headline: 'The Expo Floor, Front and Centre',
    subhead: 'Mathrubhumi reports from an Inker technology exhibition',
    lede: 'The expo has become Inker’s most repeatable format: bring the robots to the crowd rather than waiting for the crowd to find them.',
    body: [
      'More than two hundred expos and exhibitions have followed, across schools, colleges, conferences and public venues throughout the state.',
      'Each is a room of people meeting a working robot for the first time — and asking, almost without exception, whether they can touch it.',
    ],
    jump: 'Continued in the archive',
    z: 2,
    tilt: -1.6,
  },
  {
    src: '/images/Gallery/News%20Paper%20Media/Inker%20Sanbot%20-%20Celebrity%20Robot.jpg',
    paper: 'Media Coverage',
    kind: 'Broadcast & print',
    dateline: 'KERALA',
    headline: 'Sanbot Becomes a Familiar Face',
    subhead: 'When a machine is recognised on sight, the conversation stops being technical',
    lede: 'The Inker Sanbot acquired something most machines never manage: recognition.',
    body: [
      'Appearances across events and broadcast placed the unit in front of audiences repeatedly enough that people began greeting it rather than inspecting it.',
      'A robot that is recognised is a robot that has been accepted — a far harder engineering outcome than it sounds.',
    ],
    jump: 'Continued in the archive',
    z: 2,
    tilt: 3.6,
  },
  {
    src: '/images/Gallery/News%20Paper%20Media/COCON%20XI%20-%20Event.jpg',
    paper: 'COCON XI',
    kind: 'Conference',
    dateline: 'KOCHI',
    headline: 'Robotics on the Floor at COCON',
    subhead: 'Kerala’s long-running security and technology conference',
    lede: 'COCON is a rare room in which the audience asks harder questions than the press does.',
    body: [
      'Inker exhibited among security researchers and engineers — an audience with little patience for demonstrations that only work once.',
      'The questions were about failure modes, latency and what happens when the network drops. Good questions.',
    ],
    jump: 'Continued in the archive',
    z: 3,
    tilt: -2.8,
  },
  {
    src: '/images/Gallery/News%20Paper%20Media/d4ea9ea6-d49d-472c-9b9a-47f753b65304.JPG',
    paper: 'Press Archive',
    kind: 'Clipping',
    dateline: 'KERALA',
    headline: 'From the Cuttings Drawer',
    subhead: 'One of many features collected since 2020',
    lede: 'The pile is the point.',
    body: [
      'Robotics designed in Kerala, built in Kerala, reported in Kerala and read in Kerala — a loop that closes without ever leaving the state.',
      'The drawer keeps filling. This is a representative page from it.',
    ],
    jump: 'Continued in the archive',
    z: 3,
    tilt: 1.9,
  },
];

/** Per-layer motion for the press board — deliberately unlike DEPTH_PUSH. */
const PRESS_LAYER: Record<Clipping['z'], { drift: number; fan: number; blur: number; rest: number }> = {
  1: { drift: -14, fan: 5.5, blur: 0, rest: 1 },
  2: { drift: -8, fan: 3, blur: 0.6, rest: 0.9 },
  3: { drift: -3.5, fan: 1.4, blur: 1.4, rest: 0.74 },
};

const ROWS = [
  {
    shot: SHOTS[7],
    index: '01',
    title: 'Robots, photographed where they work',
    body: 'Not studio shots. The Inker Alton, the Federal Bank kiosk and the Tholpava Kooth rig are photographed on the floor, at the counter and on the stage — wherever they actually run.',
  },
  {
    shot: SHOTS[4],
    index: '02',
    title: 'Two hundred expos and counting',
    body: 'Technology expos, exhibitions and campus demonstrations across Kerala and beyond. Every one of them a room full of people meeting a robot for the first time.',
  },
  {
    shot: SHOTS[11],
    index: '03',
    title: 'The front pages',
    body: 'Malayala Manorama, Mathrubhumi, Flowers TV. When a robot serves an Onam sadhya or performs Tholpava Kooth, the press tends to notice.',
  },
];

export default function GalleryClient() {
  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState<Shot | null>(null);

  useSmoothScroll();

  /* ---------------- lightbox ---------------- */

  const open = useCallback((shot: Shot) => setActive(shot), []);
  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  useEffect(() => {
    const box = lightboxRef.current;
    if (!box) return;

    if (active) {
      box.classList.add('open');
      gsap.fromTo(box, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: EASE.out, overwrite: true });
      gsap.fromTo(
        box.querySelector('img'),
        { scale: 0.9, filter: 'blur(14px)', opacity: 0 },
        { scale: 1, filter: 'blur(0px)', opacity: 1, duration: 0.85, ease: EASE.out }
      );
    } else if (box.classList.contains('open')) {
      gsap.to(box, {
        opacity: 0,
        duration: 0.35,
        ease: EASE.out,
        overwrite: true,
        onComplete: () => box.classList.remove('open'),
      });
    }
  }, [active]);

  /* ---------------- scroll choreography ---------------- */

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      const cleanupMotion = initMotion(rootRef.current);

      if (reduced) return cleanupMotion;

      /* ---------------- HERO COLLAGE ----------------
         The hero pins for one extra viewport. Over that distance the
         collage flies apart — every tile pushes away from the centre of
         the screen at a rate set by its depth band — while the wordmark
         scales up and dissolves. */

      /* Pinning is a pointer-and-wheel idiom: it freezes the page and
         converts vertical scroll into horizontal travel. On touch that
         hijacks the natural gesture and reads as broken, and the pin
         spacer plus per-frame repaint is expensive on a phone. Gate
         both pinned sections behind the same breakpoint the solution
         pages already use for their showcase. */
      const canPin = window.matchMedia('(min-width: 1001px)').matches;

      const tiles = gsap.utils.toArray<HTMLElement>('.cg-collage-item');

      /* Entrance, held back until the AppShell intro curtain lifts. */
      const intro = gsap.timeline({ delay: INTRO_MS / 1000 });

      intro.from(
        tiles,
        {
          scale: 0.72,
          opacity: 0,
          duration: 1.4,
          ease: EASE.out,
          stagger: { each: 0.035, from: 'edges' },
        },
        0
      );

      intro.from('.cg-hero-kicker', { y: 18, opacity: 0, duration: 0.9, ease: EASE.out }, 0.3);

      gsap.utils.toArray<HTMLElement>('.cg-hero-title .line').forEach((line, i) => {
        const chars = splitChars(line);
        if (!chars.length) return;
        intro.from(
          chars,
          {
            yPercent: 65,
            opacity: 0,
            filter: 'blur(12px)',
            duration: 1.15,
            ease: EASE.out,
            stagger: 0.045,
          },
          0.45 + i * 0.14
        );
      });

      intro
        .from('.cg-hero-sub', { y: 16, opacity: 0, duration: 0.9, ease: EASE.out }, 1.05)
        .from('.cg-hero-meta', { y: 26, opacity: 0, duration: 1, ease: EASE.out }, 1.2);

      /* Idle drift so the collage breathes before you scroll. */
      const drifts = tiles.map((tile, i) =>
        gsap.to(tile, {
          yPercent: i % 2 ? -2.5 : 2.5,
          duration: 4 + (i % 5) * 0.7,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.05,
        })
      );

      /* Every tween below is a `fromTo` with `immediateRender: false` so
         it can't latch onto a mid-intro value. */
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=110%',
          // pinning costs a full-height spacer and a repaint per frame;
          // on a phone the collage still flies apart, just unpinned
          pin: canPin,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: (self) => drifts.forEach((d) => (self.isActive ? d.play() : d.pause())),
        },
      });

      const noRender = { immediateRender: false };

      tiles.forEach((tile) => {
        const push = parseFloat(tile.dataset.push ?? '1');
        const rest = parseFloat(tile.dataset.rest ?? '1');
        const cx = parseFloat(tile.dataset.cx ?? '50');
        const cy = parseFloat(tile.dataset.cy ?? '50');

        // vector from screen centre → tile centre, in viewport units
        const dx = (cx - 50) / 50;
        const dy = (cy - 50) / 50;

        heroTl.fromTo(
          tile,
          { x: 0, y: 0, scale: 1, opacity: rest, ...noRender },
          {
            x: `${dx * push * 62}vw`,
            y: `${dy * push * 55}vh`,
            scale: 1 + push * 0.55,
            opacity: 0,
            ease: 'power1.in',
            ...noRender,
          },
          0
        );
      });

      heroTl
        .fromTo('.cg-hero-mark', { scale: 1, ...noRender }, { scale: 1.28, ease: 'power1.in', ...noRender }, 0)
        .fromTo(
          '.cg-hero-kicker, .cg-hero-sub',
          { opacity: 1, y: 0, ...noRender },
          { opacity: 0, y: -20, ease: 'none', ...noRender },
          0
        )
        .fromTo(
          '.cg-hero-title',
          { opacity: 1, filter: 'blur(0px)', ...noRender },
          { opacity: 0, filter: 'blur(10px)', ease: 'power2.in', ...noRender },
          0.35
        )
        .fromTo('.cg-hero-meta', { opacity: 1, y: 0, ...noRender }, { opacity: 0, y: 40, ease: 'none', ...noRender }, 0)
        .fromTo('.cg-hero-scrim', { opacity: 1, ...noRender }, { opacity: 0, ease: 'none', ...noRender }, 0.2);

      /* Pinned horizontal rail. */
      const track = trackRef.current;
      const rail = railRef.current;

      if (track && rail && canPin) {
        const getDistance = () => track.scrollWidth - window.innerWidth + 64;

        const railTween = gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: rail,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 0.9,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) {
                gsap.set(progressRef.current, { scaleX: self.progress });
              }
            },
          },
        });

        /* Slides enter with a skew that resolves as they settle. */
        gsap.utils.toArray<HTMLElement>('.cg-slide').forEach((slide, i) => {
          gsap.fromTo(
            slide,
            { yPercent: (i % 3) * 6, rotate: i % 2 ? -1.2 : 1.2 },
            {
              yPercent: 0,
              rotate: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: slide,
                containerAnimation: railTween,
                start: 'left right',
                end: 'right left',
                scrub: 1,
              },
            }
          );
        });
      }

      /* ---------------- PRESS BOARD ----------------
         A different parallax signature from the hero on purpose. The
         hero throws tiles outward from screen centre; this one keeps
         everything on the board and instead:
           · drifts each depth layer vertically at its own rate,
           · fans the columns apart sideways (left goes left, right goes
             right) as you pass, then eases them back,
           · settles each clipping's resting tilt toward zero, so the
             pile straightens itself as it comes into focus,
           · sharpens the back layers out of a soft blur.
         Scrub values differ per layer so the layers never move in lock
         step — that mismatch is what reads as depth. */
      gsap.utils.toArray<HTMLElement>('.cg-clip').forEach((clip) => {
        const drift = parseFloat(clip.dataset.drift ?? '0');
        const fan = parseFloat(clip.dataset.fan ?? '0');
        const blur = parseFloat(clip.dataset.blur ?? '0');
        const tilt = parseFloat(clip.dataset.tilt ?? '0');
        const side = parseFloat(clip.dataset.side ?? '0'); // -1 left, +1 right
        const layer = parseFloat(clip.dataset.layer ?? '1');

        gsap.fromTo(
          clip,
          {
            yPercent: -drift,
            xPercent: -side * fan,
            rotate: tilt,
            filter: `blur(${blur}px)`,
          },
          {
            yPercent: drift,
            xPercent: side * fan,
            rotate: tilt * 0.15,
            filter: 'blur(0px)',
            ease: 'none',
            scrollTrigger: {
              trigger: '.cg-press',
              start: 'top bottom',
              end: 'bottom top',
              // each layer chases the scrollbar at its own laziness
              scrub: 0.6 + layer * 0.55,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      /* Clippings deal onto the board like cards being laid down. */
      gsap.from('.cg-clip', {
        y: 70,
        opacity: 0,
        rotate: (i: number) => (i % 2 ? -8 : 8),
        duration: 1.15,
        ease: EASE.out,
        stagger: { each: 0.11, from: 'random' },
        scrollTrigger: { trigger: '.cg-press-board', start: 'top 80%', toggleActions: 'play none none reverse' },
      });

      /* The masthead rule draws itself across as the section arrives. */
      gsap.fromTo(
        '.cg-press-rule i',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.cg-press-head', start: 'top 88%', end: 'top 40%', scrub: 1 },
        }
      );

      /* Editorial rows — media and copy travel at different speeds. */
      gsap.utils.toArray<HTMLElement>('.cg-row').forEach((row) => {
        const media = row.querySelector('.cg-row-media img');
        if (media) {
          gsap.fromTo(
            media,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: 'none',
              scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
            }
          );
        }
      });

      /* Mosaic tiles rise in a staggered wave. */
      gsap.from('.cg-tile', {
        y: 90,
        opacity: 0,
        duration: 1.1,
        ease: EASE.out,
        stagger: { each: 0.09, from: 'start' },
        scrollTrigger: { trigger: '.cg-mosaic', start: 'top 78%', toggleActions: 'play none none reverse' },
      });

      /* Two marquee tracks at different depths, speeds and directions —
         both flip when you reverse the scroll. */
      const stripTracks = gsap.utils.toArray<HTMLElement>('.cg-strip-track');

      if (stripTracks.length) {
        const loops = stripTracks.map((t, i) =>
          gsap.to(t, {
            xPercent: i === 0 ? -50 : 50,
            repeat: -1,
            duration: i === 0 ? 26 : 72,
            ease: 'none',
          })
        );

        ScrollTrigger.create({
          trigger: '.cg-strip',
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const dir = self.direction === 1 ? 1 : -1;
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 2200, 2.5);
            loops.forEach((loop) => loop.timeScale(dir * boost));
          },
          onLeave: () => loops.forEach((l) => l.timeScale(1)),
          onLeaveBack: () => loops.forEach((l) => l.timeScale(1)),
        });
      }

      return cleanupMotion;
    },
    { scope: rootRef }
  );

  /* Everything above the lightbox is static, but `active` re-renders
     this component every time a plate is opened or closed. That is a
     problem here specifically: lib/motion splits eight headings on this
     page by emptying the element and rebuilding its children, so React
     still holds references to text nodes that no longer exist. On the
     next reconcile it calls insertBefore against one of them and throws
     NotFoundError: "The node before which the new node is to be
     inserted is not a child of this node."

     Holding the static tree in a memo returns the identical element
     reference each render, so React bails out of diffing it entirely
     and never touches the mutated DOM. `open` is a stable useCallback,
     so this memoises for the life of the component. */
  const body = useMemo(
    () => (
      <>
      <WebGLImages />

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
        {/* ============================ HERO ============================ */}
        <section className="cg-hero" ref={heroRef}>
          <div className="cg-hero-stage">
            {/* ---- collage ---- */}
            <div className="cg-collage" aria-hidden="true">
              {COLLAGE.map((tile, i) => {
                const shot = SHOTS[i % SHOTS.length];
                return (
                  <div
                    key={`tile-${i}`}
                    className={`cg-collage-item depth-${tile.d}`}
                    style={{
                      left: `${tile.x}%`,
                      top: `${tile.y}%`,
                      width: `${tile.w}%`,
                      aspectRatio: `1 / ${tile.ratio}`,
                      opacity: DEPTH_OPACITY[tile.d],
                    }}
                    data-push={DEPTH_PUSH[tile.d]}
                    data-rest={DEPTH_OPACITY[tile.d]}
                    data-cx={tile.x + tile.w / 2}
                    data-cy={tile.y}
                  >
                    <AutoImg src={shot.src} alt="" loading="eager" />
                  </div>
                );
              })}
            </div>

            {/* ---- scrims keep the centre and the meta bar readable ---- */}
            <div className="cg-hero-scrim" aria-hidden="true" />

            {/* ---- centred wordmark ---- */}
            <div className="cg-hero-mark">
              <p className="cg-hero-kicker">Visual Archive — Since 2020</p>
              <h1 className="cg-hero-title">
                <span className="line">INKER</span>
                <span className="line outline">GALLERY</span>
              </h1>
              <p className="cg-hero-sub">
                {SHOTS.length} photographs · robots, expos, press and the workshop
              </p>
            </div>
          </div>

          {/* ---- bottom meta bar ---- */}
          <div className="cg-hero-meta">
            <div className="cg-hero-count">
              {SHOTS.length.toString().padStart(3, '0')}
              <span>Photographs catalogued</span>
            </div>

            <div className="cg-scroll-hint">
              <i />
              Scroll to enter
            </div>
          </div>
        </section>
      </div>

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
        {/* ====================== PINNED RAIL ========================== */}
        <section className="cg-rail" ref={railRef}>
          <div className="cg-rail-sticky">
            <header className="cg-rail-head">
              <div>
                <p className="cine-eyebrow" data-anim="fade-up">
                  Selected
                </p>
                <h2 className="cine-h2" data-anim="words" style={{ marginTop: '0.8rem' }}>
                  The horizontal cut
                </h2>
              </div>
              <p className="cine-body" data-anim="fade-up" data-anim-delay="0.15" style={{ maxWidth: '30ch' }}>
                Scroll down to travel sideways.
              </p>
            </header>

            <div className="cg-rail-track" ref={trackRef}>
              {SHOTS.map((shot, i) => (
                <figure key={shot.src} className="cg-slide" data-webgl onClick={() => open(shot)}>
                  <AutoImg src={shot.src} alt={shot.title} />
                  <span className="cg-slide-num">{(i + 1).toString().padStart(2, '0')}</span>
                  <figcaption className="cg-slide-cap">
                    <h4>{shot.title}</h4>
                    <p>{shot.tag}</p>
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="cg-rail-progress">
              <i ref={progressRef} />
            </div>
          </div>
        </section>
      </div>

      {/* ======================= MARQUEE STRIP ======================= */}
      <section className="cg-strip">
        <div className="cg-strip-track">
          {[...STRIP_WORDS, ...STRIP_WORDS, ...STRIP_WORDS, ...STRIP_WORDS].map((w, i) => (
            <span key={`${w}-${i}`}>{w}</span>
          ))}
        </div>
        <div className="cg-strip-track ghost" aria-hidden="true">
          {[...STRIP_WORDS, ...STRIP_WORDS, ...STRIP_WORDS, ...STRIP_WORDS].map((w, i) => (
            <span key={`ghost-${w}-${i}`}>{w}</span>
          ))}
        </div>
      </section>

      {/* ======================= PRESS BOARD ========================= */}
      <section className="cg-press">
        <div className="cg-depth" aria-hidden="true">
          <span className="cg-ghost-type" data-parallax="0.22" data-parallax-x="-0.14" data-parallax-trigger="self">
            PRESS
          </span>
          <span className="cg-rule cg-rule-d" data-parallax="0.44" data-parallax-trigger="self" />
          <span className="cg-mark cg-mark-b" data-parallax="0.3" data-parallax-rotate="-16" data-parallax-trigger="self" />
        </div>

        <header className="cg-press-head">
          <p className="cine-eyebrow" data-anim="fade-up">In print</p>
          <h2 className="cine-h2" data-anim="words" data-anim-stagger="0.04">
            What the papers wrote
          </h2>
          <p className="cine-body" data-anim="fade-up" data-anim-delay="0.14">
            Manorama, Mathrubhumi, broadcast and conference coverage — collected
            since 2020. A robot only really exists once someone outside the
            workshop writes about it.
          </p>
          <div className="cg-press-rule" aria-hidden="true"><i /></div>
        </header>

        <div className="cg-press-board">
          {PRESS.map((c, i) => {
            const layer = PRESS_LAYER[c.z];
            const side = i % 2 === 0 ? -1 : 1;
            return (
              <article
                key={c.src}
                className={`cg-clip z-${c.z}`}
                data-drift={layer.drift}
                data-fan={layer.fan}
                data-blur={layer.blur}
                data-tilt={c.tilt}
                data-side={side}
                data-layer={c.z}
                style={{ opacity: layer.rest }}
                onClick={() =>
                  open({ src: c.src, title: c.headline, tag: `${c.paper} · ${c.kind}` })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  open({ src: c.src, title: c.headline, tag: `${c.paper} · ${c.kind}` })
                }
              >
                <div className="cg-clip-media">
                  <AutoImg src={c.src} alt={`${c.paper} — ${c.headline}`} loading="lazy" />
                  <span className="cg-clip-tape" aria-hidden="true" />
                </div>

                <div className="cg-clip-copy">
                  <div className="cg-clip-masthead">
                    <span className="cg-clip-paper">{c.paper}</span>
                    <span className="cg-clip-kind">{c.kind}</span>
                  </div>

                  <div className="cg-clip-hairline" aria-hidden="true" />

                  <h3 className="cg-clip-headline">{c.headline}</h3>
                  <p className="cg-clip-subhead">{c.subhead}</p>

                  <div className="cg-clip-hairline thin" aria-hidden="true" />

                  <p className="cg-clip-lede">
                    <span className="cg-clip-dateline">{c.dateline} —</span> {c.lede}
                  </p>

                  <div className="cg-clip-cols">
                    {c.body.map((para, n) => (
                      <p key={n}>{para}</p>
                    ))}
                  </div>

                  <span className="cg-clip-jump">{c.jump}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ====================== EDITORIAL ROWS ======================= */}
      <section className="cg-split">
        {/* drifting depth layers behind the rows */}
        <div className="cg-depth" aria-hidden="true">
          <span className="cg-ghost-type" data-parallax="0.34" data-parallax-x="0.18" data-parallax-trigger="self">
            PLATES
          </span>
          <span className="cg-mark cg-mark-a" data-parallax="0.62" data-parallax-rotate="26" data-parallax-trigger="self" />
          <span className="cg-mark cg-mark-b" data-parallax="0.4" data-parallax-rotate="-18" data-parallax-trigger="self" />
          <span className="cg-rule cg-rule-a" data-parallax="0.5" data-parallax-trigger="self" />
          <span className="cg-rule cg-rule-b" data-parallax="0.28" data-parallax-trigger="self" />
        </div>

        {ROWS.map((row, i) => (
          <article className={`cg-row ${i % 2 ? 'flip' : ''}`} key={row.index}>
            {/* No data-wipe here: a CSS clip-path only clips the DOM box,
                not the shader plane drawn over it. These images get their
                reveal from the uReveal uniform instead. */}
            <div className="cg-row-media" data-webgl onClick={() => open(row.shot)}>
              <AutoImg src={row.shot.src} alt={row.title} />
            </div>
            <div className="cg-row-copy">
              <span className="cg-row-big" aria-hidden="true" data-parallax="0.5" data-parallax-trigger="self">
                {row.index}
              </span>
              <span className="cg-row-index" data-anim="fade-up">
                {row.index} / 03
              </span>
              <h3 className="cine-h2" data-anim="words">
                {row.title}
              </h3>
              <p className="cine-body" data-anim="fade-up" data-anim-delay="0.12">
                {row.body}
              </p>
              <button className="cine-btn" data-magnetic="0.25" onClick={() => open(row.shot)}>
                <span className="dot" />
                View plate
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* ========================== MOSAIC =========================== */}
      <section className="cg-mosaic-wrap">
        <div className="cg-depth" aria-hidden="true">
          <span className="cg-ghost-type right" data-parallax="0.28" data-parallax-x="-0.22" data-parallax-trigger="self">
            INDEX
          </span>
          <span className="cg-mark cg-mark-c" data-parallax="0.55" data-parallax-rotate="34" data-parallax-trigger="self" />
          <span className="cg-rule cg-rule-c" data-parallax="0.42" data-parallax-trigger="self" />
        </div>

        <div className="cg-mosaic-head">
          <p className="cine-eyebrow" data-anim="fade-up">
            Full index
          </p>
          <h2 className="cine-h2" data-anim="words">
            Everything else in the drawer
          </h2>
          <p className="cine-body" data-anim="fade-up" data-anim-delay="0.12">
            Expos, workshops, front pages and the team behind all of it.
          </p>
        </div>

        <div className="cg-mosaic">
          {SHOTS.slice(0, 6).map((shot, i) => (
            <figure
              key={shot.src}
              className={`cg-tile t-${'abcdef'[i]}`}
              data-webgl
              data-parallax={[0.08, 0.16, 0.05, 0.2, 0.11, 0.14][i]}
              data-parallax-scrub={1 + (i % 3) * 0.4}
              onClick={() => open(shot)}
            >
              <AutoImg src={shot.src} alt={shot.title} />
            </figure>
          ))}
        </div>
      </section>

      {/* ========================== SIGN-OFF ========================= */}
      <footer className="cg-footer">
        <div className="cg-depth" aria-hidden="true">
          <span className="cg-rule cg-rule-d" data-parallax="0.34" data-parallax-trigger="self" />
          <span className="cg-mark cg-mark-d" data-parallax="0.48" data-parallax-rotate="-30" data-parallax-trigger="self" />
        </div>

        <h2 className="cg-footer-mark" data-anim="chars" data-parallax="0.12" data-parallax-trigger="self">
          INKER ARCHIVE
        </h2>
        <div className="cg-footer-row">
          <span>© {new Date().getFullYear()} Inker Robotics</span>
          <span>Kerala, India — {SHOTS.length} photographs</span>
          <span>Rendered with WebGL</span>
        </div>
      </footer>
      </>
    ),
    [open]
  );

  return (
    <main className="cg-page" ref={rootRef}>
      {body}

      {/* ========================= LIGHTBOX ========================== */}
      <div
        className="cg-lightbox"
        ref={lightboxRef}
        onClick={close}
        role="dialog"
        aria-modal="true"
        aria-hidden={!active}
      >
        <button className="cg-lightbox-close" onClick={close} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {active && (
          <>
            <AutoImg src={active.src} alt={active.title} onClick={(e) => e.stopPropagation()} />
            <p className="cg-lightbox-caption">
              {active.title} — {active.tag}
            </p>
          </>
        )}
      </div>
    </main>
  );
}

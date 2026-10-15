'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/smoothScroll';
import { EASE } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Extra GSAP choreography for the content pages (About, Careers, Contact).
 *
 * Drop <PageMotion /> anywhere inside a page's <main>. It renders nothing;
 * it finds the enclosing <main> and animates the shared building blocks it
 * contains, so each page only gets the effects for the parts it actually
 * uses. It never touches elements that carry `data-anim`, which lib/motion
 * already owns, so nothing is animated twice.
 */
export default function PageMotion() {
  const probe = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const main = probe.current?.closest('main');
    if (!main || prefersReducedMotion()) return;

    const cleanups: Array<() => void> = [];
    const q = <T extends Element = HTMLElement>(sel: string) =>
      Array.from(main.querySelectorAll<T>(sel)).filter((el) => !(el as unknown as HTMLElement).dataset?.anim);
    const reveal = (trigger: Element, start = 'top 86%') => ({
      trigger, start, toggleActions: 'play none none reverse',
    });

    const ctx = gsap.context(() => {
      /* Corner brackets close in on each framed section. */
      q('.sv-brackets').forEach((b) => {
        gsap.from(b.children, {
          scale: 0, opacity: 0, duration: 0.9, ease: 'back.out(2)', stagger: 0.08,
          transformOrigin: 'center',
          scrollTrigger: reveal(b.parentElement ?? b, 'top 80%'),
        });
      });

      /* Orange divider rules draw out from the left. */
      q('.sv-divider').forEach((d) => {
        gsap.from(d, {
          scaleX: 0, transformOrigin: 'left center', duration: 1.1, ease: EASE.out,
          scrollTrigger: reveal(d, 'top 90%'),
        });
      });

      /* Tag pills pop in. */
      q('.sv-tags').forEach((wrap) => {
        gsap.from(wrap.children, {
          scale: 0.7, opacity: 0, duration: 0.7, ease: 'back.out(2.2)', stagger: 0.08,
          scrollTrigger: reveal(wrap, 'top 90%'),
        });
      });

      /* Bullet lists slide in item by item. */
      q('.ink-list').forEach((list) => {
        gsap.from(list.children, {
          x: -28, opacity: 0, duration: 0.7, ease: EASE.out, stagger: 0.09,
          scrollTrigger: reveal(list, 'top 88%'),
        });
      });

      /* Rows of roles / perks: each row rises and its top edge wipes open. */
      q('.ink-roles').forEach((wrap) => {
        Array.from(wrap.children).forEach((row) => {
          gsap.fromTo(row,
            { y: 50, opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' },
            { y: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'expo.out',
              scrollTrigger: reveal(row, 'top 90%') });
        });
      });

      /* Contact details rail. */
      q('.ink-detail').forEach((row, i) => {
        gsap.from(row, {
          x: -36, opacity: 0, duration: 0.85, ease: EASE.out, delay: (i % 5) * 0.08,
          scrollTrigger: reveal(row, 'top 92%'),
        });
      });
      q('.ink-social-links').forEach((wrap) => {
        gsap.from(wrap.children, {
          y: 16, scale: 0.85, opacity: 0, duration: 0.6, ease: 'back.out(2)', stagger: 0.08,
          scrollTrigger: reveal(wrap, 'top 95%'),
        });
      });

      /* Contact form: the card rises, then the fields cascade. */
      q('.ink-contact-grid > .sv-article').forEach((card) => {
        const tl = gsap.timeline({ scrollTrigger: reveal(card, 'top 85%') });
        tl.from(card, { y: 70, opacity: 0, duration: 1.05, ease: EASE.out });
        const fields = card.querySelectorAll('.ink-form-row, .ink-form > .ink-field, .ink-submit');
        if (fields.length) {
          tl.from(fields, { y: 26, opacity: 0, duration: 0.7, ease: EASE.out, stagger: 0.08 }, 0.3);
        }
      });

      /* About: journey timeline items step in with their dots popping. */
      q('.ink-tl-item').forEach((item) => {
        const tl = gsap.timeline({ scrollTrigger: reveal(item, 'top 88%') });
        tl.from(item, { y: 36, opacity: 0, duration: 0.85, ease: EASE.out });
        const dot = item.querySelector('.ink-tl-dot');
        if (dot) tl.from(dot, { scale: 0, duration: 0.6, ease: 'back.out(3)' }, 0.15);
      });

      /* About: leader portraits wipe up from the bottom. */
      q('.ink-leader-photo').forEach((photo) => {
        gsap.fromTo(photo,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.out',
            scrollTrigger: reveal(photo, 'top 85%') });
      });

      /* Closing banner title grows into place as the banner scrolls up. */
      /* Scale only — the letters inside are animated by lib/motion. */
      main.querySelectorAll('.sv-dive-title').forEach((t) => {
        gsap.fromTo(t, { scale: 0.82 }, {
          scale: 1, ease: 'none',
          scrollTrigger: { trigger: t.closest('.sv-dive') ?? t, start: 'top bottom', end: 'center center', scrub: 1 },
        });
      });
      q('.sv-dive-media img').forEach((img) => {
        gsap.fromTo(img, { scale: 1.16, yPercent: -5 }, {
          scale: 1, yPercent: 5, ease: 'none',
          scrollTrigger: { trigger: img.closest('.sv-dive') ?? img, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
        });
      });
    }, main);

    /* Gentle 3D tilt on glass cards, desktop pointers only. */
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      main.querySelectorAll<HTMLElement>('.ink-mv, .ink-leader, .ink-contact-grid > .sv-article').forEach((card) => {
        gsap.set(card, { transformPerspective: 1000 });
        const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' });
        const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' });
        const strength = card.matches('.sv-article') ? 3 : 6;
        const onMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * strength);
          rx(-((e.clientY - r.top) / r.height - 0.5) * strength);
        };
        const onLeave = () => { rx(0); ry(0); };
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
        cleanups.push(() => {
          card.removeEventListener('mousemove', onMove);
          card.removeEventListener('mouseleave', onLeave);
          gsap.set(card, { clearProps: 'rotationX,rotationY,transformPerspective' });
        });
      });
    }

    /* Images and fonts settle after first paint; re-measure once. */
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      window.clearTimeout(t);
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return <span ref={probe} hidden aria-hidden="true" />;
}

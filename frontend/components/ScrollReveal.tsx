'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SELECTOR = [
  '.domain', '.product-card', '.case', '.pillar', '.industry-card',
  '.industry-pill', '.solution-card', '.media-item', '.lab-card',
  '.role', '.highlight', '.t-item', '.leader', '.vertical',
  '.capability', '.park-card', '.flow-step', '.program',
  '.section-head', '.mv', '.contact-card', '.form-section',
  '.gallery-photo', '.stakeholder', '.benefit', '.openings-empty',
  '.inquiry-card', '.news-marquee-item'
].join(', ');

const STAGGER_STEP = 0.06;
const STAGGER_MAX = 3;

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    if (!els.length) return;

    els.forEach((el) => {
      el.classList.add('reveal');
      const siblings = Array.from(el.parentElement?.children ?? []);
      const index = Math.min(siblings.indexOf(el), STAGGER_MAX);
      el.style.transitionDelay = `${index * STAGGER_STEP}s`;
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px 200px 0px' });

    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('in-view');
      } else {
        io.observe(el);
      }
    });

    return () => io.disconnect();
  }, [pathname]);

  return null;
}

'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import dynamic from 'next/dynamic';
import PostScrollTypography from '@/components/PostScrollTypography';
import GlassFeatureCards from '@/components/GlassFeatureCards';
import KineticShiftTypography from '@/components/KineticShiftTypography';
import ExpertServices from '@/components/ExpertServices';
const InteractiveHand = dynamic(() => import('@/components/InteractiveHand'), { ssr: false });
// reads the Brands API so mastheads can be managed from /admin/brands
const PressLogos = dynamic(() => import('@/components/PressLogos'), { ssr: false });
// clients, campuses and institutions — same Brands API, page=partners
const PartnerLogos = dynamic(() => import('@/components/PartnerLogos'), { ssr: false });
import { useSmoothScroll, prefersReducedMotion } from '@/lib/smoothScroll';
import { initMotion, EASE } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/* The sequence canvas only ever runs in the browser and owns its own
   progressive loader, so there is nothing to gain from shipping it in
   the first chunk. */
const RobotSequenceCanvas = dynamic(() => import('@/components/RobotSequenceCanvas'), {
  ssr: false,
});

export default function HomeClient() {
  const mainRef = useRef<HTMLElement>(null);

  useSmoothScroll();

  useGSAP(() => {
    const cleanup = initMotion(mainRef.current);
    if (prefersReducedMotion()) return cleanup;

    gsap.utils.toArray<HTMLElement>('.parallax-bg-text').forEach((text) => {
      gsap.to(text, {
        x: -150,
        ease: 'none',
        scrollTrigger: { trigger: text, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    });

    // The hero blacks out as the robot sequence hands off to the page
    gsap.to('.hero-sticky', {
      filter: 'brightness(0.35) saturate(0.6)',
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-scroll-container',
        start: 'bottom 80%',
        end: 'bottom top',
        scrub: true,
      },
    });

    gsap.from('.partners-logos span', {
      scrollTrigger: { trigger: '.partners-section', start: 'top 85%', toggleActions: 'play none none reverse' },
      y: 30,
      opacity: 0,
      duration: 0.9,
      stagger: 0.08,
      ease: EASE.out,
    });

    const marquee = document.querySelector<HTMLElement>('.marquee-content');
    if (marquee) {
      gsap.to(marquee, {
        xPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: '.marquee-container', start: 'top bottom', end: 'bottom top', scrub: 1.4 },
      });
    }

    /* The wordmark drifts and opens up as the hero shaft scrolls — it
       pulls apart and fades just as the robot sequence hands over to the
       page, so it never competes with the sections below. */
    gsap.fromTo(
      '.hero-wordmark-line',
      { yPercent: (i) => (i === 0 ? 6 : -6), letterSpacing: '-0.05em' },
      {
        yPercent: (i) => (i === 0 ? -14 : 14),
        letterSpacing: '0.06em',
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-scroll-container',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.1,
        },
      }
    );

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    gsap.from('.footer-logo', {
      scrollTrigger: { trigger: '.hm-signoff', start: 'top 90%', toggleActions: 'play none none reverse' },
      opacity: 0,
      letterSpacing: isMobile ? '0.12em' : '0.3em',
      duration: 1.6,
      ease: EASE.out,
    });

    return cleanup;
  }, { scope: mainRef });

  return (
    <main ref={mainRef}>
      <div className="hero-scroll-container relative z-10">
        <div className="ambient-glows"></div>

        <div className="hero-sticky">
          <div className="hero-visual-wrap" aria-hidden="true">
            {/* Wordmark sits *inside* the visual layer and behind the
                canvas. The frames are opaque, so the canvas is composited
                with mix-blend-mode: lighten — its near-black ground
                (#020202) loses to the wordmark's stroke and drops out,
                while the lit parts of the robot win and stay solid. The
                result is type genuinely behind the machine. */}
            <div className="hero-wordmark">
              <span className="hero-wordmark-line">INKER</span>
              <span className="hero-wordmark-line accent">ROBOTICS</span>
            </div>

            <RobotSequenceCanvas />
          </div>

          <div className="hero-text-block">
            <p className="cine-eyebrow">Robotics · AI · EduTech</p>
            <h1 className="hero-main-title">
              BUILDING THE FUTURE WITH ROBOTICS, AI &amp; INTELLIGENT EXPERIENCES
            </h1>
            <div className="hero-btn-group">
              <Link className="cine-btn" href="/robotics"><span className="dot" />Explore solutions</Link>
              <Link className="cine-btn" href="/contact">Talk to us</Link>
            </div>
          </div>
        </div>
      </div>

      <PostScrollTypography />

      <KineticShiftTypography />

      <GlassFeatureCards />

      <ExpertServices />

      <div className="content-flow relative z-10 bg-white/5 backdrop-blur-sm" style={{ paddingTop: 'clamp(32px, 8vh, 120px)' }}>
        <div id="vision" className="hand-feature-section">
          <div className="hand-feature-left">
            <p className="cine-eyebrow" data-anim="fade-up">Human × machine</p>
            <h2 className="cine-h2" data-anim="words">
              WE BUILD THE HAND, THE HEAD AND EVERYTHING BETWEEN
            </h2>
            <p className="cine-body" data-anim="fade-up" data-anim-delay="0.14">
              Mechanical design, electronics, control systems and human-machine interaction —
              engineered under one roof in Kerala, then deployed into banks, studios, campuses
              and public events.
            </p>
          </div>
          <div className="hand-feature-right">
            <InteractiveHand />
          </div>
        </div>

        <div id="engineering" className="partners-section" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="cg-depth" aria-hidden="true">
            <span className="cg-rule cg-rule-a" data-parallax="0.5" data-parallax-trigger="self" />
            <span className="cg-mark cg-mark-b" data-parallax="0.42" data-parallax-rotate="24" data-parallax-trigger="self" />
          </div>
          <div className="partners-label" data-anim="fade-up">AS FEATURED IN</div>
          <PressLogos />

          <div className="partners-divider" aria-hidden="true" />

          <div className="partners-label" data-anim="fade-up">TRUSTED BY</div>
          <PartnerLogos />
        </div>

        <div className="marquee-container">
          <div className="marquee-content">
            <span>ROBOTICS &times; ARTIFICIAL INTELLIGENCE &times; AUTOMATION &times; EDUTECH &times; HUMANOID SYSTEMS &times; ROBOPARKS &times;</span>
            <span>ROBOTICS &times; ARTIFICIAL INTELLIGENCE &times; AUTOMATION &times; EDUTECH &times; HUMANOID SYSTEMS &times; ROBOPARKS &times;</span>
          </div>
        </div>

        <div id="core" className="statement-section" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="cg-depth" aria-hidden="true">
            <span className="cg-ghost-type" data-parallax="0.3" data-parallax-x="0.2" data-parallax-trigger="self">
              INKER
            </span>
            <span className="cg-mark cg-mark-a" data-parallax="0.58" data-parallax-rotate="30" data-parallax-trigger="self" />
            <span className="cg-rule cg-rule-b" data-parallax="0.36" data-parallax-trigger="self" />
          </div>
          <h2>
            <span data-anim="words" data-anim-stagger="0.035">
              We make robotics and AI practical, affordable and accessible for
            </span>{' '}
            <span className="accent" data-anim="words" data-anim-stagger="0.035" data-anim-delay="0.12">
              everyone — from school students to enterprise teams.
            </span>
          </h2>
        </div>

        <div id="cta" className="bottom-section-wrapper">
          <div className="halftone-footer-bg" data-parallax="0.22" data-parallax-trigger="self"></div>
          <div className="cg-depth" aria-hidden="true">
            <span className="cg-mark cg-mark-d" data-parallax="0.5" data-parallax-rotate="-28" data-parallax-trigger="self" />
            <span className="cg-rule cg-rule-c" data-parallax="0.34" data-parallax-trigger="self" />
          </div>
          <div className="bottom-split">
            <div className="split-left">
              <h3>
                <span data-anim="words">HAVE A TECHNOLOGY</span>{' '}
                <span className="accent" data-anim="words" data-anim-delay="0.1">REQUIREMENT?</span>
              </h3>
              <p data-anim="fade-up" data-anim-delay="0.15">
                Whether you need a robotics solution, an AI-powered customer engagement system,
                an EduTech program, an innovation lab or a RoboPark partnership — our team can help.
              </p>
              <Link href="/contact" className="cine-btn" data-magnetic="0.3" data-anim="fade-up" data-anim-delay="0.28">
                <span className="dot" />
                Talk to us
              </Link>
            </div>
          </div>
        </div>

        <div className="hm-signoff relative z-10">
          <div className="footer-logo">INKER ROBOTICS</div>
        </div>
      </div>
    </main>
  );
}

'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Link from 'next/link';
import AutoImg from '@/components/AutoImg';
import { Counter } from '@/components/Counter';
import { useSmoothScroll, prefersReducedMotion } from '@/lib/smoothScroll';
import { initMotion, EASE } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}


const JOURNEY: [string, string, string][] = [
  ['PHASE 01', 'Foundation of Inker Robotics', 'The company is founded with a vision to engineer intelligent robotics and technology that improves lives.'],
  ['PHASE 02', 'Early Robotics Projects', 'First robotic prototypes and product builds — laying down engineering capabilities across mechanical, electronics, and control systems.'],
  ['PHASE 03', 'Educational Programs & Training', 'Workshops, internships, and learning initiatives reach students and educators across institutions.'],
  ['PHASE 04', 'Major Robotic Deployments', 'Real-world deployments across culture, enterprise, education, and entertainment use cases.'],
  ['PHASE 05', 'AI & Customer Engagement Solutions', 'Launch of AI-powered customer engagement, WhatsApp-first management systems, and analytics tools.'],
  ['PHASE 06', 'The RoboPark Vision', 'Active planning and stakeholder discussions for RoboParks, RoboLand, and RoboLand Mini ecosystems.'],
  ['NEXT', 'Future Expansion', 'Scaling deployments, ecosystems, and learning networks across India and beyond.'],
];

const LEADERS = [
  {
    name: 'Rahul P B',
    role: 'Founder & Managing Director',
    photo: '/images/About/Rahul.png',
    linkedin: 'https://www.linkedin.com/in/rahul-p-balachandran-8319b128',
  },
  {
    name: 'Amith Raman',
    role: 'Co-Founder & CEO',
    photo: '/images/About/Amith.png',
    linkedin: 'https://www.linkedin.com/in/amith-raman-0b575a21',
  },
];

export default function AboutClient() {
  const mainRef = useRef<HTMLElement>(null);

  useSmoothScroll();

  useGSAP(() => {
    const cleanup = initMotion(mainRef.current);
    if (prefersReducedMotion()) return cleanup;

    // Legacy class-toggle reveals still used by this page's CSS
    gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        toggleClass: 'revealed',
        toggleActions: 'play none none reverse',
      });
    });

    // Hero: title lifts and dissolves, giving the section real depth
    gsap.to('.about-v2-title', {
      yPercent: -18,
      opacity: 0.08,
      scale: 0.96,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about-v2-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    gsap.to('.about-v2-img-float', {
      yPercent: (i) => -30 - i * 18,
      rotate: (i) => (i % 2 ? 6 : -6),
      ease: 'none',
      scrollTrigger: {
        trigger: '.about-v2-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.3,
      }
    });

    // Precise SVG scrub drawing of the process line
    const processPath = document.querySelector('.process-line-bg') as SVGPathElement | null;
    const processAccent = document.querySelector('.process-line-accent') as SVGPathElement | null;

    if (processPath && processAccent) {
      gsap.set([processPath, processAccent], { transition: 'none' });

      gsap.to(processPath, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-v2-process',
          start: 'top 80%',
          end: 'bottom 50%',
          scrub: 1,
        }
      });
      gsap.to(processAccent, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-v2-process',
          start: 'top 70%',
          end: 'bottom 40%',
          scrub: 1.5,
        }
      });
    }

    // Each step's dot pulses as it crosses the middle of the screen
    gsap.utils.toArray<HTMLElement>('.about-v2-step-dot').forEach((dot) => {
      gsap.fromTo(
        dot,
        { scale: 0.7, opacity: 0.4 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.9,
          ease: EASE.out,
          scrollTrigger: { trigger: dot, start: 'top 72%', toggleActions: 'play none none reverse' },
        }
      );
    });

    return cleanup;
  }, { scope: mainRef });

  return (
    <main ref={mainRef}>
      {/* ── HERO ── */}
      <section className="about-v2-hero">
        <div className="about-v2-breadcrumb reveal reveal-fade">
          main / <span>about inker</span>
        </div>
        <h1 className="about-v2-title" data-anim="chars" data-anim-stagger="0.06">about inker</h1>
      </section>

      {/* ── MISSION STATEMENT ── */}
      <section className="about-v2-mission">
        <div className="about-v2-mission-icon reveal reveal-fade">◉</div>
        <div className="about-v2-location reveal reveal-fade">Based in Kerala, India,<br />building for the world</div>

        <h2 className="about-v2-statement" data-anim="words" data-anim-stagger="0.04">
          we are a technology company building intelligent robotics, AI-powered systems, experiential ecosystems and future-ready education.
        </h2>

        <p className="about-v2-body" data-anim="fade-up" data-anim-delay="0.12">
          Since 2020, Inker has designed and deployed humanoids, robotic kiosks and automation systems; built AI engagement platforms for restaurants, hospitals, hotels and retail; and put hardware into the hands of more than 200,000 students. Our robots don&apos;t sit in a showroom — they serve at bank counters, perform on national television and carry Kerala&apos;s oldest art form.
        </p>

        <div className="cg-depth" aria-hidden="true">
          <span className="cg-ghost-type right" data-parallax="0.3" data-parallax-x="-0.2" data-parallax-trigger="self">
            2020
          </span>
          <span className="cg-mark cg-mark-b" data-parallax="0.5" data-parallax-rotate="22" data-parallax-trigger="self" />
          <span className="cg-rule cg-rule-a" data-parallax="0.38" data-parallax-trigger="self" />
        </div>
      </section>


      {/* ── COMPANY OVERVIEW ── */}
      <section className="ink-about-section">
        <div className="cg-depth" aria-hidden="true">
          <span className="cg-mark cg-mark-c" data-parallax="0.5" data-parallax-rotate="-24" data-parallax-trigger="self" />
          <span className="cg-rule cg-rule-a" data-parallax="0.4" data-parallax-trigger="self" />
        </div>

        <div className="ink-about-inner ink-overview">
          <div>
            <p className="cine-eyebrow" data-anim="fade-up">Company overview</p>
            <h2 className="cine-h2" data-anim="words" style={{ marginTop: '0.8rem' }}>
              ABOUT INKER ROBOTICS
            </h2>
          </div>
          <div>
            <p className="ink-lede" data-anim="fade-up">
              Inker Robotics works at the intersection of robotics, artificial intelligence,
              education, automation, and experiential technology.
            </p>
            <p className="cine-body" data-anim="fade-up" data-anim-delay="0.12">
              From robotic systems and AI-powered customer engagement tools to future skills
              programs and RoboPark concepts, Inker Robotics is focused on building technology
              that creates meaningful impact.
            </p>
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="ink-about-section">
        <div className="cg-depth" aria-hidden="true">
          <span className="cg-ghost-type right" data-parallax="0.26" data-parallax-x="-0.2" data-parallax-trigger="self">
            WHY
          </span>
          <span className="cg-rule cg-rule-c" data-parallax="0.38" data-parallax-trigger="self" />
        </div>

        <div className="ink-about-inner">
          <div className="ink-mv-grid" data-anim="stagger">
            <article className="ink-mv hm-glass">
              <div className="ink-mv-label">Our Mission</div>
              <div className="ink-mv-statement">
                Engineer<br />the <span className="accent">Future.</span>
              </div>
              <p>
                We are committed to designing, developing, and delivering technology solutions
                that help people, businesses, and institutions move toward a smarter and more
                innovative future.
              </p>
            </article>

            <article className="ink-mv hm-glass accent-lime">
              <div className="ink-mv-label">Our Vision</div>
              <div className="ink-mv-statement">
                Improve lives beyond <span className="accent">imagination</span> with technology.
              </div>
              <p>
                We believe technology has the power to transform learning, business, culture,
                industry, and everyday life.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── PROCESS SECTION ── */}
      <section className="about-v2-process">
        {/* Flowing SVG curved line */}
        <svg className="about-v2-process-svg reveal reveal-draw" viewBox="0 0 740 900" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            className="process-line-bg"
            d="M 200 40 C 200 120, 500 120, 500 200 C 500 280, 200 300, 350 380 C 500 460, 550 460, 550 540 C 550 620, 250 640, 200 720 C 150 800, 180 850, 180 880"
            stroke="#333"
            strokeWidth="1"
            fill="none"
          />
          <path
            className="process-line-accent"
            d="M 200 40 C 200 120, 500 120, 500 200"
            stroke="var(--color-lime)"
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx="500" cy="200" r="3" fill="var(--color-lime)" />
          <circle cx="350" cy="380" r="3" fill="#555" />
          <circle cx="550" cy="540" r="3" fill="#555" />
          <circle cx="200" cy="720" r="3" fill="#555" />
        </svg>

        {/* Step 1 — Left */}
        <div className="about-v2-step about-v2-step-left reveal reveal-left">
          <div className="about-v2-step-dot">
            <span className="about-v2-step-title">understand</span>
          </div>
          <p className="about-v2-step-desc">
            We start on site — understanding the operation, the audience and the constraint that actually matters before anything is designed.
          </p>
          <div className="about-v2-step-num">01.</div>
        </div>

        {/* Step 2 — Right */}
        <div className="about-v2-step about-v2-step-right reveal reveal-right">
          <div className="about-v2-step-dot">
            <span className="about-v2-step-title">engineer</span>
          </div>
          <p className="about-v2-step-desc">
            Mechanical design, electronics and control systems are built in-house, prototyped and tested until the machine survives real use.
          </p>
          <div className="about-v2-step-num">02.</div>
        </div>

        {/* Step 3 — Right */}
        <div className="about-v2-step about-v2-step-right reveal reveal-right">
          <div className="about-v2-step-dot">
            <span className="about-v2-step-title">integrate</span>
          </div>
          <p className="about-v2-step-desc">
            Software, AI and the human interface come together — so the people who use the system need no training manual to do it.
          </p>
          <div className="about-v2-step-num">03.</div>
        </div>

        {/* Step 4 — Left */}
        <div className="about-v2-step about-v2-step-left reveal reveal-left">
          <div className="about-v2-step-dot">
            <span className="about-v2-step-title">deploy</span>
          </div>
          <p className="about-v2-step-desc">
            Commissioning, operator training and ongoing support. Available outright or as a service, with transparent pricing either way.
          </p>
          <div className="about-v2-step-num">04.</div>
        </div>

        {/* Depth scenery lives last so it doesn't shift the :nth-child
            stagger delays this section's CSS relies on. It's absolutely
            positioned at z-index -1, so DOM order costs it nothing. */}
        <div className="cg-depth" aria-hidden="true">
          <span className="cg-mark cg-mark-a" data-parallax="0.6" data-parallax-rotate="30" data-parallax-trigger="self" />
          <span className="cg-mark cg-mark-c" data-parallax="0.44" data-parallax-rotate="-24" data-parallax-trigger="self" />
          <span className="cg-rule cg-rule-b" data-parallax="0.5" data-parallax-trigger="self" />
          <span className="cg-rule cg-rule-d" data-parallax="0.3" data-parallax-trigger="self" />
        </div>
      </section>


      {/* ── JOURNEY ── */}
      <section className="ink-about-section">
        <div className="cg-depth" aria-hidden="true">
          <span className="cg-ghost-type" data-parallax="0.28" data-parallax-x="0.16" data-parallax-trigger="self">
            2020
          </span>
          <span className="cg-mark cg-mark-a" data-parallax="0.55" data-parallax-rotate="26" data-parallax-trigger="self" />
        </div>

        <div className="ink-about-inner">
          <header className="ink-about-head">
            <div>
              <p className="cine-eyebrow" data-anim="fade-up">Our journey</p>
              <h2 className="cine-h2" data-anim="words" style={{ marginTop: '0.8rem' }}>
                FROM A SPARK TO AN ECOSYSTEM
              </h2>
            </div>
            <p className="cine-body" data-anim="fade-up" data-anim-delay="0.14">
              A timeline of milestones — from founding to first deployments, to building a
              multi-vertical technology company across robotics, AI, EduTech, and experiential
              ecosystems.
            </p>
          </header>

          <ol className="ink-timeline">
            {JOURNEY.map(([phase, title, desc]) => (
              <li className="ink-tl-item" key={phase}>
                <span className="ink-tl-dot" aria-hidden="true" />
                <div className="ink-tl-phase">{phase}</div>
                <h4 className="ink-tl-title">{title}</h4>
                <p className="ink-tl-desc">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── LEADERSHIP ── */}
      <section className="ink-about-section">
        <div className="cg-depth" aria-hidden="true">
          <span className="cg-mark cg-mark-b" data-parallax="0.44" data-parallax-rotate="-18" data-parallax-trigger="self" />
          <span className="cg-rule cg-rule-b" data-parallax="0.34" data-parallax-trigger="self" />
        </div>

        <div className="ink-about-inner">
          <header className="ink-about-head">
            <div>
              <p className="cine-eyebrow" data-anim="fade-up">Leadership team</p>
              <h2 className="cine-h2" data-anim="words" style={{ marginTop: '0.8rem' }}>
                THE PEOPLE BUILDING INKER
              </h2>
            </div>
            <p className="cine-body" data-anim="fade-up" data-anim-delay="0.14">
              Engineers, educators, and builders working together to shape the future of
              robotics, AI, and experiential technology.
            </p>
          </header>

          <div className="ink-leaders" data-anim="stagger">
            {/* the brush stroke that sat behind the portraits on the original page */}
            <AutoImg
              className="ink-leader-stroke"
              src="/images/About/orange stroke.png"
              alt=""
              aria-hidden="true"
            />

            {LEADERS.map((l) => (
              <article className="ink-leader" key={l.name}>
                <div className="ink-leader-photo">
                  <AutoImg src={l.photo} alt={`${l.name} — ${l.role}, Inker Robotics`} />
                </div>
                <div className="ink-leader-body">
                  <div className="ink-leader-role">{l.role}</div>
                  <h4>{l.name}</h4>
                  <a
                    className="ink-leader-linkedin"
                    href={l.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACT ── */}
      <section className="ink-about-section ink-impact-section">
        <div className="cg-depth" aria-hidden="true">
          <span className="cg-ghost-type right" data-parallax="0.24" data-parallax-x="-0.18" data-parallax-trigger="self">
            IMPACT
          </span>
        </div>

        <div className="ink-about-inner">
          <header className="ink-about-head">
            <div>
              <p className="cine-eyebrow" data-anim="fade-up">Impact</p>
              <h2 className="cine-h2" data-anim="words" style={{ marginTop: '0.8rem' }}>
                MEASURABLE IMPACT AT SCALE
              </h2>
            </div>
            <p className="cine-body" data-anim="fade-up" data-anim-delay="0.14">
              Numbers from deployments, programs, training, and institutional collaborations.
            </p>
          </header>

          <div className="ink-impact">
            <Counter target={12} label="Robotic Deployments" />
            <Counter target={25} label="AI Solutions" />
            <Counter target={500} label="Technology Programs" />
            <Counter target={200000} label="Students Impacted" />
            <Counter target={1000} label="Professionals Trained" />
            <Counter target={50} label="Institutions Connected" />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="sv-dive">
        <div className="sv-brackets" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="sv-dive-media" aria-hidden="true">
          <AutoImg src="/images/Robotics/Alton.png" alt="" />
        </div>
        <h2 className="sv-dive-title" data-anim="chars" data-anim-stagger="0.03">
          LET&rsquo;S BUILD THE FUTURE
        </h2>
        <div className="ink-dive-actions">
          <Link className="cine-btn" href="/contact" data-magnetic="0.3">
            <span className="dot" />Talk to us
          </Link>
        </div>
      </section>

    </main>
  );
}

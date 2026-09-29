'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, getLenis } from '@/lib/smoothScroll';
import { splitChars, splitWords, EASE } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export type ServiceCategory = 'all' | 'edutech' | 'robotics' | 'careers';

export interface ServiceCard {
  id: string;
  num: string;
  title: string;
  category: 'edutech' | 'robotics' | 'careers';
  categoryLabel: string;
  tag: string;
  description: string;
  image: string;
  video: string;
  link: string;
  linkText: string;
  highlights: string[];
}

const SERVICES: ServiceCard[] = [
  {
    id: 'robotics-show',
    num: '01',
    title: 'Robotics Show',
    category: 'robotics',
    categoryLabel: 'Robotics & Expos',
    tag: 'Live Performance',
    description:
      'Immerse yourself in the future with our robotic shows, showcasing advanced technology, innovative designs, and thrilling performances.',
    image: 'https://inkerrobotics.com/wp-content/uploads/revslider/video-media/Untitled-video-Made-with-Clipchamp-6_43_layer.jpeg',
    video: 'https://inkerrobotics.com/wp-content/uploads/2024/06/Untitled-video-Made-with-Clipchamp-6.mp4',
    link: '/robotics',
    linkText: 'Explore Shows',
    highlights: ['Autonomous Choreography', 'Humanoid Demos', 'Events & Expos'],
  },
  {
    id: 'summer-camp',
    num: '02',
    title: 'Summer Camp',
    category: 'edutech',
    categoryLabel: 'EduTech & Labs',
    tag: 'Hands-On Learning',
    description:
      'Robotic summer camp for an immersive experience with hands-on projects and cutting-edge technology!',
    image: 'https://inkerrobotics.com/wp-content/uploads/revslider/video-media/summer-camp-480p_65_layer.jpeg',
    video: 'https://inkerrobotics.com/wp-content/uploads/2024/06/summer-camp-480p.mp4',
    link: '/edutech',
    linkText: 'Discover Camps',
    highlights: ['Interactive STEM', 'Robotics Kits', 'Ages 8-18'],
  },
  {
    id: 'internship',
    num: '03',
    title: 'Internship',
    category: 'careers',
    categoryLabel: 'Career & Innovation',
    tag: 'Career Accelerator',
    description:
      'Gain valuable real-world experience and kickstart your career with our internship opportunities.',
    image: 'https://inkerrobotics.com/wp-content/uploads/revslider/video-media/Untitled-video-Made-with-Clipchamp-12_57_layer.jpeg',
    video: 'https://inkerrobotics.com/wp-content/uploads/2024/06/Untitled-video-Made-with-Clipchamp-12.mp4',
    link: '/careers',
    linkText: 'Join as Intern',
    highlights: ['Live Industry Projects', 'Mechatronics & AI', 'Expert Mentors'],
  },
  {
    id: 'school-college-labs',
    num: '04',
    title: 'School & College Labs',
    category: 'edutech',
    categoryLabel: 'EduTech & Labs',
    tag: 'Lab Infrastructure',
    description:
      'Design & implement advanced technology labs for schools and colleges, featuring the latest in robotics and AI.',
    image: 'https://inkerrobotics.com/wp-content/uploads/revslider/video-media/Untitled-video-Made-with-Clipchamp-16_74_layer.jpeg',
    video: 'https://inkerrobotics.com/wp-content/uploads/2024/06/Untitled-video-Made-with-Clipchamp-16.mp4',
    link: '/edutech',
    linkText: 'Setup Labs',
    highlights: ['Turnkey Lab Setup', 'Curriculum Mapping', 'Hardware Benches'],
  },
  {
    id: 'skill-development-program',
    num: '05',
    title: 'Skill Development Program',
    category: 'edutech',
    categoryLabel: 'EduTech & Labs',
    tag: 'Skill Building',
    description:
      'Sharpen your talents and unlock new career opportunities, paving the way for your growth.',
    image: 'https://inkerrobotics.com/wp-content/uploads/revslider/video-media/Untitled-video-Made-with-Clipchamp-13_59_layer.jpeg',
    video: 'https://inkerrobotics.com/wp-content/uploads/2024/06/Untitled-video-Made-with-Clipchamp-13.mp4',
    link: '/edutech',
    linkText: 'Skill Programs',
    highlights: ['Industry Alignment', 'Applied Automation', 'Practical Skills'],
  },
  {
    id: 'workshops',
    num: '06',
    title: 'Workshops',
    category: 'edutech',
    categoryLabel: 'EduTech & Labs',
    tag: 'Practical Training',
    description:
      'Hands-on workshops to mold tech enthusiasts into experts on the latest tools and technologies.',
    image: 'https://inkerrobotics.com/wp-content/uploads/revslider/video-media/Untitled-video-Made-with-Clipchamp-17_60_layer.jpeg',
    video: 'https://inkerrobotics.com/wp-content/uploads/2024/06/Untitled-video-Made-with-Clipchamp-17.mp4',
    link: '/edutech',
    linkText: 'View Workshops',
    highlights: ['1-3 Day Intensives', 'Hardware Kits Included', 'Expert Trainers'],
  },
  {
    id: 'on-the-job-training',
    num: '07',
    title: 'On the Job Training',
    category: 'careers',
    categoryLabel: 'Career & Innovation',
    tag: 'Professional Immersion',
    description:
      'Hands-on training for career success! Dive into real-world projects and accelerate your career with us.',
    image: 'https://inkerrobotics.com/wp-content/uploads/revslider/video-media/On-the-Job-Program_61_layer-600x338.jpeg',
    video: 'https://inkerrobotics.com/wp-content/uploads/2024/06/Untitled-video-Made-with-Clipchamp-11.mp4',
    link: '/careers',
    linkText: 'Explore Training',
    highlights: ['Real Client Scenarios', 'Embedded Firmware', 'Deployment Cycles'],
  },
  {
    id: 'bootcamp',
    num: '08',
    title: 'Bootcamp',
    category: 'edutech',
    categoryLabel: 'EduTech & Labs',
    tag: 'Intensive Immersion',
    description:
      'Intensive hands-on training in robotic technologies and applications, turning participants into proficient robotics experts.',
    image: 'https://inkerrobotics.com/wp-content/uploads/revslider/video-media/Untitled-video-Made-with-Clipchamp-15_62_layer.jpeg',
    video: 'https://inkerrobotics.com/wp-content/uploads/2024/06/Untitled-video-Made-with-Clipchamp-15.mp4',
    link: '/edutech',
    linkText: 'Join Bootcamp',
    highlights: ['Fast-Paced Sprints', 'Full Robot Builds', 'Capstone Project'],
  },
  {
    id: 'faculty-development-program',
    num: '09',
    title: 'Faculty Development Program',
    category: 'edutech',
    categoryLabel: 'EduTech & Labs',
    tag: 'Educator Enablement',
    description:
      'Empowers educators with the latest teaching methodologies and technological advancements.',
    image: 'https://inkerrobotics.com/wp-content/uploads/revslider/video-media/Untitled-video-Made-with-Clipchamp-14_63_layer.jpeg',
    video: 'https://inkerrobotics.com/wp-content/uploads/2024/06/Untitled-video-Made-with-Clipchamp-14.mp4',
    link: '/edutech',
    linkText: 'FDP Programs',
    highlights: ['Modern Pedagogy', 'Emerging Tech Tools', 'Lab Management'],
  },
  {
    id: 'industrial-visit',
    num: '10',
    title: 'Industrial Visit',
    category: 'careers',
    categoryLabel: 'Career & Innovation',
    tag: 'Industry Tour',
    description:
      'Join us for an enriching industrial visit to gain practical insights and experience industry best practices firsthand.',
    image: 'https://inkerrobotics.com/wp-content/uploads/revslider/video-media/Untitled-video-Made-with-Clipchamp-10_64_layer.jpeg',
    video: 'https://inkerrobotics.com/wp-content/uploads/2024/06/Untitled-video-Made-with-Clipchamp-10.mp4',
    link: '/contact',
    linkText: 'Plan a Visit',
    highlights: ['Live Facility Walkthrough', 'Robotic Assembly Lines', 'Interactive Q&A'],
  },
  {
    id: 'research-and-development',
    num: '11',
    title: 'Research & Development',
    category: 'careers',
    categoryLabel: 'Career & Innovation',
    tag: 'Futuristic R&D',
    description:
      "Dedicated to pioneering innovations that shape the future, driving progress and creating impactful solutions for tomorrow's challenges.",
    image: 'https://inkerrobotics.com/wp-content/uploads/revslider/video-media/Untitled-video-Made-with-Clipchamp-8_66_layer.jpeg',
    video: 'https://inkerrobotics.com/wp-content/uploads/2024/06/Untitled-video-Made-with-Clipchamp-8.mp4',
    link: '/robotics',
    linkText: 'Explore R&D',
    highlights: ['Custom Mechatronics', 'Computer Vision & AI', 'Patent Engineering'],
  },
  {
    id: 'school-classes',
    num: '12',
    title: 'School Classes',
    category: 'edutech',
    categoryLabel: 'EduTech & Labs',
    tag: 'Curriculum Integration',
    description:
      'Interactive learning, hands-on projects, and advanced tech fostering creativity with our custom curriculum and kits.',
    image: 'https://inkerrobotics.com/wp-content/uploads/revslider/video-media/Untitled-video-Made-with-Clipchamp-9_67_layer.jpeg',
    video: 'https://inkerrobotics.com/wp-content/uploads/2024/06/Untitled-video-Made-with-Clipchamp-9.mp4',
    link: '/edutech',
    linkText: 'School Programs',
    highlights: ['CBSE/ICSE Aligned', 'Gamified Software', 'Trained Faculty'],
  },
  {
    id: 'robotic-rentals',
    num: '13',
    title: 'Robotic Rentals',
    category: 'robotics',
    categoryLabel: 'Robotics & Expos',
    tag: 'Event Deployments',
    description:
      'Our robotic rentals provide advanced solutions tailored to your specific requirements for events and celebration.',
    image: 'https://inkerrobotics.com/wp-content/uploads/revslider/video-media/Untitled-video-Made-with-Clipchamp-7_68_layer.jpeg',
    video: 'https://inkerrobotics.com/wp-content/uploads/2024/06/Untitled-video-Made-with-Clipchamp-7.mp4',
    link: '/robotics',
    linkText: 'Rent Robots',
    highlights: ['Humanoid Greeters', 'Kiosk Automations', 'On-Site Technical Crew'],
  },
  {
    id: 'product-development',
    num: '14',
    title: 'Product Development',
    category: 'robotics',
    categoryLabel: 'Robotics & Expos',
    tag: 'Turnkey Engineering',
    description:
      'Focus on transforming ideas into market-ready solutions, leveraging innovation, expertise, and market insights.',
    image: 'https://inkerrobotics.com/wp-content/uploads/revslider/video-media/Untitled-video-Made-with-Clipchamp-4_69_layer.jpeg',
    video: 'https://inkerrobotics.com/wp-content/uploads/2024/06/Untitled-video-Made-with-Clipchamp-4.mp4',
    link: '/robotics',
    linkText: 'Product Solutions',
    highlights: ['Rapid Prototyping', 'PCB & CAD Design', 'Pilot Batching'],
  },
  {
    id: 'integrated-solutions',
    num: '15',
    title: 'Integrated Solutions',
    category: 'robotics',
    categoryLabel: 'Robotics & Expos',
    tag: 'System Integration',
    description:
      'Seamlessly combine technology and strategy to deliver comprehensive and efficient outcomes tailored to your specific needs.',
    image: 'https://inkerrobotics.com/wp-content/uploads/revslider/video-media/Untitled-video-Made-with-Clipchamp-5_70_layer.jpeg',
    video: 'https://inkerrobotics.com/wp-content/uploads/2024/06/Untitled-video-Made-with-Clipchamp-5.mp4',
    link: '/robotics',
    linkText: 'Custom Solutions',
    highlights: ['Custom Cloud Dashboards', 'Hardware Integration', 'Scalable Architecture'],
  },
  {
    id: 'robo-kits',
    num: '16',
    title: 'Robo Kits',
    category: 'edutech',
    categoryLabel: 'EduTech & Labs',
    tag: 'Hardware Kits',
    description:
      'Immersive learning experience, allowing enthusiasts of all ages to build, program, and explore the fascinating world of robotics.',
    image: 'https://inkerrobotics.com/wp-content/uploads/revslider/video-media/kit-2_72_layer.jpeg',
    video: 'https://inkerrobotics.com/wp-content/uploads/2024/06/kit-2.mp4',
    link: '/edutech',
    linkText: 'Explore Kits',
    highlights: ['RoboBox Hardware', 'Modular Plug & Play', 'Project Missions'],
  },
  {
    id: 'events-inauguration',
    num: '17',
    title: 'Events - Inauguration',
    category: 'robotics',
    categoryLabel: 'Robotics & Expos',
    tag: 'VIP Experiences',
    description:
      'Immerse yourself in our engaging events where creativity, learning, and connections unite for unforgettable experiences.',
    image: 'https://inkerrobotics.com/wp-content/uploads/revslider/video-media/Untitled-video-Made-with-Clipchamp-3_71_layer.jpeg',
    video: 'https://inkerrobotics.com/wp-content/uploads/2024/06/Untitled-video-Made-with-Clipchamp-3.mp4',
    link: '/contact',
    linkText: 'Event Inquiries',
    highlights: ['Robotic Ribbon Cutting', 'VIP Bot Hosts', 'Unforgettable First Impressions'],
  },
];

const CATEGORIES: { id: ServiceCategory; label: string; count: number }[] = [
  { id: 'all', label: 'All Services', count: 17 },
  { id: 'edutech', label: 'EduTech & Labs', count: 8 },
  { id: 'robotics', label: 'Robotics & Expos', count: 5 },
  { id: 'careers', label: 'Career & Innovation', count: 4 },
];

export default function ExpertServices() {
  /* ---------------------------------------------------------------- *
   * Refs
   * ---------------------------------------------------------------- */
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleARef = useRef<HTMLSpanElement>(null);
  const titleBRef = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const glow1Ref = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);
  const modalCardRef = useRef<HTMLDivElement>(null);
  const modalBackdropRef = useRef<HTMLDivElement>(null);

  /* The master horizontal tween while the section is pinned. Arrows and
     dots seek the *page* through this tween's ScrollTrigger rather than
     writing scrollLeft, because while pinned the track is transform
     driven and has no scrollLeft to write. */
  const horizontalRef = useRef<gsap.core.Tween | null>(null);

  /* ---------------------------------------------------------------- *
   * State
   * ---------------------------------------------------------------- */
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeModalItem, setActiveModalItem] = useState<ServiceCard | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'all') return SERVICES;
    return SERVICES.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  /* Pinning only earns its keep on a wide screen with enough cards to
     travel. On phones the native swipe carousel is the better gesture,
     and hijacking vertical scroll on a touch device is hostile. */
  const canPin = viewMode === 'carousel' && isDesktop && filteredServices.length > 3;

  const isPinnedRef = useRef(false);
  useEffect(() => {
    isPinnedRef.current = canPin;
  }, [canPin]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1025px)');
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  /* ---------------------------------------------------------------- *
   * Progress + active index, written straight to the DOM
   *
   * The old version pushed scroll progress into React state on every
   * scroll event, which re-rendered all seventeen cards (and their
   * videos) per frame. The bar is now a scaleX quickSetter and the
   * index only enters state when it actually changes.
   * ---------------------------------------------------------------- */
  const setProgress = useRef<((v: number) => void) | null>(null);
  const lastIdxRef = useRef(0);

  const commitIdx = useCallback((raw: number, total: number) => {
    const next = Math.min(Math.max(raw, 0), Math.max(total - 1, 0));
    if (next !== lastIdxRef.current) {
      lastIdxRef.current = next;
      setActiveIdx(next);
    }
  }, []);

  /* ---------------------------------------------------------------- *
   * Native (unpinned) carousel tracking — mobile, tablet, grid mode
   * ---------------------------------------------------------------- */
  const checkScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el || isPinnedRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollPrev(scrollLeft > 10);
    setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 10);

    const maxScroll = scrollWidth - clientWidth;
    const p = maxScroll > 0 ? gsap.utils.clamp(0, 1, scrollLeft / maxScroll) : 0;
    setProgress.current?.(Math.max(p, 0.02));

    const first = el.firstElementChild as HTMLElement | null;
    const cardWidth = first ? first.offsetWidth + 24 : clientWidth;
    commitIdx(Math.round(scrollLeft / cardWidth), filteredServices.length);
  }, [commitIdx, filteredServices.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  /* ---------------------------------------------------------------- *
   * Navigation — one API over two very different scroll models
   * ---------------------------------------------------------------- */
  const seekToIndex = useCallback(
    (idx: number) => {
      const total = filteredServices.length;
      const st = horizontalRef.current?.scrollTrigger;

      // Pinned: move the page, and the tween follows.
      if (st && isPinnedRef.current) {
        const p = total > 1 ? gsap.utils.clamp(0, 1, idx / (total - 1)) : 0;
        const y = st.start + (st.end - st.start) * p;
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(y, { duration: 1.1 });
        else window.scrollTo({ top: y, behavior: 'smooth' });
        return;
      }

      // Unpinned: ordinary horizontal scroll.
      const el = trackRef.current;
      const card = el?.children[idx] as HTMLElement | undefined;
      if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: 'smooth' });
    },
    [filteredServices.length]
  );

  const step = useCallback(
    (direction: 'prev' | 'next') => {
      if (isPinnedRef.current) {
        seekToIndex(lastIdxRef.current + (direction === 'next' ? 1 : -1));
        return;
      }
      const el = trackRef.current;
      if (!el) return;
      const card = el.firstElementChild as HTMLElement | null;
      const amount = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
      el.scrollBy({ left: direction === 'prev' ? -amount : amount, behavior: 'smooth' });
    },
    [seekToIndex]
  );

  /* ---------------------------------------------------------------- *
   * Card tilt. Lives on the inner <article>; the scroll-driven depth
   * transform lives on the outer shell, so the two never fight over
   * the same matrix.
   * ---------------------------------------------------------------- */
  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion()) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    gsap.to(card, {
      rotateX: ((y - rect.height / 2) / (rect.height / 2)) * -6,
      rotateY: ((x - rect.width / 2) / (rect.width / 2)) * 6,
      transformPerspective: 900,
      scale: 1.015,
      y: -8,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      y: 0,
      duration: 0.6,
      ease: EASE.out,
      overwrite: 'auto',
    });
  };

  /* ---------------------------------------------------------------- *
   * Videos: play only what is on screen.
   *
   * Seventeen remote 480p reels autoplaying at once saturated the
   * connection and kept the decoder busy through every scroll frame.
   * The src is now attached on approach and the element is paused the
   * moment it leaves.
   * ---------------------------------------------------------------- */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            if (!v.src && v.dataset.src) v.src = v.dataset.src;
            const played = v.play();
            if (played) played.catch(() => {});
          } else if (!v.paused) {
            v.pause();
          }
        });
      },
      { rootMargin: '250px 400px', threshold: 0.12 }
    );

    track.querySelectorAll<HTMLVideoElement>('video').forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, [filteredServices, viewMode]);

  /* ---------------------------------------------------------------- *
   * Modal
   * ---------------------------------------------------------------- */
  const closeModal = useCallback(() => {
    if (prefersReducedMotion() || !modalCardRef.current) {
      setActiveModalItem(null);
      return;
    }
    gsap
      .timeline({ onComplete: () => setActiveModalItem(null) })
      .to(modalCardRef.current, { y: 30, scale: 0.94, opacity: 0, duration: 0.3, ease: 'power2.in' })
      .to(modalBackdropRef.current, { opacity: 0, duration: 0.25 }, '-=0.22');
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    if (activeModalItem) {
      window.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
      const lenis = getLenis();
      lenis?.stop();
    } else {
      document.body.style.overflow = '';
      getLenis()?.start();
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [activeModalItem, closeModal]);

  useGSAP(
    () => {
      if (!activeModalItem || prefersReducedMotion()) return;
      gsap
        .timeline()
        .fromTo(modalBackdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'none' })
        .fromTo(
          modalCardRef.current,
          { y: 48, scale: 0.93, opacity: 0, rotateX: 6 },
          { y: 0, scale: 1, opacity: 1, rotateX: 0, duration: 0.7, ease: EASE.out },
          '-=0.15'
        )
        .from(
          '.expert-modal-pill',
          { y: 14, opacity: 0, duration: 0.45, stagger: 0.04, ease: EASE.out },
          '-=0.35'
        );
    },
    { scope: modalCardRef, dependencies: [activeModalItem] }
  );

  /* ================================================================ *
   * The scroll choreography
   * ================================================================ */
  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const fill = progressRef.current;
      setProgress.current = fill
        ? (gsap.quickSetter(fill, 'scaleX') as (v: number) => void)
        : null;

      if (prefersReducedMotion()) {
        section.classList.remove('is-pin-active');
        gsap.set('.expert-card-shell', { clearProps: 'all', opacity: 1 });
        setProgress.current?.(1);
        return;
      }

      /* ---- 1. Header: masked character rise, word-by-word subtitle -- */
      const charsA = titleARef.current ? splitChars(titleARef.current) : [];
      const subWords = subRef.current ? splitWords(subRef.current) : [];

      gsap.set([titleARef.current, titleBRef.current, subRef.current], { opacity: 1 });

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
      });

      intro
        .from(eyebrowRef.current, {
          y: 18,
          opacity: 0,
          duration: 0.6,
          ease: EASE.out,
        })
        .from(
          charsA,
          {
            yPercent: 115,
            opacity: 0,
            rotate: 4,
            duration: 0.9,
            ease: EASE.expo,
            stagger: 0.028,
          },
          '-=0.3'
        )
        .from(
          titleBRef.current,
          { yPercent: 115, duration: 0.95, ease: EASE.expo },
          '-=0.72'
        )
        .from(
          subWords,
          { yPercent: 110, duration: 0.8, ease: EASE.out, stagger: 0.02 },
          '-=0.55'
        )
        .from(
          panelRef.current,
          { y: 22, opacity: 0, duration: 0.65, ease: EASE.out },
          '-=0.5'
        );

      /* ---- 2. Ambient glows drift the whole way through ------------- */
      gsap.fromTo(
        glow1Ref.current,
        { yPercent: -18, xPercent: -6 },
        {
          yPercent: 18,
          xPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.4 },
        }
      );
      gsap.fromTo(
        glow2Ref.current,
        { yPercent: 20, xPercent: 8 },
        {
          yPercent: -20,
          xPercent: -8,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.4 },
        }
      );

      /* Last line of defence for the heading.
         gsap.from() renders its start state immediately, so the title sits
         translated and transparent until its ScrollTrigger fires. If that
         never happens — a bad measurement after the pin, an image resizing
         late, a throw upstream — it would stay hidden for the rest of the
         session. lib/motion.ts carries the same guard for its declarative
         reveals; this section builds its timeline by hand and needs its own.

         The check is deliberately narrow: only force the timeline when the
         section is ACTUALLY on screen and the reveal still has not started.
         Testing `!scrollTrigger.isActive` alone would be true for a section
         the reader simply has not reached yet, and would skip the animation
         entirely. */
      const safety = window.setTimeout(() => {
        if (intro.progress() > 0) return;
        const box = section.getBoundingClientRect();
        const inView = box.top < window.innerHeight * 0.9 && box.bottom > 0;
        if (inView) intro.progress(1);
      }, 2600);

      const shells = gsap.utils.toArray<HTMLElement>('.expert-card-shell', track);

      /* ================================================================
       * 3a. PINNED MODE — vertical scroll drives the track sideways
       * ============================================================== */
      if (canPin) {
        section.classList.add('is-pin-active');

        /* Measured lazily and re-measured on every refresh, because the
           card count changes with the filter and the viewport changes
           with the window. */
        const distance = () => {
          /* Measured from the last card rather than scrollWidth: while
             pinned the track is transform-driven with overflow visible,
             and scrollWidth on a non-scrolling box is not dependable
             across browsers. offsetLeft is relative to the track, which
             is position:relative in this mode, and ScrollTrigger reverts
             the transform before every refresh — so this reads clean
             layout every time. */
          const last = track.lastElementChild as HTMLElement | null;
          if (!last) return 1;
          const padRight = parseFloat(getComputedStyle(track).paddingRight) || 0;
          const total = last.offsetLeft + last.offsetWidth + padRight;
          return Math.max(total - track.clientWidth, 1);
        };

        const horizontal = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pinRef.current,
            start: 'top top',
            end: () => '+=' + (distance() + window.innerHeight * 0.5),
            pin: pinRef.current,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.9,
            invalidateOnRefresh: true,
            onToggle: (self) => setIsPinned(self.isActive),
            onUpdate: (self) => {
              setProgress.current?.(Math.max(self.progress, 0.02));
              commitIdx(
                Math.round(self.progress * (filteredServices.length - 1)),
                filteredServices.length
              );
              setCanScrollPrev(self.progress > 0.005);
              setCanScrollNext(self.progress < 0.995);
            },
          },
        });

        horizontalRef.current = horizontal;

        /* Per-card depth, measured against the horizontal tween rather
           than the page. `containerAnimation` is what makes a
           ScrollTrigger read an element's position inside a
           horizontally-moving container — without it every card would
           report the same position, because none of them move
           vertically. */
        shells.forEach((shell) => {
          gsap.fromTo(
            shell,
            { scale: 0.82, rotateY: 14, opacity: 0.25, z: -220 },
            {
              scale: 1,
              rotateY: 0,
              opacity: 1,
              z: 0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: shell,
                containerAnimation: horizontal,
                start: 'left 98%',
                end: 'left 58%',
                scrub: true,
              },
            }
          );

          gsap.to(shell, {
            scale: 0.84,
            rotateY: -14,
            opacity: 0.28,
            z: -200,
            ease: 'power2.in',
            scrollTrigger: {
              trigger: shell,
              containerAnimation: horizontal,
              start: 'right 42%',
              end: 'right 2%',
              scrub: true,
            },
          });
        });

        /* The heading loosens its grip as the cards take over, so the
           eye is pulled down into the track instead of staying on the
           title for the whole pin. */
        gsap.to('.expert-services-header', {
          y: -26,
          opacity: 0.55,
          scale: 0.97,
          ease: 'none',
          scrollTrigger: {
            trigger: pinRef.current,
            start: 'top top',
            end: () => '+=' + window.innerHeight * 0.7,
            scrub: 0.6,
          },
        });

        ScrollTrigger.refresh();
        return () => window.clearTimeout(safety);
      }

      /* ================================================================
       * 3b. UNPINNED MODE — grid, tablet, phone
       * ============================================================== */
      section.classList.remove('is-pin-active');
      horizontalRef.current = null;
      setIsPinned(false);

      gsap.set(shells, { clearProps: 'transform,opacity' });

      /* Batched so a three-across grid row arrives as a row, not as
         three separate events a few pixels apart. */
      ScrollTrigger.batch(shells, {
        start: 'top 88%',
        onEnter: (batch) =>
          gsap.from(batch, {
            y: 64,
            opacity: 0,
            scale: 0.94,
            rotateX: 10,
            transformPerspective: 1000,
            duration: 0.9,
            ease: EASE.out,
            stagger: 0.08,
            overwrite: true,
          }),
        onEnterBack: (batch) =>
          gsap.to(batch, { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 0.5, ease: EASE.out, overwrite: true }),
      });

      return () => window.clearTimeout(safety);
    },
    {
      scope: sectionRef,
      dependencies: [viewMode, selectedCategory, canPin, filteredServices.length],
      revertOnUpdate: true,
    }
  );

  /* ---------------------------------------------------------------- *
   * Category switching
   *
   * The previous version fired its tween in the same tick as the
   * setState, so it animated the cards that were about to be replaced.
   * The reveal now lives in a useGSAP keyed on the category, which runs
   * after React has committed the new list.
   * ---------------------------------------------------------------- */
  useGSAP(
    () => {
      /* Pinned mode owns the shells through scrubbed containerAnimation
         triggers. Running a second tween over the same targets here
         would overwrite those the moment the filter changed, and the
         depth effect would silently die. The pin's own refresh already
         re-reveals the new set. */
      if (prefersReducedMotion() || canPin) return;

      gsap.fromTo(
        '.expert-card-shell',
        { opacity: 0, y: 34, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.035,
          ease: EASE.out,
          onComplete: () => ScrollTrigger.refresh(),
        }
      );
    },
    { scope: sectionRef, dependencies: [selectedCategory, canPin], revertOnUpdate: false }
  );

  const handleCategoryChange = (cat: ServiceCategory) => {
    if (cat === selectedCategory) return;
    lastIdxRef.current = 0;
    setActiveIdx(0);
    setProgress.current?.(0.02);
    setSelectedCategory(cat);

    const el = trackRef.current;
    if (el && !isPinnedRef.current) el.scrollTo({ left: 0, behavior: 'smooth' });
    if (el && isPinnedRef.current) gsap.set(el, { x: 0 });
  };

  const handleViewMode = (mode: 'carousel' | 'grid') => {
    if (mode === viewMode) return;
    setViewMode(mode);
    lastIdxRef.current = 0;
    setActiveIdx(0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  /* ---------------------------------------------------------------- *
   * Render
   * ---------------------------------------------------------------- */
  return (
    <section ref={sectionRef} className="expert-services-section" id="expert-services">
      <div ref={glow1Ref} className="expert-ambient-glow expert-glow-1" aria-hidden="true" />
      <div ref={glow2Ref} className="expert-ambient-glow expert-glow-2" aria-hidden="true" />

      <div ref={pinRef} className="expert-pin-inner">
        <div className="expert-services-container">
          <div className="expert-services-header">
            <div ref={eyebrowRef} className="expert-services-eyebrow">
              <span className="expert-pulse-dot" />
              <span className="expert-eyebrow-text">CAPABILITIES &amp; EXPERTISE</span>
              <span className="expert-serial-badge">// INKER-CORP-SRV-2024</span>
            </div>

            <h2 className="expert-services-main-title">
              <span ref={titleARef} className="expert-title-part">
                EXPERT
              </span>{' '}
              {/* Not split. A background-clip:text gradient is painted on the
                  element's own box and clipped to its own text — once
                  splitChars empties the text nodes and appends inline-block
                  character spans, those descendants inherit a transparent
                  text-fill with nothing behind them, and the word renders
                  invisible. It rises as one masked word instead. */}
              <span className="expert-title-mask">
                <span ref={titleBRef} className="expert-title-part expert-gradient-text">
                  SERVICES
                </span>
              </span>
            </h2>

            <p ref={subRef} className="expert-services-sub">
              From groundbreaking robotic performances and hands-on maker ecosystems to turnkey academic
              labs and custom industrial R&amp;D — engineered to elevate human potential.
            </p>
          </div>

          <div ref={panelRef} className="expert-control-panel">
            <div className="expert-categories-bar" role="tablist" aria-label="Filter Services">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`expert-cat-pill ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleCategoryChange(cat.id)}
                  >
                    <span className="expert-cat-label">{cat.label}</span>
                    <span className="expert-cat-count">{cat.count}</span>
                  </button>
                );
              })}
            </div>

            <div className="expert-toolbar-right">
              <div className="expert-counter-hud">
                <span className="expert-counter-current">{String(activeIdx + 1).padStart(2, '0')}</span>
                <span className="expert-counter-sep">/</span>
                <span className="expert-counter-total">
                  {String(filteredServices.length).padStart(2, '0')}
                </span>
              </div>

              <div className="expert-layout-toggle" role="radiogroup" aria-label="Layout view">
                <button
                  type="button"
                  className={`expert-layout-btn ${viewMode === 'carousel' ? 'is-active' : ''}`}
                  onClick={() => handleViewMode('carousel')}
                  title="Carousel View"
                  aria-label="Carousel View"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="5" width="6" height="14" rx="1" />
                    <rect x="10" y="3" width="6" height="18" rx="1" />
                    <rect x="18" y="5" width="6" height="14" rx="1" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`expert-layout-btn ${viewMode === 'grid' ? 'is-active' : ''}`}
                  onClick={() => handleViewMode('grid')}
                  title="Grid View"
                  aria-label="Grid View"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {viewMode === 'carousel' && (
            <div className="expert-progress-track" aria-hidden="true">
              <div ref={progressRef} className="expert-progress-fill" />
            </div>
          )}
        </div>

        <div
          className={`expert-display-area ${viewMode === 'grid' ? 'is-grid-layout' : 'is-carousel-layout'}`}
        >
          {viewMode === 'carousel' && (
            <>
              <button
                type="button"
                className={`expert-nav-btn expert-nav-prev ${!canScrollPrev ? 'is-disabled' : ''}`}
                onClick={() => step('prev')}
                aria-label="Previous service"
                disabled={!canScrollPrev}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <button
                type="button"
                className={`expert-nav-btn expert-nav-next ${!canScrollNext ? 'is-disabled' : ''}`}
                onClick={() => step('next')}
                aria-label="Next service"
                disabled={!canScrollNext}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          <div
            ref={trackRef}
            className={`expert-services-track ${viewMode === 'grid' ? 'is-grid' : 'is-slider'}`}
            role="region"
            aria-label="Expert services track"
            tabIndex={0}
          >
            {filteredServices.map((item, idx) => (
              <div className="expert-card-shell" key={item.id}>
                <article
                  className="expert-services-card"
                  data-accent={item.category}
                  aria-roledescription="slide"
                  aria-label={`${idx + 1} of ${filteredServices.length}: ${item.title}`}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                >
                  <div className="expert-card-corner corner-tl" aria-hidden="true" />
                  <div className="expert-card-corner corner-tr" aria-hidden="true" />
                  <div className="expert-card-corner corner-br" aria-hidden="true" />
                  <div className="expert-card-corner corner-bl" aria-hidden="true" />

                  <div className="expert-card-header-bar">
                    <div className="expert-card-num-wrap">
                      <span className="expert-card-serial">SRV-{item.num}</span>
                      <span className="expert-card-badge">{item.tag}</span>
                    </div>

                    <button
                      type="button"
                      className="expert-quick-view-btn"
                      onClick={() => setActiveModalItem(item)}
                      title="Watch Full Reel & Details"
                      aria-label={`Preview video reel for ${item.title}`}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                      </svg>
                      <span>PREVIEW</span>
                    </button>
                  </div>

                  <div
                    className="expert-card-media-wrap"
                    onClick={() => setActiveModalItem(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveModalItem(item);
                      }
                    }}
                    aria-label={`Open preview modal for ${item.title}`}
                  >
                    {/* src is attached by the IntersectionObserver above —
                        seventeen simultaneous downloads is what made this
                        section stutter. */}
                    <video
                      className="expert-card-media"
                      data-src={item.video}
                      loop
                      muted
                      playsInline
                      poster={item.image}
                      preload="none"
                      aria-label={item.title}
                    />

                    <div className="expert-scanline-overlay" aria-hidden="true" />

                    <div className="expert-live-pill">
                      <span className="expert-live-dot" />
                      <span>REEL</span>
                    </div>

                    <div className="expert-media-play-hud" aria-hidden="true">
                      <div className="expert-play-circle">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="6 4 20 12 6 20 6 4" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="expert-card-body">
                    <h3 className="expert-card-title">{item.title}</h3>
                    <p className="expert-card-desc">{item.description}</p>

                    <div className="expert-card-highlights">
                      {item.highlights.map((hl, i) => (
                        <span key={i} className="expert-hl-pill">
                          {hl}
                        </span>
                      ))}
                    </div>

                    <div className="expert-card-actions">
                      <Link href={item.link} className="expert-card-cta">
                        <span>{item.linkText}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </Link>

                      <Link
                        href={`/contact?service=${encodeURIComponent(item.title)}`}
                        className="expert-card-inquire"
                        title={`Inquire about ${item.title}`}
                      >
                        Enquire
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {viewMode === 'carousel' && (
          <div className="expert-services-dots" role="tablist" aria-label="Services pagination">
            {filteredServices.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === activeIdx}
                aria-label={`Go to slide ${i + 1}: ${s.title}`}
                className={`expert-dot ${i === activeIdx ? 'is-active' : ''}`}
                onClick={() => seekToIndex(i)}
              />
            ))}
          </div>
        )}

        <div className={`expert-scroll-hint ${isPinned ? 'is-visible' : ''}`} aria-hidden="true">
          <span className="expert-scroll-hint-line" />
          <span>KEEP SCROLLING</span>
        </div>
      </div>

      {activeModalItem && (
        <div
          ref={modalBackdropRef}
          className="expert-modal-backdrop"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-service-title"
        >
          <div ref={modalCardRef} className="expert-modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="expert-modal-close" onClick={closeModal} aria-label="Close modal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="expert-modal-video-box">
              <video
                controls
                autoPlay
                loop
                playsInline
                poster={activeModalItem.image}
                className="expert-modal-video"
              >
                <source src={activeModalItem.video} type="video/mp4" />
              </video>
            </div>

            <div className="expert-modal-details">
              <div className="expert-modal-meta">
                <span className="expert-modal-serial">SERVICE // {activeModalItem.num}</span>
                <span className="expert-modal-cat">{activeModalItem.categoryLabel}</span>
              </div>

              <h3 id="modal-service-title" className="expert-modal-title">
                {activeModalItem.title}
              </h3>

              <p className="expert-modal-desc">{activeModalItem.description}</p>

              <div className="expert-modal-highlights-title">CAPABILITY HIGHLIGHTS</div>
              <div className="expert-modal-pills">
                {activeModalItem.highlights.map((h, idx) => (
                  <span key={idx} className="expert-modal-pill">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {h}
                  </span>
                ))}
              </div>

              <div className="expert-modal-cta-row">
                <Link
                  href={`/contact?service=${encodeURIComponent(activeModalItem.title)}`}
                  className="expert-modal-btn-primary"
                  onClick={closeModal}
                >
                  <span>Book / Enquire This Service</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>

                <Link href={activeModalItem.link} className="expert-modal-btn-secondary" onClick={closeModal}>
                  {activeModalItem.linkText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface NavItem {
  key: string;
  label: string;
  href: string;
  drop?: [string, string, string?][];
}

const items: NavItem[] = [
  { key: 'home', label: 'Home', href: '/' },
  {
    key: 'robotics', label: 'Robotics', href: '/robotics',
    drop: [
      ['01', 'Shadow Puppetry Automation', '/robotics#tholpava-kooth'],
      ['02', 'Robotic Kiosk', '/robotics#federal-bank'],
      ['03', 'RoboMaker', '/robotics#robomaker'],
      ['04', 'Robotic Kunjiraman', '/robotics#robotic-kunjiraman'],
      ['05', 'Inker Alton', '/robotics#inker-alton'],
      ['SECTION', 'Services', ''],
      ['RaaS', 'Robot as a Service', '/robotics#raas']
    ]
  },
  {
    key: 'ai', label: 'AI Solutions', href: '/ai-solutions',
    drop: [
      ['01', 'Customer Engagement & Analytics', '/ai-solutions#solutions'],
      ['02', 'Customer Management Systems', '/ai-solutions#cms']
    ]
  },
  {
    key: 'roboparks', label: 'RoboParks', href: '/roboparks',
    drop: [
      ['01', 'RoboPark', '/roboparks#robopark'],
      ['02', 'RoboLand', '/roboparks#roboland'],
      ['03', 'RoboLand Mini', '/roboparks#roboland-mini']
    ]
  },
  {
    key: 'edutech', label: 'EduTech', href: '/edutech',
    drop: [
      ['01', 'Workshops', '/edutech#workshops'],
      ['02', 'Internships', '/edutech#internships'],
      ['03', 'FDP', '/edutech#fdps'],
      ['04', 'Add-On Courses', '/edutech#addon'],
      ['05', 'Robo Clubs', '/edutech#robo-clubs'],
      ['06', 'Innovation Labs', '/edutech#innovation-labs'],
      ['SECTION', 'Events', ''],
      ['Expo', 'Future Tech Expo', '/edutech#future-tech-expo']
    ]
  },
  { key: 'about', label: 'About', href: '/about' },
  { key: 'gallery', label: 'Gallery', href: '/gallery' },
  { key: 'careers', label: 'Careers', href: '/careers' }
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
    // Clicking a nav link leaves it focused, which keeps its dropdown
    // open via :focus-within after navigation. Clear focus so it closes.
    if (document.activeElement instanceof HTMLElement && document.activeElement.closest('.nav')) {
      document.activeElement.blur();
    }
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <Link className="nav-logo" href="/">
          <Image src="/logo.png" alt="Inker Robotics" width={140} height={38} priority />
        </Link>

        <div className={`nav-links ${open ? 'open' : ''}`}>
          {items.map((it) =>
            it.drop ? (
              <div className="nav-item-drop" key={it.key}>
                <Link href={it.href} className={isActive(it.href) ? 'active' : ''}>
                  {it.label} <span className="caret">▾</span>
                </Link>
                <div className="nav-drop">
                  <div className="nav-drop-label">{it.label === 'Robotics' ? 'Projects' : it.label === 'AI Solutions' ? 'Solutions' : it.label === 'RoboParks' ? 'Formats' : 'Programs'}</div>
                  {it.drop.map(([n, t, href]) =>
                    n === 'SECTION' ? (
                      <div key={t} className="nav-drop-label" style={{ marginTop: '8px' }}>{t}</div>
                    ) : (
                      <Link key={n} href={href || it.href}><span className="nav-drop-num">{n}</span><span>{t}</span></Link>
                    )
                  )}
                </div>
              </div>
            ) : (
              <Link key={it.key} href={it.href} className={isActive(it.href) ? 'active' : ''}>{it.label}</Link>
            )
          )}
          <Link className="nav-cta" href="/contact">Talk to Us →</Link>
        </div>

        <button className="nav-toggle" aria-label="Menu" onClick={() => setOpen(!open)}>
          <svg width="28" height="20" viewBox="0 0 28 20" fill="none"><path d="M2 2h24M2 10h24M2 18h24" stroke="currentColor" strokeWidth="2" /></svg>
        </button>
      </div>
    </nav>
  );
}

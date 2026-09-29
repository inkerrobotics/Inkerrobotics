'use client';

import Link from 'next/link';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const LINKS: [string, string][] = [
  ['HOME', '/'],
  ['ROBOTICS', '/robotics'],
  ['AI SOLUTIONS', '/ai-solutions'],
  ['ROBOPARKS', '/roboparks'],
  ['EDUTECH', '/edutech'],
  ['ABOUT', '/about'],
  ['GALLERY', '/gallery'],
  ['CAREERS', '/careers'],
  ['CONTACT', '/contact'],
];

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  return (
    <div className={`menu-overlay ${isOpen ? 'active' : ''}`} id="menu-overlay">
      <div className="menu-top-bar">
        <div className="nav-left">
          <div className="menu-toggle" onClick={onClose} style={{ cursor: 'pointer' }} role="button" tabIndex={0} aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </div>
          <Link href="/" className="nav-logo" onClick={onClose}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Inker Robotics" style={{ height: 30, width: 'auto' }} />
          </Link>
        </div>
        <div className="nav-right">
          <Link href="/contact" className="nav-btn" onClick={onClose}>
            TALK TO US
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 8 }}>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="menu-links-container">
        {LINKS.map(([label, href]) => (
          <Link key={href} href={href} className="menu-link" onClick={onClose}>
            {label}
          </Link>
        ))}
      </div>

      <div className="menu-bottom-bar">
        <a href="https://www.linkedin.com/company/inkerrobotics/" target="_blank" rel="noopener noreferrer" className="menu-social">
          LINKEDIN <span className="arrow">&#8599;</span>
        </a>
        <a href="https://www.instagram.com/inkerrobotics" target="_blank" rel="noopener noreferrer" className="menu-social">
          INSTAGRAM <span className="arrow">&#8599;</span>
        </a>
      </div>
    </div>
  );
}

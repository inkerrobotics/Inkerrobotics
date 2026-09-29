'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MenuOverlay from './MenuOverlay';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <div
            className="menu-toggle"
            role="button"
            tabIndex={0}
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            onKeyDown={(e) => e.key === 'Enter' && setMenuOpen(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </div>

          <Link href="/" className="nav-logo" title="Inker Robotics Home" aria-label="Inker Robotics Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Inker Robotics" style={{ height: 30, width: 'auto' }} />
          </Link>
        </div>

        <div className="nav-right">
          <Link
            href="/"
            className={`nav-home-btn ${isHome ? 'active' : ''}`}
            title="Go to Home Landing Page"
            aria-label="Go to Home Landing Page"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
              <path d="M3 9.5L12 3l9 6.5V20a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20V9.5z" />
              <polyline points="9 21 9 12 15 12 15 21" />
            </svg>
            <span>HOME</span>
          </Link>

          <Link href="/contact" className="nav-btn">
            TALK TO US
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 8 }}>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </nav>

      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

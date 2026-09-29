'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV = [
  { href: '/admin',          label: 'Dashboard',     icon: '◉' },
  { href: '/admin/media',    label: 'Media Library', icon: '🖼' },
  { href: '/admin/leaders',  label: 'Team & Leaders',icon: '👥' },
  { href: '/admin/press',    label: 'Press & Media', icon: '📰' },
  { href: '/admin/programs', label: 'Edu Programs',  icon: '🎓' },
  { href: '/admin/brands',   label: 'Client Brands', icon: '🏢' },
  { href: '/admin/settings', label: 'Site Settings', icon: '⚙' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('inker_admin_token');
    if (!token && pathname !== '/admin/login') {
      router.replace('/admin/login');
    } else {
      setReady(true);
    }
  }, [pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (!ready) return null;

  const handleLogout = () => {
    localStorage.removeItem('inker_admin_token');
    router.push('/admin/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      background: '#07080D',
      color: '#FFFFFF',
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        background: '#020306',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50,
      }}>
        {/* Brand header */}
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '10px',
            letterSpacing: '0.18em',
            color: '#eb670e',
            fontWeight: 800,
            marginBottom: '4px',
            textTransform: 'uppercase',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#eb670e', boxShadow: '0 0 6px #eb670e' }} />
            Inker Robotics
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Control Panel
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
          {NAV.map(({ href, label, icon }) => {
            const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  color: active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.60)',
                  background: active
                    ? 'linear-gradient(90deg, rgba(235, 103, 14, 0.18) 0%, rgba(235, 103, 14, 0.04) 100%)'
                    : 'transparent',
                  fontSize: '13.5px',
                  fontWeight: active ? 600 : 500,
                  textDecoration: 'none',
                  marginBottom: '4px',
                  borderLeft: active ? '3px solid #eb670e' : '3px solid transparent',
                  boxShadow: active ? '0 0 16px rgba(235, 103, 14, 0.12)' : 'none',
                  transition: 'all 150ms ease',
                }}
              >
                <span style={{ fontSize: '14px', opacity: active ? 1 : 0.7 }}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div style={{ padding: '18px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(0,0,0,0.3)' }}>
          <Link
            href="/"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              color: 'rgba(255, 255, 255, 0.55)',
              textDecoration: 'none',
              marginBottom: '12px',
              fontWeight: 500,
              transition: 'color 0.15s',
            }}
          >
            <span style={{ color: '#eb670e' }}>↗</span> View Website
          </Link>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#ff4d4f',
              fontSize: '12.5px',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500,
            }}
          >
            ← Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        overflow: 'auto',
        background: '#07080D',
        backgroundImage: 'radial-gradient(ellipse at top right, rgba(42, 53, 130, 0.08) 0%, transparent 60%)',
      }}>
        {children}
      </main>
    </div>
  );
}

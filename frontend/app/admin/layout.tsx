'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV = [
  { href: '/admin',          label: 'Dashboard',    icon: '◉' },
  { href: '/admin/media',    label: 'Media Library', icon: '🖼' },
  { href: '/admin/leaders',  label: 'Team',          icon: '👥' },
  { href: '/admin/press',    label: 'Press Items',   icon: '📰' },
  { href: '/admin/programs', label: 'Programs',      icon: '🎓' },
  { href: '/admin/brands',   label: 'Brands',        icon: '🏢' },
  { href: '/admin/settings', label: 'Settings',      icon: '⚙' },
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
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, system-ui, sans-serif', background: '#05050A' }}>
      {/* Sidebar */}
      <aside style={{ width: '230px', background: '#000000', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '28px 24px 16px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.15em', color: '#eb670e', fontWeight: 700, marginBottom: '2px' }}>INKER ROBOTICS</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>Control Panel</div>
        </div>

        <nav style={{ padding: '16px 10px', flex: 1 }}>
          {NAV.map(({ href, label, icon }) => {
            const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
            return (
              <Link key={href} href={href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '5px', color: active ? '#fff' : 'rgba(255,255,255,0.5)', background: active ? 'rgba(235,103,14,0.18)' : 'transparent', fontSize: '13.5px', textDecoration: 'none', marginBottom: '2px', borderLeft: active ? '2px solid #eb670e' : '2px solid transparent', transition: 'all 120ms' }}>
                <span style={{ fontSize: '14px' }}>{icon}</span>{label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <Link href="/" target="_blank" style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', marginBottom: '10px' }}>↗ View Website</Link>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '12px', cursor: 'pointer', padding: 0 }}>Sign out</button>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: 'auto' }}>{children}</main>
    </div>
  );
}

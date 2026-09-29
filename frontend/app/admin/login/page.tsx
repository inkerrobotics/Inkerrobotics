'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message ?? 'Invalid password');
      localStorage.setItem('inker_admin_token', data.token);
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#040508',
      backgroundImage: 'radial-gradient(circle at 50% 25%, rgba(235, 103, 14, 0.10) 0%, rgba(42, 53, 130, 0.15) 45%, transparent 75%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      padding: '24px',
    }}>
      <div style={{
        background: 'rgba(12, 15, 25, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        borderRadius: '12px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.7), 0 0 35px rgba(235, 103, 14, 0.12)',
      }}>
        <div style={{ marginBottom: '36px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: '#eb670e',
            fontWeight: 800,
            marginBottom: '12px',
            textTransform: 'uppercase',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#eb670e', boxShadow: '0 0 8px #eb670e' }} />
            Inker Robotics
          </div>
          <h1 style={{ color: '#FFFFFF', fontSize: '26px', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Control Panel
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.50)', fontSize: '13px', margin: 0 }}>
            Enter your administrator secret to access the CMS.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.75)', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '8px' }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '8px',
                padding: '13px 16px',
                color: '#FFFFFF',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => {
                e.target.style.borderColor = '#eb670e';
                e.target.style.boxShadow = '0 0 0 2px rgba(235, 103, 14, 0.2)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(255, 77, 79, 0.12)',
              border: '1px solid rgba(255, 77, 79, 0.35)',
              borderRadius: '6px',
              padding: '10px 14px',
              color: '#ff7875',
              fontSize: '13px',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #eb670e 0%, #ff7315 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '14px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.75 : 1,
              letterSpacing: '0.05em',
              boxShadow: '0 4px 18px rgba(235, 103, 14, 0.40)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
          >
            {loading ? 'Authenticating…' : 'Sign In →'}
          </button>
        </form>
      </div>
    </div>
  );
}

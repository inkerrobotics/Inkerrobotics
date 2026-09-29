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
    <div style={{ minHeight: '100vh', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: '#7D39EB', borderRadius: '8px', padding: '48px', width: '100%', maxWidth: '400px', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#7D39EB', fontWeight: 600, marginBottom: '8px' }}>INKER ROBOTICS</div>
          <h1 style={{ color: 'rgba(255,255,255,0.04)', fontSize: '24px', fontWeight: 700, margin: 0 }}>Admin Panel</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', marginBottom: '8px' }}>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', padding: '12px 14px', color: 'rgba(255,255,255,0.04)', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {error && <p style={{ color: '#7D39EB', fontSize: '13px', margin: 0 }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ background: '#7D39EB', color: 'rgba(255,255,255,0.04)', border: 'none', borderRadius: '4px', padding: '13px', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, letterSpacing: '0.05em' }}
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>
      </div>
    </div>
  );
}

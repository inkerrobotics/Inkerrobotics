'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface Stats { total: number; new: number; read: number; replied: number; }
interface Inquiry {
  id: string; name: string; email: string; phone: string;
  organization?: string; inquiryType: string; status: string;
  message: string; createdAt: string;
}

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  new:     { bg: 'rgba(235, 103, 14, 0.15)', color: '#eb670e', border: '1px solid rgba(235, 103, 14, 0.35)' },
  read:    { bg: 'rgba(42, 53, 130, 0.25)',  color: '#8c9cff', border: '1px solid rgba(42, 53, 130, 0.45)' },
  replied: { bg: 'rgba(47, 212, 160, 0.15)', color: '#2FD4A0', border: '1px solid rgba(47, 212, 160, 0.35)' },
};

const TYPE_LABELS: Record<string, string> = {
  robotics: 'Robotics', ai: 'AI Solution', roboparks: 'RoboParks',
  edutech: 'EduTech', careers: 'Careers', general: 'General',
};

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div style={{
      background: 'rgba(15, 18, 28, 0.70)',
      backdropFilter: 'blur(12px)',
      borderRadius: '10px',
      padding: '24px 28px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderTop: accent ? '3px solid #eb670e' : '3px solid rgba(255, 255, 255, 0.08)',
      boxShadow: accent ? '0 10px 30px rgba(235, 103, 14, 0.12)' : '0 4px 20px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ fontSize: '36px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em' }}>{value}</div>
      <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.60)', marginTop: '4px', fontWeight: 500 }}>{label}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('inker_admin_token') : '';
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/admin/stats`, { headers }).then(r => r.json()),
      fetch(`${API_URL}/api/admin/inquiries?limit=50${filter ? `&status=${filter}` : ''}`, { headers }).then(r => r.json()),
    ]).then(([s, i]) => {
      if (s.success) setStats(s.data);
      if (i.success) setInquiries(i.data);
    }).finally(() => setLoading(false));
  }, [filter]);

  if (loading) return <div style={{ padding: '48px', color: 'rgba(255,255,255,0.55)' }}>Loading inquiries…</div>;

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '11px', letterSpacing: '0.18em', color: '#eb670e', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
          Overview
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
          Inquiries Dashboard
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', margin: 0 }}>
          Manage all incoming contact form submissions and leads.
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '40px' }}>
          <StatCard label="Total Inquiries" value={stats.total} />
          <StatCard label="New Submissions" value={stats.new} accent />
          <StatCard label="Read" value={stats.read} />
          <StatCard label="Replied" value={stats.replied} />
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['', 'new', 'read', 'replied'].map(f => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 18px',
                borderRadius: '6px',
                border: active ? '1px solid #eb670e' : '1px solid rgba(255,255,255,0.10)',
                fontSize: '13px',
                fontWeight: active ? 700 : 500,
                cursor: 'pointer',
                background: active ? 'linear-gradient(135deg, #eb670e 0%, #ff7315 100%)' : 'rgba(255,255,255,0.04)',
                color: active ? '#FFFFFF' : 'rgba(255,255,255,0.65)',
                boxShadow: active ? '0 4px 14px rgba(235, 103, 14, 0.35)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {f === '' ? 'All Inquiries' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Inquiries Table */}
      <div style={{
        background: 'rgba(15, 18, 28, 0.70)',
        backdropFilter: 'blur(12px)',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
              {['Name & Org', 'Email & Phone', 'Category', 'Status', 'Received Date', 'Action'].map(h => (
                <th key={h} style={{ padding: '16px 20px', textAlign: 'left', color: 'rgba(255,255,255,0.60)', fontWeight: 700, fontSize: '11.5px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.45)' }}>No inquiries match this filter.</td></tr>
            ) : inquiries.map(inq => (
              <tr key={inq.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s' }}>
                <td style={{ padding: '16px 20px', fontWeight: 600, color: '#FFFFFF' }}>
                  {inq.name}
                  {inq.organization && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.50)', fontWeight: 400, marginTop: '2px' }}>{inq.organization}</div>}
                </td>
                <td style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.65)' }}>
                  {inq.email}
                  {inq.phone && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{inq.phone}</div>}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ background: 'rgba(42, 53, 130, 0.25)', color: '#98a5ff', border: '1px solid rgba(42, 53, 130, 0.45)', padding: '4px 10px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 600 }}>
                    {TYPE_LABELS[inq.inquiryType] ?? inq.inquiryType}
                  </span>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ ...STATUS_COLORS[inq.status], padding: '4px 10px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {inq.status}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>
                  {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <Link
                    href={`/admin/inquiries/${inq.id}`}
                    style={{
                      color: '#eb670e',
                      fontSize: '13px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    View Details →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

interface Stats { total: number; new: number; read: number; replied: number; }
interface Inquiry {
  id: string; name: string; email: string; phone: string;
  organization?: string; inquiryType: string; status: string;
  message: string; createdAt: string;
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  new:     { bg: 'rgba(125,57,235,0.15)', color: '#7D39EB' },
  read:    { bg: 'rgba(125,57,235,0.15)',  color: '#9B63F2' },
  replied: { bg: 'rgba(47,212,160,0.15)', color: '#2FD4A0' },
};

const TYPE_LABELS: Record<string, string> = {
  robotics: 'Robotics', ai: 'AI Solution', roboparks: 'RoboParks',
  edutech: 'EduTech', careers: 'Careers', general: 'General',
};

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderTop: accent ? '3px solid #7D39EB' : '3px solid transparent' }}>
      <div style={{ fontSize: '32px', fontWeight: 700, color: '#FFFFFF' }}>{value}</div>
      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginTop: '4px' }}>{label}</div>
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

  if (loading) return <div style={{ padding: '48px', color: 'rgba(255,255,255,0.55)' }}>Loading…</div>;

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 4px' }}>Dashboard</h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', margin: 0 }}>All incoming inquiries from the website contact form.</p>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
          <StatCard label="Total Inquiries" value={stats.total} />
          <StatCard label="New" value={stats.new} accent />
          <StatCard label="Read" value={stats.read} />
          <StatCard label="Replied" value={stats.replied} />
        </div>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['', 'new', 'read', 'replied'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 16px', borderRadius: '4px', border: '1px solid', fontSize: '13px', cursor: 'pointer', background: filter === f ? '#7D39EB' : 'rgba(255,255,255,0.04)', color: filter === f ? '#fff' : 'rgba(255,255,255,0.55)', borderColor: filter === f ? '#7D39EB' : 'rgba(255,255,255,0.10)' }}>
            {f === '' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
              {['Name', 'Email', 'Type', 'Status', 'Date', ''].map(h => (
                <th key={h} style={{ padding: '14px 18px', textAlign: 'left', color: 'rgba(255,255,255,0.55)', fontWeight: 600, fontSize: '12px', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.55)' }}>No inquiries found.</td></tr>
            ) : inquiries.map(inq => (
              <tr key={inq.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <td style={{ padding: '14px 18px', fontWeight: 600, color: '#FFFFFF' }}>
                  {inq.name}
                  {inq.organization && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', fontWeight: 400 }}>{inq.organization}</div>}
                </td>
                <td style={{ padding: '14px 18px', color: 'rgba(255,255,255,0.55)' }}>{inq.email}</td>
                <td style={{ padding: '14px 18px' }}>
                  <span style={{ background: 'rgba(125,57,235,0.08)', color: '#9B63F2', padding: '3px 8px', borderRadius: '3px', fontSize: '12px', fontWeight: 500 }}>
                    {TYPE_LABELS[inq.inquiryType] ?? inq.inquiryType}
                  </span>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span style={{ ...STATUS_COLORS[inq.status], padding: '3px 8px', borderRadius: '3px', fontSize: '12px', fontWeight: 600 }}>
                    {inq.status}
                  </span>
                </td>
                <td style={{ padding: '14px 18px', color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>
                  {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <Link href={`/admin/inquiries/${inq.id}`} style={{ color: '#7D39EB', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>View →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

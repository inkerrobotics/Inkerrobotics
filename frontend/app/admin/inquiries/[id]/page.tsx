'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

interface Inquiry {
  id: string; name: string; email: string; phone: string;
  organization?: string; location?: string; inquiryType: string;
  status: string; message: string; notes?: string; createdAt: string; updatedAt: string;
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

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <div style={{ fontSize: '11px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.55)', fontWeight: 600, marginBottom: '4px' }}>{label}</div>
      <div style={{ color: '#FFFFFF', fontSize: '15px' }}>{value}</div>
    </div>
  );
}

export default function InquiryDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('inker_admin_token') : '';
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => {
    fetch(`${API_URL}/api/admin/inquiries/${id}`, { headers })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setInquiry(data.data);
          setNotes(data.data.notes ?? '');
          setStatus(data.data.status);
        }
      });
  }, [id]);

  const save = async () => {
    setSaving(true);
    await fetch(`${API_URL}/api/admin/inquiries/${id}`, {
      method: 'PATCH', headers,
      body: JSON.stringify({ status, notes }),
    });
    setSaving(false);
  };

  const remove = async () => {
    if (!confirm('Delete this inquiry? This cannot be undone.')) return;
    setDeleting(true);
    await fetch(`${API_URL}/api/admin/inquiries/${id}`, { method: 'DELETE', headers });
    router.push('/admin');
  };

  if (!inquiry) return <div style={{ padding: '48px', color: 'rgba(255,255,255,0.55)' }}>Loading…</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '860px' }}>
      {/* Back */}
      <Link href="/admin" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '28px' }}>
        ← Back to Dashboard
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px' }}>{inquiry.name}</h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ ...STATUS_COLORS[inquiry.status], padding: '3px 10px', borderRadius: '3px', fontSize: '12px', fontWeight: 600 }}>{inquiry.status}</span>
            <span style={{ background: 'rgba(125,57,235,0.08)', color: '#9B63F2', padding: '3px 10px', borderRadius: '3px', fontSize: '12px', fontWeight: 500 }}>{TYPE_LABELS[inquiry.inquiryType] ?? inquiry.inquiryType}</span>
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>{new Date(inquiry.createdAt).toLocaleString('en-IN')}</span>
          </div>
        </div>
        <button onClick={remove} disabled={deleting} style={{ background: 'rgba(255,91,110,0.1)', color: '#FF5B6E', border: '1px solid rgba(255,91,110,0.2)', borderRadius: '4px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}>
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Contact info */}
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.05em' }}>CONTACT DETAILS</h3>
          <Field label="NAME" value={inquiry.name} />
          <Field label="EMAIL" value={inquiry.email} />
          <Field label="PHONE" value={inquiry.phone} />
          <Field label="ORGANIZATION" value={inquiry.organization} />
          <Field label="LOCATION" value={inquiry.location} />
        </div>

        {/* Message + actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.05em' }}>MESSAGE</h3>
            <p style={{ color: '#FFFFFF', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>{inquiry.message}</p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.05em' }}>UPDATE</h3>

            <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', marginBottom: '6px' }}>STATUS</label>
            <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.10)', fontSize: '14px', color: '#FFFFFF', marginBottom: '16px', background: 'rgba(255,255,255,0.04)' }}>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>

            <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', marginBottom: '6px' }}>ADMIN NOTES</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Add internal notes…" style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.10)', fontSize: '14px', color: '#FFFFFF', resize: 'vertical', boxSizing: 'border-box', marginBottom: '16px' }} />

            <button onClick={save} disabled={saving} style={{ background: '#7D39EB', color: 'rgba(255,255,255,0.04)', border: 'none', borderRadius: '4px', padding: '11px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  new:     { bg: 'rgba(235, 103, 14, 0.15)', color: '#eb670e', border: '1px solid rgba(235, 103, 14, 0.35)' },
  read:    { bg: 'rgba(42, 53, 130, 0.25)',  color: '#8c9cff', border: '1px solid rgba(42, 53, 130, 0.45)' },
  replied: { bg: 'rgba(47, 212, 160, 0.15)', color: '#2FD4A0', border: '1px solid rgba(47, 212, 160, 0.35)' },
};

const TYPE_LABELS: Record<string, string> = {
  robotics: 'Robotics', ai: 'AI Solution', roboparks: 'RoboParks',
  edutech: 'EduTech', careers: 'Careers', general: 'General',
};

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <div style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.50)', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 500 }}>{value}</div>
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
  const [savedSuccess, setSavedSuccess] = useState(false);
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
    setSavedSuccess(false);
    await fetch(`${API_URL}/api/admin/inquiries/${id}`, {
      method: 'PATCH', headers,
      body: JSON.stringify({ status, notes }),
    });
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const remove = async () => {
    if (!confirm('Delete this inquiry? This cannot be undone.')) return;
    setDeleting(true);
    await fetch(`${API_URL}/api/admin/inquiries/${id}`, { method: 'DELETE', headers });
    router.push('/admin');
  };

  if (!inquiry) return <div style={{ padding: '48px', color: 'rgba(255,255,255,0.55)' }}>Loading inquiry details…</div>;

  return (
    <div style={{ padding: '40px 48px', maxWidth: '960px' }}>
      {/* Back button */}
      <Link
        href="/admin"
        style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.60)',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '28px',
          fontWeight: 600,
          transition: 'color 0.15s',
        }}
      >
        <span style={{ color: '#eb670e' }}>←</span> Back to Dashboard
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            {inquiry.name}
          </h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ ...STATUS_COLORS[inquiry.status], padding: '4px 10px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase' }}>
              {inquiry.status}
            </span>
            <span style={{ background: 'rgba(42, 53, 130, 0.25)', color: '#98a5ff', border: '1px solid rgba(42, 53, 130, 0.45)', padding: '4px 10px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 600 }}>
              {TYPE_LABELS[inquiry.inquiryType] ?? inquiry.inquiryType}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.50)', fontSize: '13px' }}>
              Received: {new Date(inquiry.createdAt).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <button
          onClick={remove}
          disabled={deleting}
          style={{
            background: 'rgba(255, 77, 79, 0.12)',
            color: '#ff7875',
            border: '1px solid rgba(255, 77, 79, 0.30)',
            borderRadius: '6px',
            padding: '9px 18px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {deleting ? 'Deleting…' : 'Delete Inquiry'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px' }}>
        {/* Contact info & Message */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            background: 'rgba(15, 18, 28, 0.70)',
            backdropFilter: 'blur(12px)',
            borderRadius: '10px',
            padding: '28px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: 700, color: '#eb670e', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Contact Information
            </h3>
            <Field label="Full Name" value={inquiry.name} />
            <Field label="Email Address" value={inquiry.email} />
            <Field label="Phone Number" value={inquiry.phone} />
            <Field label="Organization" value={inquiry.organization} />
            <Field label="Location" value={inquiry.location} />
          </div>

          <div style={{
            background: 'rgba(15, 18, 28, 0.70)',
            backdropFilter: 'blur(12px)',
            borderRadius: '10px',
            padding: '28px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 700, color: '#eb670e', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Inquiry Message
            </h3>
            <p style={{ color: '#FFFFFF', fontSize: '15px', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
              {inquiry.message}
            </p>
          </div>
        </div>

        {/* Update status and notes */}
        <div>
          <div style={{
            background: 'rgba(15, 18, 28, 0.70)',
            backdropFilter: 'blur(12px)',
            borderRadius: '10px',
            padding: '28px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <h3 style={{ margin: '0 0 18px', fontSize: '12px', fontWeight: 700, color: '#eb670e', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Manage Status & Notes
            </h3>

            <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.60)', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '8px' }}>
              STATUS
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.14)',
                fontSize: '14px',
                color: '#FFFFFF',
                marginBottom: '20px',
                background: '#0D101C',
                outline: 'none',
              }}
            >
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>

            <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.60)', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '8px' }}>
              INTERNAL NOTES
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={5}
              placeholder="Add follow-up notes, assigned personnel, or meeting logs…"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.14)',
                fontSize: '14px',
                color: '#FFFFFF',
                background: 'rgba(255,255,255,0.04)',
                resize: 'vertical',
                boxSizing: 'border-box',
                marginBottom: '20px',
                outline: 'none',
              }}
            />

            <button
              onClick={save}
              disabled={saving}
              style={{
                width: '100%',
                background: savedSuccess ? '#2FD4A0' : 'linear-gradient(135deg, #eb670e 0%, #ff7315 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '13px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                opacity: saving ? 0.75 : 1,
                boxShadow: '0 4px 14px rgba(235, 103, 14, 0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              {saving ? 'Saving Changes…' : savedSuccess ? '✓ Saved Successfully' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

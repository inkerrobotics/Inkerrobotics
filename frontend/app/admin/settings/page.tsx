'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

const DEFAULTS: Record<string, Record<string, string>> = {
  'Contact Info': { contact_email: '', contact_phone: '', contact_address: '' },
  'Social Links': { social_linkedin: '', social_instagram: '', social_youtube: '' },
  'Site': { site_tagline: '', og_image_url: '' },
  'Stats': { stat_deployments: '6', stat_ai_solutions: '7', stat_programs: '100', stat_students: '50000', stat_professionals: '5000', stat_institutions: '40' },
};

const LABELS: Record<string, string> = {
  contact_email: 'Email', contact_phone: 'Phone', contact_address: 'Office Address',
  social_linkedin: 'LinkedIn URL', social_instagram: 'Instagram URL', social_youtube: 'YouTube URL',
  site_tagline: 'Tagline', og_image_url: 'OG Image URL',
  stat_deployments: 'Robotic Deployments', stat_ai_solutions: 'AI Solutions',
  stat_programs: 'Technology Programs', stat_students: 'Students Impacted',
  stat_professionals: 'Professionals Trained', stat_institutions: 'Institutions Connected',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('inker_admin_token') : '';
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => {
    fetch(`${API_URL}/api/cms/settings`, { headers }).then(r => r.json()).then(d => {
      if (d.success) {
        const merged: Record<string, string> = {};
        for (const group of Object.values(DEFAULTS)) Object.assign(merged, group);
        setSettings({ ...merged, ...d.data });
      }
    });
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch(`${API_URL}/api/cms/settings`, { method: 'POST', headers, body: JSON.stringify(settings) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '720px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 4px' }}>Site Settings</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', margin: 0 }}>Update contact info, social links, stats, and site defaults</p>
        </div>
        <button onClick={save} disabled={saving} style={{ background: saved ? '#2FD4A0' : '#7D39EB', color: 'rgba(255,255,255,0.04)', border: 'none', borderRadius: '4px', padding: '10px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', minWidth: '110px' }}>
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save All'}
        </button>
      </div>

      {Object.entries(DEFAULTS).map(([group, keys]) => (
        <div key={group} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '7px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '14px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.04em' }}>{group.toUpperCase()}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.keys(keys).map(key => (
              <div key={key}>
                <label style={lbl}>{LABELS[key] ?? key}</label>
                {key === 'contact_address' ? (
                  <textarea value={settings[key] ?? ''} onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))} rows={2} style={{ ...inp, resize: 'vertical' }} />
                ) : (
                  <input type={key.startsWith('stat_') ? 'number' : 'text'} value={settings[key] ?? ''} onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))} style={inp} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const lbl: React.CSSProperties = { display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.07em', fontWeight: 600, marginBottom: '5px' };
const inp: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '4px', fontSize: '14px', color: '#FFFFFF', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)' };

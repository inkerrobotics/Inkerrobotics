'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const DEFAULTS: Record<string, Record<string, string>> = {
  'Contact Info': { contact_email: '', contact_phone: '', contact_address: '' },
  'Social Links': { social_linkedin: '', social_instagram: '', social_youtube: '' },
  'Site Identity': { site_tagline: '', og_image_url: '' },
  'Platform Impact Stats': { stat_deployments: '6', stat_ai_solutions: '7', stat_programs: '100', stat_students: '50000', stat_professionals: '5000', stat_institutions: '40' },
};

const LABELS: Record<string, string> = {
  contact_email: 'Public Email', contact_phone: 'Contact Phone', contact_address: 'Registered Office Address',
  social_linkedin: 'LinkedIn Page URL', social_instagram: 'Instagram Profile URL', social_youtube: 'YouTube Channel URL',
  site_tagline: 'Meta Tagline', og_image_url: 'Social Share (OG) Image URL',
  stat_deployments: 'Robotic Deployments', stat_ai_solutions: 'AI Solutions Implemented',
  stat_programs: 'Educational Programs', stat_students: 'Students Trained & Mentored',
  stat_professionals: 'Industry Professionals', stat_institutions: 'Partner Institutions',
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
    <div style={{ padding: '40px 48px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <div style={{ fontSize: '11px', letterSpacing: '0.18em', color: '#eb670e', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            Configuration
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
            Site Settings
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13.5px', margin: '4px 0 0' }}>
            Update global contact information, social handles, statistics counters, and metadata.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          style={{
            background: saved ? '#2FD4A0' : 'linear-gradient(135deg, #eb670e 0%, #ff7315 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            padding: '11px 26px',
            fontSize: '13.5px',
            fontWeight: 700,
            cursor: 'pointer',
            minWidth: '120px',
            boxShadow: '0 4px 14px rgba(235, 103, 14, 0.35)',
            transition: 'all 0.2s ease',
          }}
        >
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save All Changes'}
        </button>
      </div>

      {Object.entries(DEFAULTS).map(([group, keys]) => (
        <div
          key={group}
          style={{
            background: 'rgba(15, 18, 28, 0.70)',
            backdropFilter: 'blur(12px)',
            borderRadius: '10px',
            padding: '28px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            marginBottom: '24px',
          }}
        >
          <h3 style={{ margin: '0 0 20px', fontSize: '12px', fontWeight: 700, color: '#eb670e', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {group}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {Object.keys(keys).map(key => (
              <div key={key}>
                <label style={lbl}>{LABELS[key] ?? key}</label>
                {key === 'contact_address' ? (
                  <textarea
                    value={settings[key] ?? ''}
                    onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))}
                    rows={2}
                    style={{ ...inp, resize: 'vertical' }}
                  />
                ) : (
                  <input
                    type={key.startsWith('stat_') ? 'number' : 'text'}
                    value={settings[key] ?? ''}
                    onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))}
                    style={inp}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const lbl: React.CSSProperties = { display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' };
const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '6px', fontSize: '14px', color: '#FFFFFF', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', outline: 'none' };

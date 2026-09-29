'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
interface Program { id: string; title: string; tag: string; status: string; audience: string; duration: string; mode: string; startDate: string; fee: string; certificate: string; outcome: string; order: number; isActive: boolean; }
const empty = (): Partial<Program> => ({ title: '', tag: 'Internship', status: 'live', audience: '', duration: '', mode: 'Hybrid', startDate: '', fee: '', certificate: 'Yes', outcome: '', order: 0, isActive: true });

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  live:     { bg: 'rgba(47, 212, 160, 0.15)', color: '#2FD4A0', border: '1px solid rgba(47, 212, 160, 0.35)' },
  upcoming: { bg: 'rgba(235, 103, 14, 0.15)', color: '#eb670e', border: '1px solid rgba(235, 103, 14, 0.35)' },
};

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [editing, setEditing] = useState<Partial<Program> | null>(null);
  const [saving, setSaving] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('inker_admin_token') : '';
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const load = () => fetch(`${API_URL}/api/cms/programs`, { headers }).then(r => r.json()).then(d => d.success && setPrograms(d.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const isNew = !editing.id;
    await fetch(`${API_URL}/api/cms/programs${isNew ? '' : `/${editing.id}`}`, {
      method: isNew ? 'POST' : 'PATCH',
      headers,
      body: JSON.stringify({ ...editing, order: Number(editing.order ?? 0), isActive: Boolean(editing.isActive) }),
    });
    await load();
    setEditing(null);
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this program?')) return;
    await fetch(`${API_URL}/api/cms/programs/${id}`, { method: 'DELETE', headers });
    setPrograms(p => p.filter(x => x.id !== id));
  };

  const tf = (label: string, key: keyof Program) => (
    <div key={key}>
      <label style={lbl}>{label}</label>
      <input value={String(editing?.[key] ?? '')} onChange={e => setEditing(p => ({ ...p, [key]: e.target.value }))} style={inp} />
    </div>
  );

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <div style={{ fontSize: '11px', letterSpacing: '0.18em', color: '#eb670e', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            Academic & Training
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
            EduTech Programs
          </h1>
        </div>
        <button onClick={() => setEditing(empty())} style={btnPrimary}>+ Add Program</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {programs.map(p => (
          <div key={p.id} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ ...STATUS_COLORS[p.status], padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                  {p.status === 'live' ? '● Live' : '▲ Upcoming'}
                </span>
                <span style={{ background: 'rgba(42, 53, 130, 0.25)', color: '#98a5ff', border: '1px solid rgba(42, 53, 130, 0.45)', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                  {p.tag}
                </span>
              </div>
              {!p.isActive && <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.40)', background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: '4px' }}>Hidden</span>}
            </div>
            <h4 style={{ margin: '0 0 14px', fontSize: '17px', color: '#FFFFFF', fontWeight: 700 }}>{p.title}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
              {[['Audience', p.audience], ['Duration', p.duration], ['Mode', p.mode], ['Fee', p.fee]].map(([k, v]) => (
                <div key={k} style={{ fontSize: '12.5px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>{k}: </span>
                  <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.60)', margin: '0 0 16px', lineHeight: 1.5 }}>{p.outcome}</p>
            <div style={{ display: 'flex', gap: '8px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button onClick={() => setEditing(p)} style={btnSm}>Edit</button>
              <button onClick={() => remove(p.id)} style={{ ...btnSm, color: '#ff4d4f', borderColor: 'rgba(255,77,79,0.35)' }}>Delete</button>
            </div>
          </div>
        ))}
        {programs.length === 0 && <div style={{ color: 'rgba(255,255,255,0.50)', gridColumn: '1/-1', padding: '40px', textAlign: 'center' }}>No programs yet. Add one above.</div>}
      </div>

      {editing && (
        <div style={overlay}>
          <div style={modal}>
            <h2 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>{editing.id ? 'Edit' : 'Add'} Program</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {tf('Title *', 'title')}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={lbl}>Program Tag</label>
                  <select value={editing.tag ?? 'Internship'} onChange={e => setEditing(p => ({ ...p, tag: e.target.value }))} style={{ ...inp, background: '#0D101C' }}>
                    {['Internship', 'FDP', 'Cohort', 'IEEE Track', 'Workshop', 'Add-On Course'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Status</label>
                  <select value={editing.status ?? 'live'} onChange={e => setEditing(p => ({ ...p, status: e.target.value }))} style={{ ...inp, background: '#0D101C' }}>
                    <option value="live">Live</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>
              </div>
              {tf('Target Audience', 'audience')}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {tf('Duration', 'duration')}
                <div>
                  <label style={lbl}>Delivery Mode</label>
                  <select value={editing.mode ?? 'Hybrid'} onChange={e => setEditing(p => ({ ...p, mode: e.target.value }))} style={{ ...inp, background: '#0D101C' }}>
                    {['Online', 'Offline', 'Hybrid'].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {tf('Start Date', 'startDate')}
                {tf('Fee / Cost', 'fee')}
              </div>
              {tf('Certification Included', 'certificate')}
              <div>
                <label style={lbl}>Outcome / Key Learnings</label>
                <textarea value={editing.outcome ?? ''} onChange={e => setEditing(p => ({ ...p, outcome: e.target.value }))} rows={3} style={{ ...inp, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label style={lbl}>Display Order</label>
                  <input type="number" value={editing.order ?? 0} onChange={e => setEditing(p => ({ ...p, order: Number(e.target.value) }))} style={inp} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '18px' }}>
                  <input type="checkbox" id="isActive" checked={Boolean(editing.isActive)} onChange={e => setEditing(p => ({ ...p, isActive: e.target.checked }))} style={{ accentColor: '#eb670e' }} />
                  <label htmlFor="isActive" style={{ fontSize: '14px', color: '#FFFFFF', cursor: 'pointer', fontWeight: 500 }}>Show on website</label>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '28px' }}>
              <button onClick={save} disabled={saving} style={btnPrimary}>{saving ? 'Saving…' : 'Save Program'}</button>
              <button onClick={() => setEditing(null)} style={btnGhost}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const lbl: React.CSSProperties = { display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' };
const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '6px', fontSize: '14px', color: '#FFFFFF', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', outline: 'none' };
const card: React.CSSProperties = { background: 'rgba(15, 18, 28, 0.70)', backdropFilter: 'blur(10px)', borderRadius: '10px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' };
const btnPrimary: React.CSSProperties = { background: 'linear-gradient(135deg, #eb670e 0%, #ff7315 100%)', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '11px 22px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(235, 103, 14, 0.35)' };
const btnGhost: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', padding: '11px 20px', fontSize: '13.5px', cursor: 'pointer', fontWeight: 600 };
const btnSm: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '5px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 };
const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(2, 3, 6, 0.80)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' };
const modal: React.CSSProperties = { background: '#0D101C', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '36px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 30px rgba(235,103,14,0.1)' };

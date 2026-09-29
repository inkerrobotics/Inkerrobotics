'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
interface Program { id: string; title: string; tag: string; status: string; audience: string; duration: string; mode: string; startDate: string; fee: string; certificate: string; outcome: string; order: number; isActive: boolean; }
const empty = (): Partial<Program> => ({ title: '', tag: 'Internship', status: 'live', audience: '', duration: '', mode: 'Hybrid', startDate: '', fee: '', certificate: 'Yes', outcome: '', order: 0, isActive: true });

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  live:     { bg: 'rgba(47,212,160,0.12)', color: '#2FD4A0' },
  upcoming: { bg: 'rgba(125,57,235,0.12)', color: '#7D39EB' },
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
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 4px' }}>EduTech Programs</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', margin: 0 }}>These appear on the /edutech page</p>
        </div>
        <button onClick={() => setEditing(empty())} style={btnPrimary}>+ Add Program</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {programs.map(p => (
          <div key={p.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '7px', padding: '22px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span style={{ ...STATUS_COLORS[p.status], padding: '2px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700 }}>{p.status === 'live' ? '● Live' : '▲ Upcoming'}</span>
                <span style={{ marginLeft: '8px', background: 'rgba(125,57,235,0.08)', color: '#9B63F2', padding: '2px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 600 }}>{p.tag}</span>
              </div>
              {!p.isActive && <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', background: 'rgba(255,255,255,0.03)', padding: '2px 8px', borderRadius: '3px' }}>Hidden</span>}
            </div>
            <h4 style={{ margin: '0 0 12px', fontSize: '15px', color: '#FFFFFF', fontWeight: 700 }}>{p.title}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '12px' }}>
              {[['Audience', p.audience], ['Duration', p.duration], ['Mode', p.mode], ['Fee', p.fee]].map(([k, v]) => (
                <div key={k} style={{ fontSize: '12px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.38)', fontWeight: 600 }}>{k}: </span>
                  <span style={{ color: '#FFFFFF' }}>{v}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', margin: '0 0 14px', lineHeight: 1.5 }}>{p.outcome}</p>
            <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button onClick={() => setEditing(p)} style={btnSm}>Edit</button>
              <button onClick={() => remove(p.id)} style={{ ...btnSm, color: '#FF5B6E', borderColor: 'rgba(255,91,110,0.3)' }}>Delete</button>
            </div>
          </div>
        ))}
        {programs.length === 0 && <div style={{ color: 'rgba(255,255,255,0.55)', gridColumn: '1/-1', padding: '40px', textAlign: 'center' }}>No programs yet.</div>}
      </div>

      {editing && (
        <div style={overlay}>
          <div style={modal}>
            <h2 style={{ margin: '0 0 24px', fontSize: '18px', color: '#FFFFFF' }}>{editing.id ? 'Edit' : 'Add'} Program</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {tf('Title *', 'title')}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={lbl}>Tag</label>
                  <select value={editing.tag ?? 'Internship'} onChange={e => setEditing(p => ({ ...p, tag: e.target.value }))} style={inp}>
                    {['Internship', 'FDP', 'Cohort', 'IEEE Track', 'Workshop', 'Add-On Course'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Status</label>
                  <select value={editing.status ?? 'live'} onChange={e => setEditing(p => ({ ...p, status: e.target.value }))} style={inp}>
                    <option value="live">Live</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>
              </div>
              {tf('Audience', 'audience')}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {tf('Duration', 'duration')}
                <div>
                  <label style={lbl}>Mode</label>
                  <select value={editing.mode ?? 'Hybrid'} onChange={e => setEditing(p => ({ ...p, mode: e.target.value }))} style={inp}>
                    {['Online', 'Offline', 'Hybrid'].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {tf('Start Date', 'startDate')}
                {tf('Fee', 'fee')}
              </div>
              {tf('Certificate', 'certificate')}
              <div>
                <label style={lbl}>Outcome / Description</label>
                <textarea value={editing.outcome ?? ''} onChange={e => setEditing(p => ({ ...p, outcome: e.target.value }))} rows={3} style={{ ...inp, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label style={lbl}>Order</label>
                  <input type="number" value={editing.order ?? 0} onChange={e => setEditing(p => ({ ...p, order: Number(e.target.value) }))} style={inp} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '18px' }}>
                  <input type="checkbox" id="isActive" checked={Boolean(editing.isActive)} onChange={e => setEditing(p => ({ ...p, isActive: e.target.checked }))} />
                  <label htmlFor="isActive" style={{ fontSize: '14px', color: '#FFFFFF' }}>Show on site</label>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button onClick={save} disabled={saving} style={btnPrimary}>{saving ? 'Saving…' : 'Save'}</button>
              <button onClick={() => setEditing(null)} style={btnGhost}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const lbl: React.CSSProperties = { display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.07em', fontWeight: 600, marginBottom: '5px' };
const inp: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '4px', fontSize: '14px', color: '#FFFFFF', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)' };
const btnPrimary: React.CSSProperties = { background: '#7D39EB', color: 'rgba(255,255,255,0.04)', border: 'none', borderRadius: '4px', padding: '10px 20px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' };
const btnGhost: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '4px', padding: '10px 20px', fontSize: '13.5px', cursor: 'pointer' };
const btnSm: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', color: '#9B63F2', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '4px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer' };
const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 };
const modal: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '36px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' };

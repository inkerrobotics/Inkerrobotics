'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
interface Leader { id: string; name: string; role: string; bio?: string; linkedin?: string; imageUrl?: string; order: number; }
const empty = (): Partial<Leader> => ({ name: '', role: '', bio: '', linkedin: '', imageUrl: '', order: 0 });

export default function LeadersPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [editing, setEditing] = useState<Partial<Leader> | null>(null);
  const [saving, setSaving] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('inker_admin_token') : '';
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const load = () => fetch(`${API_URL}/api/cms/leaders`, { headers }).then(r => r.json()).then(d => d.success && setLeaders(d.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const isNew = !editing.id;
    await fetch(`${API_URL}/api/cms/leaders${isNew ? '' : `/${editing.id}`}`, {
      method: isNew ? 'POST' : 'PATCH',
      headers,
      body: JSON.stringify({ ...editing, order: Number(editing.order ?? 0) }),
    });
    await load();
    setEditing(null);
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this team member?')) return;
    await fetch(`${API_URL}/api/cms/leaders/${id}`, { method: 'DELETE', headers });
    setLeaders(l => l.filter(x => x.id !== id));
  };

  const field = (label: string, key: keyof Leader, type = 'text') => (
    <div key={key}>
      <label style={lbl}>{label}</label>
      <input type={type} value={String(editing?.[key] ?? '')} onChange={e => setEditing(p => ({ ...p, [key]: e.target.value }))} style={inp} />
    </div>
  );

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <div style={{ fontSize: '11px', letterSpacing: '0.18em', color: '#eb670e', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            People & Culture
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
            Team & Leadership
          </h1>
        </div>
        <button onClick={() => setEditing(empty())} style={btnPrimary}>+ Add Team Member</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {leaders.map(l => (
          <div key={l.id} style={card}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {l.imageUrl ? <img src={l.imageUrl} alt={l.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '24px' }}>👤</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '16px' }}>{l.name}</div>
                <div style={{ color: '#eb670e', fontSize: '12.5px', fontWeight: 600, marginTop: '2px' }}>{l.role}</div>
                {l.bio && <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.60)', margin: '8px 0 0', lineHeight: 1.5 }}>{l.bio}</p>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button onClick={() => setEditing(l)} style={btnSm}>Edit</button>
              <button onClick={() => remove(l.id)} style={{ ...btnSm, color: '#ff4d4f', borderColor: 'rgba(255,77,79,0.35)' }}>Delete</button>
            </div>
          </div>
        ))}
        {leaders.length === 0 && <div style={{ color: 'rgba(255,255,255,0.50)', gridColumn: '1/-1', padding: '40px', textAlign: 'center' }}>No team members yet — add one above.</div>}
      </div>

      {/* Modal */}
      {editing && (
        <div style={overlay}>
          <div style={modal}>
            <h2 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>{editing.id ? 'Edit' : 'Add'} Team Member</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {field('Name *', 'name')}
              {field('Role / Title *', 'role')}
              <div>
                <label style={lbl}>Bio</label>
                <textarea value={editing.bio ?? ''} onChange={e => setEditing(p => ({ ...p, bio: e.target.value }))} rows={3} style={{ ...inp, resize: 'vertical' }} />
              </div>
              {field('LinkedIn URL', 'linkedin')}
              {field('Photo URL (from Media Library)', 'imageUrl')}
              {field('Display Order', 'order', 'number')}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '28px' }}>
              <button onClick={save} disabled={saving} style={btnPrimary}>{saving ? 'Saving…' : 'Save Member'}</button>
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
const modal: React.CSSProperties = { background: '#0D101C', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '36px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 30px rgba(235,103,14,0.1)' };

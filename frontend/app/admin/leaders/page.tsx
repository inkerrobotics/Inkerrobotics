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
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>Team / Leadership</h1>
        <button onClick={() => setEditing(empty())} style={btnPrimary}>+ Add Member</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {leaders.map(l => (
          <div key={l.id} style={card}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {l.imageUrl ? <img src={l.imageUrl} alt={l.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '22px' }}>👤</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '15px' }}>{l.name}</div>
                <div style={{ color: '#7D39EB', fontSize: '12px', fontWeight: 600, marginTop: '2px' }}>{l.role}</div>
                {l.bio && <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', margin: '8px 0 0', lineHeight: 1.5 }}>{l.bio}</p>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button onClick={() => setEditing(l)} style={btnSm}>Edit</button>
              <button onClick={() => remove(l.id)} style={{ ...btnSm, color: '#FF5B6E', borderColor: 'rgba(255,91,110,0.3)' }}>Delete</button>
            </div>
          </div>
        ))}
        {leaders.length === 0 && <div style={{ color: 'rgba(255,255,255,0.55)', gridColumn: '1/-1', padding: '40px', textAlign: 'center' }}>No team members yet — add one above.</div>}
      </div>

      {/* Modal */}
      {editing && (
        <div style={overlay}>
          <div style={modal}>
            <h2 style={{ margin: '0 0 24px', fontSize: '18px', color: '#FFFFFF' }}>{editing.id ? 'Edit' : 'Add'} Team Member</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
const card: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', borderRadius: '7px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' };
const btnPrimary: React.CSSProperties = { background: '#7D39EB', color: 'rgba(255,255,255,0.04)', border: 'none', borderRadius: '4px', padding: '10px 20px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' };
const btnGhost: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '4px', padding: '10px 20px', fontSize: '13.5px', cursor: 'pointer' };
const btnSm: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', color: '#9B63F2', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '4px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer' };
const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 };
const modal: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '36px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' };

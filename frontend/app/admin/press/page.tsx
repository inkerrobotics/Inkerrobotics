'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
interface PressItem { id: string; publication: string; headline: string; date: string; kind: string; isVideo: boolean; imageUrl?: string; linkUrl?: string; page: string; order: number; }
const empty = (): Partial<PressItem> => ({ publication: '', headline: '', date: '', kind: 'Newspaper Feature', isVideo: false, imageUrl: '', linkUrl: '', page: 'home', order: 0 });

const PAGES = ['home', 'about', 'robotics', 'edutech', 'roboparks', 'ai-solutions'];
const KINDS = ['Newspaper Feature', 'Online Feature', 'Cover Feature', 'Television Segment · Video', 'Documentary · Video', 'News Segment · Video', 'Founder Interview · Video', 'Student Story · Video'];

export default function PressPage() {
  const [items, setItems] = useState<PressItem[]>([]);
  const [editing, setEditing] = useState<Partial<PressItem> | null>(null);
  const [filterPage, setFilterPage] = useState('');
  const [saving, setSaving] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('inker_admin_token') : '';
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const load = () => fetch(`${API_URL}/api/cms/press${filterPage ? `?page=${filterPage}` : ''}`, { headers }).then(r => r.json()).then(d => d.success && setItems(d.data));
  useEffect(() => { load(); }, [filterPage]);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const isNew = !editing.id;
    await fetch(`${API_URL}/api/cms/press${isNew ? '' : `/${editing.id}`}`, {
      method: isNew ? 'POST' : 'PATCH',
      headers,
      body: JSON.stringify({ ...editing, order: Number(editing.order ?? 0), isVideo: Boolean(editing.isVideo) }),
    });
    await load();
    setEditing(null);
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this press item?')) return;
    await fetch(`${API_URL}/api/cms/press/${id}`, { method: 'DELETE', headers });
    setItems(i => i.filter(x => x.id !== id));
  };

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>Press / Media Items</h1>
        <button onClick={() => setEditing(empty())} style={btnPrimary}>+ Add Press Item</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['', ...PAGES].map(p => (
          <button key={p} onClick={() => setFilterPage(p)} style={{ padding: '6px 14px', borderRadius: '4px', border: '1px solid', fontSize: '12px', cursor: 'pointer', background: filterPage === p ? '#7D39EB' : 'rgba(255,255,255,0.04)', color: filterPage === p ? '#fff' : 'rgba(255,255,255,0.55)', borderColor: filterPage === p ? '#7D39EB' : 'rgba(255,255,255,0.10)' }}>
            {p === '' ? 'All Pages' : p}
          </button>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
              {['Publication', 'Headline', 'Date', 'Kind', 'Page', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.55)', fontWeight: 600, fontSize: '11px', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.55)' }}>No press items. Add one above.</td></tr>
            ) : items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: '#FFFFFF' }}>{item.publication}</td>
                <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.55)', maxWidth: '260px' }}>{item.headline}</td>
                <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}>{item.date}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: item.isVideo ? 'rgba(125,57,235,0.1)' : 'rgba(125,57,235,0.1)', color: item.isVideo ? '#9B63F2' : '#7D39EB', padding: '2px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 600 }}>
                    {item.isVideo ? '▶ Video' : '📰 Print'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.55)' }}>{item.page}</td>
                <td style={{ padding: '12px 16px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => setEditing(item)} style={btnSm}>Edit</button>
                  <button onClick={() => remove(item.id)} style={{ ...btnSm, color: '#FF5B6E', borderColor: 'rgba(255,91,110,0.3)' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div style={overlay}>
          <div style={modal}>
            <h2 style={{ margin: '0 0 24px', fontSize: '18px', color: '#FFFFFF' }}>{editing.id ? 'Edit' : 'Add'} Press Item</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(['publication', 'headline', 'date'] as const).map(k => (
                <div key={k}>
                  <label style={lbl}>{k.charAt(0).toUpperCase() + k.slice(1)} *</label>
                  <input value={String(editing[k] ?? '')} onChange={e => setEditing(p => ({ ...p, [k]: e.target.value }))} style={inp} />
                </div>
              ))}
              <div>
                <label style={lbl}>Kind</label>
                <select value={editing.kind ?? 'Newspaper Feature'} onChange={e => setEditing(p => ({ ...p, kind: e.target.value }))} style={inp}>
                  {KINDS.map(k => <option key={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Page</label>
                <select value={editing.page ?? 'home'} onChange={e => setEditing(p => ({ ...p, page: e.target.value }))} style={inp}>
                  {PAGES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Image URL (from Media Library)</label>
                <input value={editing.imageUrl ?? ''} onChange={e => setEditing(p => ({ ...p, imageUrl: e.target.value }))} style={inp} placeholder="https://…" />
              </div>
              <div>
                <label style={lbl}>Link URL (optional)</label>
                <input value={editing.linkUrl ?? ''} onChange={e => setEditing(p => ({ ...p, linkUrl: e.target.value }))} style={inp} placeholder="https://…" />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={lbl}>Display Order</label>
                  <input type="number" value={editing.order ?? 0} onChange={e => setEditing(p => ({ ...p, order: Number(e.target.value) }))} style={inp} />
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '18px' }}>
                  <input type="checkbox" id="isVideo" checked={Boolean(editing.isVideo)} onChange={e => setEditing(p => ({ ...p, isVideo: e.target.checked }))} />
                  <label htmlFor="isVideo" style={{ fontSize: '14px', color: '#FFFFFF' }}>Is Video</label>
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
const modal: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '36px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' };

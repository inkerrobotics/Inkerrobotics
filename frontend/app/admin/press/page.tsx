'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
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
    <div style={{ padding: '40px 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ fontSize: '11px', letterSpacing: '0.18em', color: '#eb670e', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            Media Coverage
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
            Press & Media Items
          </h1>
        </div>
        <button onClick={() => setEditing(empty())} style={btnPrimary}>+ Add Press Item</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['', ...PAGES].map(p => {
          const active = filterPage === p;
          return (
            <button
              key={p}
              onClick={() => setFilterPage(p)}
              style={{
                padding: '7px 16px',
                borderRadius: '6px',
                border: active ? '1px solid #eb670e' : '1px solid rgba(255,255,255,0.10)',
                fontSize: '12.5px',
                fontWeight: active ? 700 : 500,
                cursor: 'pointer',
                background: active ? 'linear-gradient(135deg, #eb670e 0%, #ff7315 100%)' : 'rgba(255,255,255,0.04)',
                color: active ? '#FFFFFF' : 'rgba(255,255,255,0.65)',
                boxShadow: active ? '0 4px 14px rgba(235, 103, 14, 0.35)' : 'none',
              }}
            >
              {p === '' ? 'All Pages' : p.toUpperCase()}
            </button>
          );
        })}
      </div>

      <div style={{ background: 'rgba(15, 18, 28, 0.70)', backdropFilter: 'blur(12px)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
              {['Publication', 'Headline', 'Date', 'Kind', 'Page', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 18px', textAlign: 'left', color: 'rgba(255,255,255,0.60)', fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.45)' }}>No press items found. Add one above.</td></tr>
            ) : items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <td style={{ padding: '14px 18px', fontWeight: 600, color: '#FFFFFF' }}>{item.publication}</td>
                <td style={{ padding: '14px 18px', color: 'rgba(255,255,255,0.65)', maxWidth: '280px' }}>{item.headline}</td>
                <td style={{ padding: '14px 18px', color: 'rgba(255,255,255,0.50)', whiteSpace: 'nowrap' }}>{item.date}</td>
                <td style={{ padding: '14px 18px' }}>
                  <span style={{
                    background: item.isVideo ? 'rgba(235, 103, 14, 0.15)' : 'rgba(42, 53, 130, 0.25)',
                    color: item.isVideo ? '#eb670e' : '#98a5ff',
                    border: item.isVideo ? '1px solid rgba(235, 103, 14, 0.35)' : '1px solid rgba(42, 53, 130, 0.45)',
                    padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                  }}>
                    {item.isVideo ? '▶ Video' : '📰 Print'}
                  </span>
                </td>
                <td style={{ padding: '14px 18px', color: 'rgba(255,255,255,0.50)', textTransform: 'capitalize' }}>{item.page}</td>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setEditing(item)} style={btnSm}>Edit</button>
                    <button onClick={() => remove(item.id)} style={{ ...btnSm, color: '#ff4d4f', borderColor: 'rgba(255,77,79,0.35)' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {editing && (
        <div style={overlay}>
          <div style={modal}>
            <h2 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>{editing.id ? 'Edit' : 'Add'} Press Item</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={lbl}>Publication Name *</label>
                <input value={editing.publication ?? ''} onChange={e => setEditing(p => ({ ...p, publication: e.target.value }))} style={inp} placeholder="e.g. The Hindu, Manorama" />
              </div>
              <div>
                <label style={lbl}>Headline *</label>
                <input value={editing.headline ?? ''} onChange={e => setEditing(p => ({ ...p, headline: e.target.value }))} style={inp} placeholder="Article headline" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={lbl}>Date *</label>
                  <input value={editing.date ?? ''} onChange={e => setEditing(p => ({ ...p, date: e.target.value }))} style={inp} placeholder="e.g. Oct 2024" />
                </div>
                <div>
                  <label style={lbl}>Target Page</label>
                  <select value={editing.page ?? 'home'} onChange={e => setEditing(p => ({ ...p, page: e.target.value }))} style={{ ...inp, background: '#0D101C' }}>
                    {PAGES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={lbl}>Content Kind</label>
                <select value={editing.kind ?? KINDS[0]} onChange={e => setEditing(p => ({ ...p, kind: e.target.value }))} style={{ ...inp, background: '#0D101C' }}>
                  {KINDS.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Image / Thumbnail URL</label>
                <input value={editing.imageUrl ?? ''} onChange={e => setEditing(p => ({ ...p, imageUrl: e.target.value }))} style={inp} placeholder="Paste from Media Library" />
              </div>
              <div>
                <label style={lbl}>External Article / Video Link</label>
                <input value={editing.linkUrl ?? ''} onChange={e => setEditing(p => ({ ...p, linkUrl: e.target.value }))} style={inp} placeholder="https://…" />
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label style={lbl}>Display Order</label>
                  <input type="number" value={editing.order ?? 0} onChange={e => setEditing(p => ({ ...p, order: Number(e.target.value) }))} style={inp} />
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '18px' }}>
                  <input type="checkbox" id="isVideo" checked={Boolean(editing.isVideo)} onChange={e => setEditing(p => ({ ...p, isVideo: e.target.checked }))} style={{ accentColor: '#eb670e' }} />
                  <label htmlFor="isVideo" style={{ fontSize: '14px', color: '#FFFFFF', cursor: 'pointer', fontWeight: 500 }}>Is Video Item</label>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '28px' }}>
              <button onClick={save} disabled={saving} style={btnPrimary}>{saving ? 'Saving…' : 'Save Item'}</button>
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
const btnPrimary: React.CSSProperties = { background: 'linear-gradient(135deg, #eb670e 0%, #ff7315 100%)', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '11px 22px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(235, 103, 14, 0.35)' };
const btnGhost: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', padding: '11px 20px', fontSize: '13.5px', cursor: 'pointer', fontWeight: 600 };
const btnSm: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '5px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 };
const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(2, 3, 6, 0.80)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' };
const modal: React.CSSProperties = { background: '#0D101C', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '36px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 30px rgba(235,103,14,0.1)' };

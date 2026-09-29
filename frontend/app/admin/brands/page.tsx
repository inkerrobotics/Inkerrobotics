'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

const PAGES = ['all', 'robotics', 'ai-solutions', 'roboparks', 'edutech'];

interface Brand { id: string; name: string; logoUrl?: string; page: string; order: number; isActive: boolean; }
const empty = (): Partial<Brand> => ({ name: '', logoUrl: '', page: 'all', order: 0, isActive: true });

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [editing, setEditing] = useState<Partial<Brand> | null>(null);
  const [filterPage, setFilterPage] = useState('');
  const [saving, setSaving] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('inker_admin_token') : '';
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const load = () =>
    fetch(`${API_URL}/api/cms/brands${filterPage ? `?page=${filterPage}` : ''}`, { headers })
      .then(r => r.json())
      .then(d => d.success && setBrands(d.data));

  useEffect(() => { load(); }, [filterPage]);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const isNew = !editing.id;
    await fetch(`${API_URL}/api/cms/brands${isNew ? '' : `/${editing.id}`}`, {
      method: isNew ? 'POST' : 'PATCH',
      headers,
      body: JSON.stringify({ ...editing, order: Number(editing.order ?? 0), isActive: Boolean(editing.isActive) }),
    });
    await load();
    setEditing(null);
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this brand?')) return;
    await fetch(`${API_URL}/api/cms/brands/${id}`, { method: 'DELETE', headers });
    setBrands(b => b.filter(x => x.id !== id));
  };

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 4px' }}>Trusted By Brands</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', margin: 0 }}>Logos and names shown on Robotics, AI Solutions, RoboParks &amp; EduTech pages</p>
        </div>
        <button onClick={() => setEditing(empty())} style={btnPrimary}>+ Add Brand</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['', ...PAGES].map(p => (
          <button key={p} onClick={() => setFilterPage(p)} style={{ padding: '6px 14px', borderRadius: '4px', border: '1px solid', fontSize: '12px', cursor: 'pointer', background: filterPage === p ? '#7D39EB' : 'rgba(255,255,255,0.04)', color: filterPage === p ? '#fff' : 'rgba(255,255,255,0.55)', borderColor: filterPage === p ? '#7D39EB' : 'rgba(255,255,255,0.10)' }}>
            {p === '' ? 'All' : p}
          </button>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '7px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
              {['Logo', 'Name', 'Page', 'Order', 'Active', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.55)', fontWeight: 600, fontSize: '11px', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {brands.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.55)' }}>No brands yet. Add one above.</td></tr>
            ) : brands.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <td style={{ padding: '10px 16px' }}>
                  {b.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.logoUrl} alt={b.name} style={{ height: '32px', maxWidth: '80px', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: '11px' }}>No logo</span>
                  )}
                </td>
                <td style={{ padding: '10px 16px', fontWeight: 600, color: '#FFFFFF' }}>{b.name}</td>
                <td style={{ padding: '10px 16px' }}>
                  <span style={{ background: 'rgba(125,57,235,0.08)', color: '#9B63F2', padding: '2px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 600 }}>{b.page}</span>
                </td>
                <td style={{ padding: '10px 16px', color: 'rgba(255,255,255,0.55)' }}>{b.order}</td>
                <td style={{ padding: '10px 16px' }}>
                  <span style={{ color: b.isActive ? '#2FD4A0' : 'rgba(255,255,255,0.38)', fontWeight: 600, fontSize: '12px' }}>{b.isActive ? 'Yes' : 'No'}</span>
                </td>
                <td style={{ padding: '10px 16px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => setEditing(b)} style={btnSm}>Edit</button>
                  <button onClick={() => remove(b.id)} style={{ ...btnSm, color: '#FF5B6E', borderColor: 'rgba(255,91,110,0.3)' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div style={overlay}>
          <div style={modal}>
            <h2 style={{ margin: '0 0 24px', fontSize: '18px', color: '#FFFFFF' }}>{editing.id ? 'Edit' : 'Add'} Brand</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={lbl}>Brand / Institution Name *</label>
                <input value={editing.name ?? ''} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))} style={inp} placeholder="e.g. Federal Bank" />
              </div>
              <div>
                <label style={lbl}>Logo URL (from Media Library)</label>
                <input value={editing.logoUrl ?? ''} onChange={e => setEditing(p => ({ ...p, logoUrl: e.target.value }))} style={inp} placeholder="https://…" />
                {editing.logoUrl && (
                  <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', display: 'inline-block' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={editing.logoUrl} alt="preview" style={{ maxHeight: '40px', maxWidth: '140px', objectFit: 'contain' }} />
                  </div>
                )}
              </div>
              <div>
                <label style={lbl}>Page</label>
                <select value={editing.page ?? 'all'} onChange={e => setEditing(p => ({ ...p, page: e.target.value }))} style={inp}>
                  {PAGES.map(p => <option key={p} value={p}>{p === 'all' ? 'All Pages' : p}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label style={lbl}>Display Order</label>
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
const modal: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '36px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' };

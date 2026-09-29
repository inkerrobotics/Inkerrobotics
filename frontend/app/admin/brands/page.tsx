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
    <div style={{ padding: '40px 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ fontSize: '11px', letterSpacing: '0.18em', color: '#eb670e', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            Partnerships
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
            Trusted By Brands
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13.5px', margin: '4px 0 0' }}>Logos shown on Robotics, AI Solutions, RoboParks &amp; EduTech pages</p>
        </div>
        <button onClick={() => setEditing(empty())} style={btnPrimary}>+ Add Brand</button>
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
              {['Logo', 'Brand Name', 'Assigned Page', 'Display Order', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 18px', textAlign: 'left', color: 'rgba(255,255,255,0.60)', fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {brands.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.45)' }}>No brands found. Add one above.</td></tr>
            ) : brands.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <td style={{ padding: '12px 18px' }}>
                  {b.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.logoUrl} alt={b.name} style={{ height: '32px', maxWidth: '90px', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ color: 'rgba(255,255,255,0.40)', fontSize: '11.5px' }}>No logo</span>
                  )}
                </td>
                <td style={{ padding: '12px 18px', fontWeight: 600, color: '#FFFFFF' }}>{b.name}</td>
                <td style={{ padding: '12px 18px' }}>
                  <span style={{ background: 'rgba(42, 53, 130, 0.25)', color: '#98a5ff', border: '1px solid rgba(42, 53, 130, 0.45)', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                    {b.page}
                  </span>
                </td>
                <td style={{ padding: '12px 18px', color: 'rgba(255,255,255,0.50)' }}>{b.order}</td>
                <td style={{ padding: '12px 18px' }}>
                  <span style={{ color: b.isActive ? '#2FD4A0' : 'rgba(255,255,255,0.40)', fontWeight: 700, fontSize: '12px' }}>
                    {b.isActive ? '● Active' : '○ Hidden'}
                  </span>
                </td>
                <td style={{ padding: '12px 18px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setEditing(b)} style={btnSm}>Edit</button>
                    <button onClick={() => remove(b.id)} style={{ ...btnSm, color: '#ff4d4f', borderColor: 'rgba(255,77,79,0.35)' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div style={overlay}>
          <div style={modal}>
            <h2 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>{editing.id ? 'Edit' : 'Add'} Brand</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={lbl}>Brand / Organization Name *</label>
                <input value={editing.name ?? ''} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))} style={inp} placeholder="e.g. Federal Bank, Kerala Police" />
              </div>
              <div>
                <label style={lbl}>Logo URL (from Media Library)</label>
                <input value={editing.logoUrl ?? ''} onChange={e => setEditing(p => ({ ...p, logoUrl: e.target.value }))} style={inp} placeholder="Paste image URL here" />
                {editing.logoUrl && (
                  <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', display: 'inline-block' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={editing.logoUrl} alt="preview" style={{ maxHeight: '40px', maxWidth: '140px', objectFit: 'contain' }} />
                  </div>
                )}
              </div>
              <div>
                <label style={lbl}>Assigned Page</label>
                <select value={editing.page ?? 'all'} onChange={e => setEditing(p => ({ ...p, page: e.target.value }))} style={{ ...inp, background: '#0D101C' }}>
                  {PAGES.map(p => <option key={p} value={p}>{p === 'all' ? 'All Pages' : p.toUpperCase()}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label style={lbl}>Display Order</label>
                  <input type="number" value={editing.order ?? 0} onChange={e => setEditing(p => ({ ...p, order: Number(e.target.value) }))} style={inp} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '18px' }}>
                  <input type="checkbox" id="isActive" checked={Boolean(editing.isActive)} onChange={e => setEditing(p => ({ ...p, isActive: e.target.checked }))} style={{ accentColor: '#eb670e' }} />
                  <label htmlFor="isActive" style={{ fontSize: '14px', color: '#FFFFFF', cursor: 'pointer', fontWeight: 500 }}>Active on site</label>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '28px' }}>
              <button onClick={save} disabled={saving} style={btnPrimary}>{saving ? 'Saving…' : 'Save Brand'}</button>
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

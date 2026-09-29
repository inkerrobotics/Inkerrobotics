'use client';

import { useEffect, useRef, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

interface Asset { id: string; name: string; url: string; mimeType: string; size: number; createdAt: string; }

function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function MediaPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);
  const [copied, setCopied] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('inker_admin_token') : '';
  const headers = { Authorization: `Bearer ${token}` };

  const load = () =>
    fetch(`${API_URL}/api/cms/media`, { headers }).then(r => r.json()).then(d => d.success && setAssets(d.data));

  useEffect(() => { load(); }, []);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      await fetch(`${API_URL}/api/cms/media`, { method: 'POST', headers, body: fd });
    }
    await load();
    setUploading(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this image permanently?')) return;
    await fetch(`${API_URL}/api/cms/media/${id}`, { method: 'DELETE', headers });
    setAssets(a => a.filter(x => x.id !== id));
  };

  const copy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 4px' }}>Media Library</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', margin: 0 }}>{assets.length} file{assets.length !== 1 ? 's' : ''} — click any image to copy its URL</p>
        </div>
        <button onClick={() => inputRef.current?.click()} disabled={uploading} style={{ background: '#7D39EB', color: 'rgba(255,255,255,0.04)', border: 'none', borderRadius: '5px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
          {uploading ? 'Uploading…' : '+ Upload Images'}
        </button>
        <input ref={inputRef} type="file" multiple accept="image/*,video/*" style={{ display: 'none' }} onChange={e => upload(e.target.files)} />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        style={{ border: `2px dashed ${drag ? '#7D39EB' : 'rgba(255,255,255,0.14)'}`, borderRadius: '8px', padding: '32px', textAlign: 'center', marginBottom: '32px', cursor: 'pointer', background: drag ? 'rgba(125,57,235,0.04)' : 'rgba(255,255,255,0.04)', transition: 'all 150ms' }}
      >
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px' }}>Drag & drop images here, or click to browse</div>
        <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: '12px', marginTop: '4px' }}>JPG, PNG, WebP, SVG, MP4 — max 10 MB each</div>
      </div>

      {/* Grid */}
      {assets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.55)' }}>No files uploaded yet.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
          {assets.map(a => (
            <div key={a.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', position: 'relative', border: copied === a.url ? '2px solid #7D39EB' : '2px solid transparent' }}>
              <div style={{ height: '130px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }} onClick={() => copy(a.url)}>
                {a.mimeType.startsWith('image') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.url} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '32px' }}>🎬</span>
                )}
                {copied === a.url && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.04)', fontSize: '13px', fontWeight: 600 }}>✓ URL Copied!</div>
                )}
              </div>
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', marginTop: '2px' }}>{fmt(a.size)}</div>
              </div>
              <button onClick={() => remove(a.id)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,91,110,0.9)', border: 'none', borderRadius: '3px', color: 'rgba(255,255,255,0.04)', fontSize: '11px', padding: '3px 7px', cursor: 'pointer' }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

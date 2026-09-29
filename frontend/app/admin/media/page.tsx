'use client';

import { useEffect, useRef, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

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
    <div style={{ padding: '40px 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <div style={{ fontSize: '11px', letterSpacing: '0.18em', color: '#eb670e', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            Assets Storage
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Media Library
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', margin: 0 }}>
            {assets.length} file{assets.length !== 1 ? 's' : ''} stored — click any file to copy its direct URL
          </p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            background: 'linear-gradient(135deg, #eb670e 0%, #ff7315 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            padding: '11px 22px',
            fontSize: '13.5px',
            fontWeight: 700,
            cursor: uploading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 14px rgba(235, 103, 14, 0.35)',
            transition: 'all 0.15s ease',
          }}
        >
          {uploading ? 'Uploading…' : '+ Upload Media'}
        </button>
        <input ref={inputRef} type="file" multiple accept="image/*,video/*" style={{ display: 'none' }} onChange={e => upload(e.target.files)} />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${drag ? '#eb670e' : 'rgba(255,255,255,0.12)'}`,
          borderRadius: '10px',
          padding: '36px',
          textAlign: 'center',
          marginBottom: '36px',
          cursor: 'pointer',
          background: drag ? 'rgba(235, 103, 14, 0.08)' : 'rgba(15, 18, 28, 0.50)',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ fontSize: '36px', marginBottom: '10px' }}>📁</div>
        <div style={{ color: '#FFFFFF', fontSize: '14.5px', fontWeight: 600 }}>Drag & drop images or videos here, or click to browse</div>
        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', marginTop: '4px' }}>PNG, JPG, WebP, SVG, MP4 — up to 10 MB per file</div>
      </div>

      {/* Grid */}
      {assets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.45)' }}>No files uploaded yet.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {assets.map(a => (
            <div
              key={a.id}
              style={{
                background: 'rgba(15, 18, 28, 0.70)',
                backdropFilter: 'blur(10px)',
                borderRadius: '8px',
                overflow: 'hidden',
                border: copied === a.url ? '2px solid #eb670e' : '1px solid rgba(255,255,255,0.08)',
                boxShadow: copied === a.url ? '0 0 20px rgba(235, 103, 14, 0.3)' : '0 4px 16px rgba(0,0,0,0.3)',
                position: 'relative',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{ height: '140px', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
                onClick={() => copy(a.url)}
              >
                {a.mimeType.startsWith('image') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.url} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '36px' }}>🎬</span>
                )}
                {copied === a.url && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(4, 5, 8, 0.85)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#eb670e', fontSize: '13px', fontWeight: 700,
                  }}>
                    ✓ URL Copied!
                  </div>
                )}
              </div>
              <div style={{ padding: '12px 14px' }}>
                <div style={{ fontSize: '12.5px', color: '#FFFFFF', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>{fmt(a.size)}</span>
                  <button
                    onClick={() => remove(a.id)}
                    style={{ background: 'none', border: 'none', color: '#ff4d4f', fontSize: '11.5px', cursor: 'pointer', padding: 0, fontWeight: 500 }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

interface Brand { id: string; name: string; logoUrl?: string; }

function BrandCard({ b }: { b: Brand }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="inker-brand-card">
      {b.logoUrl && !imgFailed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={b.logoUrl}
          alt={b.name}
          className="inker-logo"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className="inker-name">{b.name}</span>
      )}
    </div>
  );
}

export default function TrustedBySection({ page }: { page: string }) {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/public/brands?page=${page}`)
      .then(r => r.json())
      .then(d => d.success && setBrands(d.data))
      .catch(() => {});
  }, [page]);

  if (brands.length === 0) return null;

  const row = [...brands, ...brands, ...brands, ...brands];
  const speed = Math.max(25, brands.length * 6);

  return (
    <section style={{ padding: '56px 0', background: '#F6F3EC', borderTop: '1px solid #EAE6DE', borderBottom: '1px solid #EAE6DE', overflow: 'hidden' }}>
      <style>{`
        @keyframes inker-ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-25%); }
        }
        .inker-ticker-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: inker-ticker ${speed}s linear infinite;
        }
        .inker-ticker-track:hover { animation-play-state: paused; }

        .inker-brand-card {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 56px;
          padding: 0 28px;
          margin: 0 8px;
          background: #fff;
          border: 1px solid #EAE6DE;
          border-radius: 10px;
          flex-shrink: 0;
          cursor: default;
          transition: border-color 220ms, box-shadow 220ms, transform 220ms;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          min-width: 120px;
        }
        .inker-brand-card:hover {
          border-color: rgba(243,112,33,0.5);
          box-shadow: 0 6px 18px rgba(243,112,33,0.12);
          transform: translateY(-2px);
        }

        .inker-logo {
          max-height: 32px;
          max-width: 110px;
          object-fit: contain;
          opacity: 0.6;
          transition: opacity 220ms;
        }
        .inker-brand-card:hover .inker-logo { opacity: 1; }

        .inker-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #0B1730;
          white-space: nowrap;
          letter-spacing: -0.01em;
        }

        .inker-ticker-fade {
          mask-image: linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%);
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <div style={{ height: '1px', width: '40px', background: 'linear-gradient(to right, transparent, #D4CEC6)' }} />
          <span style={{ fontSize: '11px', letterSpacing: '0.13em', fontWeight: 700, color: '#9AA3B0' }}>
            TRUSTED BY BRANDS &amp; INSTITUTIONS
          </span>
          <div style={{ height: '1px', width: '40px', background: 'linear-gradient(to left, transparent, #D4CEC6)' }} />
        </div>
      </div>

      <div className="inker-ticker-fade">
        <div className="inker-ticker-track">
          {row.map((b, i) => <BrandCard key={i} b={b} />)}
        </div>
      </div>
    </section>
  );
}

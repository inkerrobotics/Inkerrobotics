'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
}

/**
 * The publications Inker has appeared in, as logos.
 *
 * Logos are not hardcoded: the project already ships a Brands model, a
 * `GET /api/public/brands?page=` endpoint and an admin screen at
 * /admin/brands for uploading them. This reads from that, so marketing
 * can add or reorder a masthead without a deploy.
 *
 * Until a logo file exists for a publication, the name renders as a
 * wordmark instead — so the rail is never empty and never shows a broken
 * image. The same fallback catches a logo that 404s at runtime.
 */
const FALLBACK: Brand[] = [
  { id: 'manorama', name: 'Malayala Manorama', logoUrl: '/images/Partners/manorama.png' },
  { id: 'mathrubhumi', name: 'Mathrubhumi' },
  { id: 'flowers', name: 'Flowers TV', logoUrl: '/images/Press/flowers-tv.png' },
  { id: 'asianet', name: 'Asianet', logoUrl: '/images/Press/asianet.png' },
  { id: 'hindu', name: 'The Hindu', logoUrl: '/images/Press/the-hindu-v2.png' },
  { id: 'toi', name: 'Times of India' },
];

function Logo({ brand }: { brand: Brand }) {
  const [failed, setFailed] = useState(false);

  if (!brand.logoUrl || failed) {
    return <span className="press-logo press-logo-text">{brand.name}</span>;
  }

  return (
    <span className="press-logo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={brand.logoUrl}
        alt={brand.name}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </span>
  );
}

export default function PressLogos() {
  const [brands, setBrands] = useState<Brand[]>(FALLBACK);

  useEffect(() => {
    let alive = true;
    fetch(`${API_URL}/api/public/brands?page=home`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d?.success && Array.isArray(d.data) && d.data.length) {
          setBrands(d.data);
        }
      })
      .catch(() => {
        /* backend down — the fallback wordmarks stay */
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="partners-logos press-logos">
      {brands.map((b) => (
        <Logo key={b.id} brand={b} />
      ))}
    </div>
  );
}

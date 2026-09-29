'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
}

/**
 * Clients, campuses and institutions Inker works with.
 *
 * Deliberately a sibling of PressLogos rather than more rows inside it:
 * that rail is labelled "AS FEATURED IN" and means mastheads Inker has
 * appeared in. A bank, a university and a ministry are a different claim,
 * so they get their own label.
 *
 * Wiring matches PressLogos exactly — reads the same Brands model through
 * `GET /api/public/brands?page=partners`, so /admin/brands can reorder or
 * extend this without a deploy, and falls back to the list below when the
 * API is unreachable or still empty.
 *
 * Every logo here was cut out of a white or coloured plate and saved with
 * a transparent background, the way asianet.png already was, so the rail
 * shows marks on black rather than a row of white rectangles. Two of them
 * (Sobha, MSME) are black ink and are inverted in CSS — no amount of
 * brightness lifts black. See the filter table in inker.css.
 */
const DIR = '/images/Partners';

const FALLBACK: Brand[] = [
  { id: 'federal-bank', name: 'Federal Bank', logoUrl: `${DIR}/federal-bank.png` },
  { id: 'mashreq', name: 'Mashreq', logoUrl: `${DIR}/mashreq.png` },
  { id: 'sobha', name: 'Sobha', logoUrl: `${DIR}/sobha.png` },
  { id: 'cyberdome', name: 'Kerala Police Cyberdome', logoUrl: `${DIR}/cyberdome.png` },
  { id: 'spc', name: 'Student Police Cadet', logoUrl: `${DIR}/spc.png` },
  { id: 'msme', name: 'Ministry of MSME, Govt. of India', logoUrl: `${DIR}/msme.png` },
  { id: 'lpu', name: 'Lovely Professional University', logoUrl: `${DIR}/lpu.png` },
  { id: 'rset', name: 'Rajagiri School of Engineering & Technology', logoUrl: `${DIR}/rset.png` },
  { id: 'gems-modern-academy', name: 'GEMS Modern Academy', logoUrl: `${DIR}/gems-modern-academy.png` },
  { id: 'reach-british-school', name: 'Reach British School', logoUrl: `${DIR}/reach-british-school.png` },
  { id: 'devamatha-cmi', name: 'Devamatha CMI International School', logoUrl: `${DIR}/devamatha-cmi.png` },
  { id: '90plus-tuition', name: '90+ My Tuition App', logoUrl: `${DIR}/90plus-tuition.png` },
];

function Logo({ brand }: { brand: Brand }) {
  const [failed, setFailed] = useState(false);

  if (!brand.logoUrl || failed) {
    return <span className="press-logo press-logo-text">{brand.name}</span>;
  }

  /* <picture> rather than a bare <img>: the house rule is that every
     PNG under public/ has a WebP twin beside it, so the browser should
     take the smaller one. The <img> keeps the .png in its src attribute,
     which is also what the per-logo [src*=] rules key off. */
  const webp = brand.logoUrl.replace(/\.png$/i, '.webp');

  return (
    <span className="press-logo">
      <picture>
        {webp !== brand.logoUrl && <source srcSet={webp} type="image/webp" />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={brand.logoUrl}
          alt={brand.name}
          title={brand.name}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      </picture>
    </span>
  );
}

export default function PartnerLogos() {
  const [brands, setBrands] = useState<Brand[]>(FALLBACK);

  useEffect(() => {
    let alive = true;
    fetch(`${API_URL}/api/public/brands?page=partners`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d?.success && Array.isArray(d.data) && d.data.length) {
          setBrands(d.data);
        }
      })
      .catch(() => {
        /* backend down — the bundled list below stays */
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="partners-logos press-logos partner-rail">
      {brands.map((b) => (
        <Logo key={b.id} brand={b} />
      ))}
    </div>
  );
}

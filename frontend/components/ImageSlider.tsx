'use client';

import { useState, useEffect, useRef } from 'react';

interface Props {
  images: { src: string; alt: string }[];
  label?: string;
  interval?: number;
  height?: number;
}

export default function ImageSlider({ images, label, interval = 2000, height }: Props) {
  const [idx, setIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const single = images.length === 1;

  const goTo = (i: number) => setIdx(i);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  const resetTimer = () => {
    if (timer.current) clearInterval(timer.current);
    if (!single) timer.current = setInterval(() => setIdx(i => (i + 1) % images.length), interval);
  };

  useEffect(() => {
    if (single) return;
    timer.current = setInterval(() => setIdx(i => (i + 1) % images.length), interval);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [images.length, interval, single]);

  return (
    <div style={{ position: 'relative', width: '100%', background: '#0B1730', borderRadius: 'var(--radius)', overflow: 'hidden', ...(height ? { height: `${height}px` } : {}) }}>
      {label && (
        <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 3, fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.5)', padding: '4px 10px', borderRadius: '3px' }}>
          {label}
        </div>
      )}

      <img loading="lazy"
        src={images[idx].src}
        alt={images[idx].alt}
        style={{ width: '100%', height: height ? '100%' : 'auto', objectFit: height ? 'cover' : undefined, display: 'block', transition: 'opacity 0.3s ease' }}
      />

      {!single && (
        <>
          <button onClick={() => { prev(); resetTimer(); }} aria-label="Previous image" style={btnStyle('left')}>‹</button>
          <button onClick={() => { next(); resetTimer(); }} aria-label="Next image" style={btnStyle('right')}>›</button>
          <div style={{ position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 3 }}>
            {images.map((_, i) => (
              <button key={i} onClick={() => { goTo(i); resetTimer(); }} aria-label={`Go to image ${i + 1}`} style={{ width: i === idx ? '20px' : '6px', height: '6px', borderRadius: '3px', background: i === idx ? 'var(--orange)' : 'rgba(255,255,255,0.4)', border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.2s ease' }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function btnStyle(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute',
    top: '50%',
    [side]: '12px',
    transform: 'translateY(-50%)',
    zIndex: 3,
    background: 'rgba(0,0,0,0.5)',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    fontSize: '20px',
    lineHeight: '1',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
}

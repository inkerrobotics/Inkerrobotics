'use client';

import { useEffect, useRef, useState } from 'react';

interface CounterProps {
  target: number;
  plus?: boolean;
  suffix?: string;
  label: string;
}

export function Counter({ target, plus = true, suffix, label }: CounterProps) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !done.current) {
          done.current = true;
          const dur = 1400;
          const start = performance.now();
          const step = (now: number) => {
            const t = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - t, 3);
            setN(Math.round(target * eased));
            if (t < 1) requestAnimationFrame(step);
            else setN(target);
          };
          requestAnimationFrame(step);
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [target]);

  return (
    <div className="stat" ref={ref}>
      <div className="stat-num">
        <span>{n.toLocaleString()}</span>
        {suffix ? <span className="plus">{suffix}</span> : plus && <span className="plus">+</span>}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

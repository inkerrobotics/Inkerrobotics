'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function InteractiveHand() {
  const handContainerRef = useRef<HTMLDivElement>(null);
  const handWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const container = handContainerRef.current;
    const wrapper = handWrapperRef.current;
    if (!container || !wrapper) return;

    // Use GSAP quickTo for highly performant mouse following
    const xTo = gsap.quickTo(wrapper, "rotationY", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(wrapper, "rotationX", { duration: 0.4, ease: "power3" });
    const scaleTo = gsap.quickTo(wrapper, "scale", { duration: 0.4, ease: "power3" });

    gsap.set(wrapper, { transformPerspective: 1000, scale: 1.15 });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -15; 
      const rotateY = ((x - centerX) / centerX) * 15;
      
      xTo(rotateY);
      yTo(rotateX);
      scaleTo(1.25);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      scaleTo(1.15);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Fade up animation on scroll
    gsap.fromTo(container, 
      { opacity: 0, y: 100 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1, 
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
        }
      }
    );

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, { scope: handContainerRef });

  return (
    <div ref={handContainerRef} className="interactive-hand-container">
      <div ref={handWrapperRef} className="interactive-hand-wrapper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/robotic-hand-nobg.png" alt="Robotic Hand" className="robotic-hand-img" />
        
        <div className="hotspot" style={{ top: '15%', right: '20%' }}>
          <div className="hotspot-dot"></div>
          <div className="hotspot-tooltip">
            <h4>Tactile Sensors</h4>
            <p>Micro-haptic feedback loops for absolute precision grip.</p>
          </div>
        </div>
        
        <div className="hotspot" style={{ top: '40%', right: '20%' }}>
          <div className="hotspot-dot"></div>
          <div className="hotspot-tooltip">
            <h4>Neural Receiver</h4>
            <p>Zero-latency cognitive control interface directly linked to the user.</p>
          </div>
        </div>

        <div className="hotspot" style={{ top: '60%', right: '25%' }}>
          <div className="hotspot-dot"></div>
          <div className="hotspot-tooltip">
            <h4>Kevlar Tendons</h4>
            <p>Ultra-lightweight synthetic tendons for rapid reflex movements.</p>
          </div>
        </div>

        <div className="hotspot" style={{ top: '75%', right: '35%' }}>
          <div className="hotspot-dot"></div>
          <div className="hotspot-tooltip">
            <h4>Micro-Motor</h4>
            <p>High precision articulation for delicate adjustments.</p>
          </div>
        </div>

        <div className="hotspot" style={{ top: '70%', left: '40%' }}>
          <div className="hotspot-dot"></div>
          <div className="hotspot-tooltip">
            <h4>Titanium Actuator</h4>
            <p>High-torque mechanical joint designed for extreme durability and stress resistance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

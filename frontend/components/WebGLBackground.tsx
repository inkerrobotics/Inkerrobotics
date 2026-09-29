'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';

function InteractiveCyberGrid() {
  const meshRef = useRef<THREE.Points>(null);
  const waveRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(t * 0.1) * 0.15;
      meshRef.current.rotation.z = t * 0.03;
    }
    if (waveRef.current) {
      waveRef.current.rotation.z = t * 0.05;
    }
  });

  const { positions, colors } = useMemo(() => {
    const count = 1200;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 4.5;
      const height = (Math.random() - 0.5) * 5;

      pos[i * 3] = radius * Math.cos(theta);
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = radius * Math.sin(theta);

      // Cyber color palette: Neon Cyan, Amber Orange, Soft Violet
      const colorChoice = Math.random();
      if (colorChoice < 0.45) {
        // Cyan #00b4ff
        col[i * 3] = 0.0;
        col[i * 3 + 1] = 0.7;
        col[i * 3 + 2] = 1.0;
      } else if (colorChoice < 0.8) {
        // Amber #ff6c00
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.42;
        col[i * 3 + 2] = 0.0;
      } else {
        // Violet #a855f7
        col[i * 3] = 0.65;
        col[i * 3 + 1] = 0.33;
        col[i * 3 + 2] = 0.96;
      }
    }
    return { positions: pos, colors: col };
  }, []);

  return (
    <group>
      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.6}>
        <points ref={meshRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.04}
            vertexColors
            transparent
            opacity={0.75}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </Float>

      {/* Subtle Wireframe Energy Ring */}
      <mesh ref={waveRef} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -1, 0]}>
        <ringGeometry args={[2.8, 4.2, 64]} />
        <meshBasicMaterial
          color="#00b4ff"
          wireframe
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function WebGLBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.9,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} color="#00b4ff" intensity={1.5} />
        <pointLight position={[-10, -10, -10]} color="#ff6c00" intensity={1.5} />

        <InteractiveCyberGrid />

        {/* Ambient floating neon sparkles */}
        <Sparkles count={140} scale={12} size={2.0} speed={0.4} color="#00b4ff" opacity={0.4} />
        <Sparkles count={90} scale={9} size={2.4} speed={0.25} color="#ff6c00" opacity={0.35} />
        <Sparkles count={60} scale={7} size={2.8} speed={0.3} color="#a855f7" opacity={0.3} />
      </Canvas>
    </div>
  );
}

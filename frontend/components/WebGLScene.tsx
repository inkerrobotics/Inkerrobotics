'use client';
import { Canvas } from '@react-three/fiber';
import { Environment, Sparkles, PerspectiveCamera, SoftShadows, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Suspense } from 'react';
import HumanoidRobot from './HumanoidRobot';
import * as THREE from 'three';

export default function WebGLScene() {
  return (
    <div className="canvas-wrapper">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping }}>
        {/* Soft realistic penumbra shadows */}
        <SoftShadows size={15} samples={16} focus={0.5} />
        
        {/* 85mm Portrait Camera look with expanded clipping planes */}
        <PerspectiveCamera makeDefault position={[0, 0.5, 5]} fov={30} near={0.001} far={10000} />
        
        <Suspense fallback={null}>
          {/* Cinematic 3-Point Lighting */}
          <ambientLight color="#ffffff" intensity={0.05} />
          
          <directionalLight 
            castShadow
            color="#ffffff" 
            intensity={2.5} 
            position={[2, 5, 3]} 
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
          />
          
          <directionalLight color="#88bbff" intensity={1.5} position={[-5, 2, 2]} />
          <directionalLight color="#ffaa55" intensity={4} position={[0, 3, -5]} />

          <Environment preset="city" />
          
          <HumanoidRobot />

          {/* Ground Contact Shadows */}
          <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={10} blur={2} far={4} />

          {/* Cinematic Post-Processing Pipeline */}
          <EffectComposer multisampling={4}>
            <Bloom luminanceThreshold={0.8} mipmapBlur intensity={0.4} />
            <ChromaticAberration
              offset={new THREE.Vector2(0.001, 0.001)}
              radialModulation={false}
              modulationOffset={0}
            />
            <Noise opacity={0.03} blendFunction={BlendFunction.OVERLAY} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>

          {/* Atmosphere */}
          <Sparkles count={150} scale={12} size={1.5} speed={0.1} color="#ffb03a" opacity={0.2} />
        </Suspense>
      </Canvas>
    </div>
  );
}

'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import { Float, useGLTF, Bounds, Center } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { OBJLoader } from 'three-stdlib';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}



export default function HumanoidRobot() {
  const { scene, materials } = useGLTF('/Meshy_AI_Aurora_Prime_0801155419_texture.glb?v=2');
  const { pointer } = useThree();
  
  const robotRef = useRef<THREE.Group>(null);

  // Initialize rig with the desired defaults (0s) so ScrollTrigger records correct starting points
  const rig = useRef({
    botX: 0, botY: -0.5, botZ: 0,
    botRotX: 0, botRotY: 0,
    headRX: 0, headRY: 0,
    entranceY: -4, // separate property for entrance drop
  });

  useEffect(() => {
    // Apply ultra-realistic Physical materials dynamically
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          
          materials.forEach((mat, index) => {
            const m = mat as THREE.MeshStandardMaterial;
            if (m) {
              const physicalMat = new THREE.MeshPhysicalMaterial({
                map: m.map,
                color: m.color,
                metalness: 0.9,
                roughness: 0.3,
                envMapIntensity: 2.5,
                clearcoat: 1.0, 
                clearcoatRoughness: 0.1,
              });
              
              if (Array.isArray(mesh.material)) {
                mesh.material[index] = physicalMat;
              } else {
                mesh.material = physicalMat;
              }
            }
          });
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      }
    });

    let ctx = gsap.context(() => {
      const ease = 'none';

      // ENTRANCE ANIMATION (uses entranceY so it doesn't fight ScrollTrigger)
      gsap.to(rig.current, {
        entranceY: 0,
        duration: 2,
        ease: 'power3.out'
      });

      // HERO -> VISION (hand feature section)
      gsap.to(rig.current, {
        botX: 1.5, botY: 0.5, botZ: 2,
        botRotY: -0.35, headRY: 0.25, headRX: 0.04,
        ease,
        scrollTrigger: {
          trigger: '#vision',
          start: 'top bottom',
          end: 'top top',
          scrub: 1.2
        }
      });

      // VISION -> ENGINEERING (partners section)
      gsap.to(rig.current, {
        botX: -2, botY: 0, botZ: 1,
        botRotY: 0.55, headRY: -0.3, headRX: 0,
        ease,
        scrollTrigger: {
          trigger: '#engineering',
          start: 'top bottom',
          end: 'top top',
          scrub: 1.2
        }
      });

      // ENGINEERING -> CORE (statement section)
      gsap.to(rig.current, {
        botX: 0, botY: -0.5, botZ: 3,
        botRotY: -0.12, headRY: 0, headRX: 0.18,
        ease,
        scrollTrigger: {
          trigger: '#core',
          start: 'top bottom',
          end: 'top top',
          scrub: 1.2
        }
      });

      // CORE -> CTA (bottom section)
      gsap.to(rig.current, {
        botX: 0, botY: -0.5, botZ: -2,
        botRotY: 6.283, // full spin
        headRX: 0, headRY: 0,
        ease,
        scrollTrigger: {
          trigger: '#cta',
          start: 'top bottom',
          end: 'top top',
          scrub: 1.2
        }
      });
    });

    return () => ctx.revert();
  }, [scene, materials]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mouseX = pointer.x;
    const mouseY = pointer.y;
    const r = rig.current;

    if (robotRef.current) {
      // Combine base Y, entrance Y, and breathing
      robotRef.current.position.set(
        r.botX,
        r.botY + r.entranceY + Math.sin(t * 1.6) * 0.05,
        r.botZ
      );
      
      robotRef.current.rotation.x = r.headRX + mouseY * 0.1 + Math.sin(t * 0.7) * 0.02;
      robotRef.current.rotation.y = r.botRotY + r.headRY + mouseX * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={robotRef} position={[0, -0.5, 0]}>
        {/* Bounds automatically scales and centers the unknown model to fit perfectly within the camera view */}
        <Bounds fit clip observe margin={1.2}>
          <Center top>
            <primitive object={scene} />
          </Center>
        </Bounds>
      </group>
    </Float>
  );
}

useGLTF.preload('/Meshy_AI_Aurora_Prime_0801155419_texture.glb?v=2');

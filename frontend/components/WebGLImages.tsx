'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { getScrollVelocity, bindScrollVelocity } from '@/lib/motion';
import { prefersReducedMotion } from '@/lib/smoothScroll';

/* ==================================================================
   DOM-synced WebGL image layer.

   Every element carrying `data-webgl` keeps its normal place in the
   document (so layout, a11y and SEO are untouched) but its <img> is
   made transparent and a shader plane is drawn at exactly the same
   viewport rect. The shader adds hover ripple, scroll-velocity RGB
   shift + bulge, and a cinematic colour grade.
   ================================================================== */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uHover;
  uniform float uVelocity;

  varying vec2 vUv;
  varying float vWave;

  void main() {
    vUv = uv;

    vec3 pos = position;

    // Scroll-driven bulge: the plane leans into the direction of travel.
    float bend = sin(uv.x * 3.14159) * sin(uv.y * 3.14159);
    float wave = bend * uVelocity * 0.16;

    // Gentle idle breathing so static grids never feel dead.
    wave += bend * sin(uTime * 0.6) * 0.004;

    // Hover lifts the centre of the plane toward the camera.
    wave += bend * uHover * 0.05;

    pos.z += wave;
    vWave = wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec2 uPlaneRatio;   // cover-fit correction
  uniform float uTime;
  uniform float uHover;
  uniform vec2 uMouse;
  uniform float uVelocity;
  uniform float uReveal;
  uniform float uOpacity;
  uniform vec3 uAccent;

  varying vec2 vUv;
  varying float vWave;

  // contain-fit: keep aspect, fit entire image without cropping
  vec2 containUv(vec2 uv, vec2 ratio) {
    return (uv - 0.5) * ratio + 0.5;
  }

  void main() {
    vec2 uv = containUv(vUv, uPlaneRatio);
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;

    // --- hover ripple -------------------------------------------------
    float d = distance(vUv, uMouse);
    float ring = sin(d * 22.0 - uTime * 3.2);
    vec2 dir = normalize(vUv - uMouse + 1e-5);
    uv += dir * ring * 0.014 * uHover * smoothstep(0.62, 0.0, d);

    // --- scroll shear -------------------------------------------------
    uv.x += sin(vUv.y * 3.6 + uTime * 0.4) * uVelocity * 0.018;

    // --- chromatic aberration ----------------------------------------
    float shift = uVelocity * 0.016 + uHover * 0.004;
    float r = texture2D(uTexture, uv + vec2(shift, 0.0)).r;
    float g = texture2D(uTexture, uv).g;
    float b = texture2D(uTexture, uv - vec2(shift, 0.0)).b;
    vec3 col = vec3(r, g, b);

    // --- cinematic grade ---------------------------------------------
    // Keep rich natural colour, gently elevate on hover
    col = mix(col, min(col * 1.08, vec3(1.0)), uHover);

    // lifted shadows, filmic toe
    col = pow(col, vec3(1.06));
    col += vec3(0.012, 0.012, 0.018);

    // accent rim where the plane is bent
    col += uAccent * abs(vWave) * 3.2 * uHover;

    // --- edge vignette on the plane itself ---------------------------
    vec2 e = abs(vUv - 0.5) * 2.0;
    float edge = 1.0 - smoothstep(0.72, 1.0, max(e.x, e.y));
    col *= mix(0.78, 1.0, edge);

    // --- scroll reveal: soft wipe from the bottom edge ---------------
    float revealMask = smoothstep(uReveal - 0.18, uReveal + 0.02, 1.0 - vUv.y);
    float alpha = uOpacity * (1.0 - revealMask);

    if (alpha < 0.01) discard;

    gl_FragColor = vec4(col, alpha);
  }
`;

type PlaneProps = {
  el: HTMLElement;
  src: string;
  accent: THREE.Color;
};

function ImagePlane({ el, src, accent }: PlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const hoverTarget = useRef(0);
  const mouseTarget = useRef(new THREE.Vector2(0.5, 0.5));
  const visible = useRef(true);

  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  /* ---- texture ---- */
  useEffect(() => {
    let alive = true;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(src, (tex) => {
      if (!alive) {
        tex.dispose();
        return;
      }
      /* Cap the texture before it reaches the GPU.
           A gallery photo decodes around 1490x1092, which is 6.2 MB of
           VRAM apiece as RGBA with no mipmaps. This page puts a plane
           over every slide, row and tile, so at full size the set ran to
           roughly 230 MB — enough to lose the context on integrated
           graphics. That is not a soft failure here: the DOM images are
           already faded out behind the planes, so the page goes blank.
           These planes are never drawn more than a few hundred pixels
           wide, so the detail was not visible anyway. */
      const MAX = 900;
      const bmp = tex.image as HTMLImageElement;
      if (bmp?.width && Math.max(bmp.width, bmp.height) > MAX) {
        const k = MAX / Math.max(bmp.width, bmp.height);
        const c = document.createElement('canvas');
        c.width = Math.round(bmp.width * k);
        c.height = Math.round(bmp.height * k);
        const ctx = c.getContext('2d');
        if (ctx) {
          ctx.drawImage(bmp, 0, 0, c.width, c.height);
          tex.image = c;
          tex.needsUpdate = true;
        }
      }

      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      setTexture(tex);
    });
    return () => {
      alive = false;
    };
  }, [src]);

  useEffect(() => () => texture?.dispose(), [texture]);

  /* Only fade out the raster image once its shader plane can actually
     draw — a failed texture load then leaves the DOM image visible
     instead of a hole. */
  useEffect(() => {
    if (!texture) return;
    el.classList.add('webgl-ready');
    return () => el.classList.remove('webgl-ready');
  }, [texture, el]);

  /* ---- pointer + visibility wiring on the DOM element ---- */
  useEffect(() => {
    const onEnter = () => (hoverTarget.current = 1);
    const onLeave = () => (hoverTarget.current = 0);
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mouseTarget.current.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('mousemove', onMove);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
      },
      { rootMargin: '200px 0px' }
    );
    io.observe(el);

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('mousemove', onMove);
      io.disconnect();
    };
  }, [el]);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: null as THREE.Texture | null },
      uPlaneRatio: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVelocity: { value: 0 },
      uReveal: { value: 0 },
      uOpacity: { value: 1 },
      uAccent: { value: accent },
    }),
    [accent]
  );

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const mat = matRef.current;
    if (!mesh || !mat) return;

    if (!visible.current) {
      mesh.visible = false;
      return;
    }
    mesh.visible = true;

    const rect = el.getBoundingClientRect();

    mesh.scale.set(rect.width, rect.height, 1);
    mesh.position.set(
      rect.left - size.width / 2 + rect.width / 2,
      -(rect.top - size.height / 2 + rect.height / 2),
      0
    );

    const u = mat.uniforms;
    u.uTime.value = state.clock.elapsedTime;

    // ease hover + pointer for silky transitions
    const k = 1 - Math.pow(0.001, delta);
    u.uHover.value += (hoverTarget.current - u.uHover.value) * k;
    u.uMouse.value.lerp(mouseTarget.current, k);

    // scroll velocity, normalised and damped
    const v = getScrollVelocity() / 90;
    u.uVelocity.value += (v - u.uVelocity.value) * (1 - Math.pow(0.0005, delta));

    // reveal: fully drawn once the element has climbed 12% into view
    const inViewY = rect.bottom > 0 && rect.top < size.height;
    const inViewX = rect.right > 0 && rect.left < size.width;
    const progress = (inViewY && inViewX)
      ? 1
      : THREE.MathUtils.clamp(1 - (rect.top - size.height * 0.12) / (size.height * 0.7), 0, 1);
    u.uReveal.value = progress;

    // contain-fit ratio: fit complete image without cropping
    if (texture?.image) {
      const img = texture.image as any;
      const imgW = (img.naturalWidth || img.width || 1);
      const imgH = (img.naturalHeight || img.height || 1);
      const planeAspect = rect.width / (rect.height || 1);
      const imgAspect = imgW / imgH;
      if (planeAspect > imgAspect) {
        u.uPlaneRatio.value.set(planeAspect / imgAspect, 1);
      } else {
        u.uPlaneRatio.value.set(1, imgAspect / planeAspect);
      }
    }
  });

  useEffect(() => {
    if (matRef.current && texture) {
      matRef.current.uniforms.uTexture.value = texture;
    }
  }, [texture]);

  if (!texture) return null;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1, 24, 24]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

const PERSPECTIVE = 900;

/** Maps 1 world unit to 1 CSS pixel so planes line up with the DOM. */
function PixelCamera() {
  const { size } = useThree();
  const fov = 2 * Math.atan(size.height / 2 / PERSPECTIVE) * (180 / Math.PI);

  return (
    <PerspectiveCamera
      makeDefault
      fov={fov}
      position={[0, 0, PERSPECTIVE]}
      near={1}
      far={PERSPECTIVE * 3}
    />
  );
}

type Item = { el: HTMLElement; src: string };

function Scene({ items }: { items: Item[] }) {
  const accent = useMemo(() => new THREE.Color('#eb670e'), []);
  return (
    <>
      <PixelCamera />
      {items.map((item, i) => (
        <ImagePlane key={`${item.src}-${i}`} el={item.el} src={item.src} accent={accent} />
      ))}
    </>
  );
}

function webglAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function WebGLImages({ selector = '[data-webgl]' }: { selector?: string }) {
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    // Bail out on reduced-motion or when WebGL is unavailable — the plain
    // DOM images then stay visible and everything still works.
    if (prefersReducedMotion() || !webglAvailable()) return;

    bindScrollVelocity();

    // Deferred to the next frame so the DOM has laid out before we read it.
    const raf = requestAnimationFrame(() => {
      const found: Item[] = [];
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        const img = el.matches('img') ? (el as HTMLImageElement) : el.querySelector('img');
        const src = img?.getAttribute('src');
        if (src) found.push({ el, src });
      });
      setItems(found);
    });

    return () => cancelAnimationFrame(raf);
  }, [selector]);
  /* If the GL context is lost the canvas stops painting, but every
     covered element still carries `.webgl-ready` and is therefore still
     faded out — the page would simply go blank. Drop the class on loss
     and the plain images come straight back. */
  useEffect(() => {
    const onLost = () => {
      document
        .querySelectorAll('.webgl-ready')
        .forEach((el) => el.classList.remove('webgl-ready'));
    };
    window.addEventListener('webglcontextlost', onLost, true);
    return () => window.removeEventListener('webglcontextlost', onLost, true);
  }, []);


  return (
    <div className="cg-webgl" aria-hidden="true">
      {!!items?.length && (
        <Canvas
          dpr={[1, 1.75]}
          gl={{
            alpha: true,
            antialias: false,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: false,
          }}
          camera={{ position: [0, 0, 900], fov: 45 }}
        >
          <Scene items={items} />
        </Canvas>
      )}
    </div>
  );
}

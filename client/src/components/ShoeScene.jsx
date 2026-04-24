import { useRef, useEffect, useMemo, useState, Suspense, Component } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const SHOE_URL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb';

// Keyframes per section
const KF = {
  hero:     { cam:[0,0,5.2],   pos:[0,-0.4,0],     rot:[0,-0.5,0.05],  scale:1.0 },
  elevate:  { cam:[0,0,4.6],   pos:[1.3,-0.4,0.2], rot:[0.2,0.6,-0.35], scale:0.95 },
  detail:   { cam:[0,0,4.2],   pos:[0,0.1,0.4],    rot:[-0.5,-0.9,0.8], scale:1.1 },
  crafted:  { cam:[0,0,4.8],   pos:[0,-0.3,0],     rot:[0.1,-Math.PI,0.1], scale:1.0 },
  features: { cam:[0,0,3.6],   pos:[0,-0.1,0.5],   rot:[0.05, 0, -0.05], scale:1.15 },
  cta:      { cam:[0,0,5.5],   pos:[0,0.6,-0.5],   rot:[0.25,-0.3,0.15], scale:0.85 },
};

function lerp(a, b, t) { return a + (b - a) * t; }
function lerpArr3(a, b, t) { return [lerp(a[0],b[0],t), lerp(a[1],b[1],t), lerp(a[2],b[2],t)]; }

function sampleKeyframes(p) {
  const keys = [KF.hero, KF.elevate, KF.detail, KF.crafted, KF.features, KF.cta];
  const n = keys.length - 1;
  const pos = p * n;
  const i = Math.min(n - 1, Math.floor(pos));
  let t = pos - i;
  t = t * t * (3 - 2 * t); // smoothstep
  const a = keys[i], b = keys[i + 1];
  return {
    cam: lerpArr3(a.cam, b.cam, t),
    pos: lerpArr3(a.pos, b.pos, t),
    rot: lerpArr3(a.rot, b.rot, t),
    scale: lerp(a.scale, b.scale, t),
  };
}

/* ---- High-detail procedural sneaker ---- */
function FallbackShoe() {
  // Premium shopon/cream materials
  const upperMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: 0xf5f0e8, roughness: 0.45, metalness: 0.0, clearcoat: 0.4, clearcoatRoughness: 0.5,
    sheen: 0.3, sheenColor: new THREE.Color(0xfff8f0),
  }), []);
  const meshMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: 0xeae5db, roughness: 0.65, metalness: 0.0, clearcoat: 0.15,
    transmission: 0.05, thickness: 0.3,
  }), []);
  const soleMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: 0xe8e2d5, roughness: 0.75, metalness: 0.0, clearcoat: 0.1,
  }), []);
  const midsoleLight = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: 0xfaf7f2, roughness: 0.3, metalness: 0.0, clearcoat: 0.6, clearcoatRoughness: 0.3,
  }), []);
  const laceMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xf0ebe0, roughness: 0.9 }), []);
  const accentMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.1, clearcoat: 0.8 }), []);
  const collarMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: 0xf8f4ed, roughness: 0.55, metalness: 0.0, clearcoat: 0.2,
  }), []);
  const tagMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }), []);

  return (
    <group scale={[1.25, 1.25, 1.25]} rotation={[0.1, 0, -0.05]}>
      {/* === MIDSOLE - chunky with air unit === */}
      <mesh position={[0, -0.22, 0]} material={midsoleLight}>
        <capsuleGeometry args={[0.18, 2.4, 16, 24]} />
        <mesh rotation={[0, 0, Math.PI / 2]} />
      </mesh>
      {/* midsole main slab */}
      <mesh position={[0, -0.28, 0]} scale={[1, 1, 1]} material={midsoleLight} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.22, 2.2, 16, 24]} />
      </mesh>
      {/* Outsole bottom */}
      <mesh position={[0, -0.48, 0]} material={soleMat} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.08, 2.3, 8, 16]} />
      </mesh>
      {/* Outsole tread lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`tread-${i}`} position={[-0.9 + i * 0.27, -0.52, 0]} material={soleMat} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.15, 0.03, 0.9]} />
        </mesh>
      ))}
      {/* Air unit bubble */}
      <mesh position={[-0.5, -0.3, 0]} material={midsoleLight} scale={[1.2, 0.6, 0.85]}>
        <sphereGeometry args={[0.25, 24, 16]} />
      </mesh>

      {/* === UPPER - main body === */}
      {/* Toe box */}
      <mesh position={[1.0, 0.1, 0]} scale={[0.85, 0.6, 0.9]} material={upperMat}>
        <sphereGeometry args={[0.5, 24, 20]} />
      </mesh>
      {/* Mid upper */}
      <mesh position={[0.2, 0.2, 0]} scale={[1.2, 0.65, 0.85]} material={meshMat} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.38, 0.8, 16, 20]} />
      </mesh>
      {/* Heel counter */}
      <mesh position={[-0.9, 0.25, 0]} scale={[0.75, 0.85, 0.88]} material={upperMat}>
        <sphereGeometry args={[0.5, 24, 20]} />
      </mesh>
      {/* Heel pull tab */}
      <mesh position={[-1.15, 0.55, 0]} material={accentMat}>
        <boxGeometry args={[0.12, 0.3, 0.2]} />
      </mesh>

      {/* === COLLAR (ankle opening) === */}
      <mesh position={[-0.5, 0.55, 0]} scale={[0.9, 0.35, 0.7]} material={collarMat}>
        <torusGeometry args={[0.35, 0.15, 12, 20, Math.PI * 1.3]} />
      </mesh>

      {/* === TONGUE === */}
      <mesh position={[0.15, 0.6, 0]} scale={[1, 1, 0.7]} material={upperMat}>
        <capsuleGeometry args={[0.12, 0.5, 8, 12]} />
      </mesh>
      {/* Tongue label */}
      <mesh position={[0.15, 0.72, 0.09]} material={tagMat}>
        <boxGeometry args={[0.2, 0.15, 0.01]} />
      </mesh>
      {/* "ShopOn" text placeholder on tongue */}
      <mesh position={[0.15, 0.72, -0.09]} material={tagMat}>
        <boxGeometry args={[0.2, 0.15, 0.01]} />
      </mesh>

      {/* === LACES === */}
      {[0, 1, 2, 3, 4].map(i => (
        <group key={`lace-${i}`}>
          <mesh position={[0.5 - i * 0.18, 0.52 + i * 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} material={laceMat}>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          </mesh>
          {/* Lace eyelets */}
          <mesh position={[0.5 - i * 0.18, 0.48 + i * 0.02, 0.22]} material={accentMat}>
            <torusGeometry args={[0.03, 0.01, 6, 12]} />
          </mesh>
          <mesh position={[0.5 - i * 0.18, 0.48 + i * 0.02, -0.22]} material={accentMat}>
            <torusGeometry args={[0.03, 0.01, 6, 12]} />
          </mesh>
        </group>
      ))}

      {/* === SWOOSH / BRAND ACCENT === */}
      {/* Side swoosh (abstract, not Nike) */}
      <mesh position={[0.1, 0.15, 0.48]} rotation={[0, 0, -0.2]} material={accentMat}>
        <capsuleGeometry args={[0.025, 0.7, 4, 8]} />
      </mesh>
      <mesh position={[0.1, 0.15, -0.48]} rotation={[0, 0, -0.2]} material={accentMat}>
        <capsuleGeometry args={[0.025, 0.7, 4, 8]} />
      </mesh>

      {/* === MUDGUARD (toe wrap) === */}
      <mesh position={[0.85, -0.05, 0]} scale={[0.7, 0.25, 1.0]} material={collarMat}>
        <sphereGeometry args={[0.5, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* === HEEL LOGO TAB === */}
      <mesh position={[-1.1, 0.3, 0]} rotation={[0, Math.PI / 2, 0]} material={accentMat}>
        <circleGeometry args={[0.08, 16]} />
      </mesh>
    </group>
  );
}

/* ---- GLB shoe from CDN ---- */
function GLBShoe() {
  const { scene } = useGLTF(SHOE_URL);
  const groupRef = useRef();
  const normalized = useRef(false);

  useFrame(() => {
    if (!groupRef.current || normalized.current) return;
    const wrapper = groupRef.current;

    // Measure raw bounding box
    const box = new THREE.Box3().setFromObject(wrapper);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim === 0) return; // not ready yet

    const center = box.getCenter(new THREE.Vector3());

    // Scale to 2.6 units
    const s = 2.6 / maxDim;
    wrapper.scale.set(s, s, s);

    // Re-measure and center
    const box2 = new THREE.Box3().setFromObject(wrapper);
    const center2 = box2.getCenter(new THREE.Vector3());
    wrapper.position.set(-center2.x, -center2.y, -center2.z);

    // Fix materials
    wrapper.traverse((c) => {
      if (c.isMesh && c.material) {
        const mats = Array.isArray(c.material) ? c.material : [c.material];
        mats.forEach(m => {
          if (m.map && 'colorSpace' in m.map) m.map.colorSpace = THREE.SRGBColorSpace;
          if (m.color) m.color.set(0xf2efe6);
          if ('roughness' in m) m.roughness = 0.45;
          if ('metalness' in m) m.metalness = 0.0;
          m.envMapIntensity = 1.3;
        });
      }
    });

    normalized.current = true;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

/* ---- Real error boundary (class component) ---- */
class GLBErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err) { console.warn('GLB load failed, using fallback shoe:', err); }
  render() {
    if (this.state.hasError) return <FallbackShoe />;
    return this.props.children;
  }
}

/* ---- Animated shoe group ---- */
function ShoeGroup({ scrollProgress }) {
  const groupRef = useRef();
  const { camera } = useThree();
  const dragState = useRef({ rotY: 0, rotX: 0, velY: 0, velX: 0 });
  const timeRef = useRef(0);

  useEffect(() => {
    let dragging = false;
    let lastX = 0, lastY = 0;

    // Only start drag from hero section
    const onDown = (e) => {
      if (scrollProgress.current > 0.2) return;
      // Check if click is in hero area (top 100vh)
      const p = e.touches ? e.touches[0] : e;
      if (p.clientY > window.innerHeight) return;
      dragging = true;
      lastX = p.clientX; lastY = p.clientY;
    };
    const onMove = (e) => {
      if (!dragging) return;
      const p = e.touches ? e.touches[0] : e;
      dragState.current.velY += (p.clientX - lastX) * 0.005;
      dragState.current.velX += (p.clientY - lastY) * 0.003;
      lastX = p.clientX; lastY = p.clientY;
    };
    const onUp = () => { dragging = false; };

    window.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [scrollProgress]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta;
    const t = timeRef.current;
    const sp = scrollProgress.current;
    const target = sampleKeyframes(sp);

    // Camera
    camera.position.x = lerp(camera.position.x, target.cam[0], 0.1);
    camera.position.y = lerp(camera.position.y, target.cam[1], 0.1);
    camera.position.z = lerp(camera.position.z, target.cam[2], 0.1);
    camera.lookAt(0, 0, 0);

    const g = groupRef.current;

    // Position
    g.position.x = lerp(g.position.x, target.pos[0], 0.08);
    g.position.y = lerp(g.position.y, target.pos[1], 0.08);
    g.position.z = lerp(g.position.z, target.pos[2], 0.08);

    // Drag inertia
    const ds = dragState.current;
    ds.velY *= 0.92; ds.velX *= 0.92;
    ds.rotY += ds.velY; ds.rotX += ds.velX;
    ds.rotX = Math.max(-0.6, Math.min(0.6, ds.rotX));
    const dragInfluence = Math.max(0, 1 - sp * 3);

    // Breathing animation
    const breatheY = Math.sin(t * 0.6) * 0.08;
    const breatheX = Math.cos(t * 0.4) * 0.04;

    // Features section 360° wow spin
    let wowSpin = 0;
    const featEl = document.querySelector('[data-section="features"]');
    if (featEl) {
      const rect = featEl.getBoundingClientRect();
      const h = window.innerHeight;
      const totalTravel = rect.height + h;
      const progress = (h - rect.top) / totalTravel;
      wowSpin = Math.max(0, Math.min(1, progress)) * Math.PI * 2;
    }

    g.rotation.x = lerp(g.rotation.x, target.rot[0] + breatheX + ds.rotX * dragInfluence, 0.1);
    g.rotation.y = lerp(g.rotation.y, target.rot[1] + breatheY + wowSpin + ds.rotY * dragInfluence, 0.1);
    g.rotation.z = lerp(g.rotation.z, target.rot[2], 0.1);

    const s = target.scale;
    g.scale.set(lerp(g.scale.x, s, 0.1), lerp(g.scale.y, s, 0.1), lerp(g.scale.z, s, 0.1));
  });

  return (
    <group ref={groupRef}>
      <GLBErrorBoundary>
        <Suspense fallback={<FallbackShoe />}>
          <GLBShoe />
        </Suspense>
      </GLBErrorBoundary>
    </group>
  );
}

/* ---- Main scene component ---- */
export default function ShoeScene({ onLoaded }) {
  const scrollProgress = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = docHeight > 0 ? window.scrollY / docHeight : 0;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
      <Canvas
        camera={{ fov: 35, near: 0.1, far: 100, position: [0, 0, 5] }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          onLoaded?.();
        }}
        style={{ pointerEvents: 'none', background: 'transparent' }}
      >
        <Environment preset="studio" />
        <directionalLight position={[4, 6, 5]} intensity={1.4} />
        <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#fff5e6" />
        <directionalLight position={[0, -3, -6]} intensity={0.8} />
        <ambientLight intensity={0.35} />
        <ShoeGroup scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}

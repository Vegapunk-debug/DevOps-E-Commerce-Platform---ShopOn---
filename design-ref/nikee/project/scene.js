/* =========================================================
   SAIL — 3D Scene + ScrollTrigger camera choreography
   - Fixed full-viewport canvas (content scrolls on top)
   - Loads a free GLB shoe from CDN (with fallback geometry)
   - Camera moves between section keyframes; shoe has subtle
     continuous breathing rotation.
   - Drag on hero = rotate shoe; between sections, bigger
     rotation + tilt; in features section, 360° "wow" spin.
========================================================= */

(function () {
  const mount = document.getElementById('three-root');
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loader-bar');
  const loaderLbl = document.getElementById('loader-lbl');

  const W = () => window.innerWidth;
  const H = () => window.innerHeight;

  // --- renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W(), H());
  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace || THREE.sRGBEncoding;
  else renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  mount.appendChild(renderer.domElement);

  // --- scene / camera
  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(35, W() / H(), 0.1, 100);
  camera.position.set(0, 0, 5);

  // --- environment (studio)
  const pmrem = new THREE.PMREMGenerator(renderer);
  try {
    const env = new THREE.RoomEnvironment(renderer);
    scene.environment = pmrem.fromScene(env, 0.04).texture;
  } catch (e) {
    // fallback: ambient lighting only
  }

  // --- lights (soft product lighting)
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(4, 6, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xfff5e6, 0.6);
  fill.position.set(-4, 2, -3);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.8);
  rim.position.set(0, -3, -6);
  scene.add(rim);
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));

  // --- shoe group (we parent whatever model loads to this)
  const shoeGroup = new THREE.Group();
  scene.add(shoeGroup);

  // placeholder shoe: chunky capsule + sole slab, in sail off-white
  function buildFallbackShoe() {
    const g = new THREE.Group();
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xf2efe6, roughness: 0.55, metalness: 0.02, clearcoat: 0.3, clearcoatRoughness: 0.6
    });
    const soleMat = new THREE.MeshPhysicalMaterial({
      color: 0xece7da, roughness: 0.7, metalness: 0.0
    });

    // upper (stretched capsule)
    const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 1.4, 12, 20), mat);
    upper.rotation.z = Math.PI / 2;
    upper.position.y = 0.28;
    upper.scale.set(1, 0.8, 0.95);
    g.add(upper);

    // toe puff
    const toe = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 16), mat);
    toe.position.set(0.95, 0.18, 0);
    toe.scale.set(0.9, 0.7, 0.95);
    g.add(toe);

    // heel
    const heel = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 16), mat);
    heel.position.set(-0.95, 0.32, 0);
    heel.scale.set(0.9, 0.95, 0.95);
    g.add(heel);

    // sole (curved slab)
    const sole = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.32, 1.05), soleMat);
    sole.position.y = -0.18;
    g.add(sole);

    // tongue
    const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.18, 0.55), mat);
    tongue.position.set(0.1, 0.6, 0);
    g.add(tongue);

    // laces (dark)
    const laceMat = new THREE.MeshStandardMaterial({ color: 0x202020, roughness: 0.8 });
    for (let i = 0; i < 4; i++) {
      const l = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.55, 8), laceMat);
      l.rotation.x = Math.PI / 2;
      l.position.set(0.4 - i * 0.2, 0.62, 0);
      g.add(l);
    }

    // swoosh-esque accent (dark) — abstract wedge, not a nike swoosh
    const accent = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.06, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.6 })
    );
    accent.position.set(-0.1, 0.22, 0.5);
    accent.rotation.z = -0.15;
    g.add(accent);

    g.scale.set(1.1, 1.1, 1.1);
    return g;
  }

  let shoe = null;
  let usingFallback = false;

  function setProgress(p) {
    const v = Math.max(0, Math.min(1, p));
    loaderBar.style.width = (v * 100) + '%';
    loaderLbl.textContent = 'LOADING · ' + Math.round(v * 100) + '%';
  }

  function dismissLoader() {
    setProgress(1);
    setTimeout(() => {
      loader.classList.add('gone');
      setTimeout(() => loader.remove(), 700);
    }, 250);
  }

  function normalizeAndAdd(obj) {
    // center and scale to a target size
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    obj.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const targetSize = 2.6;
    const s = targetSize / maxDim;
    obj.scale.multiplyScalar(s);

    // brighten materials + soft clearcoat
    obj.traverse((c) => {
      if (c.isMesh && c.material) {
        const mats = Array.isArray(c.material) ? c.material : [c.material];
        mats.forEach(m => {
          if (m.map) { if ('colorSpace' in m.map) m.map.colorSpace = THREE.SRGBColorSpace; else m.map.encoding = THREE.sRGBEncoding; }
          if ('roughness' in m) m.roughness = Math.min(0.9, (m.roughness ?? 0.5));
          if ('metalness' in m) m.metalness = Math.min(0.4, (m.metalness ?? 0));
          m.envMapIntensity = 1.1;
        });
      }
    });

    shoeGroup.add(obj);
    shoe = obj;
  }

  // Try a few known free GLBs; fall back to built-in geometry.
  const candidates = [
    // KhronosGroup glTF-Sample-Models: MaterialsVariantsShoe
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb'
  ];

  function loadShoe(i = 0) {
    if (i >= candidates.length) {
      // fallback
      const fb = buildFallbackShoe();
      usingFallback = true;
      normalizeAndAdd(fb);
      dismissLoader();
      init();
      return;
    }
    const gl = new THREE.GLTFLoader();
    gl.load(
      candidates[i],
      (gltf) => {
        normalizeAndAdd(gltf.scene);
        dismissLoader();
        init();
      },
      (xhr) => {
        if (xhr.lengthComputable) setProgress(xhr.loaded / xhr.total * 0.95);
      },
      (err) => {
        console.warn('GLB failed, trying next / fallback', err);
        loadShoe(i + 1);
      }
    );
  }

  // ---- render loop + scroll choreography ----
  const state = {
    // camera target
    camPos: new THREE.Vector3(0, 0, 5),
    camLookAt: new THREE.Vector3(0, 0, 0),
    // shoe target
    shoePos: new THREE.Vector3(0, -0.2, 0),
    shoeRot: new THREE.Euler(0, -0.4, 0.1),
    shoeScale: 1.0,
    // continuous
    time: 0,
    dragRotY: 0,
    dragRotX: 0,
    dragVelY: 0,
    dragVelX: 0,
    // 360 wow spin progress (0..1)
    wowSpin: 0,
    // scroll progress (0..1 across whole doc)
    scrollP: 0,
  };

  // Keyframes per section (sectionIndex: camPos, shoePos, shoeRot)
  // Sections are layered full-width; canvas is fixed. We place shoe
  // on screen using x-offset in world space relative to camera.
  // Positive X = right, positive Y = up.
  const KF = {
    hero:     { cam:[0,0,5.2],   pos:[0,-0.4,0],     rot:[0,-0.5,0.05],  scale:1.0 },
    elevate:  { cam:[0,0,4.6],   pos:[1.3,-0.4,0.2], rot:[0.2,0.6,-0.35], scale:0.95 },
    detail:   { cam:[0,0,4.2],   pos:[0,0.1,0.4],    rot:[-0.5,-0.9,0.8], scale:1.1 },
    crafted:  { cam:[0,0,4.8],   pos:[0,-0.3,0],     rot:[0.1,-Math.PI,0.1], scale:1.0 },
    features: { cam:[0,0,3.6],   pos:[0,-0.1,0.5],   rot:[0.05, 0, -0.05], scale:1.15 }, // wow
    cta:      { cam:[0,0,5.5],   pos:[0,0.6,-0.5],   rot:[0.25,-0.3,0.15], scale:0.85 },
  };

  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerpArr3(a, b, t) { return [lerp(a[0],b[0],t), lerp(a[1],b[1],t), lerp(a[2],b[2],t)]; }

  // piecewise interpolation across sections based on overall scroll
  function sampleKeyframes(p) {
    // 6 waypoints equally spaced
    const keys = [KF.hero, KF.elevate, KF.detail, KF.crafted, KF.features, KF.cta];
    const n = keys.length - 1;
    const pos = p * n;
    const i = Math.min(n - 1, Math.floor(pos));
    let t = pos - i;
    // smoothstep for buttery transitions
    t = t * t * (3 - 2 * t);
    const a = keys[i], b = keys[i + 1];
    return {
      cam: lerpArr3(a.cam, b.cam, t),
      pos: lerpArr3(a.pos, b.pos, t),
      rot: lerpArr3(a.rot, b.rot, t),
      scale: lerp(a.scale, b.scale, t),
    };
  }

  function resize() {
    renderer.setSize(W(), H());
    camera.aspect = W() / H();
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);

  // --- drag to rotate on hero
  const threeRoot = document.getElementById('three-root');
  let dragging = false;
  let lastX = 0, lastY = 0;
  function onDown(e) {
    if (!threeRoot.classList.contains('drag-enabled')) return;
    dragging = true;
    threeRoot.classList.add('dragging');
    const p = e.touches ? e.touches[0] : e;
    lastX = p.clientX; lastY = p.clientY;
  }
  function onMove(e) {
    if (!dragging) return;
    const p = e.touches ? e.touches[0] : e;
    const dx = p.clientX - lastX;
    const dy = p.clientY - lastY;
    lastX = p.clientX; lastY = p.clientY;
    state.dragVelY += dx * 0.005;
    state.dragVelX += dy * 0.003;
  }
  function onUp() { dragging = false; threeRoot.classList.remove('dragging'); }
  threeRoot.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  threeRoot.addEventListener('touchstart', onDown, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('touchend', onUp);

  // disable drag once we leave the hero section (section 0)
  function updateDragZone() {
    const heroEl = document.querySelector('[data-section="hero"]');
    if (!heroEl) return;
    const r = heroEl.getBoundingClientRect();
    const inHero = r.bottom > H() * 0.25;
    threeRoot.classList.toggle('drag-enabled', inHero);
  }

  // --- ScrollTrigger setup
  function init() {
    gsap.registerPlugin(ScrollTrigger);

    // Overall scroll progress -> state.scrollP
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        state.scrollP = self.progress;
        updateProgressRail(self.progress);
        updateDragZone();
      }
    });

    // "Wow" 360° spin, driven by the features section's own progress
    const featuresEl = document.querySelector('[data-section="features"]');
    if (featuresEl) {
      ScrollTrigger.create({
        trigger: featuresEl,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => { state.wowSpin = self.progress; }
      });
    }

    // progress rail dots
    const rail = document.getElementById('progress');
    const sections = document.querySelectorAll('main section');
    sections.forEach(() => {
      const s = document.createElement('span');
      rail.appendChild(s);
    });
    window._railSpans = rail.querySelectorAll('span');

    animate();
  }

  function updateProgressRail(p) {
    const sections = document.querySelectorAll('main section');
    if (!window._railSpans) return;
    const cur = Math.min(sections.length - 1, Math.floor(p * sections.length));
    window._railSpans.forEach((s, i) => s.classList.toggle('on', i === cur));
  }

  function animate() {
    state.time += 0.016;
    const target = sampleKeyframes(state.scrollP);

    // ease cam toward target
    camera.position.x = lerp(camera.position.x, target.cam[0], 0.1);
    camera.position.y = lerp(camera.position.y, target.cam[1], 0.1);
    camera.position.z = lerp(camera.position.z, target.cam[2], 0.1);
    camera.lookAt(0, 0, 0);

    if (shoe) {
      // target shoe position + rotation
      shoeGroup.position.x = lerp(shoeGroup.position.x, target.pos[0], 0.08);
      shoeGroup.position.y = lerp(shoeGroup.position.y, target.pos[1], 0.08);
      shoeGroup.position.z = lerp(shoeGroup.position.z, target.pos[2], 0.08);

      // base rotation from keyframes
      const baseRX = target.rot[0];
      let baseRY = target.rot[1];
      const baseRZ = target.rot[2];

      // Add the "wow" full spin on top when in features section
      // Use features scroll progress directly (0 -> 1 == one full turn)
      const wowY = state.wowSpin * Math.PI * 2;

      // drag inertia (only meaningful when dragging is enabled)
      state.dragVelY *= 0.92; state.dragVelX *= 0.92;
      state.dragRotY += state.dragVelY;
      state.dragRotX += state.dragVelX;
      // limit drag tilt
      state.dragRotX = Math.max(-0.6, Math.min(0.6, state.dragRotX));
      // decay drag influence as we scroll past the hero
      const dragInfluence = Math.max(0, 1 - state.scrollP * 3);

      // gentle breathing
      const breatheY = Math.sin(state.time * 0.6) * 0.08;
      const breatheX = Math.cos(state.time * 0.4) * 0.04;

      shoeGroup.rotation.x = lerp(shoeGroup.rotation.x, baseRX + breatheX + state.dragRotX * dragInfluence, 0.1);
      shoeGroup.rotation.y = lerp(shoeGroup.rotation.y, baseRY + breatheY + wowY + state.dragRotY * dragInfluence, 0.1);
      shoeGroup.rotation.z = lerp(shoeGroup.rotation.z, baseRZ, 0.1);

      const s = target.scale;
      shoeGroup.scale.set(
        lerp(shoeGroup.scale.x, s, 0.1),
        lerp(shoeGroup.scale.y, s, 0.1),
        lerp(shoeGroup.scale.z, s, 0.1)
      );
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  // kick off
  setProgress(0.05);
  loadShoe();
})();

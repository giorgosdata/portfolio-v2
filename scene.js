// scene.js — Three.js background of floating playful primitives
(() => {
  const canvas = document.getElementById('bg3d');
  if (!canvas || !window.THREE) return;
  if (matchMedia('(max-width: 720px)').matches) return; // skip on mobile

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio));
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0x000000, 0);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const dl = new THREE.DirectionalLight(0xffffff, 1.1);
  dl.position.set(2, 3, 4);
  scene.add(dl);
  const fill = new THREE.DirectionalLight(0xff6fa3, 0.6);
  fill.position.set(-3, -1, 2);
  scene.add(fill);

  // Materials — soft toon-ish but standard
  const mat = (color) => new THREE.MeshStandardMaterial({
    color, roughness: 0.35, metalness: 0.15, flatShading: false
  });

  // Floating shapes — Greek-island playful palette
  const shapes = [];
  const makeShape = (geom, color, pos, scl = 1) => {
    const m = new THREE.Mesh(geom, mat(color));
    m.position.set(...pos);
    m.scale.setScalar(scl);
    m.userData = {
      rotSpeed: new THREE.Vector3((Math.random() - .5) * .005, (Math.random() - .5) * .006, (Math.random() - .5) * .004),
      floatOffset: Math.random() * Math.PI * 2,
      basePos: m.position.clone(),
    };
    scene.add(m);
    shapes.push(m);
    return m;
  };

  makeShape(new THREE.IcosahedronGeometry(.85, 0), 0x06b6d4, [-4.2, 1.8, -1], 1);
  makeShape(new THREE.TorusGeometry(.55, .22, 16, 48), 0x10b981, [4.0, 1.5, -0.5], 1.1);
  makeShape(new THREE.ConeGeometry(.55, 1.1, 32), 0xffd84a, [3.5, -1.8, -1.5], 1.0);
  makeShape(new THREE.SphereGeometry(.45, 32, 32), 0xff6fa3, [-3.6, -1.6, -0.5], 1.2);
  makeShape(new THREE.TorusKnotGeometry(.40, .14, 96, 16), 0x6366f1, [0, 2.8, -2.5], .9);
  makeShape(new THREE.DodecahedronGeometry(.40, 0), 0x10b981, [1.2, -2.6, -2], 1);

  // Mouse parallax
  const mouse = { x: 0, y: 0 };
  addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = (e.clientY / innerHeight) * 2 - 1;
  });

  // Scroll-driven camera zoom
  let scrollY = 0;
  addEventListener('scroll', () => { scrollY = scrollY = window.scrollY; }, { passive: true });

  // Resize
  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  // Loop
  const clock = new THREE.Clock();
  function tick() {
    const t = clock.getElapsedTime();
    shapes.forEach((s) => {
      s.rotation.x += s.userData.rotSpeed.x;
      s.rotation.y += s.userData.rotSpeed.y;
      s.rotation.z += s.userData.rotSpeed.z;
      s.position.y = s.userData.basePos.y + Math.sin(t * .9 + s.userData.floatOffset) * .35;
      s.position.x = s.userData.basePos.x + Math.cos(t * .6 + s.userData.floatOffset) * .15;
    });
    // camera parallax
    camera.position.x += (mouse.x * .9 - camera.position.x) * .05;
    camera.position.y += (-mouse.y * .6 - camera.position.y) * .05;
    camera.position.z = 7 + Math.min(scrollY / 600, 2);
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
})();

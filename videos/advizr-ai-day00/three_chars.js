import * as THREE from "./assets/vendor/three.module.min.js";
import { RoomEnvironment } from "./assets/vendor/addons/RoomEnvironment.js";
const W = 1080, H = 1920, TM = window.__TC;
const canvas = document.getElementById("three-layer");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
const scene = new THREE.Scene();
const pm = new THREE.PMREMGenerator(renderer);
scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.5;
const cam = new THREE.PerspectiveCamera(30, W / H, 0.1, 100); cam.position.set(0, 0, 10);
const PX = H / (2 * 10 * Math.tan(15 * Math.PI / 180));
const ux = (x) => (x - W / 2) / PX, uy = (y) => (H / 2 - y) / PX;
scene.add(new THREE.HemisphereLight(0xffffff, 0xc8d8f0, 1.4));
const key = new THREE.DirectionalLight(0xffffff, 2.0); key.position.set(3, 5, 6); scene.add(key);
const rim = new THREE.DirectionalLight(0x9fe3ff, 1.0); rim.position.set(-5, 2, -3); scene.add(rim);
const clamp = (v) => Math.max(0, Math.min(1, v));
const outBack = (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const outCubic = (x) => 1 - Math.pow(1 - x, 3);
const M = (c, r = 0.4, m = 0, ex = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: r, metalness: m }, ex));
// AD logo shapes
const LS = 410, OX = 250, OY = 255;
const LP = (x, y) => new THREE.Vector2((x - OX) / LS, -(y - OY) / LS);
const poly = (pts) => { const s = new THREE.Shape(); pts.forEach((p, i) => { const v = LP(p[0], p[1]); i ? s.lineTo(v.x, v.y) : s.moveTo(v.x, v.y); }); s.closePath(); return s; };
function logoGroup(cA, cW, depth) {
  const sA = poly([[8, 404], [121, 106], [166, 226], [100, 404]]), sW = poly([[121, 106], [213, 106], [325, 404], [233, 404]]);
  const sD = new THREE.Shape(); let v;
  v = LP(232, 106); sD.moveTo(v.x, v.y); v = LP(350, 106); sD.lineTo(v.x, v.y);
  const c0 = LP(350, 255); sD.absarc(c0.x, c0.y, 149 / LS, Math.PI / 2, -Math.PI / 2, true);
  v = LP(325, 404); sD.lineTo(v.x, v.y); v = LP(288, 305); sD.lineTo(v.x, v.y); v = LP(350, 305); sD.lineTo(v.x, v.y);
  sD.absarc(c0.x, c0.y, 50 / LS, -Math.PI / 2, Math.PI / 2, false); v = LP(268, 205); sD.lineTo(v.x, v.y); sD.closePath();
  const ext = { depth, bevelEnabled: true, bevelThickness: depth * 0.16, bevelSize: depth * 0.08, bevelSegments: 3, curveSegments: 32 };
  const g = new THREE.Group();
  [[sA, cA], [sW, cW], [sD, cA]].forEach(([sh, m]) => { const geo = new THREE.ExtrudeGeometry(sh, ext); geo.translate(0, 0, -depth / 2); g.add(new THREE.Mesh(geo, m)); });
  return g;
}
const cyanM = M(0x12c4ff, 0.3, 0.1), navyM = M(0x10203f, 0.35, 0.1), whiteM = M(0xffffff, 0.3);
// character factory
function makeChar(o) {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const skin = M(o.skin, 0.55);
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.55, 10, 32), M(o.shirt, 0.45)); torso.position.y = 0.75; body.add(torso);
  const legM = M(o.pants, 0.5);
  [-0.17, 0.17].forEach((x) => { const l = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.32, 8, 16), legM); l.position.set(x, 0.12, 0); body.add(l); const sh = new THREE.Mesh(new THREE.SphereGeometry(0.15, 20, 12), M(0x222a3a, 0.5)); sh.scale.set(1, 0.6, 1.4); sh.position.set(x, -0.12, 0.05); body.add(sh); });
  const arms = [];
  [-1, 1].forEach((s) => { const piv = new THREE.Group(); piv.position.set(0.48 * s, 1.08, 0); const a = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.45, 8, 16), M(o.shirt, 0.45)); a.position.y = -0.3; piv.add(a); const h = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), skin); h.position.y = -0.6; piv.add(h); piv.rotation.z = 0.18 * s; body.add(piv); arms.push(piv); });
  const head = new THREE.Group(); head.position.y = 1.62; body.add(head);
  head.add(new THREE.Mesh(new THREE.SphereGeometry(0.44, 40, 28), skin));
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.46, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2.1), M(o.hair, 0.6)); hair.position.y = 0.05; hair.rotation.x = -0.25; head.add(hair);
  const eyeM = M(0x1a1a24, 0.3);
  [-0.15, 0.15].forEach((x) => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), eyeM); e.position.set(x, 0.02, 0.4); head.add(e); });
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.025, 8, 24, Math.PI), M(0x8a3b2e, 0.5)); mouth.rotation.z = Math.PI; mouth.position.set(0, -0.14, 0.41); head.add(mouth);
  [-1, 1].forEach((s) => { const ear = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), skin); ear.position.set(0.43 * s, -0.02, 0); head.add(ear); });
  if (o.glasses) { const gm = M(0x10203f, 0.3); [-0.16, 0.16].forEach((x) => { const r = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.018, 8, 32), gm); r.position.set(x, 0.02, 0.42); head.add(r); }); const br = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.1, 8), gm); br.rotation.z = Math.PI / 2; br.position.set(0, 0.03, 0.44); head.add(br); }
  if (o.badge) { const lg = logoGroup(cyanM, navyM, 0.05); lg.scale.setScalar(0.36); lg.position.set(0, 0.86, 0.5); body.add(lg); const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 40), M(0xffffff, 0.3)); plate.rotation.x = Math.PI / 2; plate.scale.set(1.25, 1, 0.85); plate.position.set(0, 0.86, 0.45); body.add(plate); }
  if (o.phone) { const ph = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.28, 0.03), M(0x10203f, 0.3)); ph.position.set(0, -0.62, 0.1); ph.rotation.x = -0.4; arms[1].add(ph); }
  if (o.hood) { const hd = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.1, 12, 32), M(o.shirt, 0.45)); hd.rotation.x = Math.PI / 2; hd.position.y = 1.27; body.add(hd); }
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.8, 0.12, 48), M(0xffffff, 0.35, 0, { emissive: o.glow, emissiveIntensity: 0 })); disc.position.y = -0.25; root.add(disc);
  scene.add(root);
  return { root, body, head, arms, mouth, disc };
}
const B = makeChar({ shirt: 0x12c4ff, pants: 0x10203f, skin: 0xe0a77d, hair: 0x2a1d17, glasses: true, badge: true, glow: 0x12c4ff });
const R = makeChar({ shirt: 0xff8a3d, pants: 0x3a4a6a, skin: 0xd99a6c, hair: 0x1d1410, phone: true, hood: true, glow: 0xff8a3d });
const endLogo = logoGroup(cyanM, navyM, 0.22); scene.add(endLogo);
const speakingAt = (t, who) => TM.lines.some(([a, b, w]) => w === who && t >= a && t < b);
function animChar(c, t, who, baseX, scale, entry) {
  const vis = t < TM.br;
  c.root.visible = vis; if (!vis) return;
  let x = baseX, hop = 0;
  if (entry !== undefined) { const p = clamp((t - entry) / 0.7); x = baseX + (1 - outCubic(p)) * 700; hop = Math.abs(Math.sin(p * Math.PI * 3)) * 0.25 * (1 - p); c.root.visible = t >= entry - 0.01; }
  const sp = speakingAt(t, who);
  c.root.position.set(ux(x), uy(1650) + hop, 0);
  c.root.scale.setScalar(scale);
  c.root.rotation.y = (who === "B" ? 0.35 : -0.35) + Math.sin(t * 0.8) * 0.05;
  c.body.position.y = Math.sin(t * 2.2 + (who === "B" ? 0 : 1)) * 0.03;
  c.head.rotation.x = sp ? Math.sin(t * 11) * 0.06 : Math.sin(t * 1.3) * 0.03;
  c.head.rotation.z = sp ? Math.sin(t * 5) * 0.05 : 0;
  c.mouth.scale.set(1, sp ? 1 + Math.abs(Math.sin(t * 14)) * 0.45 : 1, 1);
  c.disc.material.emissiveIntensity = sp ? 0.45 + 0.15 * Math.sin(t * 8) : 0;
  c.arms[0].rotation.z = 0.18 * -1 + (sp ? Math.sin(t * 6) * 0.08 : 0);
  c.arms[1].rotation.z = 0.18;
  c.arms[1].rotation.x = 0;
}
function renderAt(t) {
  animChar(B, t, "B", 320, 0.78);
  animChar(R, t, "R", 780, 0.64, TM.rEnter);
  // Bhaiya waves in wave windows
  TM.wave.forEach(([a, b]) => { if (t >= a && t < b) { B.arms[1].rotation.z = 2.6 + Math.sin(t * 10) * 0.35; } });
  // Rahul shrug
  TM.shrug.forEach(([a, b]) => { if (t >= a && t < b) { const k = Math.sin(clamp((t - a) / (b - a)) * Math.PI); R.arms[0].rotation.z = -0.18 - 1.6 * k; R.arms[1].rotation.z = 0.18 + 1.6 * k; R.head.rotation.z = Math.sin(t * 9) * 0.12; } });
  // Rahul spin (level up)
  if (t >= TM.spin && t < TM.spin + 0.9) R.root.rotation.y += outCubic(clamp((t - TM.spin) / 0.9)) * Math.PI * 2;
  endLogo.visible = t >= TM.br;
  if (endLogo.visible) { const q = t - TM.br, p = clamp(q / 1.0); endLogo.scale.setScalar(Math.max(0.001, 0.25 + 0.75 * outBack(p))); endLogo.rotation.y = -Math.PI * 1.5 * (1 - outCubic(p)) + (q > 1 ? Math.sin((q - 1) * 1.3) * 0.28 : 0); endLogo.position.set(0, uy(TM.logoY), 0); }
  renderer.render(scene, cam);
}
window.addEventListener("hf-seek", (e) => renderAt(e.detail.time));
renderAt(window.__hfThreeTime || 0);

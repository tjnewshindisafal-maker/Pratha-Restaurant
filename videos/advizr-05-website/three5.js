import * as THREE from "./assets/vendor/three.module.min.js";
import { RoomEnvironment } from "./assets/vendor/addons/RoomEnvironment.js";
const W = 1080, H = 1920, TM = window.__T5;
const canvas = document.getElementById("three-layer");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
const scene = new THREE.Scene();
const pm = new THREE.PMREMGenerator(renderer);
scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.55;
const cam = new THREE.PerspectiveCamera(30, W / H, 0.1, 100); cam.position.set(0, 0, 10);
const PX = H / (2 * 10 * Math.tan(15 * Math.PI / 180));
const ux = (x) => (x - W / 2) / PX, uy = (y) => (H / 2 - y) / PX;
scene.add(new THREE.HemisphereLight(0xffffff, 0xc8d8f0, 1.3));
const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 5, 6); scene.add(key);
const rim = new THREE.DirectionalLight(0x9fe3ff, 1.2); rim.position.set(-5, 2, -3); scene.add(rim);
const clamp = (v) => Math.max(0, Math.min(1, v));
const outBack = (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const outCubic = (x) => 1 - Math.pow(1 - x, 3);
const outBounce = (x) => { const n = 7.5625, d = 2.75; if (x < 1 / d) return n * x * x; if (x < 2 / d) return n * (x -= 1.5 / d) * x + 0.75; if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + 0.9375; return n * (x -= 2.625 / d) * x + 0.984375; };
const M = (c, r = 0.35, m = 0.0, extra = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: r, metalness: m }, extra));
// floating pastel shapes
const floats = [];
const fdefs = [[new THREE.TorusGeometry(0.32, 0.12, 24, 64), 0x5fd3ff, 150, 600], [new THREE.IcosahedronGeometry(0.3, 0), 0xb9a6ff, 950, 640], [new THREE.SphereGeometry(0.26, 48, 32), 0xffb38a, 130, 1480], [new THREE.TorusKnotGeometry(0.2, 0.07, 120, 16), 0x7be0b0, 960, 1430], [new THREE.OctahedronGeometry(0.22, 0), 0xffd36b, 880, 1640], [new THREE.CapsuleGeometry(0.12, 0.3, 8, 24), 0xff8fb1, 210, 1700]];
fdefs.forEach(([g, c, x, y], i) => { const m = new THREE.Mesh(g, M(c, 0.3)); m.userData = { x, y, i }; scene.add(m); floats.push(m); });
// shop
const shop = new THREE.Group();
const add = (g, m, x, y, z, rx = 0) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.rotation.x = rx; shop.add(o); return o; };
add(new THREE.BoxGeometry(2.6, 1.7, 1.3), M(0xffffff, 0.6), 0, 0, 0);
add(new THREE.BoxGeometry(2.9, 0.16, 1.6), M(0xdfe7f2, 0.6), 0, -0.93, 0);
add(new THREE.BoxGeometry(2.9, 0.22, 1.6), M(0x10203f, 0.5), 0, 0.96, 0);
for (let k = 0; k < 8; k++) add(new THREE.BoxGeometry(0.34, 0.07, 0.62), M(k % 2 ? 0xffffff : 0x12c4ff, 0.4), -1.19 + k * 0.34, 0.6, 0.86, 0.5);
const sc = document.createElement("canvas"); sc.width = 1024; sc.height = 216; const sx = sc.getContext("2d");
sx.fillStyle = "#10203f"; sx.fillRect(0, 0, 1024, 216); sx.fillStyle = "#ffffff"; sx.font = "900 120px sans-serif"; sx.textAlign = "center"; sx.textBaseline = "middle"; sx.fillText("YOUR SHOP", 512, 116);
const st = new THREE.CanvasTexture(sc); st.colorSpace = THREE.SRGBColorSpace;
const signM = [M(0x10203f), M(0x10203f), M(0x10203f), M(0x10203f), new THREE.MeshStandardMaterial({ map: st, roughness: 0.5 }), M(0x10203f)];
add(new THREE.BoxGeometry(1.9, 0.4, 0.08), signM, 0, 1.36, 0.3);
const glass = M(0x8fd3f7, 0.08, 0.2);
add(new THREE.BoxGeometry(0.7, 0.62, 0.05), glass, -0.82, -0.08, 0.66);
add(new THREE.BoxGeometry(0.7, 0.62, 0.05), glass, 0.82, -0.08, 0.66);
const doorM = M(0x12c4ff, 0.3, 0.1, { emissive: 0x12c4ff, emissiveIntensity: 0.0 });
const door = add(new THREE.BoxGeometry(0.62, 1.02, 0.06), doorM, 0, -0.34, 0.67);
const people = [0xff8a5c, 0x6a5cff, 0x1fbf62].map((c, k) => { const p = new THREE.Group(); const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.22, 8, 16), M(c, 0.4)); const h = new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 16), M(0xffd7b5, 0.5)); h.position.y = 0.28; p.add(b, h); shop.add(p); return p; });
scene.add(shop);
// Advizr logo
const S = 410, OX = 250, OY = 255;
const P = (x, y) => new THREE.Vector2((x - OX) / S, -(y - OY) / S);
const poly = (pts) => { const s = new THREE.Shape(); pts.forEach((p, i) => { const v = P(p[0], p[1]); i ? s.lineTo(v.x, v.y) : s.moveTo(v.x, v.y); }); s.closePath(); return s; };
const sA = poly([[8, 404], [121, 106], [166, 226], [100, 404]]), sW = poly([[121, 106], [213, 106], [325, 404], [233, 404]]);
const sD = new THREE.Shape(); let v;
v = P(232, 106); sD.moveTo(v.x, v.y); v = P(350, 106); sD.lineTo(v.x, v.y);
const c0 = P(350, 255); sD.absarc(c0.x, c0.y, 149 / S, Math.PI / 2, -Math.PI / 2, true);
v = P(325, 404); sD.lineTo(v.x, v.y); v = P(288, 305); sD.lineTo(v.x, v.y); v = P(350, 305); sD.lineTo(v.x, v.y);
sD.absarc(c0.x, c0.y, 50 / S, -Math.PI / 2, Math.PI / 2, false); v = P(268, 205); sD.lineTo(v.x, v.y); sD.closePath();
const ext = { depth: 0.22, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.018, bevelSegments: 4, curveSegments: 48 };
const adv = new THREE.Group();
[[sA, M(0x12c4ff, 0.28, 0.15)], [sW, M(0x10203f, 0.3, 0.1)], [sD, M(0x12c4ff, 0.28, 0.15)]].forEach(([sh, m]) => { const g = new THREE.ExtrudeGeometry(sh, ext); g.translate(0, 0, -0.11); adv.add(new THREE.Mesh(g, m)); });
scene.add(adv);
function shopState(t) {
  const inS1 = t >= TM.s1 && t < TM.s1e, inS7 = t >= TM.s7 && t < TM.s8e;
  shop.visible = inS1 || inS7;
  if (!shop.visible) return;
  const t0 = inS1 ? TM.s1 : TM.s7, q = t - t0;
  const p = clamp(q / 0.6);
  shop.scale.setScalar(0.56 * (inS1 ? 1 : outBack(clamp(q / 0.6))));
  shop.position.set(0, uy(1090) + (inS1 ? (1 - outBounce(p)) * 2.2 : 0), 0);
  shop.rotation.set(0.18, Math.sin(t * 0.9) * 0.35 - 0.15, 0);
  const dp = inS7 ? clamp((t - TM.door) / 0.6) : 0;
  door.visible = dp > 0; door.scale.y = Math.max(0.001, outBack(dp)); door.position.y = -0.34 - (1 - dp) * 0.5;
  doorM.emissiveIntensity = inS7 ? 0.35 + 0.25 * Math.sin(t * 6) : 0;
  people.forEach((pp, k) => {
    const w = inS7 ? (t - TM.walk - k * 0.45) / 1.4 : -1;
    pp.visible = w > 0 && w < 1;
    if (!pp.visible) return;
    pp.position.set((k - 1) * 0.6 * (1 - w), -0.65, 1.9 - 1.3 * w);
    pp.scale.setScalar(1 - 0.5 * clamp((w - 0.7) / 0.3));
  });
}
function renderAt(t) {
  floats.forEach((m) => { const { x, y, i } = m.userData; m.visible = t < TM.br; m.position.set(ux(x), uy(y) + Math.sin(t * 1.2 + i) * 0.12, -1); m.rotation.set(t * 0.5 + i, t * 0.7 + i * 0.5, 0); });
  shopState(t);
  adv.visible = t >= TM.br;
  if (adv.visible) {
    const q = t - TM.br, p = clamp(q / 1.0);
    adv.scale.setScalar(Math.max(0.001, 0.25 + 0.75 * outBack(p)));
    adv.rotation.y = -Math.PI * 1.5 * (1 - outCubic(p)) + (q > 1 ? Math.sin((q - 1) * 1.3) * 0.28 : 0);
    adv.rotation.x = Math.sin(q * 0.9) * 0.08;
    adv.position.set(0, uy(TM.logoY), 0);
  }
  renderer.render(scene, cam);
}
window.addEventListener("hf-seek", (e) => renderAt(e.detail.time));
renderAt(window.__hfThreeTime || 0);

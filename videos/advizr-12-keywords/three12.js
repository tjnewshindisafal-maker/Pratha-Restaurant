import * as THREE from "./assets/vendor/three.module.min.js";
import { RoomEnvironment } from "./assets/vendor/addons/RoomEnvironment.js";
const W = 1080, H = 1920;
const canvas = document.getElementById("three-layer");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
const scene = new THREE.Scene();
const pm = new THREE.PMREMGenerator(renderer);
scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.45;
const cam = new THREE.PerspectiveCamera(30, W / H, 0.1, 100); cam.position.set(0, 0, 10);
const PX = H / (2 * 10 * Math.tan(15 * Math.PI / 180));
const ux = (x) => (x - W / 2) / PX, uy = (y) => (H / 2 - y) / PX;
scene.add(new THREE.HemisphereLight(0xbfd8ff, 0x101830, 1.0));
const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(3, 5, 6); scene.add(key);
const rim = new THREE.DirectionalLight(0x12c4ff, 2.0); rim.position.set(-5, 2, -3); scene.add(rim);
const clamp = (v) => Math.max(0, Math.min(1, v));
const outBack = (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const outCubic = (x) => 1 - Math.pow(1 - x, 3);
// Google Ads logo
const gads = new THREE.Group();
const gm = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.3, metalness: 0.0 });
const cap = new THREE.CapsuleGeometry(0.45, 2.2, 10, 32);
const blue = new THREE.Mesh(cap, gm(0x4285f4)); blue.position.set(0.55, 0.05, 0); blue.rotation.z = Math.PI / 6;
const yel = new THREE.Mesh(cap, gm(0xfbbc05)); yel.position.set(-0.55, 0.05, -0.12); yel.rotation.z = -Math.PI / 6;
const grn = new THREE.Mesh(new THREE.SphereGeometry(0.47, 48, 32), gm(0x34a853)); grn.position.set(-1.1, -0.9, 0.12);
gads.add(blue, yel, grn); scene.add(gads);
// coins
const cv = document.createElement("canvas"); cv.width = cv.height = 512;
const cx = cv.getContext("2d");
const gr = cx.createRadialGradient(200, 180, 30, 256, 256, 260); gr.addColorStop(0, "#fff3b8"); gr.addColorStop(0.5, "#ffc53d"); gr.addColorStop(1, "#c8820a");
cx.fillStyle = gr; cx.fillRect(0, 0, 512, 512);
cx.strokeStyle = "#b87507"; cx.lineWidth = 26; cx.beginPath(); cx.arc(256, 256, 220, 0, Math.PI * 2); cx.stroke();
cx.fillStyle = "#8a5300"; cx.font = "bold 300px sans-serif"; cx.textAlign = "center"; cx.textBaseline = "middle"; cx.fillText("₹", 256, 272);
const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.center.set(0.5, 0.5); tex.rotation = Math.PI / 2;
const faceM = new THREE.MeshStandardMaterial({ map: tex, metalness: 0.65, roughness: 0.28, transparent: true });
const sideM = new THREE.MeshStandardMaterial({ color: 0xe0a020, metalness: 0.9, roughness: 0.3, transparent: true });
const coinG = new THREE.CylinderGeometry(0.42, 0.42, 0.1, 64);
const coins = [];
for (let j = 0; j < 6; j++) { const c = new THREE.Mesh(coinG, [sideM, faceM, faceM]); c.rotation.x = Math.PI / 2; scene.add(c); coins.push(c); }
const DEST = [[-330, -300], [320, -260], [-340, 160], [330, 210], [-60, -420], [60, 380]];
// Advizr logo
const S = 410, OX = 250, OY = 255;
const P = (x, y) => new THREE.Vector2((x - OX) / S, -(y - OY) / S);
const poly = (pts) => { const s = new THREE.Shape(); pts.forEach((p, i) => { const v = P(p[0], p[1]); i ? s.lineTo(v.x, v.y) : s.moveTo(v.x, v.y); }); s.closePath(); return s; };
const sA = poly([[8, 404], [121, 106], [166, 226], [100, 404]]);
const sW = poly([[121, 106], [213, 106], [325, 404], [233, 404]]);
const sD = new THREE.Shape(); let v;
v = P(232, 106); sD.moveTo(v.x, v.y); v = P(350, 106); sD.lineTo(v.x, v.y);
const c0 = P(350, 255); sD.absarc(c0.x, c0.y, 149 / S, Math.PI / 2, -Math.PI / 2, true);
v = P(325, 404); sD.lineTo(v.x, v.y); v = P(288, 305); sD.lineTo(v.x, v.y); v = P(350, 305); sD.lineTo(v.x, v.y);
sD.absarc(c0.x, c0.y, 50 / S, -Math.PI / 2, Math.PI / 2, false);
v = P(268, 205); sD.lineTo(v.x, v.y); sD.closePath();
const ext = { depth: 0.22, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.018, bevelSegments: 4, curveSegments: 48 };
const cyanM = new THREE.MeshStandardMaterial({ color: 0x12c4ff, metalness: 0.15, roughness: 0.28, emissive: 0x0a5a80, emissiveIntensity: 0.5 });
const whiteM = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.25 });
const adv = new THREE.Group();
[[sA, cyanM], [sW, whiteM], [sD, cyanM]].forEach(([sh, m]) => { const g = new THREE.ExtrudeGeometry(sh, ext); g.translate(0, 0, -0.11); adv.add(new THREE.Mesh(g, m)); });
scene.add(adv);
const TM = window.__T12;
function renderAt(t) {
  // Google Ads logo in hook
  gads.visible = t < TM.s0end;
  if (gads.visible) {
    const p = clamp(t / 0.9);
    const s = 0.4 * outBack(p);
    gads.scale.setScalar(Math.max(0.001, s));
    gads.rotation.y = -Math.PI * 2 * (1 - outCubic(p)) + Math.sin(t * 1.6) * 0.35;
    gads.rotation.x = Math.sin(t * 1.1) * 0.12;
    gads.position.set(0, uy(880) + Math.sin(t * 2) * 0.06, 0);
  }
  // coins
  coins.forEach((c, j) => {
    const t0 = TM.s4 + 0.25 + j * 0.22, p = (t - t0) / 0.95;
    c.visible = t >= TM.s4 && t < TM.s4end && p >= 0 && p < 1;
    if (!c.visible) return;
    const e = outCubic(p);
    c.position.set(ux(540 + DEST[j][0] * e), uy(1090 + DEST[j][1] * e), 0.6 * e);
    c.scale.setScalar(0.7 + 0.5 * e);
    c.rotation.set(Math.PI / 2 + (1 - e) * Math.PI * 2 - 0.25, 0, (j % 2 ? 1 : -1) * 0.25 * (1 - e));
    faceM.opacity = sideM.opacity = 1;
    if (p > 0.75) { const o = 1 - (p - 0.75) / 0.25; c.material.forEach((m) => (m.opacity = o)); }
  });
  // Advizr logo
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

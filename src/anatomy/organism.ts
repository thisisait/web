/* The specimen: nOS drawn as a medusa. A thick translucent bell (the organism's
   boundary), a manubrium with one mouth (the Gatehouse), gastric pouches (the
   Stores), radial and ring canals (veins), a marginal nerve ring with eight
   rhopalia (senses, the Watch) and pacemakers (Pulse, the Clockwork), four oral
   arms (the Wits) and trailing tentacles that end in bounded hands (limbs),
   hitch-hikers under the bell (symbionts), a helix in the stalk (genome).
   Three.js, framework-free; Anatomy.tsx mounts it. */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { fbm, rng } from "./noise";
import { causticTexture, normalTexture } from "./textures";
import { PARTS, type LayerId, partById } from "./parts";

export interface Projected { id: string; x: number; y: number; visible: boolean }
export interface OrganismOptions {
  onHover?: (id: string | null) => void;
  onSelect?: (id: string) => void;
  onFrame?: (items: Projected[], breathing: number) => void;
  reducedMotion?: boolean;
}

type Flesh = THREE.MeshPhysicalMaterial;
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

interface PartRec { meshes: THREE.Object3D[]; anchor: THREE.Vector3; layer: LayerId }

export class Organism {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private body = new THREE.Group();
  private parts = new Map<string, PartRec>();
  private pickables: THREE.Object3D[] = [];
  private cut = new THREE.Plane(V(0, 0, -1), 3.6);
  private cutDepth = 0.35;
  private layers = new Map<LayerId, boolean>();
  private running = true;
  private raf = 0;
  private visible = true;
  private t = 0;
  private last = 0;
  private hovered: string | null = null;
  private selected: string | null = null;
  private ray = new THREE.Raycaster();
  private ptr = new THREE.Vector2();
  private ptrIn = false;
  private downAt: [number, number] | null = null;
  private ro: ResizeObserver;
  private io: IntersectionObserver;
  private swayUniforms: { value: number }[] = [];
  private anim: Array<(t: number, dt: number, breath: number) => void> = [];
  private highlightColor = new THREE.Color(0x6a8cd3);
  private disposed = false;
  // shared shader state: one clock, one caustic sheet, two normal maps, the sun's direction
  private uTime = { value: 0 };
  private causticTex!: THREE.Texture;
  private skinN!: THREE.Texture;
  private bellN!: THREE.Texture;
  private sunDir = new THREE.Vector3(-3, 12, 6).normalize();

  constructor(private el: HTMLElement, private opts: OrganismOptions = {}) {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    el.appendChild(canvas);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.localClippingEnabled = true;
    this.scene.environment = new THREE.PMREMGenerator(this.renderer).fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.fog = new THREE.FogExp2(0x07182b, 0.028);

    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 120);
    this.camera.position.set(2.2, 1.2, 13.2);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.target.set(0, -0.55, 0);
    this.controls.minDistance = 8;
    this.controls.maxDistance = 26;
    this.controls.enablePan = false;
    this.controls.autoRotate = !opts.reducedMotion;
    this.controls.autoRotateSpeed = 0.3;
    this.running = !opts.reducedMotion;

    for (const l of ["bell", "systems", "host", "canals", "nerves", "wiring", "limbs", "symbionts", "cells", "genome", "habitat", "vision"] as LayerId[]) this.layers.set(l, true);

    this.causticTex = causticTexture(512, 9, 2);
    this.skinN = normalTexture(512, 7, 2.4, 1, true);
    this.bellN = normalTexture(512, 4, 1.4, 5);
    this.lights();
    this.water();
    this.scene.add(this.body);
    this.build();
    this.applyLayers();

    canvas.addEventListener("pointermove", this.onMove);
    canvas.addEventListener("pointerleave", () => { this.ptrIn = false; this.setHover(null); });
    canvas.addEventListener("pointerdown", (e) => { this.downAt = [e.clientX, e.clientY]; });
    canvas.addEventListener("pointerup", (e) => {
      if (this.downAt && Math.hypot(e.clientX - this.downAt[0], e.clientY - this.downAt[1]) < 6 && this.hovered) this.select(this.hovered);
      this.downAt = null;
    });
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(el);
    this.io = new IntersectionObserver((es) => { this.visible = es[0].isIntersecting; if (this.visible) this.kick(); }, { rootMargin: "80px" });
    this.io.observe(el);
    this.resize();
    this.kick();
  }

  // ── public API ─────────────────────────────────────────────────────────
  setLayer(id: LayerId, on: boolean) { this.layers.set(id, on); this.applyLayers(); }
  setCut(amount: number) { this.cutDepth = 3.6 - amount * 7.2; }
  setRunning(on: boolean) { this.running = on; }
  setAutoRotate(on: boolean) { this.controls.autoRotate = on; }
  get isRunning() { return this.running; }
  get autoRotate() { return this.controls.autoRotate; }
  select(id: string) { this.selected = id; this.paint(); this.opts.onSelect?.(id); }
  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect(); this.io.disconnect(); this.controls.dispose();
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose()); else mat?.dispose();
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  // ── scene furniture ────────────────────────────────────────────────────
  private lights() {
    const sun = new THREE.DirectionalLight(0xdff3ff, 3.0); sun.position.set(-3, 12, 6); this.scene.add(sun);
    const rim = new THREE.DirectionalLight(0x5fb3d6, 1.4); rim.position.set(6, -4, -8); this.scene.add(rim);
    const under = new THREE.PointLight(0x2a63a8, 18, 20, 1.6); under.position.set(0, -4.5, 1); this.scene.add(under);
    this.scene.add(new THREE.HemisphereLight(0x8fc3e8, 0x040b16, 0.45));
  }
  private water() {
    // backdrop: deep water gradient on an inverted sphere
    const bg = new THREE.Mesh(new THREE.SphereGeometry(60, 32, 16), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: { top: { value: new THREE.Color(0x12415f) }, bottom: { value: new THREE.Color(0x02070f) } },
      vertexShader: "varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader: "uniform vec3 top,bottom;varying vec3 p;void main(){float h=smoothstep(-40.,55.,p.y);gl_FragColor=vec4(mix(bottom,top,h),1.);}",
    }));
    this.scene.add(bg);
    // light shafts: additive fans from above, slowly swinging
    const shaftTex = (() => {
      const c = document.createElement("canvas"); c.width = 64; c.height = 256; const g = c.getContext("2d")!;
      const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "rgba(190,230,255,.55)"); gr.addColorStop(1, "rgba(190,230,255,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 64, 256);
      const gx = g.createLinearGradient(0, 0, 64, 0); gx.addColorStop(0, "rgba(0,0,0,1)"); gx.addColorStop(.5, "rgba(0,0,0,0)"); gx.addColorStop(1, "rgba(0,0,0,1)");
      g.globalCompositeOperation = "destination-out"; g.fillStyle = gx; g.fillRect(0, 0, 64, 256);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
    })();
    const shafts = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1.4 + i * .5, 26), new THREE.MeshBasicMaterial({ map: shaftTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: .35, fog: false }));
      m.position.set(-6 + i * 3.1, 6, -7 - (i % 2) * 4); m.rotation.z = (i - 2) * .06; shafts.add(m);
    }
    this.scene.add(shafts);
    this.anim.push((t) => { shafts.children.forEach((m, i) => { m.rotation.z = (i - 2) * .06 + Math.sin(t * .11 + i) * .035; }); shafts.quaternion.copy(this.camera.quaternion).setFromAxisAngle(V(0, 1, 0), Math.atan2(this.camera.position.x, this.camera.position.z)); });
    // marine snow
    const n = 700, pos = new Float32Array(n * 3), R = rng(11);
    for (let i = 0; i < n; i++) { pos[i * 3] = (R() - .5) * 30; pos[i * 3 + 1] = (R() - .5) * 24; pos[i * 3 + 2] = (R() - .5) * 24; }
    const snow = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(pos, 3)),
      new THREE.PointsMaterial({ color: 0xcfe6f4, size: .045, transparent: true, opacity: .55, depthWrite: false }));
    this.scene.add(snow);
    this.anim.push((t, dt) => { const a = snow.geometry.attributes.position as THREE.BufferAttribute; for (let i = 0; i < n; i++) { let y = a.getY(i) - dt * (.08 + (i % 5) * .02); if (y < -12) y = 12; a.setY(i, y); a.setX(i, a.getX(i) + Math.sin(t * .3 + i) * dt * .02); } a.needsUpdate = true; });
    // heartbeat: liveness rings sent from inside, every 2.4 s
    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const r = new THREE.Mesh(new THREE.RingGeometry(1, 1.03, 128), new THREE.MeshBasicMaterial({ color: 0x5fb3d6, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, fog: false }));
      r.rotation.x = -Math.PI / 2; r.position.y = -.3; this.scene.add(r); rings.push(r);
    }
    this.reg("heartbeat", rings, V(4.2, -.3, 3.4), true);
    this.reg("habitat", [snow, shafts], V(-5.4, 3.2, -1), true);
    let beatAt = 0;
    this.anim.push((t) => { if (t - beatAt > 2.4) beatAt = t; rings.forEach((r, i) => { const a = t - beatAt - i * .3, k = Math.max(0, a) / 2.1; r.scale.setScalar(3.2 + k * 4.5); (r.material as THREE.MeshBasicMaterial).opacity = this.layers.get("habitat") && a > 0 ? .28 * (1 - k) : 0; }); });
  }

  // ── materials & geometry helpers ───────────────────────────────────────
  private flesh(color: number, o: Partial<THREE.MeshPhysicalMaterialParameters> = {}, fx: { sss?: number; caustic?: number; sssColor?: number } = {}): Flesh {
    const m = new THREE.MeshPhysicalMaterial({ color, roughness: .42, metalness: 0, clearcoat: .8, clearcoatRoughness: .28, sheen: .9, sheenRoughness: .5,
      sheenColor: new THREE.Color(color).lerp(new THREE.Color(0xffffff), .4), normalMap: this.skinN, normalScale: new THREE.Vector2(.45, .45), ...o });
    return this.enhance(m, { sss: .75, caustic: .9, ...fx });
  }
  /** subsurface scattering (wrapped back-light through the surface) + caustics projected from the sun above.
      Chains with an existing onBeforeCompile (the sway) and shares one program across every material. */
  private enhance<M extends THREE.Material>(mat: M, o: { sss?: number; caustic?: number; sssColor?: number }): M {
    const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey.bind(mat);
    mat.onBeforeCompile = (sh, r) => {
      prev?.call(mat, sh, r);
      Object.assign(sh.uniforms, { uTime: this.uTime, uCaustic: { value: this.causticTex }, uCau: { value: o.caustic ?? 0 }, uSSS: { value: o.sss ?? 0 },
        uSSSColor: { value: new THREE.Color(o.sssColor ?? 0xffa386) }, uSun: { value: this.sunDir } });
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vWPos;")
        .replace("#include <worldpos_vertex>", "#include <worldpos_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.)).xyz;");
      sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nuniform float uTime, uCau, uSSS; uniform sampler2D uCaustic; uniform vec3 uSSSColor, uSun; varying vec3 vWPos;")
        .replace("#include <lights_fragment_end>", `#include <lights_fragment_end>
  vec3 wN = inverseTransformDirection(normal, viewMatrix);
  vec3 wV = normalize(cameraPosition - vWPos);
  // caustics: the sun's light web refracted by the surface, projected straight down and scrolled two ways
  vec2 cuv = vWPos.xz * 0.3;
  float c1 = texture2D(uCaustic, cuv + vec2(uTime * 0.026, uTime * 0.017)).r;
  float c2 = texture2D(uCaustic, cuv * 1.37 - vec2(uTime * 0.021, -uTime * 0.029)).r;
  float cau = min(c1, c2) * 2.4 + 0.35 * c1 * c2;
  reflectedLight.directDiffuse += diffuseColor.rgb * cau * uCau * clamp(wN.y * 0.8 + 0.2, 0.0, 1.0);
  // subsurface: light from behind leaks through, wrapped around the normal; thin edges glow warmest
  vec3 sH = normalize(-uSun + wN * 0.4);
  float thin = 1.0 - clamp(dot(wN, wV), 0.0, 1.0);
  float sss = pow(clamp(dot(wV, -sH), 0.0, 1.0), 2.4) * 1.3 + 0.22 * (0.4 + 0.6 * thin) * clamp(dot(wN, -uSun) * 0.5 + 0.5, 0.0, 1.0);
  reflectedLight.indirectDiffuse += uSSSColor * diffuseColor.rgb * sss * uSSS;`);
    };
    mat.customProgramCacheKey = () => prevKey() + "|enh";
    return mat;
  }
  private reg(id: string, meshes: THREE.Object3D[], anchor?: THREE.Vector3, world = false) {
    const rec = this.parts.get(id) ?? { meshes: [], anchor: anchor ?? V(0, 0, 0), layer: partById(id).layer };
    for (const m of meshes) { m.userData.id = id; rec.meshes.push(m); if ((m as THREE.Mesh).isMesh || (m as THREE.InstancedMesh).isInstancedMesh) this.pickables.push(m); }
    if (anchor) rec.anchor = anchor.clone(); rec.meshes.forEach((m) => (m.userData.world = world));
    (rec as PartRec & { world?: boolean }).world = world;
    this.parts.set(id, rec);
  }
  /** displaced icosphere: pushed along the normal by fbm; ridged = gyri */
  private blob(rad: THREE.Vector3, { detail = 20, amp = .12, freq = 2.2, seed = 0, ridged = false }: { detail?: number; amp?: number; freq?: number; seed?: number; ridged?: boolean } = {}) {
    const g = new THREE.IcosahedronGeometry(1, detail), pos = g.attributes.position as THREE.BufferAttribute, uv = g.attributes.uv as THREE.BufferAttribute, v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).normalize();
      let n = fbm(v.x * freq + seed, v.y * freq + seed * 1.7, v.z * freq - seed);
      if (ridged) n = Math.pow(1 - Math.abs(n * 2 - 1), 2.2);
      uv.setXY(i, Math.atan2(v.z, v.x) / (Math.PI * 2) + .5, Math.asin(Math.max(-1, Math.min(1, v.y))) / Math.PI + .5);
      v.multiplyScalar(1 + amp * (n - .5)); pos.setXYZ(i, v.x * rad.x, v.y * rad.y, v.z * rad.z);
    }
    g.computeVertexNormals(); return g;
  }
  /** tube with a radius function along a curve; uv.x is the along-curve parameter (used by sway) */
  private taper(curve: THREE.Curve<THREE.Vector3>, segs: number, radial: number, r: (t: number) => number) {
    const fr = curve.computeFrenetFrames(segs, false), P: number[] = [], N: number[] = [], U: number[] = [], I: number[] = [];
    for (let i = 0; i <= segs; i++) {
      const t = i / segs, c = curve.getPointAt(t), rr = r(t);
      for (let j = 0; j <= radial; j++) {
        const a = (j / radial) * Math.PI * 2, n = fr.normals[i].clone().multiplyScalar(Math.cos(a)).add(fr.binormals[i].clone().multiplyScalar(Math.sin(a)));
        P.push(c.x + n.x * rr, c.y + n.y * rr, c.z + n.z * rr); N.push(n.x, n.y, n.z); U.push(t, j / radial);
      }
    }
    for (let i = 0; i < segs; i++) for (let j = 0; j < radial; j++) { const a = i * (radial + 1) + j, b = a + radial + 1; I.push(a, b, a + 1, b, b + 1, a + 1); }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(P, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(N, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(U, 2)); g.setIndex(I);
    return g;
  }
  /** vertex sway for trailing parts: displacement grows with uv.x (distance from the root) */
  private swaying(mat: THREE.Material, seed: number, amp = .35) {
    const u = { value: 0 }; this.swayUniforms.push(u);
    mat.customProgramCacheKey = () => "sway";
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uSway = u; sh.uniforms.uSeed = { value: seed }; sh.uniforms.uAmp = { value: amp };
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nuniform float uSway,uSeed,uAmp;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nfloat k=uv.x*uv.x;transformed.x+=sin(uSway*.7+uv.x*3.5+uSeed)*uAmp*k;transformed.z+=cos(uSway*.55+uv.x*2.8+uSeed*1.3)*uAmp*.8*k;transformed.y+=sin(uSway*.4+uSeed)*.08*k;");
    };
    return mat;
  }
  /** bell: a thick-walled lathe (outer surface down to the margin, back up the inner surface), scalloped in 8 lobes */
  private bellGeometry(R = 3.0, H = 2.45, wall = .34, segs = 160, rings = 72) {
    // profile: t 0..1 outer apex -> margin, 1..2 inner margin -> inner apex
    const prof = (t: number): [number, number] => {
      if (t <= 1) { const a = t * Math.PI / 2; return [Math.sin(a) * R * (1 + .06 * Math.pow(t, 6)), Math.cos(a) * H]; }
      const s = 2 - t, a = s * Math.PI / 2; return [Math.sin(a) * (R - wall) - .05 * s, Math.cos(a) * (H - wall * 1.3) + .12];
    };
    const P: number[] = [], N: number[] = [], I: number[] = [], U: number[] = [];
    for (let i = 0; i <= rings; i++) {
      const t = (i / rings) * 2, [r0, y0] = prof(t), inner = t > 1;
      for (let j = 0; j <= segs; j++) {
        const th = (j / segs) * Math.PI * 2, lobe = 1 + .035 * Math.cos(8 * th) * Math.pow(Math.min(t, 2 - t), 2.2);
        const nz = fbm(Math.cos(th) * 1.8 + 7, (inner ? 2 - t : t) * 2.4, Math.sin(th) * 1.8 - 3) - .5;
        const r = r0 * lobe * (1 + .05 * nz), y = y0 + .08 * nz * Math.min(t, 2 - t);
        P.push(Math.cos(th) * r, y, Math.sin(th) * r); U.push(j / segs, t / 2);
        N.push(0, 0, 0);
      }
    }
    for (let i = 0; i < rings; i++) for (let j = 0; j < segs; j++) { const a = i * (segs + 1) + j, b = a + segs + 1; I.push(a, a + 1, b, b, a + 1, b + 1); }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(P, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(U, 2)); g.setIndex(I); g.computeVertexNormals();
    return g;
  }
  /** a point on the bell's outer surface in direction d (unit, y >= 0) */
  private onBell(d: THREE.Vector3, R = 3.0, H = 2.45) {
    const v = d.clone().normalize(), a = Math.acos(Math.max(0, Math.min(1, v.y))), t = a / (Math.PI / 2);
    const r = Math.sin(a) * R * (1 + .06 * Math.pow(t, 6)), th = Math.atan2(v.z, v.x);
    return V(Math.cos(th) * r, Math.cos(a) * H, Math.sin(th) * r);
  }

  // ── the specimen ───────────────────────────────────────────────────────
  private build() {
    const B = this.body, R = rng(5);
    // bell (the organism) — clipped by the cut, so the wall and the cavity read
    const bellGeo = this.bellGeometry();
    const bell = new THREE.Mesh(bellGeo, this.enhance(new THREE.MeshPhysicalMaterial({ color: 0xf7e4de, roughness: .22, transmission: .78, thickness: 1.4, ior: 1.34,
      attenuationColor: new THREE.Color(0xe39a8e), attenuationDistance: 3.2, clearcoat: 1, clearcoatRoughness: .08, side: THREE.DoubleSide, clippingPlanes: [this.cut], clipShadows: true,
      normalMap: this.bellN, normalScale: new THREE.Vector2(.3, .3), clearcoatNormalMap: this.bellN, clearcoatNormalScale: new THREE.Vector2(.5, .5) }), { sss: 1.3, caustic: .8, sssColor: 0xffb49c }));
    B.add(bell); this.reg("organism", [bell], V(-2.3, 1.75, 1.3));
    const cutFace = new THREE.Mesh(bellGeo, this.enhance(new THREE.MeshPhysicalMaterial({ color: 0xf0c9bf, roughness: .55, sheen: 1, sheenColor: new THREE.Color(0xffe0d6), side: THREE.BackSide, clippingPlanes: [this.cut], transparent: true, opacity: .7, normalMap: this.bellN, normalScale: new THREE.Vector2(.6, .6) }), { sss: 1.0, caustic: .3 }));
    B.add(cutFace); this.parts.get("organism")!.meshes.push(cutFace);
    this.reg("converge", [], V(2.95, .05, 1.1));

    // ── manubrium + mouth (Gatehouse) + genome helix inside
    const manCurve = new THREE.CatmullRomCurve3([V(0, 1.0, 0), V(.04, .3, .03), V(-.03, -.5, -.02), V(0, -1.3, 0), V(.02, -1.75, 0)]);
    const manubrium = new THREE.Mesh(this.taper(manCurve, 48, 24, (t) => .34 - .08 * t + .03 * Math.sin(t * 14)), this.enhance(new THREE.MeshPhysicalMaterial({ color: 0xf1cfc4, roughness: .3, transmission: .7, thickness: .6, ior: 1.3, clearcoat: .8, attenuationColor: new THREE.Color(0xe8a89a), attenuationDistance: 1.5, normalMap: this.skinN, normalScale: new THREE.Vector2(.3, .3) }), { sss: 1.1, caustic: .4 }));
    B.add(manubrium); this.reg("organism", [manubrium]);
    const mouthShape = (() => { const pts: THREE.Vector3[] = []; for (let i = 0; i <= 64; i++) { const a = (i / 64) * Math.PI * 2, r = .42 + .12 * Math.cos(4 * a); pts.push(V(Math.cos(a) * r, -1.78 - .05 * Math.cos(4 * a), Math.sin(a) * r)); } return new THREE.CatmullRomCurve3(pts, true); })();
    const mouth = new THREE.Mesh(new THREE.TubeGeometry(mouthShape, 128, .11, 12, true), this.flesh(0xc46d62, { roughness: .3, clearcoat: 1 }));
    B.add(mouth); this.reg("gatehouse", [mouth], V(.5, -1.85, .5));
    const helix = new THREE.Group();
    for (const ph of [0, Math.PI]) {
      const pts: THREE.Vector3[] = []; for (let i = 0; i <= 140; i++) { const t = i / 140, a = t * Math.PI * 9 + ph; pts.push(V(Math.cos(a) * .13, .85 - t * 2.45, Math.sin(a) * .13)); }
      helix.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 240, .022, 8), this.flesh(0x8a5cc8, { emissive: 0x2a1444, emissiveIntensity: .6, roughness: .3 })));
    }
    for (let i = 0; i < 30; i++) { const t = i / 30, a = t * Math.PI * 9; const r = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, .26, 6), this.flesh(0xc9a6ee, { emissive: 0x3a2060 })); r.position.set(0, .85 - t * 2.45, 0); r.rotation.z = Math.PI / 2; r.rotation.y = -a; helix.add(r); }
    B.add(helix); this.reg("genome", helix.children, V(.3, -.4, .35));

    // ── gastric pouches (Stores) around the stalk, Hippocampus coiling into one, Keel below
    const storeMat = this.flesh(0xa65a4c, { roughness: .32, clearcoat: 1, normalScale: new THREE.Vector2(.7, .7) }, { sss: 1.1, sssColor: 0xff7a5a });
    const stores: THREE.Mesh[] = [];
    for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4, m = new THREE.Mesh(this.blob(V(.62, .42, .5), { amp: .3, freq: 1.8, seed: 7 + k }), storeMat); m.position.set(Math.cos(a) * .95, .72, Math.sin(a) * .95); m.rotation.y = -a; B.add(m); stores.push(m); }
    this.reg("stores", stores, V(1.4, .95, 1.0));
    const hip = new THREE.CatmullRomCurve3([V(.15, .95, .1), V(.55, 1.05, .35), V(.95, .9, .65), V(1.0, .62, .75), V(.75, .55, .6)]);
    const hippo = new THREE.Mesh(this.taper(hip, 70, 14, (t) => .11 * (1 - .4 * t) + .02 * Math.sin(t * 36)), this.flesh(0xd49a8c));
    B.add(hippo); this.reg("hippocampus", [hippo], V(.95, 1.05, .75));
    const keel = new THREE.Mesh(new THREE.TorusGeometry(.78, .2, 20, 72), this.flesh(0xe6d6bf, { roughness: .6, sheen: .3, clearcoat: .4 }));
    keel.rotation.x = Math.PI / 2; keel.position.y = .12; keel.scale.y = .7; B.add(keel); this.reg("keel", [keel], V(-.9, -.05, .5));

    // ── Cortex (gyri) at the apex of the cavity, Thalamus beneath, Vault behind, Ears, Pupil on the exumbrella
    const cortex = new THREE.Mesh(this.blob(V(.78, .5, .66), { detail: 36, amp: .26, freq: 3.6, seed: 1, ridged: true }), this.flesh(0xd8aaa0, { roughness: .5 }));
    cortex.position.set(0, 1.42, 0); B.add(cortex); this.reg("cortex", [cortex], V(.2, 1.95, .6));
    const thalMat = this.flesh(0xc98c84), thal: THREE.Mesh[] = [];
    for (const s of [-1, 1]) { const t = new THREE.Mesh(this.blob(V(.22, .17, .27), { detail: 14, amp: .1, seed: s + 4 }), thalMat); t.position.set(s * .22, 1.02, .08); B.add(t); thal.push(t); }
    this.reg("thalamus", thal, V(-.25, 1.1, .35));
    const vault = new THREE.Mesh(this.blob(V(.34, .42, .3), { detail: 16, amp: .14, seed: 9 }), this.flesh(0x4f353c, { roughness: .28, clearcoat: 1, sheen: .3 }));
    vault.position.set(-.25, 1.4, -.95); B.add(vault); this.reg("vault", [vault], V(-.35, 1.45, -1.25));
    const ears: THREE.Mesh[] = [];
    for (const s of [-1, 1]) {
      const base = this.onBell(V(s * .78, .55, .3)), pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 60; i++) { const t = i / 60, a = t * Math.PI * 4.5, r = .3 * (1 - t * .8); pts.push(base.clone().add(V(s * (.1 + t * .1), Math.sin(a) * r, Math.cos(a) * r))); }
      const e = new THREE.Mesh(this.taper(new THREE.CatmullRomCurve3(pts), 140, 12, (t) => .1 * (1 - t * .7)), this.flesh(0xd7a99a)); B.add(e); ears.push(e);
    }
    this.reg("ears", ears, this.onBell(V(.78, .55, .3)).add(V(.3, .25, .1)));
    // the eye
    const irisTex = (() => {
      const c = document.createElement("canvas"); c.width = 1024; c.height = 512; const g = c.getContext("2d")!;
      g.fillStyle = "#f1ebe4"; g.fillRect(0, 0, 1024, 512);
      const RR = rng(3);
      for (let i = 0; i < 80; i++) { g.strokeStyle = `rgba(160,40,40,${.05 + RR() * .08})`; g.lineWidth = .6 + RR(); g.beginPath(); let x = RR() * 1024, y = RR() > .5 ? 0 : 512; g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (RR() - .5) * 60; y += (y < 256 ? 1 : -1) * 22; g.lineTo(x, y); } g.stroke(); }
      const cx = 512, cy = 256, Ri = 86, gr = g.createRadialGradient(cx, cy, 20, cx, cy, Ri);
      gr.addColorStop(0, "#8a6a3e"); gr.addColorStop(.38, "#8a6a3e"); gr.addColorStop(.48, "#4f7099"); gr.addColorStop(.9, "#35506f"); gr.addColorStop(1, "#1d2a3b");
      g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, Ri, 0, 7); g.fill();
      for (let i = 0; i < 360; i++) { const a = (i / 360) * Math.PI * 2, r0 = 26 + RR() * 7, r1 = Ri - RR() * 12; g.strokeStyle = `rgba(${RR() > .5 ? "220,230,240" : "20,30,45"},${.08 + RR() * .16})`; g.lineWidth = .8; g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); g.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); g.stroke(); }
      g.fillStyle = "#07080a"; g.beginPath(); g.arc(cx, cy, 28, 0, 7); g.fill();
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
    })();
    const eye = new THREE.Group(), eyeball = new THREE.Mesh(new THREE.SphereGeometry(.36, 64, 48), new THREE.MeshPhysicalMaterial({ map: irisTex, roughness: .08, clearcoat: 1, clearcoatRoughness: .02 }));
    const lid = new THREE.Mesh(new THREE.TorusGeometry(.37, .09, 20, 64), this.flesh(0xd2a08f));
    eye.add(eyeball, lid); const eyePos = this.onBell(V(.3, .6, .74)); eye.position.copy(eyePos); B.add(eye);
    this.reg("pupil", [eyeball, lid], eyePos.clone().add(V(.25, .35, .25)));
    const q = new THREE.Quaternion(), look = new THREE.Vector3(), ew = new THREE.Vector3();
    this.anim.push(() => {
      eye.getWorldPosition(ew);
      if (this.ptrIn) { this.ray.setFromCamera(this.ptr, this.camera); look.copy(this.ray.ray.origin).addScaledVector(this.ray.ray.direction, this.camera.position.distanceTo(ew) * .8); } else look.copy(this.camera.position);
      const lp = eye.worldToLocal(look.clone()).normalize();
      q.setFromUnitVectors(V(0, 0, 1), lp).multiply(new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0), -Math.PI / 2));
      eyeball.quaternion.slerp(q, .12); lid.lookAt(this.camera.position);
    });

    // ── gonads (Forge), Archive lamellae, Commons, Backoffice, Receptor pore, tissue graft
    const forge: THREE.Mesh[] = [];
    for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2, m = new THREE.Mesh(new THREE.TorusGeometry(.36, .13, 16, 48, Math.PI * 1.25), this.flesh(0xd3a496, { roughness: .35 })); m.position.set(Math.cos(a) * 1.55, .42, Math.sin(a) * 1.55); m.rotation.set(Math.PI / 2, 0, -a + Math.PI * .35); B.add(m); forge.push(m); }
    this.reg("forge", forge, V(1.85, .6, .35));
    const arch = new THREE.Group();
    for (let i = 0; i < 7; i++) { const d = new THREE.Mesh(new THREE.CylinderGeometry(.42 - i * .03, .45 - i * .03, .06, 36), this.flesh(0xc59a7d, { roughness: .6 })); d.position.y = i * .1; arch.add(d); }
    arch.position.set(-1.45, .5, .55); arch.rotation.z = .35; B.add(arch); this.reg("archive", arch.children, V(-1.8, 1.0, .9));
    const commons = new THREE.Mesh(this.blob(V(.5, .3, .42), { detail: 18, amp: .5, freq: 3.2, seed: 21 }), this.flesh(0xd6a294, { roughness: .5, sheen: 1 }));
    commons.position.set(1.35, .95, -.95); B.add(commons); this.reg("commons", [commons], V(1.7, 1.25, -1.0));
    const back = new THREE.Group(); const bm = this.flesh(0xc8a58e, { roughness: .55 });
    for (let i = 0; i < 9; i++) { const t = new THREE.Mesh(new THREE.CapsuleGeometry(.055, .32, 6, 10), bm); t.position.set((i % 3) * .13 - .13, Math.floor(i / 3) * .11 - .1, (i % 2) * .12 - .06); t.rotation.z = .5; back.add(t); }
    back.position.set(-1.35, .9, -.95); B.add(back); this.reg("backoffice", back.children, V(-1.75, 1.15, -1.05));
    const recPos = this.onBell(V(-.9, .35, -.35)), rec = new THREE.Mesh(new THREE.TorusGeometry(.14, .05, 12, 32), this.flesh(0xb7745e));
    rec.position.copy(recPos); rec.lookAt(recPos.clone().multiplyScalar(2)); B.add(rec); this.reg("receptor", [rec], recPos.clone().add(V(-.3, .15, -.2)));
    const graft = new THREE.Group(), gp = this.onBell(V(-.55, .7, .55)), gn = gp.clone().normalize();
    for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, s = new THREE.Mesh(new THREE.BoxGeometry(.05, .02, .14), this.flesh(0x7a4a40)); s.position.set(Math.cos(a) * .42, 0, Math.sin(a) * .42); s.rotation.y = -a; graft.add(s); }
    const patch = new THREE.Mesh(new THREE.CircleGeometry(.4, 48), new THREE.MeshPhysicalMaterial({ color: 0xe6b3a6, roughness: .5, transparent: true, opacity: .55, side: THREE.DoubleSide })); patch.rotation.x = -Math.PI / 2; graft.add(patch);
    graft.position.copy(gp).addScaledVector(gn, .03); graft.quaternion.setFromUnitVectors(V(0, 1, 0), gn); B.add(graft); this.reg("tissue", graft.children, gp.clone().add(V(-.3, .3, .3)));

    // ── canals: 16 radial (veins) from the pouches to a ring canal at the margin (Spine), Bone a pale strut
    const canals: THREE.Curve<THREE.Vector3>[] = [], canalMat = this.flesh(0x2a63a8, { roughness: .25, clearcoat: 1, sheenColor: new THREE.Color(0x9bb8e8), emissive: 0x0b1e3a, emissiveIntensity: .4, normalScale: new THREE.Vector2(.2, .2) }, { sss: .4, sssColor: 0x6aa6ff });
    const veinMeshes: THREE.Mesh[] = [];
    for (let k = 0; k < 16; k++) {
      const a = (k / 16) * Math.PI * 2 + Math.PI / 16, c = new THREE.CatmullRomCurve3([V(Math.cos(a) * .9, .78, Math.sin(a) * .9), V(Math.cos(a) * 1.7, .72 - .05 * (k % 2), Math.sin(a) * 1.7), V(Math.cos(a) * 2.35, .45, Math.sin(a) * 2.35), V(Math.cos(a) * 2.68, .12, Math.sin(a) * 2.68)]);
      canals.push(c); const m = new THREE.Mesh(this.taper(c, 40, 8, (t) => .05 - .02 * t), canalMat); B.add(m); veinMeshes.push(m);
      if (k % 2) { const b = (k / 16) * Math.PI * 2 + Math.PI / 16 + .11, bc = new THREE.CatmullRomCurve3([c.getPointAt(.6), V(Math.cos(b) * 2.45, .32, Math.sin(b) * 2.45), V(Math.cos(b) * 2.68, .12, Math.sin(b) * 2.68)]); const bm2 = new THREE.Mesh(this.taper(bc, 20, 6, () => .025), canalMat); B.add(bm2); veinMeshes.push(bm2); }
    }
    this.reg("veins", veinMeshes, canals[2].getPointAt(.5).add(V(0, .12, 0)));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.68, .055, 12, 160), canalMat); ring.rotation.x = Math.PI / 2; ring.position.y = .12; B.add(ring);
    this.reg("spine", [ring], V(-2.7, .2, -.6));
    const boneCurve = new THREE.CatmullRomCurve3([V(0, .95, .3), V(.1, .75, 1.3), V(.05, .4, 2.2), V(0, .15, 2.62)]);
    const bone = new THREE.Mesh(this.taper(boneCurve, 50, 12, (t) => .09 + .04 * Math.pow(Math.abs(t - .5) * 2, 4)), this.flesh(0xf2e8d8, { roughness: .55, sheen: .1, clearcoat: .3 }));
    B.add(bone); this.reg("bone", [bone], V(.15, .55, 1.75));

    // ── margin: nerve ring (Clockwork), 8 rhopalia (senses / Watch), Pulse the pacemaker, Wing the ganglion
    const nerveMat = new THREE.MeshPhysicalMaterial({ color: 0xe0a145, emissive: 0x7a4a08, emissiveIntensity: .6, roughness: .35, clearcoat: .6 });
    const nring = new THREE.Mesh(new THREE.TorusGeometry(2.55, .028, 8, 200), nerveMat); nring.rotation.x = Math.PI / 2; nring.position.y = .22; B.add(nring);
    this.reg("clockwork", [nring], V(2.6, .3, -.9));
    const rhop: THREE.Mesh[] = [];
    for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2 + Math.PI / 8, m = new THREE.Mesh(this.blob(V(.11, .16, .11), { detail: 10, amp: .12, seed: 30 + k }), this.flesh(0xe5b7a8, { emissive: 0x4a2a1a, emissiveIntensity: .3 })); m.position.set(Math.cos(a) * 2.78, .02, Math.sin(a) * 2.78); B.add(m); rhop.push(m); }
    this.reg("watch", rhop, V(2.6, -.05, 1.5));
    this.reg("senses", [], V(-2.1, -.1, 2.0));
    const pulse = new THREE.Mesh(this.blob(V(.2, .24, .2), { detail: 12, amp: .25, freq: 3, seed: 15 }), this.flesh(0xb7745e, { emissive: 0x2a63a8, emissiveIntensity: 0 }));
    pulse.position.set(0, .05, 2.75); B.add(pulse); this.reg("pulse", [pulse], V(.35, -.15, 2.95));
    const wing = new THREE.Mesh(this.blob(V(.26, .2, .22), { detail: 14, amp: .2, seed: 12 }), this.flesh(0xd9a35a, { emissive: 0x3a2200, emissiveIntensity: .4 }));
    wing.position.set(0, .3, -2.45); B.add(wing); this.reg("wing", [wing], V(-.3, .55, -2.65));
    // nerve net: from each rhopalium up the subumbrella to Wing; from Wing to the Voice photophores
    const nerveCurves: THREE.Curve<THREE.Vector3>[] = [], nerveMeshes: THREE.Mesh[] = [];
    rhop.forEach((r) => { const p = r.position, mid = V(p.x * .55, .95, p.z * .55), c = new THREE.CatmullRomCurve3([p.clone(), mid, wing.position.clone()]); nerveCurves.push(c); const m = new THREE.Mesh(new THREE.TubeGeometry(c, 36, .014, 5), nerveMat); B.add(m); nerveMeshes.push(m); });
    const voicePos = this.onBell(V(-.45, .78, -.45)), voice = new THREE.Group();
    for (let i = 0; i < 12; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(.05 + (i % 3) * .015, 12, 10), new THREE.MeshPhysicalMaterial({ color: 0xfff1c2, emissive: 0xffc46b, emissiveIntensity: 1.6, roughness: .2 })); const a = i * 2.4, rr = .12 + i * .035; s.position.set(Math.cos(a) * rr, 0, Math.sin(a) * rr); voice.add(s); }
    voice.position.copy(voicePos); voice.quaternion.setFromUnitVectors(V(0, 1, 0), voicePos.clone().normalize()); B.add(voice); this.reg("voice", voice.children, voicePos.clone().add(V(-.3, .4, -.3)));
    const toVoice = new THREE.CatmullRomCurve3([wing.position.clone(), V(-.3, 1.3, -1.6), voicePos.clone().multiplyScalar(.9)]); nerveCurves.push(toVoice);
    const tv = new THREE.Mesh(new THREE.TubeGeometry(toVoice, 36, .022, 6), nerveMat); B.add(tv); nerveMeshes.push(tv);
    this.reg("nerves", nerveMeshes, toVoice.getPointAt(.5));
    this.reg("reflex", [], canals[6].getPointAt(.45).add(V(0, .15, 0)));
    // sparks: reflexes along canals on Pulse's clock, nerve signals toward Wing and the Voice, engrams into the Hippocampus
    const glow = (() => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d")!, r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(.3, "rgba(255,255,255,.5)"); r.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
    const spark = (color: number, size: number) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); s.scale.setScalar(size); s.visible = false; B.add(s); return s; };
    type Spk = { s: THREE.Sprite; curve: THREE.Curve<THREE.Vector3> | null; t: number; speed: number };
    const mk = (n: number, color: number, size: number, speed: number): Spk[] => Array.from({ length: n }, () => ({ s: spark(color, size), curve: null, t: 0, speed }));
    const reflexes = mk(8, 0x8fb8ff, .28, .9), signals = mk(10, 0xffc46b, .2, 1.5), engrams = mk(4, 0xff9ed0, .18, 1.1);
    this.reg("reflex", reflexes.map((r) => r.s)); this.reg("engram", engrams.map((r) => r.s), V(.7, 1.3, .45));
    let nextR = 0, nextS = 0, nextE = 0;
    const fire = (arr: Spk[], curve: THREE.Curve<THREE.Vector3>) => { const r = arr.find((x) => !x.curve); if (r) { r.curve = curve; r.t = 0; r.s.visible = true; } };
    this.anim.push((t, dt) => {
      const tick = (t % 1.25) / 1.25; pulse.material.emissiveIntensity = Math.max(0, 1 - tick * 4) * 1.2; pulse.scale.setScalar(1 + .1 * Math.max(0, 1 - tick * 5));
      nerveMat.emissiveIntensity = .45 + .35 * Math.max(0, 1 - tick * 3);
      if (t > nextR && this.layers.get("canals")) { nextR = t + 1.25; fire(reflexes, canals[Math.floor(R() * canals.length)]); }
      if (t > nextS && this.layers.get("nerves")) { nextS = t + .35 + R() * .5; fire(signals, nerveCurves[Math.floor(R() * nerveCurves.length)]); }
      if (t > nextE && this.layers.get("vision")) { nextE = t + 2.2 + R() * 2; fire(engrams, hip); }
      for (const arr of [reflexes, signals, engrams]) for (const r of arr) if (r.curve) { r.t += dt * r.speed; if (r.t >= 1) { r.curve = null; r.s.visible = false; } else r.s.position.copy(r.curve.getPointAt(r.t)); }
    });

    // ── plugin wiring: pale threads that wire one organ to the others (SSO, dashboards, jobs)
    const wireMat = this.flesh(0xf3ebdc, { roughness: .7, sheen: 1, clearcoat: 0 }), wires: THREE.Mesh[] = [];
    const WIRES: [THREE.Vector3, THREE.Vector3][] = [[cortex.position, V(0, 1.02, .08)], [stores[0].position, forge[0].position], [commons.position, arch.position], [back.position, stores[2].position], [wing.position, stores[1].position], [mouth.position.clone().add(V(0, -1.6, 0)), stores[3].position], [vault.position, stores[1].position], [cortex.position, commons.position]];
    for (const [a, b] of WIRES) for (const o of [-.04, .04]) { const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([a.clone(), a.clone().lerp(b, .5).add(V(o, o * 2.5, o)), b.clone()]), 24, .011, 5), wireMat); B.add(m); wires.push(m); }
    this.reg("wiring", wires, stores[0].position.clone().lerp(forge[0].position, .5).add(V(.1, .1, .2)));

    // ── oral arms (Wits) from the stalk; tentacles from the margin (limbs) ending in three-finger grips
    const arms: THREE.Mesh[] = [];
    for (let k = 0; k < 4; k++) {
      const a = k * Math.PI / 2 + Math.PI / 4, dir = V(Math.cos(a), 0, Math.sin(a)), pts = [V(0, -1.1, 0)];
      for (let i = 1; i <= 6; i++) pts.push(dir.clone().multiplyScalar(.25 + i * .22 + Math.sin(i * 1.7 + k) * .12).add(V(0, -1.1 - i * .45, 0)));
      const c = new THREE.CatmullRomCurve3(pts), m = new THREE.Mesh(this.taper(c, 90, 16, (t) => .17 * (1 - .6 * t) + .035 * Math.sin(t * 50) * (1 - t)), this.swaying(this.flesh(0xd7a194, { roughness: .45, sheen: 1 }), k * 1.7, .3));
      B.add(m); arms.push(m);
    }
    this.reg("wits", arms, V(1.3, -2.3, 1.2));
    const tent: THREE.Object3D[] = [], tentMat = this.flesh(0xbf8c80, { roughness: .4, sheen: 1 }), handMat = this.flesh(0xdcb4a6);
    for (let k = 0; k < 28; k++) {
      const a = (k / 28) * Math.PI * 2 + .07, r0 = 2.72 + (k % 3) * .04, len = 2.6 + R() * 1.6, pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 5; i++) { const t = i / 5; pts.push(V(Math.cos(a) * (r0 + t * (.4 + R() * .5)) + Math.sin(t * 5 + k) * .15 * t, .02 - t * len, Math.sin(a) * (r0 + t * (.4 + R() * .5)) + Math.cos(t * 4 + k) * .15 * t)); }
      const c = new THREE.CatmullRomCurve3(pts), m = new THREE.Mesh(this.taper(c, 60, 7, (t) => .05 * (1 - .55 * t)), this.swaying(tentMat.clone(), k * .9, .5));
      B.add(m); tent.push(m);
      if (k % 4 === 0) { // bounded hand: three short fingers at the tip
        const tip = c.getPointAt(1), tan = c.getTangentAt(1), hand = new THREE.Group();
        for (let f = 0; f < 3; f++) { const fg = new THREE.Mesh(new THREE.ConeGeometry(.028, .22, 8), handMat); fg.position.copy(tip); fg.quaternion.setFromUnitVectors(V(0, 1, 0), tan.clone().add(V(Math.cos(f * 2.1) * .5, 0, Math.sin(f * 2.1) * .5)).normalize()); fg.translateY(.1); hand.add(fg); }
        B.add(hand); tent.push(...hand.children);
      }
    }
    this.reg("limbs", tent, V(2.9, -2.2, .9));
    // immune: cnidocils — sensor hairs along two tentacles that only report
    const imm: THREE.Mesh[] = [];
    for (let i = 0; i < 18; i++) { const h = new THREE.Mesh(new THREE.SphereGeometry(.035, 8, 6), new THREE.MeshPhysicalMaterial({ color: 0xffd9c8, emissive: 0xd48a6c, emissiveIntensity: 1.2 })); const t = i / 18, a = .07 + (i % 2 ? 0 : Math.PI); h.position.set(Math.cos(a) * (2.75 + t * .6), -t * 2.4, Math.sin(a) * (2.75 + t * .6)); B.add(h); imm.push(h); }
    this.reg("immune", imm, V(2.85, -1.2, .35));

    // ── symbionts: hitch-hikers sheltering under the bell, each on its own joint
    const symMats = [this.flesh(0x3f8f86, { roughness: .5, sheen: 1, sheenColor: new THREE.Color(0xa6e0d6) }), this.flesh(0xc9a24a, { roughness: .6, sheen: 1 }), this.flesh(0x6b8f4a, { roughness: .55, sheen: 1 })];
    const sym: THREE.Object3D[] = [], symGroups: THREE.Group[] = [];
    for (let i = 0; i < 6; i++) {
      const g = new THREE.Group(), a = i * 1.05 + .4, r = 1.3 + (i % 3) * .35, mat = symMats[i % 3];
      const bodyM = new THREE.Mesh(this.blob(V(.3, .11, .1), { detail: 12, amp: .15, seed: 40 + i }), mat), tail = new THREE.Mesh(new THREE.ConeGeometry(.09, .22, 8), mat);
      tail.rotation.z = Math.PI / 2; tail.position.x = -.36; g.add(bodyM, tail);
      g.position.set(Math.cos(a) * r, -.75 - (i % 2) * .5, Math.sin(a) * r); g.rotation.y = -a + Math.PI / 2; B.add(g); symGroups.push(g); sym.push(bodyM, tail);
    }
    for (let i = 0; i < 3; i++) { const p = this.onBell(V(Math.cos(i * 2.2) * .8, .35 + i * .12, Math.sin(i * 2.2) * .8)), g = new THREE.Group(); const mat = symMats[(i + 1) % 3]; for (let k = 0; k < 6; k++) { const s = new THREE.Mesh(new THREE.SphereGeometry(.05 + (k % 2) * .025, 10, 8), mat); s.position.set((k - 2.5) * .07, .04, Math.sin(k) * .04); g.add(s); sym.push(s); } g.position.copy(p); g.quaternion.setFromUnitVectors(V(0, 1, 0), p.clone().normalize()); B.add(g); }
    this.reg("symbionts", sym, symGroups[0].position.clone().add(V(.2, -.35, .3)));
    this.anim.push((t) => symGroups.forEach((g, i) => { g.position.y += Math.sin(t * 1.3 + i) * .0015; g.rotation.z = Math.sin(t * 2.2 + i) * .08; }));

    // ── cells: agents drifting through the canals
    const cellN = 70, cells = new THREE.InstancedMesh(new THREE.SphereGeometry(.04, 10, 8), this.flesh(0x9dbcf0, { roughness: .2, emissive: 0x1c2e58, emissiveIntensity: .8 }), cellN);
    const cellT = Array.from({ length: cellN }, (_, i) => [i % canals.length, R(), .05 + R() * .06]);
    B.add(cells); this.reg("cells", [cells], canals[9].getPointAt(.55).add(V(0, .1, 0)));
    const m4 = new THREE.Matrix4(), tmp = new THREE.Vector3();
    this.anim.push((_, dt) => { for (let i = 0; i < cellN; i++) { const c = cellT[i]; if (this.running) c[1] = (c[1] + dt * c[2]) % 1; canals[c[0]].getPointAt(c[1], tmp); m4.makeTranslation(tmp.x, tmp.y, tmp.z); cells.setMatrixAt(i, m4); } cells.instanceMatrix.needsUpdate = true; });

    // ── twin: the second organism, far behind, in mirror-parity
    const twin = new THREE.Mesh(bellGeo, new THREE.MeshPhysicalMaterial({ color: 0xa8c6e0, roughness: .3, transmission: .5, thickness: 1, transparent: true, opacity: .35, side: THREE.DoubleSide }));
    twin.position.set(-9, 2.5, -14); twin.scale.setScalar(.8); this.scene.add(twin); this.reg("twin", [twin], V(-9, 5.2, -14), true);
    this.anim.push((t) => { twin.position.y = 2.5 + Math.sin(t * .4) * .3; twin.scale.set(.8 - .03 * Math.max(0, Math.sin(t * .9 + 1)), .8 + .02 * Math.max(0, Math.sin(t * .9 + 1)), .8 - .03 * Math.max(0, Math.sin(t * .9 + 1))); });

    // ── propulsion = converge: the bell contracts and lengthens, the whole specimen rises on each stroke
    this.anim.push((t, _dt, breath) => {
      const c = Math.max(0, breath); B.scale.set(1 - .055 * c, 1 + .04 * c, 1 - .055 * c); B.position.y = .25 * Math.sin(t * Math.PI * 2 / 7 - .6);
      stores.forEach((s, i) => s.scale.setScalar(1 + .025 * Math.sin(t * 1.3 + i)));
    });
  }

  // ── picking, highlight ─────────────────────────────────────────────────
  private onMove = (e: PointerEvent) => {
    const r = this.renderer.domElement.getBoundingClientRect();
    this.ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); this.ptrIn = true;
    this.ray.setFromCamera(this.ptr, this.camera);
    const hits = this.ray.intersectObjects(this.pickables.filter((m) => m.visible), false);
    // the bell only counts where the cut has not opened it; the twin never blocks
    const hit = hits.find((h) => h.object.userData.id !== "twin" && !(h.object.userData.id === "organism" && this.cutDepth < 2.5 && this.cut.distanceToPoint(h.point) < 0));
    this.setHover(hit ? (hit.object.userData.id as string) : null);
  };
  private setHover(id: string | null) {
    if (id === this.hovered) return; this.hovered = id; this.paint();
    this.renderer.domElement.style.cursor = id ? "pointer" : "grab"; this.opts.onHover?.(id);
  }
  private paint() {
    for (const [id, p] of this.parts) for (const m of p.meshes) {
      const mesh = m as THREE.Mesh; const mat = mesh.material as THREE.MeshPhysicalMaterial | undefined;
      if (!mat || !("emissive" in mat) || id === "organism" || id === "twin") continue;
      if (!mesh.userData.base) mesh.userData.base = { e: mat.emissive.clone(), i: mat.emissiveIntensity };
      const on = id === this.selected || id === this.hovered;
      if (on && !mesh.userData.own) { mesh.material = mat.clone(); mesh.userData.own = true; }
      const mm = mesh.material as THREE.MeshPhysicalMaterial;
      if (on) { mm.emissive.copy(this.highlightColor); mm.emissiveIntensity = id === this.selected ? .7 : .4; }
      else if (mesh.userData.own) { mm.emissive.copy(mesh.userData.base.e); mm.emissiveIntensity = mesh.userData.base.i; }
    }
  }
  private applyLayers() {
    for (const [, p] of this.parts) for (const m of p.meshes) m.visible = !!this.layers.get(p.layer);
  }

  // ── loop ───────────────────────────────────────────────────────────────
  private resize() {
    const w = this.el.clientWidth, h = this.el.clientHeight; if (!w || !h) return;
    this.renderer.setSize(w, h, false); this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
  }
  private kick() { if (!this.raf && !this.disposed) { this.last = performance.now(); this.raf = requestAnimationFrame(this.frame); } }
  private frame = (now: number) => {
    this.raf = 0;
    if (this.disposed || !this.visible || document.hidden) return;
    // rAF stamps the frame start, which can precede the previous frame's own clock: never let dt go negative
    const dt = Math.max(0, Math.min(.05, (now - this.last) / 1000)); this.last = now;
    if (this.running) this.t += dt;
    const t = this.t, breath = Math.sin(t * Math.PI * 2 / 7);
    for (const u of this.swayUniforms) u.value = t;
    this.uTime.value = t;
    for (const a of this.anim) a(t, this.running ? dt : 0, breath);
    // the cut always faces the viewer: a cutaway toward the camera
    const n = this.camera.getWorldDirection(new THREE.Vector3()); this.cut.normal.copy(n); this.cut.constant = -this.cutDepth - n.dot(this.body.position);
    this.controls.update(); this.renderer.render(this.scene, this.camera);
    this.project(breath);
    this.raf = requestAnimationFrame(this.frame);
  };
  private project(breath: number) {
    if (!this.opts.onFrame) return;
    const w = this.el.clientWidth, h = this.el.clientHeight, v = new THREE.Vector3(), out: Projected[] = [];
    for (const p of PARTS) {
      const rec = this.parts.get(p.id); if (!rec) continue;
      v.copy(rec.anchor); if (!(rec as PartRec & { world?: boolean }).world) this.body.localToWorld(v);
      const d = v.distanceTo(this.camera.position); v.project(this.camera);
      out.push({ id: p.id, x: ((v.x + 1) / 2) * w, y: ((1 - v.y) / 2) * h, visible: !!this.layers.get(rec.layer) && v.z < 1 && d < 40 });
    }
    this.opts.onFrame(out, breath);
  }
}

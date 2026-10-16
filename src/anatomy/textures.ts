/* Procedural surface maps, generated once on a canvas so nothing is downloaded:
   - caustics: a cellular (Voronoi-edge) light web, tiled and scrolled by the shader
   - normal maps: height fields (fbm) turned into tangent-space normals
   Seeded, so the specimen looks the same on every visit. */
import * as THREE from "three";
import { fbm, rng } from "./noise";

function canvas(size: number) {
  const c = document.createElement("canvas"); c.width = c.height = size;
  return { c, g: c.getContext("2d")!, img: c.getContext("2d")!.createImageData(size, size) };
}

/** F2-F1 Voronoi edges, tileable: feature points live on a wrapped grid */
export function causticTexture(size = 512, cells = 9, seed = 2): THREE.Texture {
  const { c, g, img } = canvas(size), R = rng(seed), pts: [number, number][] = [];
  for (let j = 0; j < cells; j++) for (let i = 0; i < cells; i++) pts.push([(i + R()) / cells, (j + R()) / cells]);
  const at = (i: number, j: number) => pts[((j + cells) % cells) * cells + ((i + cells) % cells)];
  const d = img.data;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = x / size, v = y / size, ci = Math.floor(u * cells), cj = Math.floor(v * cells);
    let f1 = 9, f2 = 9;
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
      const p = at(ci + di, cj + dj); let px = p[0], py = p[1];
      if (ci + di < 0) px -= 1; if (ci + di >= cells) px += 1; if (cj + dj < 0) py -= 1; if (cj + dj >= cells) py += 1;
      const dd = Math.hypot(px - u, py - v); if (dd < f1) { f2 = f1; f1 = dd; } else if (dd < f2) f2 = dd;
    }
    const e = Math.pow(Math.max(0, 1 - (f2 - f1) * cells * 2.6), 2.4), k = (y * size + x) * 4;
    const val = Math.round(255 * Math.min(1, e * (0.75 + 0.5 * fbm(u * 7, v * 7, seed))));
    d[k] = d[k + 1] = d[k + 2] = val; d[k + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.NoColorSpace;
  return t;
}

/** tangent-space normal map from an fbm height field; `pores` adds sparse pits */
export function normalTexture(size = 512, freq = 6, strength = 2.2, seed = 0, pores = false): THREE.Texture {
  const { c, g, img } = canvas(size), h = new Float32Array(size * size), R = rng(seed + 9);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    // periodic by sampling on a torus: tiles without a seam
    const a = (x / size) * Math.PI * 2, b = (y / size) * Math.PI * 2;
    let v = fbm(Math.cos(a) * freq + seed, Math.sin(a) * freq, Math.cos(b) * freq + Math.sin(b) * freq * .7, 5);
    if (pores) { const p = fbm(Math.cos(a) * freq * 3.1, Math.sin(b) * freq * 3.1 + 11, Math.sin(a) * 4); v -= 0.35 * Math.pow(Math.max(0, p - 0.56) * 2.4, 2); }
    h[y * size + x] = v;
  }
  const d = img.data, at = (x: number, y: number) => h[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const dx = (at(x + 1, y) - at(x - 1, y)) * strength * size * 0.02, dy = (at(x, y + 1) - at(x, y - 1)) * strength * size * 0.02;
    const l = Math.hypot(dx, dy, 1), k = (y * size + x) * 4;
    d[k] = Math.round((-dx / l * 0.5 + 0.5) * 255); d[k + 1] = Math.round((-dy / l * 0.5 + 0.5) * 255); d[k + 2] = Math.round((1 / l * 0.5 + 0.5) * 255); d[k + 3] = 255;
  }
  void R;
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.NoColorSpace;
  return t;
}

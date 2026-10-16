import { useEffect, useMemo, useRef, useState } from "react";
import { Section } from "../Section/Section";
import { useI18n } from "../../i18n";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { LAYERS, PARTS, partById, type LayerId } from "../../anatomy/parts";
import type { Organism, Projected } from "../../anatomy/organism";
import styles from "./Anatomy.module.css";

const ORDER = PARTS.map((p) => p.id);

export function Anatomy({ page = false }: { page?: boolean }) {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const figRef = useRef<HTMLDivElement>(null);
  const leadersRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const orgRef = useRef<Organism | null>(null);
  const stateRef = useRef({ selected: "thalamus", hovered: null as string | null });
  const [selected, setSelected] = useState("thalamus");
  const [hovered, setHovered] = useState<string | null>(null);
  const [running, setRunning] = useState(!reduced);
  const [spin, setSpin] = useState(!reduced);
  const [cut, setCut] = useState(45);
  const [layers, setLayers] = useState<Record<LayerId, boolean>>(() => Object.fromEntries(LAYERS.map((l) => [l.id, true])) as Record<LayerId, boolean>);
  const [breathOut, setBreathOut] = useState(false);
  const [ready, setReady] = useState(false);

  stateRef.current = { selected, hovered };
  const a = t.anatomy;

  // mount the specimen once; the module is loaded lazily so the landing page stays light
  useEffect(() => {
    const el = figRef.current;
    if (!el) return;
    let org: Organism | null = null, dead = false;
    import("../../anatomy/organism").then(({ Organism }) => {
      if (dead) return;
      org = new Organism(el, {
        reducedMotion: reduced,
        onHover: setHovered,
        onSelect: setSelected,
        onFrame: (items, breath) => { draw(items); setBreathOut((b) => (breath < 0) !== b ? breath < 0 : b); },
      });
      org.setCut(cut / 100);
      orgRef.current = org; setReady(true);
    });
    return () => { dead = true; org?.dispose(); orgRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { orgRef.current?.setCut(cut / 100); }, [cut]);
  useEffect(() => { orgRef.current?.say(a.parts[selected].gloss); }, [selected, a, ready]);
  useEffect(() => { orgRef.current?.setRunning(running); }, [running]);
  useEffect(() => { orgRef.current?.setAutoRotate(spin); }, [spin]);
  useEffect(() => { for (const l of LAYERS) orgRef.current?.setLayer(l.id, layers[l.id]); }, [layers, ready]);

  // leader lines: anchors projected by the scene, labels stacked in the two margins
  function draw(items: Projected[]) {
    const fig = figRef.current, cv = leadersRef.current; if (!fig || !cv) return;
    const W = fig.clientWidth, H = fig.clientHeight, dpr = Math.min(window.devicePixelRatio, 2);
    if (cv.width !== Math.round(W * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    const g = cv.getContext("2d")!; g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    const cs = getComputedStyle(fig), hi = cs.getPropertyValue("--lbl-hi").trim(), mute = cs.getPropertyValue("--lbl").trim();
    const { selected: sel, hovered: hov } = stateRef.current;
    const vis = items.filter((it) => it.visible && labelRefs.current[it.id]);
    for (const it of items) { const el = labelRefs.current[it.id]; if (el) el.hidden = !it.visible; }
    const narrow = W < 640, step = narrow ? 16 : 18, pad = 6;
    for (const side of ["l", "r"] as const) {
      const col = vis.filter((it) => (it.x < W / 2) === (side === "l")).sort((p, q) => p.y - q.y);
      // the right column stops above the Pupil inset (bottom-right), the left above the HUD
      let y = 10; const maxY = side === "r" && orgRef.current?.eye ? H - Math.min(H * 0.26 * 0.6, 120) - 24 : H - 44;
      col.forEach((it, i) => { const ly = Math.max(y, Math.min(it.y, maxY - (col.length - 1 - i) * step)); y = ly + step; (it as Projected & { ly: number }).ly = ly; });
      for (const it of col as Array<Projected & { ly: number }>) {
        const el = labelRefs.current[it.id]!; el.classList.toggle(styles.r, side === "r");
        el.style.top = `${it.ly - 8}px`;
        if (side === "l") { el.style.left = `${pad}px`; el.style.right = "auto"; } else { el.style.right = `${pad}px`; el.style.left = "auto"; }
        const ew = el.offsetWidth, ex = side === "l" ? pad + ew + 4 : W - pad - ew - 4, on = it.id === sel || it.id === hov;
        g.strokeStyle = on ? hi : mute; g.globalAlpha = on ? 1 : 0.6; g.lineWidth = on ? 1.4 : 0.8;
        g.beginPath(); g.moveTo(ex, it.ly); g.lineTo(ex + (side === "l" ? 12 : -12), it.ly); g.lineTo(it.x, it.y); g.stroke();
        g.globalAlpha = 1; g.fillStyle = on ? hi : mute; g.beginPath(); g.arc(it.x, it.y, on ? 3 : 2, 0, 7); g.fill();
      }
    }
  }

  const part = partById(selected), copy = a.parts[selected];
  const sourceLabel = useMemo(() => a.sources[part.source], [a, part.source]);

  const body = (
    <>
      <div className={[styles.plate, page ? styles.pagePlate : ""].join(" ")}>
        <figure className={styles.figure}>
          <div className={styles.bar}>
            <span>{a.figure}</span>
            <span className={styles.barMeta}>{running ? (breathOut ? a.breathOut : a.breathIn) : a.paused} · {a.converge}</span>
          </div>
          <div ref={figRef} className={styles.stage} style={{ cursor: "grab" }}>
            <canvas ref={leadersRef} className={styles.leaders} aria-hidden="true" />
            <div className={styles.labels}>
              {PARTS.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  ref={(el) => { labelRefs.current[p.id] = el; }}
                  className={[styles.lbl, p.id === selected ? styles.on : "", p.id === hovered ? styles.hov : "", p.source === "vision" ? styles.vision : ""].join(" ")}
                  onClick={() => { setSelected(p.id); orgRef.current?.select(p.id); }}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                  hidden
                >
                  <em>{i + 1}</em>
                  <span>{a.parts[p.id].name}</span>
                </button>
              ))}
            </div>
            <div className={styles.hud}>
              <button type="button" className={styles.btn} aria-pressed={!running} onClick={() => setRunning((r) => !r)}>{running ? a.pause : a.play}</button>
              <button type="button" className={styles.btn} aria-pressed={spin} onClick={() => setSpin((s) => !s)}>{a.spin}</button>
              <label className={styles.cut} htmlFor="anatomy-cut">
                {a.cut}
                <input id="anatomy-cut" type="range" min={0} max={100} value={cut} onChange={(e) => setCut(Number(e.target.value))} />
              </label>
            </div>
            {!ready && <div className={styles.loading}>{a.loading}</div>}
          </div>
          <figcaption className={styles.caption}>
            <b>Fig. 1</b> {a.caption}
            <span className={styles.scale}><i />{a.scale}</span>
          </figcaption>
        </figure>

        <aside className={styles.entry} aria-live="polite">
          <div className={styles.bar}>
            <span>{a.entry}</span>
            <span className={styles.barMeta}>{a.entryOf(ORDER.indexOf(selected) + 1, ORDER.length)}</span>
          </div>
          <div className={styles.entryBody}>
            <div className={styles.level}>{part.lex.level}</div>
            <h3 className={styles.name}>{copy.name}</h3>
            <div className={styles.tags}>
              <span className={styles.tag}>{a.layers[part.layer]}</span>
              <span className={[styles.tag, styles.tagSrc].join(" ")}>{sourceLabel}</span>
            </div>
            <p className={styles.gloss}>{copy.gloss}</p>
            {part.apex && (
              <div className={styles.src}><b>apex · organ_systems.{part.key}</b>{part.apex.title} — {part.apex.tells}</div>
            )}
            <div className={styles.src}><b>{part.source === "doctrine" ? "ssot/doctrine" : "genome · lexicon.yml"} · {part.key}</b>{part.lex.means}</div>
            <dl className={styles.facts}>
              {part.lex.mechanism && (<><dt>{a.fields.mechanism}</dt><dd>{part.lex.mechanism}</dd></>)}
              {part.lex.not && (<><dt>{a.fields.not}</dt><dd>{part.lex.not}</dd></>)}
              {part.lex.counter && (<><dt>{a.fields.counter}</dt><dd>{part.lex.counter}</dd></>)}
            </dl>
          </div>
        </aside>
      </div>

      <div className={styles.layersPanel}>
        <div className={styles.bar}><span>{a.layersTitle}</span><span className={styles.barMeta}>{a.layersHint}</span></div>
        <div className={styles.layers}>
          {LAYERS.map((l) => (
            <label key={l.id} className={styles.layer} htmlFor={`anatomy-layer-${l.id}`}>
              <input id={`anatomy-layer-${l.id}`} type="checkbox" checked={layers[l.id]} onChange={(e) => setLayers((s) => ({ ...s, [l.id]: e.target.checked }))} />
              <i style={{ background: l.swatch }} />
              {a.layers[l.id]}
              <small>{PARTS.filter((p) => p.layer === l.id).length}</small>
            </label>
          ))}
        </div>
        <p className={styles.leash}>{a.leash}</p>
      </div>
    </>
  );
  if (page) return <section id="anatomy" className={[styles.pageWrap, "container"].join(" ")} aria-label={a.title}>{body}</section>;
  return (
    <Section id="anatomy" kicker={a.kicker} title={a.title} subtitle={a.subtitle}>{body}</Section>
  );
}

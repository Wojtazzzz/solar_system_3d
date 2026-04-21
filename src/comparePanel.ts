import {
  AmbientLight,
  Clock,
  DirectionalLight,
  DoubleSide,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  RingGeometry,
  Scene,
  SphereGeometry,
  WebGLRenderer,
  type Texture,
} from "three";
import { bodyFacts, type BodyFact } from "./planetData";
import { onLocaleChange, t } from "./i18n";
import type { UIStrings } from "./i18n/types";

const ROTATION_SPEED = 0.45;
const MODEL_OFFSET_X = 1.8;
const MODEL_RADIUS = 1;
const CAMERA_Z = 7;
const MIN_REALISTIC_SCALE = 0.02;

const parseDiameterKm = (value: string): number | null => {
  const match = value.match(/(\d[\d,]*(?:\.\d+)?)\s*km/i);
  if (!match) return null;
  const n = parseFloat(match[1].replace(/,/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
};

const FACT_ROWS: ReadonlyArray<readonly [keyof UIStrings, (f: BodyFact) => string]> = [
  ["diameter", (f) => f.diameter],
  ["mass", (f) => f.mass],
  ["orbitalPeriod", (f) => f.orbitalPeriod],
  ["dayLength", (f) => f.dayLength],
  ["moons", (f) => f.moons],
  ["temperature", (f) => f.temperature],
  ["distanceFromSun", (f) => f.distanceFromSun],
];

type Elements = {
  panel: HTMLElement;
  canvas: HTMLCanvasElement;
  title: HTMLElement;
  nameA: HTMLElement;
  nameB: HTMLElement;
  factNameA: HTMLElement;
  factNameB: HTMLElement;
  factA: HTMLElement;
  factB: HTMLElement;
  data: HTMLElement;
  realisticToggle: HTMLInputElement;
};

export class ComparePanel {
  private readonly elements: Elements;
  private readonly textures: Map<string, Texture>;
  private readonly onClose: () => void;

  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera: PerspectiveCamera;
  private readonly clock = new Clock(false);
  private readonly resizeObserver: ResizeObserver;

  private modelA: Group | null = null;
  private modelB: Group | null = null;
  private diameterA: number | null = null;
  private diameterB: number | null = null;
  private primaryId: string | null = null;
  private secondaryId: string | null = null;
  private rafId: number | null = null;

  constructor(
    elements: Elements,
    textures: Map<string, Texture>,
    onClose: () => void,
  ) {
    this.elements = elements;
    this.textures = textures;
    this.onClose = onClose;

    this.renderer = new WebGLRenderer({
      canvas: elements.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    this.camera = new PerspectiveCamera(38, 2, 0.1, 100);
    this.camera.position.set(0, 0, CAMERA_Z);

    this.scene.add(new AmbientLight(0xffffff, 0.35));
    const key = new DirectionalLight(0xffffff, 1.25);
    key.position.set(3, 2, 5);
    this.scene.add(key);
    const fill = new DirectionalLight(0x99aaff, 0.25);
    fill.position.set(-3, -1, 2);
    this.scene.add(fill);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(elements.canvas);

    elements.panel
      .querySelector("#comparePanelClose")
      ?.addEventListener("click", () => this.hide());
    elements.panel
      .querySelector(".compare-panel__backdrop")
      ?.addEventListener("click", () => this.hide());
    elements.realisticToggle.addEventListener("change", () =>
      this.applyScaleMode(),
    );

    onLocaleChange(() => this.refreshTexts());
  }

  isVisible(): boolean {
    return this.elements.panel.classList.contains("compare-panel--visible");
  }

  show(primary: BodyFact, secondary: BodyFact): void {
    this.clearModels();

    this.primaryId = primary.id;
    this.secondaryId = secondary.id;
    this.writeTexts(primary, secondary);

    this.diameterA = parseDiameterKm(primary.diameter);
    this.diameterB = parseDiameterKm(secondary.diameter);

    this.modelA = this.buildBody(primary, -MODEL_OFFSET_X);
    this.modelB = this.buildBody(secondary, MODEL_OFFSET_X);
    this.scene.add(this.modelA);
    this.scene.add(this.modelB);
    this.applyScaleMode();

    this.renderTable(primary, secondary);

    const { panel } = this.elements;
    panel.classList.add("compare-panel--visible");
    panel.setAttribute("aria-hidden", "false");

    this.resize();
    this.clock.start();
    this.startLoop();
  }

  hide(): void {
    if (!this.isVisible()) return;
    const { panel } = this.elements;
    panel.classList.remove("compare-panel--visible");
    panel.setAttribute("aria-hidden", "true");
    this.stopLoop();
    this.clearModels();
    this.onClose();
  }

  private writeTexts(primary: BodyFact, secondary: BodyFact): void {
    const { title, nameA, nameB, factNameA, factNameB, factA, factB } = this.elements;
    title.textContent = `${primary.displayName} ${t("vs")} ${secondary.displayName}`;
    nameA.textContent = primary.displayName;
    nameB.textContent = secondary.displayName;
    factNameA.textContent = primary.displayName;
    factNameB.textContent = secondary.displayName;
    factA.textContent = primary.funFact;
    factB.textContent = secondary.funFact;
  }

  private refreshTexts(): void {
    if (!this.primaryId || !this.secondaryId) return;
    const primary = bodyFacts[this.primaryId];
    const secondary = bodyFacts[this.secondaryId];
    if (!primary || !secondary) return;
    this.writeTexts(primary, secondary);
    this.renderTable(primary, secondary);
  }

  private renderTable(primary: BodyFact, secondary: BodyFact): void {
    const el = this.elements.data;
    el.replaceChildren();

    el.appendChild(document.createElement("dt"));
    this.appendDd(primary.displayName, "compare-panel__header");
    this.appendDd(secondary.displayName, "compare-panel__header");

    for (const [labelKey, read] of FACT_ROWS) {
      const dt = document.createElement("dt");
      dt.textContent = t(labelKey);
      el.appendChild(dt);
      this.appendDd(read(primary));
      this.appendDd(read(secondary));
    }
  }

  private appendDd(text: string, className?: string): void {
    const dd = document.createElement("dd");
    dd.textContent = text;
    if (className) dd.className = className;
    this.elements.data.appendChild(dd);
  }

  private buildBody(fact: BodyFact, offsetX: number): Group {
    const group = new Group();
    group.position.x = offsetX;
    group.rotation.z = 0.2;

    if (fact.type === "star") {
      const mesh = new Mesh(
        new SphereGeometry(MODEL_RADIUS, 64, 64),
        new MeshBasicMaterial({ color: 0xffb24a }),
      );
      group.add(mesh);
      const glow = new Mesh(
        new SphereGeometry(MODEL_RADIUS * 1.12, 48, 48),
        new MeshBasicMaterial({
          color: 0xff8a22,
          transparent: true,
          opacity: 0.18,
        }),
      );
      group.add(glow);
    } else if (fact.type === "planet") {
      const texture = this.textures.get(fact.id) ?? null;
      const normalMap = this.textures.get("normal") ?? null;
      const mesh = new Mesh(
        new SphereGeometry(MODEL_RADIUS, 64, 64),
        new MeshStandardMaterial({
          map: texture,
          normalMap,
          roughness: 1,
          metalness: 0,
        }),
      );
      group.add(mesh);

      if (fact.id === "earth") {
        const cloudsTexture = this.textures.get("earth") ?? null;
        group.add(
          new Mesh(
            new SphereGeometry(MODEL_RADIUS * 1.015, 48, 48),
            new MeshStandardMaterial({
              map: cloudsTexture,
              transparent: true,
              opacity: 0.12,
              depthWrite: false,
            }),
          ),
        );
      } else if (fact.id === "saturn") {
        const rings = new Mesh(
          new RingGeometry(MODEL_RADIUS * 1.3, MODEL_RADIUS * 1.95, 96),
          new MeshBasicMaterial({
            color: 0xd7c39a,
            side: DoubleSide,
            transparent: true,
            opacity: 0.85,
          }),
        );
        rings.rotation.x = Math.PI / 2 - 0.35;
        group.add(rings);
      }
    } else {
      const mesh = new Mesh(
        new IcosahedronGeometry(MODEL_RADIUS * 0.75, 1),
        new MeshStandardMaterial({
          color: 0xc8c8bc,
          roughness: 0.85,
          metalness: 0.05,
          flatShading: true,
        }),
      );
      group.add(mesh);
    }

    return group;
  }

  private clearModels(): void {
    for (const m of [this.modelA, this.modelB]) {
      if (!m) continue;
      this.scene.remove(m);
      m.traverse((obj) => {
        if (!(obj instanceof Mesh)) return;
        obj.geometry.dispose();
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const mat of materials) mat.dispose();
      });
    }
    this.modelA = null;
    this.modelB = null;
    this.diameterA = null;
    this.diameterB = null;
    this.primaryId = null;
    this.secondaryId = null;
  }

  private applyScaleMode(): void {
    const realistic = this.elements.realisticToggle.checked;
    let scaleA = 1;
    let scaleB = 1;
    if (realistic && this.diameterA !== null && this.diameterB !== null) {
      const maxDiameter = Math.max(this.diameterA, this.diameterB);
      scaleA = Math.max(MIN_REALISTIC_SCALE, this.diameterA / maxDiameter);
      scaleB = Math.max(MIN_REALISTIC_SCALE, this.diameterB / maxDiameter);
    }
    this.modelA?.scale.setScalar(scaleA);
    this.modelB?.scale.setScalar(scaleB);
  }

  private startLoop(): void {
    if (this.rafId !== null) return;
    const tick = (): void => {
      const dt = this.clock.getDelta();
      if (this.modelA) this.modelA.rotation.y += ROTATION_SPEED * dt;
      if (this.modelB) this.modelB.rotation.y -= ROTATION_SPEED * dt;
      this.renderer.render(this.scene, this.camera);
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private stopLoop(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    this.clock.stop();
  }

  private resize(): void {
    const w = this.elements.canvas.clientWidth;
    const h = this.elements.canvas.clientHeight;
    if (w === 0 || h === 0) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
}

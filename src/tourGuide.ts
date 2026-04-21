import type { Object3D } from "three";
import type { Camera } from "./objects/camera";
import type { Sun } from "./objects/sun";
import type { Planet } from "./objects/planet";
import type { Comet } from "./objects/comet";
import { bodyFacts } from "./planetData";

type TourBody = {
  readonly id: string;
  readonly displayName: string;
  readonly mesh: Object3D;
  readonly focusDistance: number;
};

const SUN_FOCUS_DISTANCE = 8;
const PLANET_DISTANCE_FACTOR = 5;
const PLANET_MIN_DISTANCE = 1.5;
const COMET_FOCUS_DISTANCE = 4;

export class TourGuide {
  private bodies: TourBody[] = [];
  private index = -1;
  private active = false;
  private includeComets = true;

  constructor(
    private readonly camera: Camera,
    private readonly onShow: (id: string) => void,
    private readonly onStateChange: () => void,
    private readonly sun: Sun,
    private readonly planets: Planet[],
    private readonly comets: Comet[] = [],
  ) {
    this.rebuildBodies();
  }

  private rebuildBodies(): void {
    const result: TourBody[] = [
      {
        id: "sun",
        displayName: bodyFacts.sun?.displayName ?? "sun",
        mesh: this.sun.model,
        focusDistance: SUN_FOCUS_DISTANCE,
      },
      ...this.planets.map((p) => ({
        id: p.name,
        displayName: bodyFacts[p.name]?.displayName ?? p.name,
        mesh: p.mesh,
        focusDistance: Math.max(
          PLANET_MIN_DISTANCE,
          p.radius * PLANET_DISTANCE_FACTOR,
        ),
      })),
    ];
    if (this.includeComets) {
      for (const c of this.comets) {
        result.push({
          id: c.name,
          displayName: bodyFacts[c.name]?.displayName ?? c.name,
          mesh: c.mesh,
          focusDistance: COMET_FOCUS_DISTANCE,
        });
      }
    }
    this.bodies = result;
  }

  setCometsIncluded(include: boolean): void {
    if (this.includeComets === include) return;
    this.includeComets = include;
    const currentId = this.bodies[this.index]?.id;
    this.rebuildBodies();
    if (!this.active) return;
    const newIndex = currentId
      ? this.bodies.findIndex((b) => b.id === currentId)
      : -1;
    if (newIndex >= 0) {
      this.index = newIndex;
      this.onStateChange();
    } else {
      this.stop();
    }
  }

  isActive(): boolean {
    return this.active;
  }

  getIndex(): number {
    return this.index;
  }

  getTotal(): number {
    return this.bodies.length;
  }

  hasPrev(): boolean {
    return this.active && this.index > 0;
  }

  hasNext(): boolean {
    return this.active && this.index < this.bodies.length - 1;
  }

  start(): void {
    this.active = true;
    this.index = 0;
    this.focusCurrent();
    this.onStateChange();
  }

  stop(): void {
    this.active = false;
    this.index = -1;
    this.camera.clearFocus();
    this.onStateChange();
  }

  next(): void {
    if (!this.hasNext()) return;
    this.index++;
    this.focusCurrent();
    this.onStateChange();
  }

  prev(): void {
    if (!this.hasPrev()) return;
    this.index--;
    this.focusCurrent();
    this.onStateChange();
  }

  jumpTo(id: string): boolean {
    const i = this.bodies.findIndex((b) => b.id === id);
    if (i < 0) return false;
    this.index = i;
    this.focusCurrent();
    this.onStateChange();
    return true;
  }

  private focusCurrent(): void {
    const body = this.bodies[this.index];
    if (!body) return;
    this.camera.setFocus(body.mesh, body.focusDistance);
    this.onShow(body.id);
  }
}

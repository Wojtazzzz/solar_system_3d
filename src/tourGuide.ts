import type { Object3D } from "three";
import type { Camera } from "./objects/camera";
import type { Sun } from "./objects/sun";
import type { Planet } from "./objects/planet";
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

export class TourGuide {
  private readonly bodies: readonly TourBody[];
  private index = -1;
  private active = false;

  constructor(
    private readonly camera: Camera,
    private readonly onShow: (id: string) => void,
    private readonly onStateChange: () => void,
    sun: Sun,
    planets: Planet[],
  ) {
    this.bodies = [
      {
        id: "sun",
        displayName: bodyFacts.sun?.displayName ?? "sun",
        mesh: sun.model,
        focusDistance: SUN_FOCUS_DISTANCE,
      },
      ...planets.map((p) => ({
        id: p.name,
        displayName: bodyFacts[p.name]?.displayName ?? p.name,
        mesh: p.mesh,
        focusDistance: Math.max(
          PLANET_MIN_DISTANCE,
          p.radius * PLANET_DISTANCE_FACTOR,
        ),
      })),
    ];
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

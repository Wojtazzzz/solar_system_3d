import type { Camera } from "./objects/camera";
import type { Planet } from "./objects/planet";
import type { Sun } from "./objects/sun";

const PLANET_COLORS: Record<string, string> = {
  mercury: "#9a9a9a",
  venus: "#e2c999",
  earth: "#4a7ed4",
  mars: "#c74e3a",
  jupiter: "#d1b89f",
  saturn: "#e4cfa0",
  uranus: "#a8d9e0",
  neptune: "#4b70dd",
};

const ORBITAL_RADIUS_SCALE = 1.2;
const WORLD_EXTENT = 75;

export class Minimap {
  private readonly ctx: CanvasRenderingContext2D;
  private size = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly sun: Sun,
    private readonly planets: Planet[],
    private readonly camera: Camera,
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Minimap 2D context unavailable");
    this.ctx = ctx;
    this.resize();
  }

  resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.size = rect.width;
    this.canvas.width = Math.round(rect.width * dpr);
    this.canvas.height = Math.round(rect.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  draw(): void {
    const ctx = this.ctx;
    const s = this.size;
    if (s <= 0) return;
    const scale = (s * 0.5 - 4) / WORLD_EXTENT;
    const cx = s / 2;
    const cy = s / 2;

    ctx.clearRect(0, 0, s, s);

    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 1;
    for (const planet of this.planets) {
      const r = planet.orbitalRadius * ORBITAL_RADIUS_SCALE * scale;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    const sunPos = this.sun.model.position;
    ctx.fillStyle = "#ffb000";
    ctx.beginPath();
    ctx.arc(cx + sunPos.x * scale, cy + sunPos.z * scale, 3.5, 0, Math.PI * 2);
    ctx.fill();

    for (const planet of this.planets) {
      const color = PLANET_COLORS[planet.name] ?? "#ffffff";
      const p = planet.mesh.position;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx + p.x * scale, cy + p.z * scale, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    const camPos = this.camera.object.position;
    const camX = cx + camPos.x * scale;
    const camY = cy + camPos.z * scale;
    const dxToCenter = cx - camX;
    const dyToCenter = cy - camY;
    const len = Math.hypot(dxToCenter, dyToCenter);
    if (len > 0.01) {
      const fx = dxToCenter / len;
      const fy = dyToCenter / len;
      const nx = -fy;
      const ny = fx;
      const tipLen = 7;
      const baseLen = 4;
      const tipX = camX + fx * tipLen;
      const tipY = camY + fy * tipLen;
      const leftX = camX - fx * 2 + nx * baseLen;
      const leftY = camY - fy * 2 + ny * baseLen;
      const rightX = camX - fx * 2 - nx * baseLen;
      const rightY = camY - fy * 2 - ny * baseLen;

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.lineTo(leftX, leftY);
      ctx.lineTo(rightX, rightY);
      ctx.closePath();
      ctx.fill();
    }
  }
}

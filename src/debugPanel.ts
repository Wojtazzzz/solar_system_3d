import type { WebGLRenderer } from "three";

const UPDATE_INTERVAL_MS = 500;
const SAMPLE_WINDOW = 60;

export class DebugPanel {
  private readonly element: HTMLElement;
  private readonly samples: number[] = [];
  private frameStart = performance.now();
  private lastUpdateTime = 0;

  constructor(private readonly renderer: WebGLRenderer) {
    this.element = document.createElement("div");
    this.element.className = "debug-panel";
    document.body.appendChild(this.element);
    this.render(0, 0);
  }

  destroy(): void {
    this.element.remove();
  }

  begin(): void {
    this.frameStart = performance.now();
  }

  end(): void {
    const now = performance.now();
    const frameMs = now - this.frameStart;
    this.samples.push(frameMs);
    if (this.samples.length > SAMPLE_WINDOW) {
      this.samples.shift();
    }

    if (now - this.lastUpdateTime < UPDATE_INTERVAL_MS) return;
    this.lastUpdateTime = now;

    let total = 0;
    for (const ms of this.samples) total += ms;
    const avgMs = this.samples.length > 0 ? total / this.samples.length : 0;
    const fps = avgMs > 0 ? 1000 / avgMs : 0;
    this.render(fps, avgMs);
  }

  private render(fps: number, ms: number): void {
    const { render, memory, programs } = this.renderer.info;
    this.element.replaceChildren();
    const rows: Array<[string, string]> = [
      ["FPS", fps.toFixed(0)],
      ["ms", ms.toFixed(2)],
      ["draw calls", String(render.calls)],
      ["triangles", render.triangles.toLocaleString()],
      ["points", String(render.points)],
      ["geometries", String(memory.geometries)],
      ["textures", String(memory.textures)],
      ["programs", String(programs?.length ?? 0)],
    ];
    for (const [label, value] of rows) {
      const row = document.createElement("div");
      row.className = "debug-panel__row";
      const labelEl = document.createElement("span");
      labelEl.className = "debug-panel__label";
      labelEl.textContent = label;
      const valueEl = document.createElement("span");
      valueEl.className = "debug-panel__value";
      valueEl.textContent = value;
      row.appendChild(labelEl);
      row.appendChild(valueEl);
      this.element.appendChild(row);
    }
  }
}

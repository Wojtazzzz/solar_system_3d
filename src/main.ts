import {
  initScene,
  initRenderer,
  initCamera,
  createSolarSystemPlanets,
  loadPlanetTextures,
} from "./utils";
import { Sun } from "./objects/sun";
import { Star, createStarsInstancedMesh } from "./objects/star";
import { Planet } from "./objects/planet";
import { createSaturnRings } from "./objects/saturnRings";
import { settings } from "./settings";
import {
  readBool,
  readEnum,
  readNumber,
  writeBool,
  writeEnum,
  writeNumber,
} from "./urlState";
import {
  stars as starsOptions,
  camera as cameraOptions,
  ZOOM_SPEED,
} from "./consts";
import {
  Clock,
  type MeshBasicMaterial,
  Plane,
  Raycaster,
  Vector2,
  Vector3,
  type Mesh,
  type Object3D,
} from "three";

type Draggable = {
  readonly mesh: Object3D;
  startDrag(): void;
  endDrag(velocity: Vector3): void;
};

type Quality = "low" | "medium" | "high";

const THROW_VELOCITY_SCALE = 1.6;
const MAX_THROW_SPEED = 60;
const VELOCITY_WINDOW_MS = 120;

const getMaxPixelRatio = () => Math.min(window.devicePixelRatio || 1, 2);

const QUALITY_PRESETS: Record<Quality, { pixelRatio: number }> = {
  low: { pixelRatio: 1 },
  medium: { pixelRatio: Math.min(getMaxPixelRatio(), 1.5) },
  high: { pixelRatio: getMaxPixelRatio() },
};

localStorage.setItem("isPlanetsShadow", "");

const renderer = initRenderer();
const scene = initScene();
const camera = initCamera();

const slider = document.getElementById("zoomSlider") as HTMLInputElement;
slider.min = String(cameraOptions.minRadius);
slider.max = String(cameraOptions.maxRadius);
slider.value = String(cameraOptions.initialRadius);

const start = async () => {
  const textures = await loadPlanetTextures();

  const sun = new Sun();
  const planets = createSolarSystemPlanets(textures);

  let starsMesh = createStarsInstancedMesh(starsOptions.count);
  let stars: Star[] = Array.from(
    { length: starsOptions.count },
    (_, i) => new Star(starsMesh, i),
  );

  scene.add(camera.object, sun.model, sun.getLight(), starsMesh);

  planets.forEach((planet) => {
    scene.add(planet.mesh);
    scene.add(planet.trail);
    scene.add(planet.orbitLine);
  });

  const saturn = planets.find((p) => p.name === "saturn") ?? null;
  const saturnRings = saturn ? createSaturnRings(saturn.radius) : null;
  if (saturnRings) scene.add(saturnRings);

  const { updateLabels } = createPlanetLabels(planets);

  const rebuildStars = (count: number): void => {
    scene.remove(starsMesh);
    starsMesh.geometry.dispose();
    (starsMesh.material as MeshBasicMaterial).dispose();
    starsMesh.dispose();

    const safeCount = Math.max(1, count);
    starsMesh = createStarsInstancedMesh(safeCount);
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push(new Star(starsMesh, i));
    }
    if (count > 0) {
      scene.add(starsMesh);
    }
  };

  initSettingsPanel(planets, rebuildStars);
  initDragAndDrop(sun, planets);

  const clock = new Clock();
  let scaledElapsed = 0;

  const animate = () => {
    requestAnimationFrame(animate);

    const dt = Math.min(0.05, clock.getDelta());
    scaledElapsed += dt * settings.timeSpeed;

    camera.updatePosition();

    sun.updateNoiseAnimation(scaledElapsed);
    sun.updatePosition(dt);

    planets.forEach((planet) => {
      planet.updateRotation();
      planet.updatePosition(dt);
      planet.updateTrail();
    });

    if (saturn && saturnRings) {
      saturnRings.position.copy(saturn.mesh.position);
    }

    stars.forEach((star) => star.tryToExplode(camera.object.position));

    updateLabels();

    renderer.render(scene, camera.object);
  };

  camera.updatePosition();
  planets.forEach((planet) => {
    planet.updatePosition(0);
    planet.updateTrail();
  });
  renderer.compile(scene, camera.object);
  renderer.render(scene, camera.object);

  const loader = document.getElementById("loader");
  loader?.classList.add("loader--hidden");
  loader?.addEventListener("transitionend", () => loader.remove(), {
    once: true,
  });

  requestAnimationFrame(animate);
};

const createPlanetLabels = (planets: Planet[]) => {
  const container = document.createElement("div");
  container.className = "planet-labels";
  document.body.appendChild(container);

  const entries = planets.map((planet) => {
    const el = document.createElement("div");
    el.className = "planet-label";
    el.textContent = planet.name;
    container.appendChild(el);
    return { planet, el };
  });

  const projected = new Vector3();

  const updateLabels = (): void => {
    if (!container.classList.contains("planet-labels--visible")) return;
    const w = window.innerWidth;
    const h = window.innerHeight;

    entries.forEach(({ planet, el }) => {
      projected.copy(planet.mesh.position).project(camera.object);
      if (projected.z > 1 || projected.z < -1) {
        el.style.display = "none";
        return;
      }
      el.style.display = "";
      const x = (projected.x * 0.5 + 0.5) * w;
      const y = (-projected.y * 0.5 + 0.5) * h;
      el.style.transform = `translate(-50%, -180%) translate(${x}px, ${y}px)`;
    });
  };

  return { updateLabels };
};

const bindCheckbox = (
  id: string,
  key: string,
  defaultValue: boolean,
  apply: (value: boolean) => void,
): void => {
  const el = document.querySelector<HTMLInputElement>(`#${id}`);
  if (!el) return;
  const initial = readBool(key, defaultValue);
  el.checked = initial;
  apply(initial);
  el.addEventListener("change", () => {
    apply(el.checked);
    writeBool(key, el.checked, defaultValue);
  });
};

const bindRange = (
  id: string,
  outputId: string | null,
  key: string,
  defaultValue: number,
  formatOutput: ((value: number) => string) | null,
  applyLive: ((value: number) => void) | null,
  applyCommit?: (value: number) => void,
): void => {
  const el = document.querySelector<HTMLInputElement>(`#${id}`);
  if (!el) return;
  const output = outputId
    ? document.querySelector<HTMLOutputElement>(`#${outputId}`)
    : null;
  const min = parseFloat(el.min);
  const max = parseFloat(el.max);
  const raw = readNumber(key, defaultValue);
  const initial = Math.max(min, Math.min(max, raw));
  el.value = String(initial);
  if (output) {
    output.textContent = formatOutput ? formatOutput(initial) : String(initial);
  }
  applyLive?.(initial);
  if (applyCommit && initial !== defaultValue) applyCommit(initial);

  el.addEventListener("input", () => {
    const v = parseFloat(el.value);
    if (output) {
      output.textContent = formatOutput ? formatOutput(v) : el.value;
    }
    applyLive?.(v);
  });
  el.addEventListener("change", () => {
    const v = parseFloat(el.value);
    applyCommit?.(v);
    writeNumber(key, v, defaultValue);
  });
};

const bindSelect = <T extends string>(
  id: string,
  key: string,
  allowed: readonly T[],
  defaultValue: T,
  apply: (value: T) => void,
): void => {
  const el = document.querySelector<HTMLSelectElement>(`#${id}`);
  if (!el) return;
  const initial = readEnum(key, allowed, defaultValue);
  el.value = initial;
  apply(initial);
  el.addEventListener("change", () => {
    const v = el.value as T;
    apply(v);
    writeEnum(key, v, defaultValue);
  });
};

const initSettingsPanel = (
  planets: Planet[],
  rebuildStars: (count: number) => void,
): void => {
  const labelsContainer = document.querySelector<HTMLElement>(".planet-labels");

  bindCheckbox("togglePlanetsShadowCheckbox", "sh", false, (v) => {
    localStorage.setItem("isPlanetsShadow", v ? "1" : "");
    planets.forEach((planet) => planet.setIsShadow(v));
  });

  bindCheckbox("toggleOrbitsCheckbox", "or", true, (v) => {
    planets.forEach((planet) => (planet.orbitLine.visible = v));
  });

  bindCheckbox("toggleLabelsCheckbox", "la", true, (v) => {
    labelsContainer?.classList.toggle("planet-labels--visible", v);
  });

  bindCheckbox("toggleTrailsCheckbox", "tr", true, (v) => {
    planets.forEach((planet) => (planet.trail.visible = v));
  });

  bindCheckbox("toggleInclinationsCheckbox", "inc", false, (v) => {
    settings.realInclinations = v;
    planets.forEach((planet) => planet.resetTrail());
  });

  bindRange(
    "timeSpeedSlider",
    "timeSpeedOutput",
    "t",
    1,
    (v) => `${v.toFixed(1)}x`,
    (v) => {
      settings.timeSpeed = v;
    },
  );

  bindRange(
    "starsCountSlider",
    "starsCountOutput",
    "s",
    starsOptions.count,
    null,
    null,
    (v) => rebuildStars(Math.round(v)),
  );

  bindSelect<Quality>(
    "qualitySelect",
    "q",
    ["low", "medium", "high"],
    "medium",
    (q) => {
      const preset = QUALITY_PRESETS[q];
      renderer.setPixelRatio(preset.pixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
  );
};

const initDragAndDrop = (sun: Sun, planets: Planet[]): void => {
  const canvas = renderer.domElement;
  const raycaster = new Raycaster();
  const pointer = new Vector2();
  const dragPlane = new Plane();
  const dragPlaneNormal = new Vector3();
  const dragIntersection = new Vector3();
  const dragOffset = new Vector3();

  const draggables: Draggable[] = [sun, ...planets];
  const draggableMeshes: Mesh[] = draggables.map(
    (d) => d.mesh as Mesh,
  );

  let active: Draggable | null = null;
  const history: Array<{ pos: Vector3; time: number }> = [];

  const setPointer = (event: PointerEvent): void => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  };

  const pickAt = (event: PointerEvent): Draggable | null => {
    setPointer(event);
    raycaster.setFromCamera(pointer, camera.object);
    const hits = raycaster.intersectObjects(draggableMeshes, false);
    if (hits.length === 0) return null;
    return (
      draggables.find((d) => d.mesh === hits[0].object) ?? null
    );
  };

  canvas.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    const picked = pickAt(event);
    if (!picked) return;

    setPointer(event);
    raycaster.setFromCamera(pointer, camera.object);

    camera.object.getWorldDirection(dragPlaneNormal).negate();
    dragPlane.setFromNormalAndCoplanarPoint(
      dragPlaneNormal,
      picked.mesh.position,
    );

    if (raycaster.ray.intersectPlane(dragPlane, dragIntersection)) {
      dragOffset.copy(dragIntersection).sub(picked.mesh.position);
    } else {
      dragOffset.set(0, 0, 0);
    }

    picked.startDrag();
    active = picked;
    history.length = 0;
    history.push({
      pos: picked.mesh.position.clone(),
      time: performance.now(),
    });

    canvas.setPointerCapture(event.pointerId);
    canvas.style.cursor = "grabbing";
    event.preventDefault();
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!active) {
      canvas.style.cursor = pickAt(event) ? "grab" : "";
      return;
    }

    setPointer(event);
    raycaster.setFromCamera(pointer, camera.object);

    if (raycaster.ray.intersectPlane(dragPlane, dragIntersection)) {
      const next = dragIntersection.sub(dragOffset);
      active.mesh.position.copy(next);

      const now = performance.now();
      history.push({ pos: next.clone(), time: now });

      const cutoff = now - VELOCITY_WINDOW_MS;
      while (history.length > 2 && history[0].time < cutoff) {
        history.shift();
      }
    }
  });

  const release = (event: PointerEvent): void => {
    if (!active) return;

    const velocity = new Vector3();
    if (history.length >= 2) {
      const first = history[0];
      const last = history[history.length - 1];
      const seconds = (last.time - first.time) / 1000;
      if (seconds > 0) {
        velocity
          .copy(last.pos)
          .sub(first.pos)
          .divideScalar(seconds)
          .multiplyScalar(THROW_VELOCITY_SCALE);
        if (velocity.length() > MAX_THROW_SPEED) {
          velocity.setLength(MAX_THROW_SPEED);
        }
      }
    }

    active.endDrag(velocity);
    active = null;
    history.length = 0;
    canvas.style.cursor = "";

    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
  };

  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);
};

start();

window.addEventListener("wheel", (event: WheelEvent) => {
  camera.setRadius(camera.getRadius() + event.deltaY * ZOOM_SPEED * 0.01);

  slider.value = String(camera.getRadius());
});

slider.addEventListener("input", () => {
  camera.setRadius(parseFloat(slider.value));
});

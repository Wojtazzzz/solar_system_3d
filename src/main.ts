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
import {
  stars as starsOptions,
  camera as cameraOptions,
  ZOOM_SPEED,
} from "./consts";
import {
  Clock,
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

const THROW_VELOCITY_SCALE = 1.6;
const MAX_THROW_SPEED = 60;
const VELOCITY_WINDOW_MS = 120;

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

  const starsMesh = createStarsInstancedMesh(starsOptions.count);
  const stars: Star[] = Array.from(
    { length: starsOptions.count },
    (_, i) => new Star(starsMesh, i),
  );

  scene.add(camera.object, sun.model, sun.getLight(), starsMesh);

  planets.forEach((planet) => {
    scene.add(planet.mesh);
    scene.add(planet.trail);
  });

  document
    .querySelector("#togglePlanetsShadowCheckbox")
    ?.addEventListener("change", (e) => {
      const isShadow = (e.target as HTMLInputElement).checked;
      localStorage.setItem("isPlanetsShadow", isShadow ? "1" : "");
      planets.forEach((planet) => planet.setIsShadow(isShadow));
    });

  initDragAndDrop(sun, planets);

  const clock = new Clock();

  const animate = () => {
    requestAnimationFrame(animate);

    const dt = Math.min(0.05, clock.getDelta());

    camera.updatePosition();

    sun.updateNoiseAnimation(clock.getElapsedTime());
    sun.updatePosition(dt);

    planets.forEach((planet) => {
      planet.updateRotation();
      planet.updatePosition(dt);
      planet.updateTrail();
    });

    stars.forEach((star) => star.tryToExplode(camera.object.position));

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

const configPanel = document.querySelector<HTMLDetailsElement>(".config-panel");

let offsetX = 0;
let offsetY = 0;
let isDragging = false;

configPanel?.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - configPanel?.offsetLeft;
  offsetY = e.clientY - configPanel?.offsetTop;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  if (!configPanel) return;

  configPanel.style.left = e.clientX - offsetX + "px";
  configPanel.style.top = e.clientY - offsetY + "px";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

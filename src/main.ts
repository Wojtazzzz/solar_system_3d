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
import { SunFlares } from "./objects/sunFlares";
import { Moon } from "./objects/moon";
import { EarthClouds } from "./objects/earthClouds";
import { createEarthAtmosphere } from "./objects/earthAtmosphere";
import { createAsteroidBelt } from "./objects/asteroidBelt";
import { createStarfield } from "./objects/starfield";
import type { PostProcessing } from "./postProcessing";
import type { DebugPanel } from "./debugPanel";
import { TourGuide } from "./tourGuide";
import { Minimap } from "./minimap";
import { settings } from "./settings";
import {
  bodyFacts,
  QUIZ_QUESTIONS,
  type BodyFact,
  type QuizQuestion,
} from "./planetData";
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
  sun as sunOptions,
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
  readonly name: string;
  readonly mesh: Object3D;
  startDrag(): void;
  setDragPosition(pos: Vector3): void;
  endDrag(velocity: Vector3): void;
};

type Quality = "low" | "medium" | "high";

const THROW_VELOCITY_SCALE = 1.6;
const MAX_THROW_SPEED = 60;
const VELOCITY_WINDOW_MS = 120;
const CLICK_DISTANCE_SQ = 25;
const CLICK_MAX_DURATION_MS = 350;

const getMaxPixelRatio = () => Math.min(window.devicePixelRatio || 1, 2);

let quizActive = false;
let quizQuestion: QuizQuestion | null = null;
let lastQuizIndex = -1;
let quizBannerTimeout: number | null = null;
let tourGuide: TourGuide | null = null;

const onBodyClick = (name: string): void => {
  if (quizActive) {
    handleQuizAnswer(name);
  } else if (tourGuide?.isActive() && tourGuide.jumpTo(name)) {
    // jumped inside tour — info panel updated by tour itself
  } else {
    showInfoPanel(name);
  }
};

const showInfoPanel = (name: string): void => {
  const fact = bodyFacts[name];
  const panel = document.getElementById("infoPanel");
  const titleEl = document.getElementById("infoPanelTitle");
  const dataEl = document.getElementById("infoPanelData");
  const factEl = document.getElementById("infoPanelFact");
  if (!fact || !panel || !titleEl || !dataEl || !factEl) return;

  titleEl.textContent = fact.displayName;
  factEl.textContent = fact.funFact;
  renderFactsTable(dataEl, fact);

  panel.classList.add("info-panel--visible");
  panel.setAttribute("aria-hidden", "false");
  syncTourUI();
};

const hideInfoPanel = (): void => {
  const panel = document.getElementById("infoPanel");
  panel?.classList.remove("info-panel--visible");
  panel?.setAttribute("aria-hidden", "true");
};

const syncTourUI = (): void => {
  const tourSection = document.getElementById("infoPanelTour");
  const prevBtn = document.getElementById("tourPrev") as HTMLButtonElement | null;
  const nextBtn = document.getElementById("tourNext") as HTMLButtonElement | null;
  const positionEl = document.getElementById("tourPosition");
  const toggleBtn = document.getElementById("tourToggle");

  const active = tourGuide?.isActive() ?? false;

  if (tourSection) {
    if (active) tourSection.removeAttribute("hidden");
    else tourSection.setAttribute("hidden", "");
  }

  if (toggleBtn) {
    toggleBtn.textContent = active ? "Stop tour" : "Start tour";
    toggleBtn.classList.toggle("quiz-toggle--active", active);
  }

  if (tourGuide && active && prevBtn && nextBtn && positionEl) {
    prevBtn.disabled = !tourGuide.hasPrev();
    nextBtn.disabled = !tourGuide.hasNext();
    positionEl.textContent = `${tourGuide.getIndex() + 1} / ${tourGuide.getTotal()}`;
  }
};

const renderFactsTable = (el: HTMLElement, fact: BodyFact): void => {
  el.replaceChildren();
  const rows: Array<[string, string]> = [
    ["Diameter", fact.diameter],
    ["Mass", fact.mass],
    ["Orbital period", fact.orbitalPeriod],
    ["Day length", fact.dayLength],
    ["Moons", fact.moons],
    ["Temperature", fact.temperature],
    ["Distance from Sun", fact.distanceFromSun],
  ];
  for (const [label, value] of rows) {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    el.appendChild(dt);
    el.appendChild(dd);
  }
};

const setQuizBanner = (
  text: string,
  state?: "correct" | "wrong",
): void => {
  const banner = document.getElementById("quizBanner");
  if (!banner) return;
  banner.textContent = text;
  banner.classList.add("quiz-banner--visible");
  banner.classList.remove("quiz-banner--correct", "quiz-banner--wrong");
  if (state) banner.classList.add(`quiz-banner--${state}`);
};

const hideQuizBanner = (): void => {
  document.getElementById("quizBanner")?.classList.remove(
    "quiz-banner--visible",
  );
};

const nextQuizQuestion = (): void => {
  let i = lastQuizIndex;
  if (QUIZ_QUESTIONS.length > 1) {
    while (i === lastQuizIndex) {
      i = Math.floor(Math.random() * QUIZ_QUESTIONS.length);
    }
  } else {
    i = 0;
  }
  lastQuizIndex = i;
  quizQuestion = QUIZ_QUESTIONS[i];
  setQuizBanner(quizQuestion.prompt);
};

const handleQuizAnswer = (name: string): void => {
  if (!quizQuestion) return;
  if (quizBannerTimeout !== null) {
    clearTimeout(quizBannerTimeout);
    quizBannerTimeout = null;
  }
  if (name === quizQuestion.answer) {
    const label = name.charAt(0).toUpperCase() + name.slice(1);
    setQuizBanner(`✓ ${label}`, "correct");
    quizBannerTimeout = window.setTimeout(() => {
      if (quizActive) nextQuizQuestion();
    }, 1500);
  } else {
    setQuizBanner("Miss — try again", "wrong");
    quizBannerTimeout = window.setTimeout(() => {
      if (quizActive && quizQuestion) {
        setQuizBanner(quizQuestion.prompt);
      }
    }, 1200);
  }
};

const applyLabelsFromCheckbox = (): void => {
  const checkbox = document.querySelector<HTMLInputElement>(
    "#toggleLabelsCheckbox",
  );
  const container = document.querySelector<HTMLElement>(".planet-labels");
  container?.classList.toggle(
    "planet-labels--visible",
    (checkbox?.checked ?? false) && !quizActive,
  );
};

const updateQuizButton = (active: boolean): void => {
  const btn = document.getElementById("quizToggle");
  if (!btn) return;
  btn.textContent = active ? "Stop quiz" : "Start quiz";
  btn.classList.toggle("quiz-toggle--active", active);
};

const setQuizActive = (active: boolean): void => {
  quizActive = active;
  updateQuizButton(active);
  applyLabelsFromCheckbox();
  if (active) {
    hideInfoPanel();
    nextQuizQuestion();
  } else {
    quizQuestion = null;
    hideQuizBanner();
    if (quizBannerTimeout !== null) {
      clearTimeout(quizBannerTimeout);
      quizBannerTimeout = null;
    }
  }
};

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
  const postProcessingPromise = import("./postProcessing");

  const loaderPercent = document.getElementById("loaderPercent");
  const textures = await loadPlanetTextures((loaded, total) => {
    if (loaderPercent) {
      loaderPercent.textContent = `${Math.round((loaded / total) * 100)}%`;
    }
  });

  const sun = new Sun();
  const planets = createSolarSystemPlanets(textures);

  let starsMesh = createStarsInstancedMesh(starsOptions.count);
  let stars: Star[] = Array.from(
    { length: starsOptions.count },
    (_, i) => new Star(starsMesh, i),
  );

  const skybox = createStarfield();
  scene.add(skybox);

  const asteroidBelt = createAsteroidBelt();
  scene.add(asteroidBelt);

  scene.add(camera.object, sun.model, sun.getLight(), starsMesh);

  const sunFlares = new SunFlares(sunOptions.radius);
  sun.model.add(sunFlares.points);

  planets.forEach((planet) => {
    scene.add(planet.mesh);
    scene.add(planet.trail);
    scene.add(planet.orbitLine);
  });

  const saturn = planets.find((p) => p.name === "saturn") ?? null;
  const saturnRings = saturn ? createSaturnRings(saturn.radius) : null;
  if (saturnRings) scene.add(saturnRings);

  const earth = planets.find((p) => p.name === "earth") ?? null;
  const moonTexture = textures.get("moon");
  const moon =
    earth && moonTexture
      ? new Moon(earth, earth.radius * 2.2, 0.08, earth.radius * 0.27, moonTexture)
      : null;
  if (moon) scene.add(moon.mesh);

  const earthClouds = earth ? new EarthClouds(earth.radius) : null;
  const earthAtmosphere = earth ? createEarthAtmosphere(earth.radius) : null;
  if (earth && earthClouds) earth.mesh.add(earthClouds.mesh);
  if (earth && earthAtmosphere) earth.mesh.add(earthAtmosphere);

  const { createPostProcessing } = await postProcessingPromise;
  const postProcessing = createPostProcessing(renderer, scene, camera.object);

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

  let debugPanel: DebugPanel | null = null;
  let DebugPanelCtor: typeof DebugPanel | null = null;
  const setDebugEnabled = (enabled: boolean): void => {
    if (enabled && !debugPanel) {
      void (async () => {
        if (!DebugPanelCtor) {
          const mod = await import("./debugPanel");
          DebugPanelCtor = mod.DebugPanel;
        }
        const stillEnabled =
          (
            document.getElementById(
              "toggleDebugCheckbox",
            ) as HTMLInputElement | null
          )?.checked ?? false;
        if (stillEnabled && !debugPanel) {
          debugPanel = new DebugPanelCtor(renderer);
        }
      })();
    } else if (!enabled && debugPanel) {
      debugPanel.destroy();
      debugPanel = null;
    }
  };

  const minimapCanvas = document.getElementById(
    "minimap",
  ) as HTMLCanvasElement | null;
  const minimap = minimapCanvas
    ? new Minimap(minimapCanvas, sun, planets, camera)
    : null;

  initSettingsPanel(planets, rebuildStars, postProcessing, setDebugEnabled);
  initDragAndDrop(sun, planets);

  tourGuide = new TourGuide(
    camera,
    (id) => showInfoPanel(id),
    () => {
      syncTourUI();
      if (!tourGuide?.isActive()) hideInfoPanel();
    },
    sun,
    planets,
  );
  initTourControls();

  const appEl = document.getElementById("app");
  const getAppSize = (): [number, number] => [
    appEl?.clientWidth ?? window.innerWidth,
    appEl?.clientHeight ?? window.innerHeight,
  ];

  window.addEventListener("resize", () => {
    const [w, h] = getAppSize();
    camera.object.aspect = w / h;
    camera.object.updateProjectionMatrix();
    renderer.setSize(w, h);
    postProcessing.setSize(w, h);
    sunFlares.setPixelRatio(renderer.getPixelRatio());
    minimap?.resize();
  });

  const clock = new Clock();
  let scaledElapsed = 0;

  const animate = () => {
    requestAnimationFrame(animate);
    debugPanel?.begin();

    const dt = Math.min(0.05, clock.getDelta());
    scaledElapsed += dt * settings.timeSpeed;

    camera.updatePosition();

    sun.updateNoiseAnimation(scaledElapsed);
    sun.updatePosition(dt);
    sunFlares.setPixelRatio(renderer.getPixelRatio());
    sunFlares.update(dt * settings.timeSpeed);

    planets.forEach((planet) => {
      planet.updateRotation();
      planet.updatePosition(dt);
      planet.updateTrail();
    });

    if (saturn && saturnRings) {
      saturnRings.position.copy(saturn.mesh.position);
    }

    if (moon) {
      moon.updatePosition();
      moon.updateRotation();
    }

    if (earthClouds) {
      earthClouds.update(scaledElapsed, settings.timeSpeed);
    }

    asteroidBelt.rotation.y += 0.0003 * settings.timeSpeed;

    stars.forEach((star) => star.tryToExplode(camera.object.position));

    updateLabels();
    minimap?.draw();

    postProcessing.composer.render();
    debugPanel?.end();
  };

  camera.updatePosition();
  planets.forEach((planet) => {
    planet.updatePosition(0);
    planet.updateTrail();
  });
  renderer.compile(scene, camera.object);
  postProcessing.composer.render();

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
  const appRoot = document.getElementById("app") ?? document.body;
  appRoot.appendChild(container);

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
    const canvas = renderer.domElement;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

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
  postProcessing: PostProcessing,
  setDebugEnabled: (enabled: boolean) => void,
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
    labelsContainer?.classList.toggle(
      "planet-labels--visible",
      v && !quizActive,
    );
  });

  bindCheckbox("toggleTrailsCheckbox", "tr", true, (v) => {
    planets.forEach((planet) => (planet.trail.visible = v));
  });

  bindCheckbox("toggleInclinationsCheckbox", "inc", false, (v) => {
    settings.realInclinations = v;
    planets.forEach((planet) => planet.resetTrail());
  });

  bindCheckbox("toggleDanceModeCheckbox", "dance", false, (v) => {
    settings.danceMode = v;
  });

  bindCheckbox("toggleDebugCheckbox", "debug", false, setDebugEnabled);

  document.getElementById("quizToggle")?.addEventListener("click", () => {
    setQuizActive(!quizActive);
  });

  document.getElementById("infoPanelClose")?.addEventListener("click", () => {
    if (tourGuide?.isActive()) {
      tourGuide.stop();
    } else {
      hideInfoPanel();
    }
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
      const app = document.getElementById("app");
      const w = app?.clientWidth ?? window.innerWidth;
      const h = app?.clientHeight ?? window.innerHeight;
      renderer.setPixelRatio(preset.pixelRatio);
      renderer.setSize(w, h);
      postProcessing.setSize(w, h);
    },
  );
};

const initTourControls = (): void => {
  document.getElementById("tourToggle")?.addEventListener("click", () => {
    if (!tourGuide) return;
    if (tourGuide.isActive()) {
      tourGuide.stop();
    } else {
      tourGuide.start();
    }
  });
  document.getElementById("tourPrev")?.addEventListener("click", () => {
    tourGuide?.prev();
  });
  document.getElementById("tourNext")?.addEventListener("click", () => {
    tourGuide?.next();
  });
  document.getElementById("tourStop")?.addEventListener("click", () => {
    tourGuide?.stop();
  });

  window.addEventListener("keydown", (event) => {
    const target = event.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT")
    ) {
      return;
    }

    if (tourGuide?.isActive()) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        tourGuide.next();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        tourGuide.prev();
      } else if (event.key === "Escape") {
        event.preventDefault();
        tourGuide.stop();
      }
      return;
    }

    if (event.key === "Escape") {
      const panel = document.getElementById("infoPanel");
      if (panel?.classList.contains("info-panel--visible")) {
        event.preventDefault();
        hideInfoPanel();
      }
    }
  });
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
  let downClientX = 0;
  let downClientY = 0;
  let downTime = 0;

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
    downClientX = event.clientX;
    downClientY = event.clientY;
    downTime = performance.now();

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
      active.setDragPosition(next);

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

    const dx = event.clientX - downClientX;
    const dy = event.clientY - downClientY;
    const elapsed = performance.now() - downTime;
    const wasClick =
      dx * dx + dy * dy < CLICK_DISTANCE_SQ &&
      elapsed < CLICK_MAX_DURATION_MS;
    const clickedName = active.name;

    const velocity = new Vector3();
    if (history.length >= 2 && !wasClick) {
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

    if (wasClick) {
      onBodyClick(clickedName);
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

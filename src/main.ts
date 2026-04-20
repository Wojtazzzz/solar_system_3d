import {
  initScene,
  initRenderer,
  initCamera,
  createSolarSystemPlanets,
  loadPlanetTextures,
} from "./utils";
import { Sun } from "./objects/sun";
import { Star, createStarsInstancedMesh } from "./objects/star";
import {
  stars as starsOptions,
  camera as cameraOptions,
  ZOOM_SPEED,
} from "./consts";
import { Clock } from "three";

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

  const clock = new Clock();

  const animate = () => {
    requestAnimationFrame(animate);

    camera.updatePosition();

    sun.updateNoiseAnimation(clock.getElapsedTime());

    planets.forEach((planet) => {
      planet.updateRotation();
      planet.updatePosition();
      planet.updateTrail();
    });

    stars.forEach((star) => star.tryToExplode(camera.object.position));

    renderer.render(scene, camera.object);
  };

  camera.updatePosition();
  planets.forEach((planet) => {
    planet.updatePosition();
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

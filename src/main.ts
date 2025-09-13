import {
  initScene,
  initRenderer,
  initCamera,
  createSolarSystemPlanets,
} from "./utils";
import { Sun } from "./objects/sun";
import { Star } from "./objects/star";
import {
  CAMERA_INITIAL_RADIUS,
  CAMERA_MAX_RADIUS,
  CAMERA_MIN_RADIUS,
  STARS_COUNT,
  ZOOM_SPEED,
} from "./consts";
import { Clock } from "three";

const renderer = initRenderer();
const scene = initScene();
const camera = initCamera();

const slider = document.getElementById("zoomSlider") as HTMLInputElement;
slider.min = String(CAMERA_MIN_RADIUS);
slider.max = String(CAMERA_MAX_RADIUS);
slider.value = String(CAMERA_INITIAL_RADIUS);

const sun = new Sun();
const planets = createSolarSystemPlanets();
const stars: Star[] = [];

Array.from({ length: STARS_COUNT }).forEach(() => stars.push(new Star()));

stars.forEach((star) => scene.add(star.mesh));
stars.forEach((star) => scene.add(star.explosion));

scene.add(
  camera.object,
  sun.model,
  sun.getLight(),
  ...planets.map((planet) => planet.mesh),
);

const clock = new Clock();

const animate = () => {
  requestAnimationFrame(animate);

  camera.updatePosition();

  sun.updateNoiseAnimation(clock.getElapsedTime());

  planets.forEach((planet) => {
    planet.updateRotation();
    planet.updatePosition();

    const [oldTrail, newTrail] = planet.updateTrail();

    if (oldTrail) {
      scene.remove(oldTrail);
    }

    if (newTrail) {
      scene.add(newTrail);
    }
  });

  stars.forEach((star) => star.tryToExplode(camera.object.position));

  renderer.render(scene, camera.object);
};

animate();

window.addEventListener("wheel", (event: WheelEvent) => {
  camera.setRadius(camera.getRadius() + event.deltaY * ZOOM_SPEED * 0.01);

  slider.value = String(camera.getRadius());
});

slider.addEventListener("input", () => {
  camera.setRadius(parseFloat(slider.value));
});

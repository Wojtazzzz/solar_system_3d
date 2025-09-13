import {
  initScene,
  initRenderer,
  initCamera,
  createSolarSystemPlanets,
} from "./utils.ts";
import { Sun } from "./objects/sun.ts";
import { Star } from "./objects/star";
import { STARS_COUNT, ZOOM_SPEED } from "./consts.ts";
import {Clock} from "three";

const renderer = initRenderer();
const scene = initScene();
const camera = initCamera();

const sun = new Sun();
const planets = createSolarSystemPlanets();
const stars = Array.from({ length: STARS_COUNT }).map(() => new Star());

scene.add(
  camera.object,
  sun.model,
  sun.getLight(),
  ...planets.map((planet) => planet.mesh),
  ...stars.map((star) => star.mesh),
  ...stars.map((star) => star.explosion),
);

const clock = new Clock();

function animate() {
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
}

animate();

window.addEventListener("wheel", (event: WheelEvent) => {
  camera.setRadius(camera.getRadius() + event.deltaY * ZOOM_SPEED * 0.01);
});

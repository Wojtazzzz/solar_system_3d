import * as THREE from "three";
import { getScene } from "./utils.ts";
import { Sun } from "./objects/sun.ts";
import { Planet } from "./objects/planet.ts";
import { PLANET_SCALE } from "./consts.ts";
import { Star } from "./objects/star.ts";

const scene = getScene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const pointLight = new THREE.PointLight(0xffcf37, 500, 5000);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const sun = new Sun();
const mercury = new Planet("mercury", 0.007 * PLANET_SCALE, 5, 0.04, 7);
const venus = new Planet("venus", 0.0174 * PLANET_SCALE, 7, 0.015, 3);
const earth = new Planet("earth", 0.0183 * PLANET_SCALE, 10, 0.01, 0);
const mars = new Planet("mars", 0.0097 * PLANET_SCALE, 15, 0.008, 1.85);
const jupiter = new Planet(
  "jupiter",
  (0.201 * PLANET_SCALE) / 4,
  25,
  0.004,
  1.3,
);
const saturn = new Planet("saturn", (0.167 * PLANET_SCALE) / 4, 35, 0.003, 2.5);
const uranus = new Planet("uranus", (0.073 * PLANET_SCALE) / 4, 45, 0.002, 0.8);
const neptune = new Planet(
  "neptune",
  (0.0708 * PLANET_SCALE) / 4,
  55,
  0.0015,
  1.8,
);

camera.position.z = 42;
camera.position.y = 20;
camera.lookAt(0, 0, 0);

const stars: Star[] = [];

Array.from({ length: 6000 }).forEach(() => {
  stars.push(new Star());
});

let theta = 0;
let radius = 32;
const baseCameraY = 20;
const yFactor = baseCameraY / radius;

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune].forEach(
    (object) => {
      object.mesh.rotation.x += 0.001;
      object.mesh.rotation.y += 0.0005;

      object.updatePosition();
      object.updateTrail();
    },
  );

  sun.sunMaterial.uniforms.time.value = clock.getElapsedTime();

  stars.forEach((star) => star.tryToExplode());

  theta += 0.001;

  camera.position.x = radius * Math.cos(theta);
  camera.position.z = radius * Math.sin(theta);
  camera.position.y = radius * yFactor;

  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

animate();

function onScroll(event: WheelEvent) {
  const scrollSpeed = 1;

  radius += event.deltaY * scrollSpeed * 0.01;

  radius = Math.max(5, Math.min(40, radius));
}

window.addEventListener("wheel", onScroll);

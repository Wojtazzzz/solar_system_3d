import { Camera } from "./objects/camera";
import { Planet } from "./objects/planet";
import {
  earth,
  jupiter,
  mars,
  mercury,
  neptune,
  planet,
  saturn,
  uranus,
  venus,
} from "./consts";
import { Scene, WebGLRenderer } from "three";

export const initScene = () => {
  if (!window.scene) {
    window.scene = new Scene();
  }

  return window.scene;
};

export const initCamera = () => {
  if (!window.camera) {
    window.camera = new Camera();
  }

  return window.camera;
};

export const initRenderer = () => {
  if (!window.renderer) {
    window.renderer = new WebGLRenderer();

    window.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    window.renderer.setSize(window.innerWidth, window.innerHeight);

    document.getElementById('app')?.appendChild(window.renderer.domElement);
  }

  return window.renderer;
};

export const createSolarSystemPlanets = () => {
  return [
    new Planet(
      mercury.name,
      mercury.radius * planet.radiusScale,
      mercury.orbitalRadius,
      mercury.orbitalSpeed,
      mercury.inclination,
    ),
    new Planet(
        venus.name,
        venus.radius * planet.radiusScale,
        venus.orbitalRadius,
        venus.orbitalSpeed,
        venus.inclination,
    ),
    new Planet(
        earth.name,
        earth.radius * planet.radiusScale,
        earth.orbitalRadius,
        earth.orbitalSpeed,
        earth.inclination,
    ),
    new Planet(
        mars.name,
        mars.radius * planet.radiusScale,
        mars.orbitalRadius,
        mars.orbitalSpeed,
        mars.inclination,
    ),
    new Planet(
        jupiter.name,
        jupiter.radius * planet.radiusScale / 4,
        jupiter.orbitalRadius,
        jupiter.orbitalSpeed,
        jupiter.inclination,
    ),
    new Planet(
        saturn.name,
        saturn.radius * planet.radiusScale / 4,
        saturn.orbitalRadius,
        saturn.orbitalSpeed,
        saturn.inclination,
    ),
    new Planet(
        uranus.name,
        uranus.radius * planet.radiusScale / 4,
        uranus.orbitalRadius,
        uranus.orbitalSpeed,
        uranus.inclination,
    ),
    new Planet(
        neptune.name,
        neptune.radius * planet.radiusScale / 4,
        neptune.orbitalRadius,
        neptune.orbitalSpeed,
        neptune.inclination,
    ),
  ];
};

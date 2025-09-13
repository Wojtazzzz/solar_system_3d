import { Camera } from "./objects/camera";
import { Planet } from "./objects/planet";
import {
  EARTH_INCLINATION,
  EARTH_NAME,
  EARTH_ORBITAL_RADIUS,
  EARTH_ORBITAL_SPEED,
  EARTH_RADIUS,
  JUPITER_INCLINATION,
  JUPITER_NAME,
  JUPITER_ORBITAL_RADIUS,
  JUPITER_ORBITAL_SPEED,
  JUPITER_RADIUS,
  MARS_INCLINATION,
  MARS_NAME,
  MARS_ORBITAL_RADIUS,
  MARS_ORBITAL_SPEED,
  MARS_RADIUS,
  MERCURY_INCLINATION,
  MERCURY_NAME,
  MERCURY_ORBITAL_RADIUS,
  MERCURY_ORBITAL_SPEED,
  MERCURY_RADIUS,
  NEPTUNE_INCLINATION,
  NEPTUNE_NAME,
  NEPTUNE_ORBITAL_RADIUS,
  NEPTUNE_ORBITAL_SPEED,
  NEPTUNE_RADIUS,
  PLANET_RADIUS_SCALE,
  SATURN_INCLINATION,
  SATURN_NAME,
  SATURN_ORBITAL_RADIUS,
  SATURN_ORBITAL_SPEED,
  SATURN_RADIUS,
  URANUS_INCLINATION,
  URANUS_NAME,
  URANUS_ORBITAL_RADIUS,
  URANUS_ORBITAL_SPEED,
  URANUS_RADIUS,
  VENUS_INCLINATION,
  VENUS_NAME,
  VENUS_ORBITAL_RADIUS,
  VENUS_ORBITAL_SPEED,
  VENUS_RADIUS,
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
      MERCURY_NAME,
      MERCURY_RADIUS * PLANET_RADIUS_SCALE,
      MERCURY_ORBITAL_RADIUS,
      MERCURY_ORBITAL_SPEED,
      MERCURY_INCLINATION,
    ),
    new Planet(
      VENUS_NAME,
      VENUS_RADIUS * PLANET_RADIUS_SCALE,
      VENUS_ORBITAL_RADIUS,
      VENUS_ORBITAL_SPEED,
      VENUS_INCLINATION,
    ),
    new Planet(
      EARTH_NAME,
      EARTH_RADIUS * PLANET_RADIUS_SCALE,
      EARTH_ORBITAL_RADIUS,
      EARTH_ORBITAL_SPEED,
      EARTH_INCLINATION,
    ),
    new Planet(
      MARS_NAME,
      MARS_RADIUS * PLANET_RADIUS_SCALE,
      MARS_ORBITAL_RADIUS,
      MARS_ORBITAL_SPEED,
      MARS_INCLINATION,
    ),
    new Planet(
      JUPITER_NAME,
      (JUPITER_RADIUS * PLANET_RADIUS_SCALE) / 4,
      JUPITER_ORBITAL_RADIUS,
      JUPITER_ORBITAL_SPEED,
      JUPITER_INCLINATION,
    ),
    new Planet(
      SATURN_NAME,
      (SATURN_RADIUS * PLANET_RADIUS_SCALE) / 4,
      SATURN_ORBITAL_RADIUS,
      SATURN_ORBITAL_SPEED,
      SATURN_INCLINATION,
    ),
    new Planet(
      URANUS_NAME,
      (URANUS_RADIUS * PLANET_RADIUS_SCALE) / 4,
      URANUS_ORBITAL_RADIUS,
      URANUS_ORBITAL_SPEED,
      URANUS_INCLINATION,
    ),
    new Planet(
      NEPTUNE_NAME,
      (NEPTUNE_RADIUS * PLANET_RADIUS_SCALE) / 4,
      NEPTUNE_ORBITAL_RADIUS,
      NEPTUNE_ORBITAL_SPEED,
      NEPTUNE_INCLINATION,
    ),
  ];
};

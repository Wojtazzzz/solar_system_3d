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
import { Scene, WebGLRenderer, TextureLoader, type Texture } from "three";

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

    document.getElementById("app")?.appendChild(window.renderer.domElement);
  }

  return window.renderer;
};

const PLANET_NAMES = [
  mercury.name,
  venus.name,
  earth.name,
  mars.name,
  jupiter.name,
  saturn.name,
  uranus.name,
  neptune.name,
] as const;

export const loadPlanetTextures = async (): Promise<Map<string, Texture>> => {
  const loader = new TextureLoader();
  const entries = await Promise.all(
    PLANET_NAMES.map(async (name): Promise<[string, Texture]> => {
      const texture = await loader.loadAsync(`/images/${name}.jpg`);
      return [name, texture];
    }),
  );
  return new Map(entries);
};

export const createSolarSystemPlanets = (textures: Map<string, Texture>) => {
  const getTexture = (name: string): Texture => {
    const t = textures.get(name);
    if (!t) {
      throw new Error(`Missing preloaded texture for planet "${name}"`);
    }
    return t;
  };

  return [
    new Planet(
      mercury.name,
      mercury.radius * planet.radiusScale,
      mercury.orbitalRadius,
      mercury.orbitalSpeed,
      mercury.inclination,
      getTexture(mercury.name),
    ),
    new Planet(
      venus.name,
      venus.radius * planet.radiusScale,
      venus.orbitalRadius,
      venus.orbitalSpeed,
      venus.inclination,
      getTexture(venus.name),
    ),
    new Planet(
      earth.name,
      earth.radius * planet.radiusScale,
      earth.orbitalRadius,
      earth.orbitalSpeed,
      earth.inclination,
      getTexture(earth.name),
    ),
    new Planet(
      mars.name,
      mars.radius * planet.radiusScale,
      mars.orbitalRadius,
      mars.orbitalSpeed,
      mars.inclination,
      getTexture(mars.name),
    ),
    new Planet(
      jupiter.name,
      (jupiter.radius * planet.radiusScale) / 4,
      jupiter.orbitalRadius,
      jupiter.orbitalSpeed,
      jupiter.inclination,
      getTexture(jupiter.name),
    ),
    new Planet(
      saturn.name,
      (saturn.radius * planet.radiusScale) / 4,
      saturn.orbitalRadius,
      saturn.orbitalSpeed,
      saturn.inclination,
      getTexture(saturn.name),
    ),
    new Planet(
      uranus.name,
      (uranus.radius * planet.radiusScale) / 4,
      uranus.orbitalRadius,
      uranus.orbitalSpeed,
      uranus.inclination,
      getTexture(uranus.name),
    ),
    new Planet(
      neptune.name,
      (neptune.radius * planet.radiusScale) / 4,
      neptune.orbitalRadius,
      neptune.orbitalSpeed,
      neptune.inclination,
      getTexture(neptune.name),
    ),
  ];
};

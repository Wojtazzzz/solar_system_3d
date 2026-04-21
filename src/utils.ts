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
    const app = document.getElementById("app");
    const width = app?.clientWidth ?? window.innerWidth;
    const height = app?.clientHeight ?? window.innerHeight;

    window.renderer = new WebGLRenderer({ preserveDrawingBuffer: true });
    window.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    window.renderer.setSize(width, height);

    app?.appendChild(window.renderer.domElement);
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
  "moon",
  "normal",
] as const;

export const loadPlanetTextures = async (
  onProgress?: (loaded: number, total: number) => void,
): Promise<Map<string, Texture>> => {
  const loader = new TextureLoader();
  const total = PLANET_NAMES.length;
  let loaded = 0;
  onProgress?.(0, total);

  const entries = await Promise.all(
    PLANET_NAMES.map(async (name): Promise<[string, Texture]> => {
      const texture = await loader.loadAsync(`/images/${name}.jpg`);
      loaded++;
      onProgress?.(loaded, total);
      return [name, texture];
    }),
  );
  return new Map(entries);
};

const PLANET_CONFIGS = [
  mercury,
  venus,
  earth,
  mars,
  jupiter,
  saturn,
  uranus,
  neptune,
] as const;

const GAS_GIANT_RADIUS_DIVISOR = 4;
const GAS_GIANTS: ReadonlySet<string> = new Set([
  jupiter.name,
  saturn.name,
  uranus.name,
  neptune.name,
]);

export const createSolarSystemPlanets = (textures: Map<string, Texture>): Planet[] => {
  const getTexture = (name: string): Texture => {
    const t = textures.get(name);
    if (!t) {
      throw new Error(`Missing preloaded texture for planet "${name}"`);
    }
    return t;
  };

  const normalMap = textures.get("normal") ?? null;

  return PLANET_CONFIGS.map((cfg) => {
    const baseRadius = cfg.radius * planet.radiusScale;
    const radius = GAS_GIANTS.has(cfg.name)
      ? baseRadius / GAS_GIANT_RADIUS_DIVISOR
      : baseRadius;
    return new Planet(
      cfg.name,
      radius,
      cfg.orbitalRadius,
      cfg.orbitalSpeed,
      cfg.inclination,
      getTexture(cfg.name),
      normalMap,
    );
  });
};

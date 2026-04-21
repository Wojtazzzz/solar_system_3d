import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import {
  HalfFloatType,
  Vector2,
  WebGLRenderTarget,
  type PerspectiveCamera,
  type Scene,
  type WebGLRenderer,
} from "three";

export type PostProcessing = {
  readonly composer: EffectComposer;
  setSize(width: number, height: number): void;
};

export const createPostProcessing = (
  renderer: WebGLRenderer,
  scene: Scene,
  camera: PerspectiveCamera,
): PostProcessing => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const renderTarget = new WebGLRenderTarget(width, height, {
    type: HalfFloatType,
    samples: 0,
  });

  const composer = new EffectComposer(renderer, renderTarget);
  composer.setPixelRatio(renderer.getPixelRatio());
  composer.setSize(width, height);

  composer.addPass(new RenderPass(scene, camera));

  const bloomPass = new UnrealBloomPass(
    new Vector2(width, height),
    0.3,
    0.15,
    1.1,
  );
  composer.addPass(bloomPass);

  composer.addPass(new OutputPass());

  const setSize = (w: number, h: number): void => {
    composer.setPixelRatio(renderer.getPixelRatio());
    composer.setSize(w, h);
    bloomPass.resolution.set(w, h);
  };

  return { composer, setSize };
};

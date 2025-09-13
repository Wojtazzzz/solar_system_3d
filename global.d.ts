import type { Scene, WebGLRenderer } from "three";
import type { Camera } from "src/objects/camera";

declare global {
  interface Window {
    scene: null | Scene;
    camera: null | Camera;
    renderer: null | WebGLRenderer;
  }
}

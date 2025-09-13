import type {Camera, Scene} from "three";

declare global {
    interface Window {
        scene: null | Scene;
        camera: null | Camera;
    }
}
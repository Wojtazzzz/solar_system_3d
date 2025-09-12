import { type Scene } from "three";

declare global {
    interface Window {
        scene: null | Scene;
    }
}
import {getScene} from "../utils.ts";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {Group} from "three";

export class Sun
{
    public model: null|Group = null;

    constructor() {
        const loader = new GLTFLoader();

        loader.load(
            '/images/sun/scene.gltf',
            (gltf) => {
                this.model = gltf.scene;

                this.model.scale.set(0.184, 0.184, 0.184);

                getScene().add(this.model);
            },
            (xhr) => {
                console.log(`${(xhr.loaded / xhr.total) * 100}% załadowane`);
            },
            (error) => {
                console.error('Błąd ładowania modelu:', error);
            }
        );
    }

    updateRotation() {
        if (!this.model) {
            return;
        }

        this.model.rotation.x -= 0.005;
        this.model.rotation.y -= 0.005;
    }
}
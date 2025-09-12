import {getScene} from "../utils.ts";
import * as THREE from "three";

export class Star
{
    public mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap>;

    constructor() {
        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 32, 32),
            new THREE.MeshStandardMaterial({ color: 0xffffff }),
        );

        const [x, y, z] = Array.from({ length: 3 })
            .map(() => THREE.MathUtils.randFloatSpread(150));

        this.mesh.position.set(x, y, z);

        getScene().add(this.mesh);
    }

    tryToExplode() {
        if (Math.random() <= 0.998) {
            return;
        }

        const explosion = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 32, 32),
            new THREE.MeshStandardMaterial({ color: 0xffffff }),
        );

        explosion.position.set(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);

        getScene().add(explosion);

        setTimeout(() => {
            getScene().remove(explosion);
        }, 16 * 2);
    }
}
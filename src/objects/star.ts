import {getCamera, getScene} from "../utils.ts";
import * as THREE from "three";

export class Star {
  public mesh: THREE.Mesh<
    THREE.SphereGeometry,
    THREE.MeshStandardMaterial | THREE.MeshBasicMaterial,
    THREE.Object3DEventMap
  >;

  public explosion: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial | THREE.MeshBasicMaterial, THREE.Object3DEventMap>;

  constructor() {
      this.mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 32, 32),
          new THREE.MeshStandardMaterial({ color: 0xffffff }),
      );

      this.explosion = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 32, 32),
          new THREE.MeshStandardMaterial({ color: 0xffffff }),
      );

    const [x, y, z] = Array.from({ length: 3 }).map(() =>
      THREE.MathUtils.randFloatSpread(150),
    );

    this.mesh.position.set(x, y, z);
    this.explosion.position.set(x, y, z);

    getScene().add(this.mesh, this.explosion);
  }

  tryToExplode() {
    const CHANCE_TO_EXPLODE = 0.002;

    if (Math.random() <= (1 - CHANCE_TO_EXPLODE)) {
      return;
    }

    const distanceToCamera = getCamera().position.distanceTo(this.mesh.position);

    if (distanceToCamera < 20) {
      return;
    }

    this.explosion.scale.set(2.1, 2.1, 2.1);

    setTimeout(() => {
      this.explosion.scale.set(1, 1, 1);
    }, 16 * 4);
  }
}

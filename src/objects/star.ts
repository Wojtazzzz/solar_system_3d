import {
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  MathUtils, Vector3,
} from "three";

export class Star {
  public mesh: Mesh<
    SphereGeometry,
    MeshStandardMaterial
  >;

  public explosion: Mesh<
    SphereGeometry,
    MeshStandardMaterial
  >;

  constructor() {
    this.mesh = new Mesh(
      new SphereGeometry(0.08, 32, 32),
      new MeshStandardMaterial({ color: 0xffffff }),
    );

    this.explosion = new Mesh(
      new SphereGeometry(0.08, 32, 32),
      new MeshStandardMaterial({ color: 0xffffff }),
    );

    const [x, y, z] = Array.from({ length: 3 }).map(() =>
      MathUtils.randFloatSpread(150),
    );

    this.mesh.position.set(x, y, z);
    this.explosion.position.set(x, y, z);
  }

  tryToExplode(currentCameraPosition: Vector3) {
    const CHANCE_TO_EXPLODE = 0.002;

    if (Math.random() <= 1 - CHANCE_TO_EXPLODE) {
      return;
    }

    const distanceToCamera = currentCameraPosition.distanceTo(
      this.mesh.position,
    );

    if (distanceToCamera < 20) {
      return;
    }

    this.explosion.scale.set(2.1, 2.1, 2.1);

    setTimeout(() => {
      this.explosion.scale.set(1, 1, 1);
    }, 16 * 4);
  }
}

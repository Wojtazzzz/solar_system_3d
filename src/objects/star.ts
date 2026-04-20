import {
  InstancedMesh,
  Matrix4,
  MeshBasicMaterial,
  SphereGeometry,
  MathUtils,
  Vector3,
} from "three";
import { stars, sun } from "../consts";

export const createStarsInstancedMesh = (count: number): InstancedMesh => {
  const geometry = new SphereGeometry(stars.radius, 8, 8);
  const material = new MeshBasicMaterial({ color: stars.color });
  const mesh = new InstancedMesh(geometry, material, count);
  mesh.frustumCulled = false;
  return mesh;
};

export class Star {
  public readonly position = new Vector3();
  private readonly matrix = new Matrix4();
  private scale = 1;

  constructor(
    private readonly instancedMesh: InstancedMesh,
    private readonly index: number,
  ) {
    const sunPos = new Vector3(sun.positionX, sun.positionY, sun.positionZ);

    do {
      this.position.set(
        MathUtils.randFloatSpread(stars.maxRenderDistanceFromSun * 2),
        MathUtils.randFloatSpread(stars.maxRenderDistanceFromSun * 2),
        MathUtils.randFloatSpread(stars.maxRenderDistanceFromSun * 2),
      );
    } while (
      this.position.distanceTo(sunPos) < stars.minRenderDistanceFromSun
    );

    this.applyMatrix();
  }

  private applyMatrix(): void {
    this.matrix.makeScale(this.scale, this.scale, this.scale);
    this.matrix.setPosition(this.position);
    this.instancedMesh.setMatrixAt(this.index, this.matrix);
    this.instancedMesh.instanceMatrix.needsUpdate = true;
  }

  tryToExplode(currentCameraPosition: Vector3): void {
    if (Math.random() <= 1 - stars.chanceToExplode) {
      return;
    }

    const starDistanceToCamera = currentCameraPosition.distanceTo(
      this.position,
    );

    if (starDistanceToCamera < stars.maxDistanceFromCameraToPreventExplode) {
      return;
    }

    this.scale = stars.explosionRadiusScale;
    this.applyMatrix();

    setTimeout(() => {
      this.scale = 1;
      this.applyMatrix();
    }, 16 * stars.explosionLengthInFrames);
  }
}

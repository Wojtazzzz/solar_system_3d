import {
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  MathUtils,
  Vector3, MeshBasicMaterial,
} from "three";
import {stars, sun} from "../consts";

export class Star {
  public readonly mesh: Mesh<SphereGeometry, MeshStandardMaterial | MeshBasicMaterial>;
  public readonly explosion: Mesh<SphereGeometry, MeshStandardMaterial | MeshBasicMaterial>;

  constructor() {
    this.mesh = new Mesh(
      new SphereGeometry(stars.radius, 32, 32),
      new MeshBasicMaterial({ color: stars.color }),
    );

    this.explosion = new Mesh(
      new SphereGeometry(stars.radius, 32, 32),
      new MeshBasicMaterial({ color: stars.color }),
    );

    const generateCoords = () => {
      let coords: [number, number, number];

      do {
        coords = [
          MathUtils.randFloatSpread(stars.maxRenderDistanceFromSun * 2),
          MathUtils.randFloatSpread(stars.maxRenderDistanceFromSun * 2),
          MathUtils.randFloatSpread(stars.maxRenderDistanceFromSun * 2),
        ];
      } while (
        new Vector3(...coords).distanceTo({
          x: sun.positionX,
          y: sun.positionY,
          z: sun.positionZ,
        }) < stars.minRenderDistanceFromSun
      );

      return coords;
    };

    const [x, y, z] = generateCoords();

    this.mesh.position.set(x, y, z);
    this.explosion.position.set(x, y, z);
  }

  tryToExplode(currentCameraPosition: Vector3) {
    if (Math.random() <= 1 - stars.chanceToExplode) {
      return;
    }

    const starDistanceToCamera = currentCameraPosition.distanceTo(
      this.mesh.position,
    );

    if (
      starDistanceToCamera < stars.maxDistanceFromCameraToPreventExplode
    ) {
      return;
    }

    this.explosion.scale.set(
        stars.explosionRadiusScale,
        stars.explosionRadiusScale,
        stars.explosionRadiusScale,
    );

    setTimeout(() => {
      this.explosion.scale.set(1, 1, 1);
    }, 16 * stars.explosionLengthInFrames);
  }
}

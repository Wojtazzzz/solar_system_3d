import {
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  MathUtils,
  Vector3,
} from "three";
import {
  STAR_CHANCE_TO_EXPLODE,
  STAR_COLOR,
  STAR_EXPLOSION_LENGTH_IN_FRAMES,
  STAR_EXPLOSION_RADIUS_SCALE,
  STAR_MAX_DISTANCE_FROM_CAMERA_TO_PREVENT_EXPLODE,
  STAR_MAX_RENDER_DISTANCE_FROM_SUN,
  STAR_MIN_RENDER_DISTANCE_FROM_SUN,
  STAR_RADIUS,
  SUN_POSITION_X,
  SUN_POSITION_Y,
  SUN_POSITION_Z,
} from "../consts.ts";

export class Star {
  public readonly mesh: Mesh<SphereGeometry, MeshStandardMaterial>;
  public readonly explosion: Mesh<SphereGeometry, MeshStandardMaterial>;

  constructor() {
    this.mesh = new Mesh(
      new SphereGeometry(STAR_RADIUS, 32, 32),
      new MeshStandardMaterial({ color: STAR_COLOR }),
    );

    this.explosion = new Mesh(
      new SphereGeometry(STAR_RADIUS, 32, 32),
      new MeshStandardMaterial({ color: STAR_COLOR }),
    );

    const generateCoords = () => {
      let coords: [number, number, number];

      do {
        coords = [
          MathUtils.randFloatSpread(STAR_MAX_RENDER_DISTANCE_FROM_SUN * 2),
          MathUtils.randFloatSpread(STAR_MAX_RENDER_DISTANCE_FROM_SUN * 2),
          MathUtils.randFloatSpread(STAR_MAX_RENDER_DISTANCE_FROM_SUN * 2),
        ];
      } while (
        new Vector3(...coords).distanceTo({
          x: SUN_POSITION_X,
          y: SUN_POSITION_Y,
          z: SUN_POSITION_Z,
        }) < STAR_MIN_RENDER_DISTANCE_FROM_SUN
      );

      return coords;
    };

    const [x, y, z] = generateCoords();

    this.mesh.position.set(x, y, z);
    this.explosion.position.set(x, y, z);
  }

  tryToExplode(currentCameraPosition: Vector3) {
    if (Math.random() <= 1 - STAR_CHANCE_TO_EXPLODE) {
      return;
    }

    const starDistanceToCamera = currentCameraPosition.distanceTo(
      this.mesh.position,
    );

    if (
      starDistanceToCamera < STAR_MAX_DISTANCE_FROM_CAMERA_TO_PREVENT_EXPLODE
    ) {
      return;
    }

    this.explosion.scale.set(
      STAR_EXPLOSION_RADIUS_SCALE,
      STAR_EXPLOSION_RADIUS_SCALE,
      STAR_EXPLOSION_RADIUS_SCALE,
    );

    setTimeout(() => {
      this.explosion.scale.set(1, 1, 1);
    }, 16 * STAR_EXPLOSION_LENGTH_IN_FRAMES);
  }
}

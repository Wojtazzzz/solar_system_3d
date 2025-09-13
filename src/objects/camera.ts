import { PerspectiveCamera } from "three";
import {
  CAMERA_FAR,
  CAMERA_FOV,
  CAMERA_INITIAL_RADIUS,
  CAMERA_INITIAL_Y,
  CAMERA_MAX_RADIUS,
  CAMERA_MIN_RADIUS,
  CAMERA_ROTATION_SPEED,
} from "../consts.ts";

export class Camera {
  public readonly object: PerspectiveCamera;

  public constructor(
    private theta = 0,
    private radius = CAMERA_INITIAL_RADIUS,
    private yFactor = CAMERA_INITIAL_Y / CAMERA_INITIAL_RADIUS,
  ) {
    this.object = new PerspectiveCamera(
      CAMERA_FOV,
      window.innerWidth / window.innerHeight,
      0.1,
      CAMERA_FAR,
    );
  }

  getRadius() {
    return this.radius;
  }

  setRadius(radius: number) {
    this.radius = Math.max(
      CAMERA_MIN_RADIUS,
      Math.min(CAMERA_MAX_RADIUS, radius),
    );
  }

  updatePosition() {
    this.theta += CAMERA_ROTATION_SPEED / 1000;

    this.object.position.x = this.radius * Math.cos(this.theta);
    this.object.position.z = this.radius * Math.sin(this.theta);
    this.object.position.y = this.radius * this.yFactor;

    this.object.lookAt(0, 0, 0);
  }
}

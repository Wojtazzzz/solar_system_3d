import { PerspectiveCamera } from "three";
import {
  INITIAL_CAMERA_Y,
  MAX_CAMERA_RADIUS,
  MIN_CAMERA_RADIUS,
} from "../consts.ts";

export class Camera {
  public object: PerspectiveCamera;
  private theta: number;
  private radius: number;

  public constructor() {
    this.object = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    this.theta = 0;
    this.radius = 32;

    this.object.lookAt(0, 0, 0);
  }

  getRadius() {
    return this.radius;
  }

  setRadius(radius: number) {
    this.radius = Math.max(
      MIN_CAMERA_RADIUS,
      Math.min(MAX_CAMERA_RADIUS, radius),
    );
  }

  updatePosition() {
    this.theta += 0.001;

    const yFactor = INITIAL_CAMERA_Y / 32;

    this.object.position.x = this.radius * Math.cos(this.theta);
    this.object.position.z = this.radius * Math.sin(this.theta);
    this.object.position.y = this.radius * yFactor;

    this.object.lookAt(0, 0, 0);
  }
}

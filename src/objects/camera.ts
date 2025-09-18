import { PerspectiveCamera } from "three";
import {
  camera,
} from "../consts";

export class Camera {
  public readonly object: PerspectiveCamera;

  public constructor(
    private theta = 0,
    private radius = camera.initialRadius,
    private yFactor = camera.initialY / camera.initialRadius,
  ) {
    this.object = new PerspectiveCamera(
      camera.fov,
      window.innerWidth / window.innerHeight,
      0.1,
      camera.far,
    );
  }

  getRadius() {
    return this.radius;
  }

  setRadius(radius: number) {
    this.radius = Math.max(
      camera.minRadius,
      Math.min(camera.maxRadius, radius),
    );
  }

  updatePosition() {
    this.theta += camera.rotationSpeed / 1000;

    this.object.position.x = this.radius * Math.cos(this.theta);
    this.object.position.z = this.radius * Math.sin(this.theta);
    this.object.position.y = this.radius * this.yFactor;

    this.object.lookAt(0, 0, 0);
  }
}

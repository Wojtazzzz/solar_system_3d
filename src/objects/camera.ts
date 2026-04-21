import { Object3D, PerspectiveCamera, Vector3 } from "three";
import {
  camera,
} from "../consts";

const LERP_ALPHA = 0.08;
const FOCUS_ROTATION_SPEED = 0.004;
const FOCUS_Y_FACTOR = 0.35;

export class Camera {
  public readonly object: PerspectiveCamera;

  private focusTarget: Object3D | null = null;
  private focusDistance = 0;
  private focusTheta = 0;

  private readonly desiredPos = new Vector3();
  private readonly targetPos = new Vector3();
  private readonly currentLookAt = new Vector3();
  private readonly wantedLookAt = new Vector3();

  public constructor(
    private theta = 0,
    private radius = camera.initialRadius,
    private yFactor = camera.initialY / camera.initialRadius,
  ) {
    const app = document.getElementById("app");
    const width = app?.clientWidth ?? window.innerWidth;
    const height = app?.clientHeight ?? window.innerHeight;
    this.object = new PerspectiveCamera(
      camera.fov,
      width / height,
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

  setFocus(target: Object3D, distance: number): void {
    this.focusTarget = target;
    this.focusDistance = distance;
  }

  clearFocus(): void {
    this.focusTarget = null;
  }

  isFocused(): boolean {
    return this.focusTarget !== null;
  }

  updatePosition() {
    if (this.focusTarget) {
      this.focusTheta += FOCUS_ROTATION_SPEED;
      this.focusTarget.getWorldPosition(this.targetPos);

      this.desiredPos.set(
        this.targetPos.x + this.focusDistance * Math.cos(this.focusTheta),
        this.targetPos.y + this.focusDistance * FOCUS_Y_FACTOR,
        this.targetPos.z + this.focusDistance * Math.sin(this.focusTheta),
      );
      this.wantedLookAt.copy(this.targetPos);
    } else {
      this.theta += camera.rotationSpeed / 1000;
      this.desiredPos.set(
        this.radius * Math.cos(this.theta),
        this.radius * this.yFactor,
        this.radius * Math.sin(this.theta),
      );
      this.wantedLookAt.set(0, 0, 0);
    }

    this.object.position.lerp(this.desiredPos, LERP_ALPHA);
    this.currentLookAt.lerp(this.wantedLookAt, LERP_ALPHA);
    this.object.lookAt(this.currentLookAt);
  }
}

import { Vector3 } from "three";
import { settings } from "../settings";

type DragState = "idle" | "dragging" | "returning";

const SPRING_STIFFNESS = 3.2;
const SPRING_DAMPING = 1.9;
const SETTLE_DISTANCE = 0.05;
const SETTLE_VELOCITY_SQ = 0.01;

const TURB_FREQ_X = 38;
const TURB_FREQ_Y = 47;
const TURB_FREQ_Z = 42;

const turbulence = (t: number): number =>
  Math.sin(t) * 0.55 + Math.sin(t * 2.3) * 0.3 + Math.sin(t * 5.7) * 0.15;

export class BodyPhysics {
  public readonly basePosition = new Vector3();
  public readonly danceOffset = new Vector3();

  private state: DragState = "idle";
  private readonly velocity = new Vector3();
  private readonly acceleration = new Vector3();
  private readonly toHome = new Vector3();

  private turbX = Math.random() * Math.PI * 2;
  private turbY = Math.random() * Math.PI * 2;
  private turbZ = Math.random() * Math.PI * 2;

  startDrag(currentPosition: Vector3): void {
    this.state = "dragging";
    this.velocity.set(0, 0, 0);
    this.basePosition.copy(currentPosition).sub(this.danceOffset);
  }

  setDragPosition(pos: Vector3): void {
    this.basePosition.copy(pos);
  }

  endDrag(releaseVelocity: Vector3): void {
    this.state = "returning";
    this.velocity.copy(releaseVelocity);
  }

  update(dt: number, homePosition: Vector3, danceAmplitude: number): void {
    if (this.state === "idle") {
      this.basePosition.copy(homePosition);
    } else if (this.state === "returning" && dt > 0) {
      this.toHome.copy(homePosition).sub(this.basePosition);
      const distance = this.toHome.length();

      this.acceleration
        .copy(this.toHome)
        .multiplyScalar(SPRING_STIFFNESS)
        .addScaledVector(this.velocity, -SPRING_DAMPING);

      this.velocity.addScaledVector(this.acceleration, dt);
      this.basePosition.addScaledVector(this.velocity, dt);

      if (
        distance < SETTLE_DISTANCE &&
        this.velocity.lengthSq() < SETTLE_VELOCITY_SQ
      ) {
        this.basePosition.copy(homePosition);
        this.velocity.set(0, 0, 0);
        this.state = "idle";
      }
    }

    this.updateDanceOffset(dt, danceAmplitude);
  }

  writeTo(outPosition: Vector3): void {
    outPosition.copy(this.basePosition).add(this.danceOffset);
  }

  private updateDanceOffset(dt: number, amplitude: number): void {
    if (!settings.danceMode) {
      this.danceOffset.set(0, 0, 0);
      return;
    }
    const scaled = Math.max(0, dt) * settings.timeSpeed;
    this.turbX += scaled * TURB_FREQ_X;
    this.turbY += scaled * TURB_FREQ_Y;
    this.turbZ += scaled * TURB_FREQ_Z;
    this.danceOffset.set(
      turbulence(this.turbX) * amplitude,
      turbulence(this.turbY) * amplitude,
      turbulence(this.turbZ) * amplitude,
    );
  }
}

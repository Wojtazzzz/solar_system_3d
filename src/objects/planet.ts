import {
  BufferAttribute,
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  Vector3,
  type Texture,
} from "three";
import {
  planet,
  USE_REAL_PLANET_INCLINATION,
} from "../consts";

type DragState = "idle" | "dragging" | "returning";

const SPRING_STIFFNESS = 3.2;
const SPRING_DAMPING = 1.9;
const SETTLE_DISTANCE = 0.05;
const SETTLE_VELOCITY_SQ = 0.01;

export class Planet {
  public mesh: Mesh<SphereGeometry, MeshBasicMaterial | MeshStandardMaterial>;
  public readonly trail: Line<BufferGeometry, LineBasicMaterial>;
  private theta = 0;
  private readonly trailPositions: Float32Array;
  private readonly maxTrailLength: number;
  private trailCount = 0;

  private readonly velocity = new Vector3();
  private readonly homeCache = new Vector3();
  private readonly toHome = new Vector3();
  private readonly acceleration = new Vector3();
  private dragState: DragState = "idle";

  public constructor(
    public readonly name: string,
    public readonly radius: number,
    public readonly orbitalRadius: number,
    public readonly orbitalSpeed: number,
    public readonly inclination: number,
    private readonly texture: Texture,
  ) {
    this.mesh = new Mesh(
      new SphereGeometry(radius, 32, 32),
      new MeshBasicMaterial({ map: texture }),
    );

    this.theta = Math.random() * 10 - 10;

    this.maxTrailLength = Math.max(
      2,
      Math.ceil(orbitalRadius * planet.trailLength),
    );
    this.trailPositions = new Float32Array(this.maxTrailLength * 3);

    const trailGeometry = new BufferGeometry();
    trailGeometry.setAttribute(
      "position",
      new BufferAttribute(this.trailPositions, 3),
    );
    trailGeometry.setDrawRange(0, 0);

    this.trail = new Line(
      trailGeometry,
      new LineBasicMaterial({ color: planet.trailColor }),
    );
    this.trail.frustumCulled = false;
  }

  getHomePosition(target: Vector3 = this.homeCache): Vector3 {
    target.set(
      this.orbitalRadius * planet.orbitalRadiusScale * Math.cos(this.theta),
      USE_REAL_PLANET_INCLINATION
        ? this.orbitalRadius * Math.sin(this.inclination)
        : 0,
      this.orbitalRadius * planet.orbitalRadiusScale * Math.sin(this.theta),
    );
    return target;
  }

  startDrag(): void {
    this.dragState = "dragging";
    this.velocity.set(0, 0, 0);
  }

  endDrag(releaseVelocity: Vector3): void {
    this.dragState = "returning";
    this.velocity.copy(releaseVelocity);
  }

  updatePosition(dt: number = 0): void {
    this.theta += this.orbitalSpeed * 0.4;

    if (this.dragState === "idle") {
      this.getHomePosition(this.mesh.position);
      return;
    }

    if (this.dragState === "returning" && dt > 0) {
      this.getHomePosition(this.homeCache);
      this.toHome.copy(this.homeCache).sub(this.mesh.position);
      const distance = this.toHome.length();

      this.acceleration
        .copy(this.toHome)
        .multiplyScalar(SPRING_STIFFNESS)
        .addScaledVector(this.velocity, -SPRING_DAMPING);

      this.velocity.addScaledVector(this.acceleration, dt);
      this.mesh.position.addScaledVector(this.velocity, dt);

      if (
        distance < SETTLE_DISTANCE &&
        this.velocity.lengthSq() < SETTLE_VELOCITY_SQ
      ) {
        this.mesh.position.copy(this.homeCache);
        this.velocity.set(0, 0, 0);
        this.dragState = "idle";
      }
    }
  }

  updateRotation() {
    this.mesh.rotation.x += planet.rotationSpeedX / 1000;
    this.mesh.rotation.y += planet.rotationSpeedY / 1000;
  }

  setIsShadow(isShadow: boolean) {
    if (isShadow && !(this.mesh.material instanceof MeshStandardMaterial)) {
      this.mesh.material.dispose();
      this.mesh.material = new MeshStandardMaterial({ map: this.texture });
    } else if (!isShadow && !(this.mesh.material instanceof MeshBasicMaterial)) {
      this.mesh.material.dispose();
      this.mesh.material = new MeshBasicMaterial({ map: this.texture });
    }
  }

  updateTrail() {
    const { x, y, z } = this.mesh.position;

    if (this.trailCount < this.maxTrailLength) {
      const idx = this.trailCount * 3;
      this.trailPositions[idx] = x;
      this.trailPositions[idx + 1] = y;
      this.trailPositions[idx + 2] = z;
      this.trailCount++;
    } else {
      this.trailPositions.copyWithin(0, 3);
      const idx = (this.maxTrailLength - 1) * 3;
      this.trailPositions[idx] = x;
      this.trailPositions[idx + 1] = y;
      this.trailPositions[idx + 2] = z;
    }

    this.trail.geometry.setDrawRange(0, this.trailCount);
    this.trail.geometry.attributes.position.needsUpdate = true;
  }
}

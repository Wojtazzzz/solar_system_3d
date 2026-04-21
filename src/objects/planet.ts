import {
  BufferAttribute,
  BufferGeometry,
  Line,
  LineBasicMaterial,
  LineLoop,
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
import { settings } from "../settings";
import { BodyPhysics } from "./bodyPhysics";

const ORBIT_SEGMENTS = 128;
const ORBIT_COLOR = 0x444444;
const ORBIT_OPACITY = 0.4;
const DANCE_MIN_AMPLITUDE = 0.25;
const DANCE_RADIUS_SCALE = 2.0;

export class Planet {
  public mesh: Mesh<SphereGeometry, MeshBasicMaterial | MeshStandardMaterial>;
  public readonly trail: Line<BufferGeometry, LineBasicMaterial>;
  public readonly orbitLine: LineLoop<BufferGeometry, LineBasicMaterial>;
  private theta = 0;
  private readonly trailPositions: Float32Array;
  private readonly maxTrailLength: number;
  private trailCount = 0;

  private readonly homeCache = new Vector3();
  private readonly physics = new BodyPhysics();

  public constructor(
    public readonly name: string,
    public readonly radius: number,
    public readonly orbitalRadius: number,
    public readonly orbitalSpeed: number,
    public readonly inclination: number,
    private readonly texture: Texture,
    private readonly normalMap: Texture | null = null,
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

    const orbitRadius = orbitalRadius * planet.orbitalRadiusScale;
    const orbitPoints = new Float32Array(ORBIT_SEGMENTS * 3);
    for (let i = 0; i < ORBIT_SEGMENTS; i++) {
      const angle = (i / ORBIT_SEGMENTS) * Math.PI * 2;
      orbitPoints[i * 3] = orbitRadius * Math.cos(angle);
      orbitPoints[i * 3 + 1] = 0;
      orbitPoints[i * 3 + 2] = orbitRadius * Math.sin(angle);
    }
    const orbitGeometry = new BufferGeometry();
    orbitGeometry.setAttribute(
      "position",
      new BufferAttribute(orbitPoints, 3),
    );

    this.orbitLine = new LineLoop(
      orbitGeometry,
      new LineBasicMaterial({
        color: ORBIT_COLOR,
        transparent: true,
        opacity: ORBIT_OPACITY,
      }),
    );
    this.orbitLine.visible = false;
  }

  getHomePosition(target: Vector3 = this.homeCache): Vector3 {
    const useInclination =
      settings.realInclinations || USE_REAL_PLANET_INCLINATION;
    target.set(
      this.orbitalRadius * planet.orbitalRadiusScale * Math.cos(this.theta),
      useInclination ? this.orbitalRadius * Math.sin(this.inclination) : 0,
      this.orbitalRadius * planet.orbitalRadiusScale * Math.sin(this.theta),
    );
    return target;
  }

  startDrag(): void {
    this.physics.startDrag(this.mesh.position);
  }

  setDragPosition(pos: Vector3): void {
    this.physics.setDragPosition(pos);
  }

  endDrag(releaseVelocity: Vector3): void {
    this.physics.endDrag(releaseVelocity);
  }

  updatePosition(dt: number = 0): void {
    this.theta += this.orbitalSpeed * 0.4 * settings.timeSpeed;

    const useInclination =
      settings.realInclinations || USE_REAL_PLANET_INCLINATION;
    this.orbitLine.position.y = useInclination
      ? this.orbitalRadius * Math.sin(this.inclination)
      : 0;

    this.getHomePosition(this.homeCache);
    const amplitude = Math.max(DANCE_MIN_AMPLITUDE, this.radius * DANCE_RADIUS_SCALE);
    this.physics.update(dt, this.homeCache, amplitude);
    this.physics.writeTo(this.mesh.position);
  }

  updateRotation() {
    this.mesh.rotation.x +=
      (planet.rotationSpeedX / 1000) * settings.timeSpeed;
    this.mesh.rotation.y +=
      (planet.rotationSpeedY / 1000) * settings.timeSpeed;
  }

  setIsShadow(isShadow: boolean) {
    if (isShadow && !(this.mesh.material instanceof MeshStandardMaterial)) {
      this.mesh.material.dispose();
      this.mesh.material = new MeshStandardMaterial({
        map: this.texture,
        normalMap: this.normalMap ?? undefined,
      });
    } else if (!isShadow && !(this.mesh.material instanceof MeshBasicMaterial)) {
      this.mesh.material.dispose();
      this.mesh.material = new MeshBasicMaterial({ map: this.texture });
    }
  }

  resetTrail(): void {
    this.trailCount = 0;
    this.trail.geometry.setDrawRange(0, 0);
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

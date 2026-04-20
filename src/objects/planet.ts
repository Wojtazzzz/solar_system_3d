import {
  BufferAttribute,
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  type Texture,
} from "three";
import {
  planet,
  USE_REAL_PLANET_INCLINATION,
} from "../consts";

export class Planet {
  public mesh: Mesh<SphereGeometry, MeshBasicMaterial | MeshStandardMaterial>;
  public readonly trail: Line<BufferGeometry, LineBasicMaterial>;
  private theta = 0;
  private readonly trailPositions: Float32Array;
  private readonly maxTrailLength: number;
  private trailCount = 0;

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

  updatePosition() {
    this.theta += this.orbitalSpeed * 0.4;

    this.mesh.position.x =
      this.orbitalRadius * planet.orbitalRadiusScale * Math.cos(this.theta);
    this.mesh.position.z =
      this.orbitalRadius * planet.orbitalRadiusScale * Math.sin(this.theta);

    if (USE_REAL_PLANET_INCLINATION) {
      this.mesh.position.y = this.orbitalRadius * Math.sin(this.inclination);
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

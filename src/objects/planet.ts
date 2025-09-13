import {
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry, TextureLoader, type Vector3,
} from "three";
import { USE_REAL_PLANET_INCLINATION } from "../consts.ts";

export class Planet {
  public mesh: Mesh<SphereGeometry, MeshStandardMaterial>;
  public theta = 0;
  public trailPoints: Vector3[] = [];
  public trail: null | Line<BufferGeometry, LineBasicMaterial> = null;

  public constructor(
    public readonly name: string,
    public readonly radius: number,
    public readonly orbitalRadius: number,
    public readonly orbitalSpeed: number,
    public readonly inclination: number,
  ) {
    this.mesh = new Mesh(
      new SphereGeometry(radius, 32, 32),
      new MeshStandardMaterial({
        map: new TextureLoader().load(`/images/${name}.jpg`),
      }),
    );

    this.theta = Math.random() * 10 - 10;
  }

  updatePosition() {
    this.theta += this.orbitalSpeed;

    this.mesh.position.x = (this.orbitalRadius / 1.2) * Math.cos(this.theta);
    this.mesh.position.z = (this.orbitalRadius / 1.2) * Math.sin(this.theta);

    if (USE_REAL_PLANET_INCLINATION) {
      this.mesh.position.y = this.orbitalRadius * Math.sin(this.inclination);
    }
  }

  updateRotation() {
    this.mesh.rotation.x += 0.001;
    this.mesh.rotation.y += 0.0005;
  }

  updateTrail() {
    this.trailPoints.push(this.mesh.position.clone());

    if (this.trailPoints.length > this.orbitalRadius * 27) {
      this.trailPoints.shift();
    }

    const oldTrail = this.trail;

    const trailMaterial = new LineBasicMaterial({ color: 0x4f4f4f });
    const trailGeometry = new BufferGeometry().setFromPoints(
      this.trailPoints,
    );
    this.trail = new Line(trailGeometry, trailMaterial);

    return [oldTrail, this.trail];
  }
}

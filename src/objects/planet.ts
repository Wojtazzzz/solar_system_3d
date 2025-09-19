import {
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial, MeshStandardMaterial,
  SphereGeometry,
  TextureLoader,
  type Vector3,
} from "three";
import {
  planet,
  USE_REAL_PLANET_INCLINATION,
} from "../consts";

export class Planet {
  public mesh: Mesh<SphereGeometry, MeshBasicMaterial | MeshStandardMaterial>;
  private theta = 0;
  private trailPoints: Vector3[] = [];
  private trail: null | Line<BufferGeometry, LineBasicMaterial> = null;

  public constructor(
    public readonly name: string,
    public readonly radius: number,
    public readonly orbitalRadius: number,
    public readonly orbitalSpeed: number,
    public readonly inclination: number,
  ) {
    this.mesh = new Mesh(
      new SphereGeometry(radius, 32, 32),
      new MeshBasicMaterial({
        map: new TextureLoader().load(`/images/${name}.jpg`),
      }),
    );

    // random start position
    this.theta = Math.random() * 10 - 10;
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
      this.mesh.material = new MeshStandardMaterial({
        map: new TextureLoader().load(`/images/${this.name}.jpg`),
      });
    } else if (!isShadow && !(this.mesh.material instanceof MeshBasicMaterial)) {
      this.mesh.material.dispose();
      this.mesh.material = new MeshBasicMaterial({
        map: new TextureLoader().load(`/images/${this.name}.jpg`),
      });
    }
  }

  updateTrail() {
    this.trailPoints.push(this.mesh.position.clone());

    if (this.trailPoints.length > this.orbitalRadius * planet.trailLength) {
      this.trailPoints.shift();
    }

    const oldTrail = this.trail;

    const trailMaterial = new LineBasicMaterial({
      color: planet.trailColor,
    });
    const trailGeometry = new BufferGeometry().setFromPoints(this.trailPoints);
    this.trail = new Line(trailGeometry, trailMaterial);

    return [oldTrail, this.trail];
  }
}

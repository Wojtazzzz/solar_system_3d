import {
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  type Texture,
} from "three";
import { Planet } from "./planet";
import { settings } from "../settings";

const THETA_SCALE = 0.4;

export class Moon {
  public readonly mesh: Mesh<SphereGeometry, MeshBasicMaterial>;
  private theta = Math.random() * Math.PI * 2;

  constructor(
    private readonly parent: Planet,
    private readonly orbitalRadius: number,
    private readonly orbitalSpeed: number,
    radius: number,
    texture: Texture,
  ) {
    this.mesh = new Mesh(
      new SphereGeometry(radius, 24, 24),
      new MeshBasicMaterial({ map: texture }),
    );
  }

  updatePosition(): void {
    this.theta += this.orbitalSpeed * THETA_SCALE * settings.timeSpeed;
    const parentPos = this.parent.mesh.position;
    this.mesh.position.set(
      parentPos.x + this.orbitalRadius * Math.cos(this.theta),
      parentPos.y,
      parentPos.z + this.orbitalRadius * Math.sin(this.theta),
    );
  }

  updateRotation(): void {
    this.mesh.rotation.y += 0.002 * settings.timeSpeed;
  }
}

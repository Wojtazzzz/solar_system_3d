import { renderPlanet } from "../utils.ts";
import type { Mesh, MeshStandardMaterial, SphereGeometry} from "three";

export class Planet
{
    public mesh: Mesh<SphereGeometry, MeshStandardMaterial>;
    public theta = 0;

    public constructor(
        public readonly name: string,
        public readonly radius: number,
        public readonly orbitalRadius: number,
        public readonly orbitalSpeed: number,
    ) {
        this.mesh = renderPlanet(name, radius)
    }

    updatePosition() {
        this.theta += this.orbitalSpeed;
        this.mesh.position.x = this.orbitalRadius / 2 * Math.cos(this.theta);
        this.mesh.position.z = this.orbitalRadius / 2 * Math.sin(this.theta);
    }
}
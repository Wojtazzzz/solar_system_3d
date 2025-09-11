import {renderPlanet} from "../utils.ts";
import type {Mesh, MeshStandardMaterial, SphereGeometry} from "three";

export class Sun
{
    public readonly name = 'sun';
    public readonly radius = 2;

    public mesh: Mesh<SphereGeometry, MeshStandardMaterial>;

    constructor() {
        this.mesh = renderPlanet(this.name, this.radius)
    }
}
import {getScene, renderPlanet} from "../utils.ts";
import {
    BufferGeometry,
    type BufferGeometryEventMap,
    Line,
    LineBasicMaterial,
    type Mesh,
    type MeshStandardMaterial,
    type NormalBufferAttributes, type Object3DEventMap,
    type SphereGeometry
} from "three";
import * as THREE from "three";
import {USE_REAL_PLANET_INCLINATION} from "../consts.ts";

export class Planet
{
    public mesh: Mesh<SphereGeometry, MeshStandardMaterial>;
    public theta = 0;
    public trailPoints: THREE.Vector3[] = [];
    public trail: null|Line<BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>, LineBasicMaterial, Object3DEventMap> = null

    public constructor(
        public readonly name: string,
        public readonly radius: number,
        public readonly orbitalRadius: number,
        public readonly orbitalSpeed: number,
        public readonly inclination: number,
    ) {
        this.mesh = renderPlanet(name, radius);
        this.theta = Math.random() * 10 - 10;
    }

    updatePosition() {
        this.theta += this.orbitalSpeed;

        this.mesh.position.x = this.orbitalRadius / 1.2 * Math.cos(this.theta);
        this.mesh.position.z = this.orbitalRadius / 1.2 * Math.sin(this.theta);

        if (USE_REAL_PLANET_INCLINATION) {
            this.mesh.position.y = this.orbitalRadius * Math.sin(this.inclination);
        }
    }

    updateTrail() {
        this.trailPoints.push(this.mesh.position.clone());

        if (this.trailPoints.length > this.orbitalRadius * 27) {
            this.trailPoints.shift();
        }

        if (this.trail) {
            getScene().remove(this.trail);
        }

        const trailMaterial = new THREE.LineBasicMaterial({ color: 0x4F4F4F });
        const trailGeometry = new THREE.BufferGeometry().setFromPoints(this.trailPoints);
        this.trail = new THREE.Line(trailGeometry, trailMaterial);

        getScene().add(this.trail);
    }
}
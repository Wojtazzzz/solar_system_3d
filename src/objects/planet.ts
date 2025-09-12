import {getScene, renderPlanet} from "../utils.ts";
import {
    BufferGeometry, type BufferGeometryEventMap, Line, LineBasicMaterial,
    type Mesh,
    type MeshStandardMaterial,
    type NormalBufferAttributes, type Object3DEventMap,
    type SphereGeometry
} from "three";
import * as THREE from "three";

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
    ) {
        this.mesh = renderPlanet(name, radius);
    }

    updatePosition() {
        this.theta += this.orbitalSpeed;

        this.mesh.position.x = this.orbitalRadius / 1.5 * Math.cos(this.theta);
        this.mesh.position.z = this.orbitalRadius / 1.5 * Math.sin(this.theta);
    }

    updateTrail() {
        this.trailPoints.push(this.mesh.position.clone());

        if (this.trailPoints.length > this.orbitalRadius * 27) {
            this.trailPoints.shift();
        }

        if (this.trail) {
            getScene().remove(this.trail);
        }

        const trailMaterial = new THREE.LineBasicMaterial({ color: 0x696969 });
        const trailGeometry = new THREE.BufferGeometry().setFromPoints(this.trailPoints);
        this.trail = new THREE.Line(trailGeometry, trailMaterial);

        getScene().add(this.trail);
    }
}
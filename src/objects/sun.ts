import { type Mesh, ShaderMaterial, type SphereGeometry } from "three";
import * as THREE from "three";
import { noise } from "./noise.ts";
import { getScene } from "../utils.ts";

export class Sun {
  public model: null | Mesh<SphereGeometry, ShaderMaterial> = null;
  public sunMaterial: ShaderMaterial;

  constructor() {
    this.sunMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        emissiveIntensity: { value: 8 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
      fragmentShader: `
        uniform float time;
        uniform float emissiveIntensity;
        varying vec2 vUv;
        varying vec3 vPosition;

        ${noise}

        void main() {
            float scale = 5.0 / 0.7;
            float noiseValue = noise(vPosition * scale + time);
            vec3 color = mix(vec3(1.0, 0.1, 0.0), vec3(1.0, 0.2, 0.0), noiseValue);
            float intensity = (noiseValue * 0.5 + 0.5) * emissiveIntensity;
            gl_FragColor = vec4(color * intensity, 1.0);
        }
    `,
    });

    this.model = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      this.sunMaterial,
    );

    getScene().add(this.model);
  }
}

import {
  Mesh,
  ShaderMaterial,
  SphereGeometry,
} from "three";
import { noise } from "./sun";

const CLOUDS_SCALE = 1.018;
const ROTATION_SPEED = 0.0004;

export class EarthClouds {
  public readonly mesh: Mesh<SphereGeometry, ShaderMaterial>;

  constructor(earthRadius: number) {
    const geometry = new SphereGeometry(earthRadius * CLOUDS_SCALE, 64, 64);

    const material = new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vPosition;

        ${noise}

        void main() {
          vec3 p = vPosition * 4.5;
          float drift = time * 0.03;

          float n1 = noise(p + vec3(drift));
          float n2 = noise(p * 2.0 + vec3(drift * 1.3));
          float n3 = noise(p * 4.0 + vec3(drift * 1.6));
          float value = n1 * 0.55 + n2 * 0.3 + n3 * 0.15;

          float alpha = smoothstep(0.08, 0.45, value);
          gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * 0.8);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    this.mesh = new Mesh(geometry, material);
  }

  update(scaledElapsed: number, timeSpeed: number): void {
    this.mesh.material.uniforms.time.value = scaledElapsed;
    this.mesh.rotation.y += ROTATION_SPEED * timeSpeed;
  }
}

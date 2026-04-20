import {
  DoubleSide,
  Mesh,
  RingGeometry,
  ShaderMaterial,
} from "three";

const INNER_RADIUS_SCALE = 1.4;
const OUTER_RADIUS_SCALE = 2.6;
const AXIAL_TILT = 0.35;

export const createSaturnRings = (
  planetRadius: number,
): Mesh<RingGeometry, ShaderMaterial> => {
  const innerRadius = planetRadius * INNER_RADIUS_SCALE;
  const outerRadius = planetRadius * OUTER_RADIUS_SCALE;

  const geometry = new RingGeometry(innerRadius, outerRadius, 128, 1);

  const material = new ShaderMaterial({
    uniforms: {
      innerRadius: { value: innerRadius },
      outerRadius: { value: outerRadius },
    },
    vertexShader: `
      varying float vRadial;
      uniform float innerRadius;
      uniform float outerRadius;
      void main() {
        float r = length(position.xy);
        vRadial = (r - innerRadius) / (outerRadius - innerRadius);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying float vRadial;
      void main() {
        float bands = sin(vRadial * 41.0) * 0.30
                    + sin(vRadial * 93.0) * 0.15
                    + sin(vRadial * 17.0) * 0.25;
        float lightness = 0.55 + bands * 0.35;
        vec3 color = mix(
          vec3(0.45, 0.38, 0.28),
          vec3(0.95, 0.87, 0.68),
          lightness
        );
        float alpha = 0.55 + bands * 0.40;
        alpha *= smoothstep(0.0, 0.08, vRadial);
        alpha *= 1.0 - smoothstep(0.92, 1.0, vRadial);
        gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.95));
      }
    `,
    transparent: true,
    side: DoubleSide,
    depthWrite: false,
  });

  const mesh = new Mesh(geometry, material);
  mesh.rotation.x = Math.PI / 2 - AXIAL_TILT;
  return mesh;
};

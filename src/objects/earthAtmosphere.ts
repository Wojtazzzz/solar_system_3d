import {
  AdditiveBlending,
  FrontSide,
  Mesh,
  ShaderMaterial,
  SphereGeometry,
} from "three";

const ATMOSPHERE_SCALE = 1.12;

export const createEarthAtmosphere = (
  earthRadius: number,
): Mesh<SphereGeometry, ShaderMaterial> => {
  const geometry = new SphereGeometry(
    earthRadius * ATMOSPHERE_SCALE,
    64,
    64,
  );

  const material = new ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vMvPos;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vMvPos = mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vMvPos;

      void main() {
        vec3 viewDir = normalize(-vMvPos);
        float fresnel = 1.0 - abs(dot(vNormal, viewDir));
        float glow = pow(fresnel, 2.5);

        vec3 color = mix(
          vec3(0.25, 0.55, 1.0),
          vec3(0.55, 0.80, 1.0),
          glow
        );

        gl_FragColor = vec4(color, glow * 0.85);
      }
    `,
    transparent: true,
    blending: AdditiveBlending,
    side: FrontSide,
    depthWrite: false,
  });

  return new Mesh(geometry, material);
};

import { Mesh, PointLight, ShaderMaterial, SphereGeometry, Vector3 } from "three";
import { sun } from "../consts";
import { settings } from "../settings";

type DragState = "idle" | "dragging" | "returning";

const SPRING_STIFFNESS = 3.2;
const SPRING_DAMPING = 1.9;
const SETTLE_DISTANCE = 0.05;
const SETTLE_VELOCITY_SQ = 0.01;

export class Sun {
  public readonly name = "sun";
  public readonly model: Mesh<SphereGeometry, ShaderMaterial>;
  public readonly material: ShaderMaterial;
  public readonly light: PointLight;

  private readonly homePosition = new Vector3(
    sun.positionX,
    sun.positionY,
    sun.positionZ,
  );
  private readonly velocity = new Vector3();
  private readonly toHome = new Vector3();
  private readonly acceleration = new Vector3();
  private readonly basePosition = new Vector3();
  private readonly danceOffset = new Vector3();
  private dragState: DragState = "idle";

  private turbX = Math.random() * Math.PI * 2;
  private turbY = Math.random() * Math.PI * 2;
  private turbZ = Math.random() * Math.PI * 2;

  constructor() {
    this.material = this.createSunMaterial();

    this.model = new Mesh(
      new SphereGeometry(sun.radius, 96, 96),
      this.material,
    );
    this.model.position.copy(this.homePosition);
    this.basePosition.copy(this.homePosition);

    this.light = new PointLight(
      sun.lightColor,
      sun.lightIntensity,
      sun.lightDistance,
    );
    this.light.position.copy(this.homePosition);
  }

  get mesh(): Mesh<SphereGeometry, ShaderMaterial> {
    return this.model;
  }

  getHomePosition(): Vector3 {
    return this.homePosition;
  }

  startDrag(): void {
    this.dragState = "dragging";
    this.velocity.set(0, 0, 0);
    this.basePosition.copy(this.model.position).sub(this.danceOffset);
  }

  setDragPosition(pos: Vector3): void {
    this.basePosition.copy(pos);
  }

  endDrag(releaseVelocity: Vector3): void {
    this.dragState = "returning";
    this.velocity.copy(releaseVelocity);
  }

  updatePosition(dt: number): void {
    if (this.dragState === "returning" && dt > 0) {
      this.toHome.copy(this.homePosition).sub(this.basePosition);
      const distance = this.toHome.length();

      this.acceleration
        .copy(this.toHome)
        .multiplyScalar(SPRING_STIFFNESS)
        .addScaledVector(this.velocity, -SPRING_DAMPING);

      this.velocity.addScaledVector(this.acceleration, dt);
      this.basePosition.addScaledVector(this.velocity, dt);

      if (
        distance < SETTLE_DISTANCE &&
        this.velocity.lengthSq() < SETTLE_VELOCITY_SQ
      ) {
        this.basePosition.copy(this.homePosition);
        this.velocity.set(0, 0, 0);
        this.dragState = "idle";
      }
    } else if (this.dragState === "idle") {
      this.basePosition.copy(this.homePosition);
    }

    this.computeDanceOffset(dt);
    this.model.position.copy(this.basePosition).add(this.danceOffset);
    this.light.position.copy(this.model.position);
  }

  private computeDanceOffset(dt: number): void {
    if (!settings.danceMode) {
      this.danceOffset.set(0, 0, 0);
      return;
    }
    const scaled = Math.max(0, dt) * settings.timeSpeed;
    this.turbX += scaled * 38;
    this.turbY += scaled * 47;
    this.turbZ += scaled * 42;
    const amp = sun.radius * 0.4;
    const ox =
      Math.sin(this.turbX) * 0.55 +
      Math.sin(this.turbX * 2.3) * 0.3 +
      Math.sin(this.turbX * 5.7) * 0.15;
    const oy =
      Math.sin(this.turbY) * 0.55 +
      Math.sin(this.turbY * 2.3) * 0.3 +
      Math.sin(this.turbY * 5.7) * 0.15;
    const oz =
      Math.sin(this.turbZ) * 0.55 +
      Math.sin(this.turbZ * 2.3) * 0.3 +
      Math.sin(this.turbZ * 5.7) * 0.15;
    this.danceOffset.set(ox * amp, oy * amp, oz * amp);
  }

  updateNoiseAnimation(time: number) {
    this.material.uniforms.time.value = time;
  }

  getLight() {
    return this.light;
  }

  createSunMaterial() {
    return new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        emissiveIntensity: { value: sun.noiseIntensity },
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;

        ${noise}

        void main() {
            vUv = uv;
            vPosition = position;

            float roil = noise(position * 2.2 + vec3(time * 0.3)) * 0.02;
            vec3 displaced = position + normalize(position) * roil;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
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
            float n = noise(vPosition * scale + vec3(time));
            float flareHot = smoothstep(0.3, 0.8, noise(vPosition * 1.3 + vec3(time * 0.3)));

            vec3 base = mix(
                vec3(1.0, 0.15, 0.0),
                vec3(1.0, 0.55, 0.1),
                n * 0.5 + 0.5
            );
            vec3 color = mix(base, vec3(1.0, 0.95, 0.55), flareHot * 0.75);

            float intensity = (n * 0.5 + 0.5) * emissiveIntensity;
            intensity *= (1.0 + flareHot * 0.5);

            gl_FragColor = vec4(color * intensity, 1.0);
        }
    `,
    });
  }
}

export const noise = `
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float noise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  //  x0 = x0 - 0. + 0.0 * C
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

  // Permutations
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  // Gradients
  // ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0 / 7.0; // N=7
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);    // mod(j,N)

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  //Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  DynamicDrawUsage,
  Points,
  ShaderMaterial,
} from "three";

const MAX_PARTICLES = 500;
const SPAWN_MIN_DELAY = 0.6;
const SPAWN_MAX_DELAY = 1.8;
const PARTICLES_PER_BURST_MIN = 8;
const PARTICLES_PER_BURST_MAX = 14;
const VELOCITY_DAMPING = 0.985;
const DIRECTION_SPREAD = 0.9;
const SURFACE_JITTER = 0.12;

export class SunFlares {
  public readonly points: Points<BufferGeometry, ShaderMaterial>;
  private readonly positions: Float32Array;
  private readonly velocities: Float32Array;
  private readonly ages: Float32Array;
  private readonly lifetimes: Float32Array;
  private readonly startSizes: Float32Array;
  private readonly positionAttr: BufferAttribute;
  private readonly ageAttr: BufferAttribute;
  private readonly lifetimeAttr: BufferAttribute;
  private readonly startSizeAttr: BufferAttribute;
  private spawnTimer = 0;

  constructor(private readonly sunRadius: number) {
    this.positions = new Float32Array(MAX_PARTICLES * 3);
    this.velocities = new Float32Array(MAX_PARTICLES * 3);
    this.ages = new Float32Array(MAX_PARTICLES);
    this.lifetimes = new Float32Array(MAX_PARTICLES);
    this.startSizes = new Float32Array(MAX_PARTICLES);

    for (let i = 0; i < MAX_PARTICLES; i++) {
      this.ages[i] = 1e6;
      this.lifetimes[i] = 1;
    }

    const geometry = new BufferGeometry();
    this.positionAttr = new BufferAttribute(this.positions, 3);
    this.ageAttr = new BufferAttribute(this.ages, 1);
    this.lifetimeAttr = new BufferAttribute(this.lifetimes, 1);
    this.startSizeAttr = new BufferAttribute(this.startSizes, 1);

    this.positionAttr.setUsage(DynamicDrawUsage);
    this.ageAttr.setUsage(DynamicDrawUsage);
    this.lifetimeAttr.setUsage(DynamicDrawUsage);
    this.startSizeAttr.setUsage(DynamicDrawUsage);

    geometry.setAttribute("position", this.positionAttr);
    geometry.setAttribute("age", this.ageAttr);
    geometry.setAttribute("lifetime", this.lifetimeAttr);
    geometry.setAttribute("startSize", this.startSizeAttr);

    const material = new ShaderMaterial({
      uniforms: {
        pixelRatio: { value: window.devicePixelRatio || 1 },
      },
      vertexShader: `
        attribute float age;
        attribute float lifetime;
        attribute float startSize;

        uniform float pixelRatio;

        varying float vAlpha;
        varying vec3 vColor;

        void main() {
          if (age >= lifetime) {
            vAlpha = 0.0;
            gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
            gl_PointSize = 0.0;
            return;
          }

          float t = clamp(age / lifetime, 0.0, 1.0);

          vAlpha = (1.0 - t) * (1.0 - t);

          vec3 c1 = vec3(1.0, 0.95, 0.55);
          vec3 c2 = vec3(1.0, 0.40, 0.10);
          vec3 c3 = vec3(0.45, 0.08, 0.0);
          vColor = t < 0.5
            ? mix(c1, c2, t * 2.0)
            : mix(c2, c3, (t - 0.5) * 2.0);

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = startSize * pixelRatio * (160.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        varying vec3 vColor;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float d = length(coord);
          float soft = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(vColor * 1.1, soft * vAlpha);
        }
      `,
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
    });

    this.points = new Points(geometry, material);
    this.points.frustumCulled = false;
  }

  setPixelRatio(value: number): void {
    this.points.material.uniforms.pixelRatio.value = value;
  }

  update(dt: number): void {
    if (dt <= 0) return;

    for (let i = 0; i < MAX_PARTICLES; i++) {
      if (this.ages[i] >= this.lifetimes[i]) continue;

      this.ages[i] += dt;

      const ix = i * 3;
      this.positions[ix] += this.velocities[ix] * dt;
      this.positions[ix + 1] += this.velocities[ix + 1] * dt;
      this.positions[ix + 2] += this.velocities[ix + 2] * dt;

      this.velocities[ix] *= VELOCITY_DAMPING;
      this.velocities[ix + 1] *= VELOCITY_DAMPING;
      this.velocities[ix + 2] *= VELOCITY_DAMPING;
    }

    this.spawnTimer -= dt;
    while (this.spawnTimer <= 0) {
      this.spawnBurst();
      this.spawnTimer +=
        SPAWN_MIN_DELAY +
        Math.random() * (SPAWN_MAX_DELAY - SPAWN_MIN_DELAY);
    }

    this.positionAttr.needsUpdate = true;
    this.ageAttr.needsUpdate = true;
    this.lifetimeAttr.needsUpdate = true;
    this.startSizeAttr.needsUpdate = true;
  }

  private spawnBurst(): void {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const dx = Math.sin(phi) * Math.cos(theta);
    const dy = Math.sin(phi) * Math.sin(theta);
    const dz = Math.cos(phi);

    const count =
      PARTICLES_PER_BURST_MIN +
      Math.floor(
        Math.random() * (PARTICLES_PER_BURST_MAX - PARTICLES_PER_BURST_MIN),
      );
    const burstSpeedBase = 0.3 + Math.random() * 0.5;
    const burstLifetime = 0.9 + Math.random();

    for (let k = 0; k < count; k++) {
      const slot = this.findDeadSlot();
      if (slot === -1) return;

      const ix = slot * 3;

      const jx = (Math.random() - 0.5) * SURFACE_JITTER;
      const jy = (Math.random() - 0.5) * SURFACE_JITTER;
      const jz = (Math.random() - 0.5) * SURFACE_JITTER;
      this.positions[ix] = dx * this.sunRadius + jx;
      this.positions[ix + 1] = dy * this.sunRadius + jy;
      this.positions[ix + 2] = dz * this.sunRadius + jz;

      const speed = burstSpeedBase * (0.3 + Math.random() * 1.5);
      this.velocities[ix] =
        (dx + (Math.random() - 0.5) * DIRECTION_SPREAD) * speed;
      this.velocities[ix + 1] =
        (dy + (Math.random() - 0.5) * DIRECTION_SPREAD) * speed;
      this.velocities[ix + 2] =
        (dz + (Math.random() - 0.5) * DIRECTION_SPREAD) * speed;

      this.ages[slot] = 0;
      this.lifetimes[slot] = burstLifetime * (0.6 + Math.random() * 0.8);
      this.startSizes[slot] = 1.0 + Math.random() * 1.5;
    }
  }

  private findDeadSlot(): number {
    for (let i = 0; i < MAX_PARTICLES; i++) {
      if (this.ages[i] >= this.lifetimes[i]) return i;
    }
    return -1;
  }
}

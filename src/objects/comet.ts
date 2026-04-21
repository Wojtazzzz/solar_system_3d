import {
  BufferAttribute,
  BufferGeometry,
  IcosahedronGeometry,
  Line,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from "three";

export type CometParams = {
  id: string;
  semiMajorAxis: number;
  eccentricity: number;
  inclination: number;
  ascendingNode: number;
  period: number;
  nucleusRadius: number;
  color: number;
  tailColor: number;
};

const ORBIT_SEGMENTS = 256;
const TAIL_POINTS = 40;
const TAIL_BASE_LENGTH = 5;

export class Comet {
  public readonly name: string;
  public readonly radius: number;
  public readonly mesh: Mesh<IcosahedronGeometry, MeshBasicMaterial>;
  public readonly tail: Line<BufferGeometry, LineBasicMaterial>;
  public readonly orbitLine: LineLoop<BufferGeometry, LineBasicMaterial>;

  private readonly a: number;
  private readonly e: number;
  private readonly incRad: number;
  private readonly omRad: number;
  private readonly angularSpeed: number;
  private readonly tailColor: number;
  private readonly tailPositions: Float32Array;
  private readonly tailColors: Float32Array;
  private mean: number;

  private readonly tmpPos = new Vector3();
  private readonly tailDir = new Vector3();

  constructor(params: CometParams) {
    this.name = params.id;
    this.radius = params.nucleusRadius;
    this.a = params.semiMajorAxis;
    this.e = params.eccentricity;
    this.incRad = (params.inclination * Math.PI) / 180;
    this.omRad = (params.ascendingNode * Math.PI) / 180;
    this.angularSpeed = (2 * Math.PI) / params.period;
    this.tailColor = params.tailColor;
    this.mean = Math.random() * Math.PI * 2;

    this.mesh = new Mesh(
      new IcosahedronGeometry(params.nucleusRadius, 1),
      new MeshBasicMaterial({ color: params.color }),
    );

    this.tailPositions = new Float32Array(TAIL_POINTS * 3);
    this.tailColors = new Float32Array(TAIL_POINTS * 3);
    const tailGeom = new BufferGeometry();
    tailGeom.setAttribute(
      "position",
      new BufferAttribute(this.tailPositions, 3),
    );
    tailGeom.setAttribute(
      "color",
      new BufferAttribute(this.tailColors, 3),
    );
    this.tail = new Line(
      tailGeom,
      new LineBasicMaterial({ vertexColors: true, transparent: true }),
    );
    this.tail.frustumCulled = false;

    const orbitPts = new Float32Array(ORBIT_SEGMENTS * 3);
    for (let k = 0; k < ORBIT_SEGMENTS; k++) {
      const E = (k / ORBIT_SEGMENTS) * Math.PI * 2;
      this.orbitCoordsFromE(E, this.tmpPos);
      orbitPts[k * 3] = this.tmpPos.x;
      orbitPts[k * 3 + 1] = this.tmpPos.y;
      orbitPts[k * 3 + 2] = this.tmpPos.z;
    }
    const orbitGeom = new BufferGeometry();
    orbitGeom.setAttribute("position", new BufferAttribute(orbitPts, 3));
    this.orbitLine = new LineLoop(
      orbitGeom,
      new LineBasicMaterial({
        color: 0x556688,
        transparent: true,
        opacity: 0.25,
      }),
    );
    this.orbitLine.visible = false;
  }

  private orbitCoordsFromE(E: number, out: Vector3): Vector3 {
    const cosE = Math.cos(E);
    const sinE = Math.sin(E);
    const b = this.a * Math.sqrt(Math.max(0, 1 - this.e * this.e));
    let x = this.a * (cosE - this.e);
    let y = 0;
    let z = b * sinE;

    const cosI = Math.cos(this.incRad);
    const sinI = Math.sin(this.incRad);
    const y1 = y * cosI - z * sinI;
    const z1 = y * sinI + z * cosI;
    y = y1;
    z = z1;

    const cosOm = Math.cos(this.omRad);
    const sinOm = Math.sin(this.omRad);
    const x2 = x * cosOm + z * sinOm;
    const z2 = -x * sinOm + z * cosOm;

    out.set(x2, y, z2);
    return out;
  }

  private solveKepler(M: number, e: number): number {
    const twoPi = Math.PI * 2;
    let Mn = ((M % twoPi) + twoPi) % twoPi;
    if (Mn > Math.PI) Mn -= twoPi;

    let E = Mn + e * Math.sin(Mn);

    for (let i = 0; i < 30; i++) {
      const f = E - e * Math.sin(E) - Mn;
      const fp = 1 - e * Math.cos(E);
      let dE = f / fp;
      if (dE > 0.5) dE = 0.5;
      else if (dE < -0.5) dE = -0.5;
      E -= dE;
      if (Math.abs(dE) < 1e-9) break;
    }
    return E;
  }

  updatePosition(dt: number, sunPos: Vector3, timeSpeed: number): void {
    this.mean += this.angularSpeed * dt * timeSpeed;
    if (this.mean > Math.PI * 2) this.mean -= Math.PI * 2;
    if (this.mean < 0) this.mean += Math.PI * 2;

    const E = this.solveKepler(this.mean, this.e);
    this.orbitCoordsFromE(E, this.mesh.position);

    this.tailDir.copy(this.mesh.position).sub(sunPos);
    const dist = this.tailDir.length();
    if (dist > 0.001) this.tailDir.divideScalar(dist);
    const tailLen = Math.max(
      0.3,
      Math.min(10, (TAIL_BASE_LENGTH * 1.8) / (dist * 0.2 + 0.5)),
    );

    const r = ((this.tailColor >> 16) & 0xff) / 255;
    const g = ((this.tailColor >> 8) & 0xff) / 255;
    const bl = (this.tailColor & 0xff) / 255;

    const pos = this.mesh.position;
    for (let i = 0; i < TAIL_POINTS; i++) {
      const t = i / (TAIL_POINTS - 1);
      this.tailPositions[i * 3] = pos.x + this.tailDir.x * tailLen * t;
      this.tailPositions[i * 3 + 1] = pos.y + this.tailDir.y * tailLen * t;
      this.tailPositions[i * 3 + 2] = pos.z + this.tailDir.z * tailLen * t;
      const fade = (1 - t) * (1 - t);
      this.tailColors[i * 3] = r * fade;
      this.tailColors[i * 3 + 1] = g * fade;
      this.tailColors[i * 3 + 2] = bl * fade;
    }
    this.tail.geometry.attributes.position.needsUpdate = true;
    this.tail.geometry.attributes.color.needsUpdate = true;
  }

  startDrag(): void {}
  setDragPosition(_pos: Vector3): void {
    void _pos;
  }
  endDrag(_velocity: Vector3): void {
    void _velocity;
  }
}

export const COMET_CONFIGS: readonly CometParams[] = [
  {
    id: "halley",
    semiMajorAxis: 30,
    eccentricity: 0.967,
    inclination: 162,
    ascendingNode: 58,
    period: 120,
    nucleusRadius: 0.06,
    color: 0xd8d0c0,
    tailColor: 0xc8e0ff,
  },
  {
    id: "haleBopp",
    semiMajorAxis: 55,
    eccentricity: 0.995,
    inclination: 89,
    ascendingNode: 282,
    period: 360,
    nucleusRadius: 0.09,
    color: 0xd8ced2,
    tailColor: 0xbbd8ff,
  },
  {
    id: "neowise",
    semiMajorAxis: 35,
    eccentricity: 0.97,
    inclination: 128,
    ascendingNode: 61,
    period: 260,
    nucleusRadius: 0.04,
    color: 0xd0d0c0,
    tailColor: 0xffecc0,
  },
  {
    id: "encke",
    semiMajorAxis: 8,
    eccentricity: 0.848,
    inclination: 11.8,
    ascendingNode: 334,
    period: 15,
    nucleusRadius: 0.035,
    color: 0xccc0b0,
    tailColor: 0xd0d8ff,
  },
  {
    id: "shoemakerLevy9",
    semiMajorAxis: 28,
    eccentricity: 0.2,
    inclination: 6,
    ascendingNode: 220,
    period: 35,
    nucleusRadius: 0.025,
    color: 0xccccc0,
    tailColor: 0xccddff,
  },
  {
    id: "swiftTuttle",
    semiMajorAxis: 45,
    eccentricity: 0.96,
    inclination: 113,
    ascendingNode: 139,
    period: 180,
    nucleusRadius: 0.06,
    color: 0xd8d0c0,
    tailColor: 0xbbeeff,
  },
  {
    id: "tempelTuttle",
    semiMajorAxis: 20,
    eccentricity: 0.906,
    inclination: 162.5,
    ascendingNode: 235,
    period: 60,
    nucleusRadius: 0.045,
    color: 0xd0d0d0,
    tailColor: 0xffeec0,
  },
  {
    id: "lovejoy",
    semiMajorAxis: 60,
    eccentricity: 0.99,
    inclination: 80,
    ascendingNode: 95,
    period: 450,
    nucleusRadius: 0.04,
    color: 0xd0e0d0,
    tailColor: 0x88ffaa,
  },
  {
    id: "ison",
    semiMajorAxis: 60,
    eccentricity: 0.995,
    inclination: 62,
    ascendingNode: 295,
    period: 300,
    nucleusRadius: 0.025,
    color: 0xd0c8c0,
    tailColor: 0xffd8a0,
  },
];

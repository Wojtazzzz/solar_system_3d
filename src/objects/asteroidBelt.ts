import {
  DodecahedronGeometry,
  Euler,
  InstancedMesh,
  Matrix4,
  MeshBasicMaterial,
  Quaternion,
  Vector3,
} from "three";

const ASTEROID_COUNT = 700;
const INNER_RADIUS = 20;
const OUTER_RADIUS = 27;
const BELT_THICKNESS = 0.6;
const MIN_SCALE = 0.03;
const MAX_SCALE = 0.11;

export const createAsteroidBelt = (): InstancedMesh => {
  const geometry = new DodecahedronGeometry(1, 0);
  const material = new MeshBasicMaterial({ color: 0x6b5a43 });
  const mesh = new InstancedMesh(geometry, material, ASTEROID_COUNT);
  mesh.frustumCulled = false;

  const matrix = new Matrix4();
  const position = new Vector3();
  const quaternion = new Quaternion();
  const scale = new Vector3();
  const euler = new Euler();

  for (let i = 0; i < ASTEROID_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = INNER_RADIUS + Math.random() * (OUTER_RADIUS - INNER_RADIUS);
    const y = (Math.random() - 0.5) * BELT_THICKNESS;
    const s = MIN_SCALE + Math.random() * (MAX_SCALE - MIN_SCALE);

    position.set(r * Math.cos(angle), y, r * Math.sin(angle));
    euler.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
    );
    quaternion.setFromEuler(euler);
    scale.set(s, s, s);

    matrix.compose(position, quaternion, scale);
    mesh.setMatrixAt(i, matrix);
  }

  return mesh;
};

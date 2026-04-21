import {
  BackSide,
  CanvasTexture,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  SRGBColorSpace,
} from "three";

const TEXTURE_WIDTH = 2048;
const TEXTURE_HEIGHT = 1024;
const SKYBOX_RADIUS = 800;
const BAND_STARS = 3000;
const FIELD_STARS = 2200;

const createStarfieldTexture = (): CanvasTexture => {
  const canvas = document.createElement("canvas");
  canvas.width = TEXTURE_WIDTH;
  canvas.height = TEXTURE_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);

  const bandY = TEXTURE_HEIGHT * 0.52;
  const bandHeight = TEXTURE_HEIGHT * 0.35;

  const gradient = ctx.createLinearGradient(
    0,
    bandY - bandHeight / 2,
    0,
    bandY + bandHeight / 2,
  );
  gradient.addColorStop(0, "rgba(80, 70, 130, 0)");
  gradient.addColorStop(0.5, "rgba(150, 130, 190, 0.22)");
  gradient.addColorStop(1, "rgba(80, 70, 130, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, bandY - bandHeight / 2, TEXTURE_WIDTH, bandHeight);

  for (let i = 0; i < BAND_STARS; i++) {
    const x = Math.random() * TEXTURE_WIDTH;
    const centerBias = (Math.random() + Math.random() + Math.random()) / 3 - 0.5;
    const y = bandY + centerBias * bandHeight;
    const b = Math.random();
    const size = b * b * 1.4 + 0.3;
    const tint = 200 + Math.random() * 55;
    ctx.fillStyle = `rgba(${tint}, ${tint}, 255, ${b})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < FIELD_STARS; i++) {
    const x = Math.random() * TEXTURE_WIDTH;
    const y = Math.random() * TEXTURE_HEIGHT;
    const b = Math.random() * 0.75;
    const size = b * 0.9 + 0.3;
    ctx.fillStyle = `rgba(255, 255, 255, ${b})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
};

export const createStarfield = (): Mesh<
  SphereGeometry,
  MeshBasicMaterial
> => {
  const geometry = new SphereGeometry(SKYBOX_RADIUS, 64, 32);
  const material = new MeshBasicMaterial({
    map: createStarfieldTexture(),
    side: BackSide,
    depthWrite: false,
  });
  const mesh = new Mesh(geometry, material);
  mesh.renderOrder = -1;
  return mesh;
};

import * as THREE from "three";

export const getScene = () => {
  if (!window.scene) {
    window.scene = new THREE.Scene();
  }

  return window.scene;
};

export const getCamera = () => {
  if (!window.camera) {
    window.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    );
  }

  return window.camera;
}

export const renderPlanet = (texture: string, width: number) => {
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(width, 32, 32),
    new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load(`/images/${texture}.jpg`),
    }),
  );

  getScene().add(planet);

  return planet;
};

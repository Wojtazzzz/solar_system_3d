import * as THREE from 'three';
import {getScene} from "./utils.ts";
import {Sun} from "./planets/sun.ts";
import {Planet} from "./planets/planet.ts";
import {PLANET_SCALE} from "./consts.ts";

const scene = getScene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const pointLight = new THREE.PointLight(0xffcf37, 200);
pointLight.position.set(0, 20, 20);
scene.add(pointLight);

const sun = new Sun();
const mercury = new Planet('mercury', 0.007 * PLANET_SCALE, 5, 0.04);
const venus = new Planet('venus', 0.0174 * PLANET_SCALE, 7, 0.015);
const earth = new Planet('earth', 0.0183 * PLANET_SCALE, 10, 0.01);
const mars = new Planet('mars', 0.0097 * PLANET_SCALE, 15, 0.008);
const jupiter = new Planet('jupiter', 0.201 * PLANET_SCALE / 4, 25, 0.004);
const saturn = new Planet('saturn', 0.167 * PLANET_SCALE / 4, 35, 0.003);
const uranus = new Planet('uranus', 0.073 * PLANET_SCALE / 4, 45, 0.002);
const neptune = new Planet('neptune', 0.0708 * PLANET_SCALE / 4, 55, 0.0015);

camera.position.z = 45;
camera.position.y = 18;
camera.rotation.x = -0.4;

const explosions: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap>[] = [];

function addStar() {
    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    const x = THREE.MathUtils.randFloatSpread(150);
    const y = THREE.MathUtils.randFloatSpread(150);
    const z = THREE.MathUtils.randFloatSpread(150);

    star.position.set(x, y, z);
    scene.add(star);

    const explosion = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 32, 32),
        material,
    );

    explosion.position.set(x, y, z);
    scene.add(explosion);

    explosions.push(explosion);
}

function starExplosion(explosion: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap>) {
    if (Math.random() > 0.999) {
        const scale = 1 + 2 * Math.sin(Date.now() * 0.01);

        explosion.scale.set(scale, scale, scale);

        setTimeout(() => {
            explosion.scale.set(1, 1, 1);
        }, 16);
    }
}

Array.from({ length: 4000 }).forEach(addStar);

function animate() {
    requestAnimationFrame(animate);

    [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune].forEach((object) => {
        object.mesh.rotation.x += 0.001;
        object.mesh.rotation.y += 0.0005;

        object.updatePosition();
        object.updateTrail();
    });

    sun.mesh.rotation.x -= 0.002;
    sun.mesh.rotation.y -= 0.001;

    explosions.forEach(starExplosion);

    renderer.render(scene, camera);
}

animate();

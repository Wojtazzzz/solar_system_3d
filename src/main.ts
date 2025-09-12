import * as THREE from 'three';
import {getScene} from "./utils.ts";
import {Sun} from "./objects/sun.ts";
import {Planet} from "./objects/planet.ts";
import {PLANET_SCALE} from "./consts.ts";
import {Star} from "./objects/star.ts";

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

const pointLight = new THREE.PointLight(0xFFE8C5, 200, 500);
pointLight.position.set(0, 20, 20);
scene.add(pointLight);

const sun = new Sun();
const mercury = new Planet('mercury', 0.007 * PLANET_SCALE, 5, 0.04, 7);
const venus   = new Planet('venus', 0.0174 * PLANET_SCALE, 7, 0.015, 3);
const earth   = new Planet('earth', 0.0183 * PLANET_SCALE, 10, 0.01, 0);
const mars    = new Planet('mars', 0.0097 * PLANET_SCALE, 15, 0.008, 1.85);
const jupiter = new Planet('jupiter', 0.201 * PLANET_SCALE / 4, 25, 0.004, 1.3);
const saturn  = new Planet('saturn', 0.167 * PLANET_SCALE / 4, 35, 0.003, 2.5);
const uranus  = new Planet('uranus', 0.073 * PLANET_SCALE / 4, 45, 0.002, 0.8);
const neptune = new Planet('neptune', 0.0708 * PLANET_SCALE / 4, 55, 0.0015, 1.8);


camera.position.z = 45;
camera.position.y = 17;
camera.lookAt(0, 0, 0);

const stars: Star[] = [];

Array.from({ length: 4000 }).forEach(() => {
    stars.push(new Star());
});

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

    stars.forEach((star) => star.tryToExplode())

    renderer.render(scene, camera);
}

animate();

function onScroll(event: WheelEvent) {
    if (event.deltaY < 0 && camera.position.z >= 45) {
        return;
    }

    if (event.deltaY > 0 && camera.position.z <= 10) {
        return;
    }

    const scrollSpeed = 0.5;
    const direction = new THREE.Vector3();

    direction.subVectors(new THREE.Vector3(0, 0, 0), camera.position).normalize();

    camera.position.addScaledVector(direction, event.deltaY * scrollSpeed * 0.01);

    camera.lookAt(0, 0, 0);
}

window.addEventListener('wheel', onScroll);
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

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(4, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const sun = new Sun();
const mercury = new Planet('mercury', 0.007 * PLANET_SCALE, 5, 0.04);
const venus = new Planet('venus', 0.0174 * PLANET_SCALE, 7, 0.015);
const earth = new Planet('earth', 0.0183 * PLANET_SCALE, 10, 0.01);
const mars = new Planet('mars', 0.0097 * PLANET_SCALE, 15, 0.008);
const jupiter = new Planet('jupiter', 0.201 * PLANET_SCALE / 4, 25, 0.004);
const saturn = new Planet('saturn', 0.167 * PLANET_SCALE / 4, 35, 0.003);
const uranus = new Planet('uranus', 0.073 * PLANET_SCALE / 4, 45, 0.002);
const neptune = new Planet('neptune', 0.0708 * PLANET_SCALE / 4, 55, 0.0015);

camera.position.z = 5;
camera.position.y = 30;
camera.rotation.x = -1.4;

mercury.mesh.position.x = 3;
venus.mesh.position.x = 6;
earth.mesh.position.x = 9;
mars.mesh.position.x = 12;
jupiter.mesh.position.x = 15;
saturn.mesh.position.x = 18;
uranus.mesh.position.x = 21;
neptune.mesh.position.x = 24;

function animate() {
    requestAnimationFrame(animate);

    [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune].forEach((object) => {
        object.mesh.rotation.x += 0.001;
        object.mesh.rotation.y += 0.0005;

        object.updatePosition();
    });

    renderer.render(scene, camera);
}

animate();

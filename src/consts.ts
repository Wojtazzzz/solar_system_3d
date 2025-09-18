export const USE_REAL_PLANET_INCLINATION = false;
export const ZOOM_SPEED = 1;

export const camera = {
    fov: 75,
    far: 1000,
    initialY: 12,
    initialRadius: 32,
    maxRadius: 80,
    minRadius: 5,
    rotationSpeed: 1,
};

export const sun = {
    radius: 2,
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    noiseIntensity: 8,
    lightColor: 0xffcf37,
    lightIntensity: 500,
    lightDistance: 5000,
};

export const stars = {
    count: 3000,
    radius: 0.06,
    color: 0xffffff,
    minRenderDistanceFromSun: 15,
    maxRenderDistanceFromSun: 60,
    chanceToExplode: 0.02,
    maxDistanceFromCameraToPreventExplode: 60,
    explosionRadiusScale: 2.1,
    explosionLengthInFrames: 3,
};

export const planet = {
    radiusScale: 20,
    orbitalRadiusScale: 1.2,
    rotationSpeedX: 1,
    rotationSpeedY: 0.5,
    trailLength: 27,
    trailColor: 0x4f4f4f,
};

export const mercury = {
    name: "mercury",
    radius: 0.007,
    orbitalRadius: 5,
    orbitalSpeed: 0.04,
    inclination: 7,
};

export const venus = {
    name: "venus",
    radius: 0.0174,
    orbitalRadius: 7,
    orbitalSpeed: 0.015,
    inclination: 3,
};

export const earth = {
    name: "earth",
    radius: 0.0183,
    orbitalRadius: 10,
    orbitalSpeed: 0.01,
    inclination: 0,
};

export const mars = {
    name: "mars",
    radius: 0.0097,
    orbitalRadius: 15,
    orbitalSpeed: 0.008,
    inclination: 1.85,
};

export const jupiter = {
    name: "jupiter",
    radius: 0.201,
    orbitalRadius: 25,
    orbitalSpeed: 0.004,
    inclination: 1.3,
};

export const saturn = {
    name: "saturn",
    radius: 0.167,
    orbitalRadius: 35,
    orbitalSpeed: 0.003,
    inclination: 2.5,
};

export const uranus = {
    name: "uranus",
    radius: 0.073,
    orbitalRadius: 45,
    orbitalSpeed: 0.002,
    inclination: 0.8,
};

export const neptune = {
    name: "neptune",
    radius: 0.0708,
    orbitalRadius: 55,
    orbitalSpeed: 0.0015,
    inclination: 1.8,
};

export const USE_REAL_PLANET_INCLINATION = false;
export const ZOOM_SPEED = 1;

export const camera = {
    fov: 75,
    far: 2000,
    initialY: 12,
    initialRadius: 32,
    maxRadius: 80,
    maxRadiusRealistic: 600,
    minRadius: 5,
    rotationSpeed: 1,
};

export const sunRealismScale = 4;

export const sun = {
    radius: 2,
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    noiseIntensity: 9,
    lightColor: 0xffffff,
    lightIntensity: 100,
    lightDistance: 500,
};

export const stars = {
    count: 2000,
    radius: 0.04,
    color: 0xffffff,
    minRenderDistanceFromSun: 15,
    maxRenderDistanceFromSun: 100,
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

const EARTH_ORBIT_ANCHOR = 10;
const au = (ratioToEarth: number): number => EARTH_ORBIT_ANCHOR * ratioToEarth;

export const mercury = {
    name: "mercury",
    radius: 0.007,
    orbitalRadius: 5,
    realisticOrbitalRadius: au(0.387),
    orbitalSpeed: 0.04,
    inclination: 7,
};

export const venus = {
    name: "venus",
    radius: 0.0174,
    orbitalRadius: 7,
    realisticOrbitalRadius: au(0.723),
    orbitalSpeed: 0.015,
    inclination: 3,
};

export const earth = {
    name: "earth",
    radius: 0.0183,
    orbitalRadius: EARTH_ORBIT_ANCHOR,
    realisticOrbitalRadius: au(1.0),
    orbitalSpeed: 0.01,
    inclination: 0,
};

export const mars = {
    name: "mars",
    radius: 0.0097,
    orbitalRadius: 15,
    realisticOrbitalRadius: au(1.524),
    orbitalSpeed: 0.008,
    inclination: 1.85,
};

export const jupiter = {
    name: "jupiter",
    radius: 0.201,
    orbitalRadius: 25,
    realisticOrbitalRadius: au(5.203),
    orbitalSpeed: 0.004,
    inclination: 1.3,
};

export const saturn = {
    name: "saturn",
    radius: 0.167,
    orbitalRadius: 35,
    realisticOrbitalRadius: au(9.537),
    orbitalSpeed: 0.003,
    inclination: 2.5,
};

export const uranus = {
    name: "uranus",
    radius: 0.073,
    orbitalRadius: 45,
    realisticOrbitalRadius: au(19.191),
    orbitalSpeed: 0.002,
    inclination: 0.8,
};

export const neptune = {
    name: "neptune",
    radius: 0.0708,
    orbitalRadius: 55,
    realisticOrbitalRadius: au(30.069),
    orbitalSpeed: 0.0015,
    inclination: 1.8,
};

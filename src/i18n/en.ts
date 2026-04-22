import type { Dictionary } from "./types";

export const en: Dictionary = {
  ui: {
    title: "Solar System 3D",
    description:
      "Interactive 3D orrery. Drag planets to throw them, take a guided tour, try the quiz, or explore real planetary facts. Built with Three.js.",
    metaTitle: "Solar System 3D — interactive planetary exploration",
    metaDescription:
      "Interactive 3D solar system orrery. Drag planets to throw them, take a guided tour, play a quiz, and explore planetary facts. Built with Three.js. Installable as a PWA.",
    loading: "Loading solar system",

    settings: "Settings",
    planetsShadow: "planets shadow",
    showOrbits: "show orbits",
    showComets: "show comets",
    showPlanetLabels: "show planet labels",
    showCometLabels: "show comet labels",
    showTrails: "show trails",
    realInclinations: "real inclinations",
    danceMode: "dance mode",
    debugPanel: "debug panel",
    timeSpeed: "time speed",
    starsCount: "stars count",
    realisticScale: "realistic scale",
    quality: "quality",
    qualityLow: "Low",
    qualityMedium: "Medium",
    qualityHigh: "High",
    language: "language",
    resetToDefaults: "Reset to defaults",
    objects: "Objects",
    minimap: "Minimap",
    takeScreenshot: "Take screenshot",
    viewOnGithub: "View on GitHub ↗",

    scrollToZoom: "Scroll to zoom",
    slideToZoom: "Slide to zoom",
    clickPlanetForInfo: "Click planet for info",
    tapPlanetForInfo: "Tap planet for info",

    startQuiz: "Start quiz",
    stopQuiz: "Stop quiz",
    startTour: "Start tour",
    stopTour: "Stop tour",
    prev: "← Prev",
    next: "Next →",
    endTour: "End tour",
    close: "Close",
    minimize: "Minimize",
    expand: "Expand",

    compareTo: "Compare to",
    none: "None",
    star: "Star",
    planets: "Planets",
    comets: "Comets",
    realisticSizes: "Realistic sizes",
    vs: "vs",

    diameter: "Diameter",
    mass: "Mass",
    orbitalPeriod: "Orbital period",
    dayLength: "Day length",
    moons: "Moons",
    temperature: "Temperature",
    distanceFromSun: "Distance from Sun",

    quizMiss: "Miss — try again",

    toggleMenu: "Toggle menu",
    toggleSound: "Toggle sound",
    zoomAria: "Zoom in or out from the Sun",
    compareAria: "Compare to another body",
    minimapAria: "Solar system top-down minimap",
  },
  bodies: {
    sun: {
      displayName: "Sun",
      funFact:
        "Contains 99.86% of the Solar System's mass. Every second it converts 600 million tons of hydrogen into helium.",
    },
    mercury: {
      displayName: "Mercury",
      funFact:
        "A day on Mercury is longer than its year. It also has the greatest temperature swings in the Solar System.",
    },
    venus: {
      displayName: "Venus",
      funFact:
        "The hottest planet in the Solar System — even though it isn't the closest to the Sun. It also rotates in the opposite direction to most planets.",
    },
    earth: {
      displayName: "Earth",
      funFact:
        "The only known planet with life. Water covers 71% of the surface, and the inner core is roughly as hot as the Sun's surface.",
    },
    mars: {
      displayName: "Mars",
      funFact:
        "Home to Olympus Mons — the tallest volcano in the Solar System, nearly 3× the height of Mount Everest.",
    },
    jupiter: {
      displayName: "Jupiter",
      funFact:
        "The largest planet — all the others combined would fit inside it. The Great Red Spot is a storm that has raged for at least 350 years.",
    },
    saturn: {
      displayName: "Saturn",
      funFact:
        "Its density is so low it would float on water (given an ocean big enough). The rings are mostly ice and dust.",
    },
    uranus: {
      displayName: "Uranus",
      funFact:
        "Rotates 'on its side' — its rotation axis is almost parallel to its orbital plane. Each pole has 42 years of day followed by 42 years of night.",
    },
    neptune: {
      displayName: "Neptune",
      funFact:
        "Winds reach 2,100 km/h — the fastest in the Solar System. Discovered mathematically, from Uranus's orbital perturbations, before anyone had seen it.",
    },
    halley: {
      displayName: "1P/Halley",
      funFact:
        "The most famous short-period comet, visible to the naked eye from Earth every 76 years. Last seen in 1986, next predicted return in 2061.",
    },
    haleBopp: {
      displayName: "C/1995 O1 (Hale-Bopp)",
      funFact:
        "One of the brightest comets ever observed, visible to the naked eye for a record 18 months (1996–97). Unusually large nucleus for a long-period comet.",
    },
    neowise: {
      displayName: "C/2020 F3 (NEOWISE)",
      funFact:
        "Discovered in March 2020 by the NEOWISE space telescope. The first brightly visible comet from the Northern Hemisphere since Hale-Bopp, with a striking split tail.",
    },
    encke: {
      displayName: "2P/Encke",
      funFact:
        "The comet with the shortest known orbital period — it completes a full loop faster than any other named comet. Origin of the Taurid meteor shower.",
    },
    shoemakerLevy9: {
      displayName: "D/1993 F2 (Shoemaker–Levy 9)",
      funFact:
        "Broken into 21 pieces by Jupiter's tidal forces, which then crashed into Jupiter in July 1994 — the first direct observation of a Solar System collision.",
    },
    swiftTuttle: {
      displayName: "109P/Swift–Tuttle",
      funFact:
        "Parent body of the annual Perseid meteor shower in August. One of the largest known short-period comet nuclei — if it ever hit Earth it would be catastrophic.",
    },
    tempelTuttle: {
      displayName: "55P/Tempel–Tuttle",
      funFact:
        "Produces the Leonid meteor shower, which sometimes erupts into dramatic storms with thousands of meteors per hour when the comet is near perihelion.",
    },
    lovejoy: {
      displayName: "C/2014 Q2 (Lovejoy)",
      funFact:
        "Famous for its bright green coma caused by diatomic carbon molecules fluorescing under sunlight. Found to be releasing ethyl alcohol — a 'boozy' comet.",
    },
    ison: {
      displayName: "C/2012 S1 (ISON)",
      funFact:
        "Hyped as the 'comet of the century' before disintegrating during its extremely close Sun passage on 28 November 2013.",
    },
  },
  quiz: [
    { prompt: "Click the biggest planet", answer: "jupiter" },
    { prompt: "Click the smallest planet", answer: "mercury" },
    { prompt: "Click the planet with life", answer: "earth" },
    { prompt: "Click the planet with rings", answer: "saturn" },
    { prompt: "Click the planet closest to the Sun", answer: "mercury" },
    { prompt: "Click the farthest planet", answer: "neptune" },
    { prompt: "Click the hottest planet", answer: "venus" },
    { prompt: "Click the Red Planet", answer: "mars" },
    { prompt: "Click the planet that rotates on its side", answer: "uranus" },
    { prompt: "Click the planet with the fastest winds", answer: "neptune" },
    { prompt: "Click the star of the Solar System", answer: "sun" },
    { prompt: "Click the second planet from the Sun", answer: "venus" },
    { prompt: "Click the third planet from the Sun", answer: "earth" },
    { prompt: "Click the fourth planet from the Sun", answer: "mars" },
    { prompt: "Click the planet with the Great Red Spot", answer: "jupiter" },
    { prompt: "Click the planet with Olympus Mons", answer: "mars" },
    { prompt: "Click the planet where a day lasts longer than a year", answer: "venus" },
    { prompt: "Click the planet with a 42-year day and 42-year night", answer: "uranus" },
    { prompt: "Click the planet with the most moons", answer: "saturn" },
    { prompt: "Click the planet that would float on water", answer: "saturn" },
    { prompt: "Click the planet discovered mathematically", answer: "neptune" },
    { prompt: "Click the planet 71% covered by water", answer: "earth" },
    { prompt: "Click the planet with two moons", answer: "mars" },
    { prompt: "Click the planet with the highest surface temperature", answer: "venus" },
    { prompt: "Click the object containing 99.86% of the Solar System's mass", answer: "sun" },
    { prompt: "Click the ice giant discovered in 1846", answer: "neptune" },
    { prompt: "Click the gas giant with icy rings", answer: "saturn" },
    { prompt: "Click the planet whose year lasts only 88 days", answer: "mercury" },
    { prompt: "Click Mercury", answer: "mercury" },
    { prompt: "Click Venus", answer: "venus" },
    { prompt: "Click Earth", answer: "earth" },
    { prompt: "Click Mars", answer: "mars" },
    { prompt: "Click Jupiter", answer: "jupiter" },
    { prompt: "Click Saturn", answer: "saturn" },
    { prompt: "Click Uranus", answer: "uranus" },
    { prompt: "Click Neptune", answer: "neptune" },
    { prompt: "Click the Sun", answer: "sun" },
  ],
};

import { getDictionary, onLocaleChange } from "./i18n";

export type BodyFact = {
  id: string;
  displayName: string;
  type: "star" | "planet" | "comet";
  diameter: string;
  mass: string;
  orbitalPeriod: string;
  dayLength: string;
  moons: string;
  temperature: string;
  distanceFromSun: string;
  funFact: string;
};

export type QuizQuestion = {
  prompt: string;
  answer: string;
};

type BodyBase = Omit<BodyFact, "displayName" | "funFact">;

const BODY_BASE: Record<string, BodyBase> = {
  sun: {
    id: "sun",
    type: "star",
    diameter: "1,392,700 km",
    mass: "1.989 × 10³⁰ kg",
    orbitalPeriod: "—",
    dayLength: "~25 days (equator)",
    moons: "—",
    temperature: "~5,500 °C (surface)",
    distanceFromSun: "—",
  },
  mercury: {
    id: "mercury",
    type: "planet",
    diameter: "4,879 km",
    mass: "3.3 × 10²³ kg",
    orbitalPeriod: "88 days",
    dayLength: "58.6 days",
    moons: "0",
    temperature: "-173 °C to 427 °C",
    distanceFromSun: "57.9 million km",
  },
  venus: {
    id: "venus",
    type: "planet",
    diameter: "12,104 km",
    mass: "4.87 × 10²⁴ kg",
    orbitalPeriod: "225 days",
    dayLength: "243 days",
    moons: "0",
    temperature: "~465 °C",
    distanceFromSun: "108.2 million km",
  },
  earth: {
    id: "earth",
    type: "planet",
    diameter: "12,742 km",
    mass: "5.97 × 10²⁴ kg",
    orbitalPeriod: "365.25 days",
    dayLength: "24 hours",
    moons: "1",
    temperature: "-88 °C to 58 °C",
    distanceFromSun: "149.6 million km",
  },
  mars: {
    id: "mars",
    type: "planet",
    diameter: "6,779 km",
    mass: "6.42 × 10²³ kg",
    orbitalPeriod: "687 days",
    dayLength: "24.6 hours",
    moons: "2",
    temperature: "-143 °C to 35 °C",
    distanceFromSun: "227.9 million km",
  },
  jupiter: {
    id: "jupiter",
    type: "planet",
    diameter: "139,820 km",
    mass: "1.9 × 10²⁷ kg",
    orbitalPeriod: "11.86 years",
    dayLength: "9.93 hours",
    moons: "95",
    temperature: "~-145 °C",
    distanceFromSun: "778.5 million km",
  },
  saturn: {
    id: "saturn",
    type: "planet",
    diameter: "116,460 km",
    mass: "5.68 × 10²⁶ kg",
    orbitalPeriod: "29.46 years",
    dayLength: "10.7 hours",
    moons: "146",
    temperature: "~-178 °C",
    distanceFromSun: "1.43 billion km",
  },
  uranus: {
    id: "uranus",
    type: "planet",
    diameter: "50,724 km",
    mass: "8.68 × 10²⁵ kg",
    orbitalPeriod: "84 years",
    dayLength: "17.2 hours",
    moons: "27",
    temperature: "~-224 °C",
    distanceFromSun: "2.87 billion km",
  },
  neptune: {
    id: "neptune",
    type: "planet",
    diameter: "49,244 km",
    mass: "1.02 × 10²⁶ kg",
    orbitalPeriod: "164.8 years",
    dayLength: "16.1 hours",
    moons: "14",
    temperature: "~-214 °C",
    distanceFromSun: "4.5 billion km",
  },
  halley: {
    id: "halley",
    type: "comet",
    diameter: "~11 km (nucleus)",
    mass: "2.2 × 10¹⁴ kg",
    orbitalPeriod: "~76 years",
    dayLength: "2.2 days (rotation)",
    moons: "—",
    temperature: "varies",
    distanceFromSun: "0.59 – 35.1 AU (perihelion – aphelion)",
  },
  haleBopp: {
    id: "haleBopp",
    type: "comet",
    diameter: "~60 km (nucleus)",
    mass: "~1.3 × 10¹⁶ kg",
    orbitalPeriod: "~2,533 years",
    dayLength: "11.4 hours (rotation)",
    moons: "—",
    temperature: "varies",
    distanceFromSun: "0.91 – 370.8 AU",
  },
  neowise: {
    id: "neowise",
    type: "comet",
    diameter: "~5 km (nucleus)",
    mass: "—",
    orbitalPeriod: "~6,800 years",
    dayLength: "7.6 hours (rotation)",
    moons: "—",
    temperature: "varies",
    distanceFromSun: "0.29 – 715 AU",
  },
  encke: {
    id: "encke",
    type: "comet",
    diameter: "~4.8 km (nucleus)",
    mass: "—",
    orbitalPeriod: "3.3 years",
    dayLength: "11 hours (rotation)",
    moons: "—",
    temperature: "varies",
    distanceFromSun: "0.34 – 4.11 AU",
  },
  shoemakerLevy9: {
    id: "shoemakerLevy9",
    type: "comet",
    diameter: "~2 km (fragmented)",
    mass: "—",
    orbitalPeriod: "captured by Jupiter (~2 years)",
    dayLength: "—",
    moons: "—",
    temperature: "—",
    distanceFromSun: "orbited Jupiter",
  },
  swiftTuttle: {
    id: "swiftTuttle",
    type: "comet",
    diameter: "~26 km (nucleus)",
    mass: "—",
    orbitalPeriod: "133 years",
    dayLength: "—",
    moons: "—",
    temperature: "varies",
    distanceFromSun: "0.96 – 51 AU",
  },
  tempelTuttle: {
    id: "tempelTuttle",
    type: "comet",
    diameter: "~3.6 km (nucleus)",
    mass: "—",
    orbitalPeriod: "33 years",
    dayLength: "—",
    moons: "—",
    temperature: "varies",
    distanceFromSun: "0.98 – 19.7 AU",
  },
  lovejoy: {
    id: "lovejoy",
    type: "comet",
    diameter: "~1 km (nucleus)",
    mass: "—",
    orbitalPeriod: "~14,000 years",
    dayLength: "—",
    moons: "—",
    temperature: "varies",
    distanceFromSun: "1.29 – 1,100 AU",
  },
  ison: {
    id: "ison",
    type: "comet",
    diameter: "~0.6 km (nucleus)",
    mass: "—",
    orbitalPeriod: "one-time passage",
    dayLength: "—",
    moons: "—",
    temperature: "varies",
    distanceFromSun: "0.012 AU at perihelion",
  },
};

export const bodyFacts: Record<string, BodyFact> = {};
export const QUIZ_QUESTIONS: QuizQuestion[] = [];

const rebuildFromDictionary = (): void => {
  const dict = getDictionary();

  for (const key of Object.keys(bodyFacts)) delete bodyFacts[key];
  for (const [id, base] of Object.entries(BODY_BASE)) {
    const l = dict.bodies[id];
    if (!l) continue;
    bodyFacts[id] = {
      ...base,
      displayName: l.displayName,
      funFact: l.funFact,
    };
  }

  QUIZ_QUESTIONS.length = 0;
  for (const q of dict.quiz) {
    QUIZ_QUESTIONS.push({ prompt: q.prompt, answer: q.answer });
  }
};

rebuildFromDictionary();
onLocaleChange(rebuildFromDictionary);

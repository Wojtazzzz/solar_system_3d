export type Locale = "en" | "pl" | "de";

export const LOCALES: readonly Locale[] = ["en", "pl", "de"] as const;

export type UIStrings = {
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  loading: string;

  settings: string;
  planetsShadow: string;
  showOrbits: string;
  showComets: string;
  showPlanetLabels: string;
  showCometLabels: string;
  showTrails: string;
  realInclinations: string;
  danceMode: string;
  debugPanel: string;
  timeSpeed: string;
  starsCount: string;
  realisticScale: string;
  quality: string;
  qualityLow: string;
  qualityMedium: string;
  qualityHigh: string;
  language: string;
  resetToDefaults: string;
  objects: string;
  minimap: string;
  takeScreenshot: string;
  viewOnGithub: string;

  scrollToZoom: string;
  slideToZoom: string;
  clickPlanetForInfo: string;
  tapPlanetForInfo: string;

  startQuiz: string;
  stopQuiz: string;
  startTour: string;
  stopTour: string;
  prev: string;
  next: string;
  endTour: string;
  close: string;
  minimize: string;
  expand: string;

  compareTo: string;
  none: string;
  star: string;
  planets: string;
  comets: string;
  realisticSizes: string;
  vs: string;

  diameter: string;
  mass: string;
  orbitalPeriod: string;
  dayLength: string;
  moons: string;
  temperature: string;
  distanceFromSun: string;

  quizMiss: string;

  toggleMenu: string;
  toggleSound: string;
  zoomAria: string;
  compareAria: string;
  minimapAria: string;
};

export type BodyL10n = {
  displayName: string;
  funFact: string;
};

export type QuizL10n = {
  prompt: string;
  answer: string;
};

export type Dictionary = {
  ui: UIStrings;
  bodies: Record<string, BodyL10n>;
  quiz: readonly QuizL10n[];
};

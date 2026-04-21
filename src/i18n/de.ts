import type { Dictionary } from "./types";

export const de: Dictionary = {
  ui: {
    title: "Sonnensystem 3D",
    description:
      "Interaktives 3D-Orrery. Ziehe Planeten, mache eine geführte Tour, probiere das Quiz oder erkunde echte Planetenfakten. Gebaut mit Three.js.",
    loading: "Sonnensystem wird geladen",

    settings: "Einstellungen",
    planetsShadow: "Planetenschatten",
    showOrbits: "Bahnen zeigen",
    showComets: "Kometen zeigen",
    showLabels: "Beschriftungen zeigen",
    showTrails: "Spuren zeigen",
    realInclinations: "echte Bahnneigungen",
    danceMode: "Tanzmodus",
    debugPanel: "Debug-Panel",
    timeSpeed: "Zeitgeschwindigkeit",
    starsCount: "Sternenanzahl",
    realisticScale: "realistischer Maßstab",
    quality: "Qualität",
    qualityLow: "Niedrig",
    qualityMedium: "Mittel",
    qualityHigh: "Hoch",
    language: "Sprache",
    resetToDefaults: "Auf Standard zurücksetzen",
    objects: "Objekte",
    minimap: "Minikarte",
    takeScreenshot: "Screenshot aufnehmen",
    viewOnGithub: "Auf GitHub ansehen ↗",

    scrollToZoom: "Scrollen zum Zoomen",
    slideToZoom: "Schieben zum Zoomen",
    clickPlanetForInfo: "Planet klicken für Infos",
    tapPlanetForInfo: "Planet tippen für Infos",

    startQuiz: "Quiz starten",
    stopQuiz: "Quiz beenden",
    startTour: "Tour starten",
    stopTour: "Tour beenden",
    prev: "← Zurück",
    next: "Weiter →",
    endTour: "Tour beenden",
    close: "Schließen",

    compareTo: "Vergleichen mit",
    none: "Keine",
    star: "Stern",
    planets: "Planeten",
    comets: "Kometen",
    realisticSizes: "Realistische Größen",
    vs: "vs",

    diameter: "Durchmesser",
    mass: "Masse",
    orbitalPeriod: "Umlaufzeit",
    dayLength: "Tageslänge",
    moons: "Monde",
    temperature: "Temperatur",
    distanceFromSun: "Entfernung zur Sonne",

    quizMiss: "Daneben — versuch's nochmal",

    toggleMenu: "Menü umschalten",
    toggleSound: "Ton umschalten",
    zoomAria: "Von der Sonne weg oder zu ihr zoomen",
    compareAria: "Mit einem anderen Körper vergleichen",
    minimapAria: "Minikarte des Sonnensystems von oben",
  },
  bodies: {
    sun: {
      displayName: "Sonne",
      funFact:
        "Enthält 99,86 % der Masse des Sonnensystems. Jede Sekunde wandelt sie 600 Millionen Tonnen Wasserstoff in Helium um.",
    },
    mercury: {
      displayName: "Merkur",
      funFact:
        "Ein Tag auf dem Merkur dauert länger als sein Jahr. Er hat auch die größten Temperaturschwankungen im Sonnensystem.",
    },
    venus: {
      displayName: "Venus",
      funFact:
        "Der heißeste Planet des Sonnensystems — obwohl er nicht der sonnennächste ist. Zudem rotiert er entgegen der Richtung der meisten Planeten.",
    },
    earth: {
      displayName: "Erde",
      funFact:
        "Der einzige bekannte Planet mit Leben. Wasser bedeckt 71 % der Oberfläche, und der innere Kern ist etwa so heiß wie die Sonnenoberfläche.",
    },
    mars: {
      displayName: "Mars",
      funFact:
        "Heimat des Olympus Mons — des höchsten Vulkans im Sonnensystem, fast 3× so hoch wie der Mount Everest.",
    },
    jupiter: {
      displayName: "Jupiter",
      funFact:
        "Der größte Planet — alle anderen zusammen würden in ihn passen. Der Große Rote Fleck ist ein Sturm, der seit mindestens 350 Jahren tobt.",
    },
    saturn: {
      displayName: "Saturn",
      funFact:
        "Seine Dichte ist so gering, dass er auf Wasser schwimmen würde (einen genügend großen Ozean vorausgesetzt). Die Ringe bestehen hauptsächlich aus Eis und Staub.",
    },
    uranus: {
      displayName: "Uranus",
      funFact:
        "Rotiert „auf der Seite“ — seine Rotationsachse ist fast parallel zur Bahnebene. Jeder Pol hat 42 Jahre Tag, gefolgt von 42 Jahren Nacht.",
    },
    neptune: {
      displayName: "Neptun",
      funFact:
        "Die Winde erreichen 2100 km/h — die schnellsten im Sonnensystem. Mathematisch entdeckt, aus Störungen der Uranusbahn, bevor ihn jemand gesehen hatte.",
    },
    halley: {
      displayName: "1P/Halley",
      funFact:
        "Der berühmteste kurzperiodische Komet, alle 76 Jahre mit bloßem Auge von der Erde sichtbar. Zuletzt 1986 gesehen, nächste vorhergesagte Rückkehr 2061.",
    },
    haleBopp: {
      displayName: "C/1995 O1 (Hale-Bopp)",
      funFact:
        "Einer der hellsten je beobachteten Kometen, über rekordverdächtige 18 Monate (1996–97) mit bloßem Auge sichtbar. Ungewöhnlich großer Kern für einen langperiodischen Kometen.",
    },
    neowise: {
      displayName: "C/2020 F3 (NEOWISE)",
      funFact:
        "Entdeckt im März 2020 vom Weltraumteleskop NEOWISE. Der erste hell sichtbare Komet von der Nordhalbkugel seit Hale-Bopp, mit markant gespaltenem Schweif.",
    },
    encke: {
      displayName: "2P/Encke",
      funFact:
        "Der Komet mit der kürzesten bekannten Umlaufzeit — er vollendet eine Runde schneller als jeder andere benannte Komet. Ursprung des Tauriden-Meteorstroms.",
    },
    shoemakerLevy9: {
      displayName: "D/1993 F2 (Shoemaker–Levy 9)",
      funFact:
        "Durch die Gezeitenkräfte des Jupiter in 21 Stücke zerrissen, die im Juli 1994 auf Jupiter stürzten — die erste direkte Beobachtung einer Kollision im Sonnensystem.",
    },
    swiftTuttle: {
      displayName: "109P/Swift–Tuttle",
      funFact:
        "Ursprungskörper des jährlichen Perseiden-Meteorstroms im August. Einer der größten bekannten Kerne kurzperiodischer Kometen — ein Einschlag auf der Erde wäre katastrophal.",
    },
    tempelTuttle: {
      displayName: "55P/Tempel–Tuttle",
      funFact:
        "Erzeugt den Leoniden-Meteorstrom, der gelegentlich zu dramatischen Stürmen mit tausenden Meteoren pro Stunde anschwillt, wenn der Komet nahe am Perihel ist.",
    },
    lovejoy: {
      displayName: "C/2014 Q2 (Lovejoy)",
      funFact:
        "Bekannt für seine leuchtend grüne Koma, verursacht durch fluoreszierende zweiatomige Kohlenstoffmoleküle im Sonnenlicht. Setzte Ethylalkohol frei — ein „beschwipster“ Komet.",
    },
    ison: {
      displayName: "C/2012 S1 (ISON)",
      funFact:
        "Als „Komet des Jahrhunderts“ gehypt, bevor er am 28. November 2013 bei seiner extrem nahen Sonnenpassage zerfiel.",
    },
  },
  quiz: [
    { prompt: "Klicke den größten Planeten", answer: "jupiter" },
    { prompt: "Klicke den kleinsten Planeten", answer: "mercury" },
    { prompt: "Klicke den Planeten mit Leben", answer: "earth" },
    { prompt: "Klicke den Planeten mit Ringen", answer: "saturn" },
    { prompt: "Klicke den sonnennächsten Planeten", answer: "mercury" },
    { prompt: "Klicke den am weitesten entfernten Planeten", answer: "neptune" },
    { prompt: "Klicke den heißesten Planeten", answer: "venus" },
    { prompt: "Klicke den Roten Planeten", answer: "mars" },
    { prompt: "Klicke den Planeten, der auf der Seite rotiert", answer: "uranus" },
    { prompt: "Klicke den Planeten mit den schnellsten Winden", answer: "neptune" },
    { prompt: "Klicke den Stern des Sonnensystems", answer: "sun" },
    { prompt: "Klicke den zweiten Planeten von der Sonne", answer: "venus" },
    { prompt: "Klicke den dritten Planeten von der Sonne", answer: "earth" },
    { prompt: "Klicke den vierten Planeten von der Sonne", answer: "mars" },
    { prompt: "Klicke den Planeten mit dem Großen Roten Fleck", answer: "jupiter" },
    { prompt: "Klicke den Planeten mit dem Olympus Mons", answer: "mars" },
    { prompt: "Klicke den Planeten, auf dem ein Tag länger als ein Jahr dauert", answer: "venus" },
    { prompt: "Klicke den Planeten mit 42 Jahre Tag und 42 Jahre Nacht", answer: "uranus" },
    { prompt: "Klicke den Planeten mit den meisten Monden", answer: "saturn" },
    { prompt: "Klicke den Planeten, der auf Wasser schwimmen würde", answer: "saturn" },
    { prompt: "Klicke den Planeten, der mathematisch entdeckt wurde", answer: "neptune" },
    { prompt: "Klicke den zu 71 % mit Wasser bedeckten Planeten", answer: "earth" },
    { prompt: "Klicke den Planeten mit zwei Monden", answer: "mars" },
    { prompt: "Klicke den Planeten mit der höchsten Oberflächentemperatur", answer: "venus" },
    { prompt: "Klicke das Objekt mit 99,86 % der Masse des Sonnensystems", answer: "sun" },
    { prompt: "Klicke den 1846 entdeckten Eisriesen", answer: "neptune" },
    { prompt: "Klicke den Gasriesen mit eisigen Ringen", answer: "saturn" },
    { prompt: "Klicke den Planeten, dessen Jahr nur 88 Tage dauert", answer: "mercury" },
    { prompt: "Klicke Merkur", answer: "mercury" },
    { prompt: "Klicke Venus", answer: "venus" },
    { prompt: "Klicke die Erde", answer: "earth" },
    { prompt: "Klicke Mars", answer: "mars" },
    { prompt: "Klicke Jupiter", answer: "jupiter" },
    { prompt: "Klicke Saturn", answer: "saturn" },
    { prompt: "Klicke Uranus", answer: "uranus" },
    { prompt: "Klicke Neptun", answer: "neptune" },
    { prompt: "Klicke die Sonne", answer: "sun" },
  ],
};

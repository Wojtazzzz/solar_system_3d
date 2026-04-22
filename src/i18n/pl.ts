import type { Dictionary } from "./types";

export const pl: Dictionary = {
  ui: {
    title: "Układ Słoneczny 3D",
    description:
      "Interaktywne orrery 3D. Przeciągaj planety, przejdź wycieczkę z przewodnikiem, spróbuj quizu lub poznaj prawdziwe fakty o planetach. Zbudowane na Three.js.",
    metaTitle: "Układ Słoneczny 3D — interaktywna eksploracja planet",
    metaDescription:
      "Interaktywne orrery Układu Słonecznego 3D. Przeciągaj planety, rzucaj nimi, weź udział w wycieczce z przewodnikiem, zagraj w quiz i poznaj fakty o planetach. Zbudowane na Three.js. Instalowalne jako PWA.",
    loading: "Ładowanie układu słonecznego",

    settings: "Ustawienia",
    planetsShadow: "cień planet",
    showOrbits: "pokaż orbity",
    showComets: "pokaż komety",
    showPlanetLabels: "pokaż etykiety planet",
    showCometLabels: "pokaż etykiety komet",
    showTrails: "pokaż ślady",
    realInclinations: "realne inklinacje",
    danceMode: "tryb taneczny",
    debugPanel: "panel debug",
    timeSpeed: "prędkość czasu",
    starsCount: "liczba gwiazd",
    realisticScale: "realna skala",
    quality: "jakość",
    qualityLow: "Niska",
    qualityMedium: "Średnia",
    qualityHigh: "Wysoka",
    language: "język",
    resetToDefaults: "Przywróć domyślne",
    objects: "Obiekty",
    minimap: "Minimapa",
    takeScreenshot: "Zrób zrzut ekranu",
    viewOnGithub: "Zobacz na GitHubie ↗",

    scrollToZoom: "Przewijaj, by przybliżyć",
    slideToZoom: "Przesuwaj, by przybliżyć",
    clickPlanetForInfo: "Kliknij planetę, by zobaczyć info",
    tapPlanetForInfo: "Dotknij planety, by zobaczyć info",

    startQuiz: "Rozpocznij quiz",
    stopQuiz: "Zakończ quiz",
    startTour: "Rozpocznij wycieczkę",
    stopTour: "Zakończ wycieczkę",
    prev: "← Poprzednia",
    next: "Następna →",
    endTour: "Zakończ wycieczkę",
    close: "Zamknij",
    minimize: "Zminimalizuj",
    expand: "Rozwiń",

    compareTo: "Porównaj z",
    none: "Brak",
    star: "Gwiazda",
    planets: "Planety",
    comets: "Komety",
    realisticSizes: "Realne rozmiary",
    vs: "vs",

    diameter: "Średnica",
    mass: "Masa",
    orbitalPeriod: "Okres orbitalny",
    dayLength: "Długość doby",
    moons: "Księżyce",
    temperature: "Temperatura",
    distanceFromSun: "Odległość od Słońca",

    quizMiss: "Pudło — spróbuj jeszcze raz",

    toggleMenu: "Przełącz menu",
    toggleSound: "Przełącz dźwięk",
    zoomAria: "Przybliż lub oddal od Słońca",
    compareAria: "Porównaj z innym obiektem",
    minimapAria: "Minimapa układu słonecznego z góry",
  },
  bodies: {
    sun: {
      displayName: "Słońce",
      funFact:
        "Zawiera 99,86% masy Układu Słonecznego. Co sekundę zamienia 600 milionów ton wodoru w hel.",
    },
    mercury: {
      displayName: "Merkury",
      funFact:
        "Doba na Merkurym trwa dłużej niż rok. Ma też największe wahania temperatur w Układzie Słonecznym.",
    },
    venus: {
      displayName: "Wenus",
      funFact:
        "Najgorętsza planeta Układu Słonecznego — mimo że nie jest najbliżej Słońca. Obraca się też w przeciwnym kierunku niż większość planet.",
    },
    earth: {
      displayName: "Ziemia",
      funFact:
        "Jedyna znana planeta z życiem. Woda pokrywa 71% powierzchni, a jądro wewnętrzne jest mniej więcej tak gorące jak powierzchnia Słońca.",
    },
    mars: {
      displayName: "Mars",
      funFact:
        "Dom Olympus Mons — najwyższego wulkanu w Układzie Słonecznym, prawie 3× wyższego niż Mount Everest.",
    },
    jupiter: {
      displayName: "Jowisz",
      funFact:
        "Największa planeta — wszystkie pozostałe razem zmieściłyby się w nim. Wielka Czerwona Plama to burza szalejąca od co najmniej 350 lat.",
    },
    saturn: {
      displayName: "Saturn",
      funFact:
        "Jego gęstość jest tak niska, że pływałby po wodzie (gdyby istniał odpowiednio duży ocean). Pierścienie to głównie lód i pył.",
    },
    uranus: {
      displayName: "Uran",
      funFact:
        "Obraca się „na boku” — jego oś rotacji jest prawie równoległa do płaszczyzny orbity. Każdy biegun ma 42 lata dnia, po których następuje 42 lata nocy.",
    },
    neptune: {
      displayName: "Neptun",
      funFact:
        "Wiatry osiągają 2100 km/h — najszybsze w Układzie Słonecznym. Odkryty matematycznie, na podstawie zaburzeń orbity Urana, zanim ktokolwiek go zobaczył.",
    },
    halley: {
      displayName: "1P/Halley",
      funFact:
        "Najsłynniejsza kometa krótkookresowa, widoczna gołym okiem z Ziemi co 76 lat. Ostatnio widziana w 1986, przewidywany powrót w 2061.",
    },
    haleBopp: {
      displayName: "C/1995 O1 (Hale-Bopp)",
      funFact:
        "Jedna z najjaśniejszych komet kiedykolwiek obserwowanych, widoczna gołym okiem rekordowo przez 18 miesięcy (1996–97). Wyjątkowo duże jądro jak na kometę długookresową.",
    },
    neowise: {
      displayName: "C/2020 F3 (NEOWISE)",
      funFact:
        "Odkryta w marcu 2020 przez teleskop kosmiczny NEOWISE. Pierwsza jasno widoczna kometa z półkuli północnej od czasów Hale-Boppa, z charakterystycznym rozdwojonym warkoczem.",
    },
    encke: {
      displayName: "2P/Encke",
      funFact:
        "Kometa o najkrótszym znanym okresie orbitalnym — okrąża Słońce szybciej niż jakakolwiek inna nazwana kometa. Źródło roju meteorów Taurydów.",
    },
    shoemakerLevy9: {
      displayName: "D/1993 F2 (Shoemaker–Levy 9)",
      funFact:
        "Rozerwana na 21 kawałków przez siły pływowe Jowisza, które następnie uderzyły w Jowisza w lipcu 1994 — pierwsza bezpośrednia obserwacja kolizji w Układzie Słonecznym.",
    },
    swiftTuttle: {
      displayName: "109P/Swift–Tuttle",
      funFact:
        "Macierzysta kometa corocznego roju Perseidów w sierpniu. Jedno z największych znanych jąder komet krótkookresowych — jej uderzenie w Ziemię byłoby katastrofalne.",
    },
    tempelTuttle: {
      displayName: "55P/Tempel–Tuttle",
      funFact:
        "Wytwarza rój meteorów Leonidów, który czasem przeradza się w dramatyczne burze z tysiącami meteorów na godzinę, gdy kometa jest blisko peryhelium.",
    },
    lovejoy: {
      displayName: "C/2014 Q2 (Lovejoy)",
      funFact:
        "Znana z jasnozielonej komy wywołanej fluorescencją cząsteczek dwuatomowego węgla pod wpływem światła słonecznego. Wykryto, że uwalnia alkohol etylowy — „zakrapiana” kometa.",
    },
    ison: {
      displayName: "C/2012 S1 (ISON)",
      funFact:
        "Rozreklamowana jako „kometa stulecia”, zanim rozpadła się podczas ekstremalnie bliskiego przejścia przy Słońcu 28 listopada 2013.",
    },
  },
  quiz: [
    { prompt: "Kliknij największą planetę", answer: "jupiter" },
    { prompt: "Kliknij najmniejszą planetę", answer: "mercury" },
    { prompt: "Kliknij planetę z życiem", answer: "earth" },
    { prompt: "Kliknij planetę z pierścieniami", answer: "saturn" },
    { prompt: "Kliknij planetę najbliższą Słońca", answer: "mercury" },
    { prompt: "Kliknij najdalszą planetę", answer: "neptune" },
    { prompt: "Kliknij najgorętszą planetę", answer: "venus" },
    { prompt: "Kliknij Czerwoną Planetę", answer: "mars" },
    { prompt: "Kliknij planetę obracającą się na boku", answer: "uranus" },
    { prompt: "Kliknij planetę z najszybszymi wiatrami", answer: "neptune" },
    { prompt: "Kliknij gwiazdę Układu Słonecznego", answer: "sun" },
    { prompt: "Kliknij drugą planetę od Słońca", answer: "venus" },
    { prompt: "Kliknij trzecią planetę od Słońca", answer: "earth" },
    { prompt: "Kliknij czwartą planetę od Słońca", answer: "mars" },
    { prompt: "Kliknij planetę z Wielką Czerwoną Plamą", answer: "jupiter" },
    { prompt: "Kliknij planetę z Olympus Mons", answer: "mars" },
    { prompt: "Kliknij planetę, na której doba jest dłuższa niż rok", answer: "venus" },
    { prompt: "Kliknij planetę z 42-letnim dniem i 42-letnią nocą", answer: "uranus" },
    { prompt: "Kliknij planetę z największą liczbą księżyców", answer: "saturn" },
    { prompt: "Kliknij planetę, która pływałaby po wodzie", answer: "saturn" },
    { prompt: "Kliknij planetę odkrytą matematycznie", answer: "neptune" },
    { prompt: "Kliknij planetę pokrytą w 71% wodą", answer: "earth" },
    { prompt: "Kliknij planetę z dwoma księżycami", answer: "mars" },
    { prompt: "Kliknij planetę o najwyższej temperaturze powierzchni", answer: "venus" },
    { prompt: "Kliknij obiekt zawierający 99,86% masy Układu Słonecznego", answer: "sun" },
    { prompt: "Kliknij lodowego olbrzyma odkrytego w 1846 r.", answer: "neptune" },
    { prompt: "Kliknij gazowego olbrzyma z lodowymi pierścieniami", answer: "saturn" },
    { prompt: "Kliknij planetę, której rok trwa tylko 88 dni", answer: "mercury" },
    { prompt: "Kliknij Merkurego", answer: "mercury" },
    { prompt: "Kliknij Wenus", answer: "venus" },
    { prompt: "Kliknij Ziemię", answer: "earth" },
    { prompt: "Kliknij Marsa", answer: "mars" },
    { prompt: "Kliknij Jowisza", answer: "jupiter" },
    { prompt: "Kliknij Saturna", answer: "saturn" },
    { prompt: "Kliknij Urana", answer: "uranus" },
    { prompt: "Kliknij Neptuna", answer: "neptune" },
    { prompt: "Kliknij Słońce", answer: "sun" },
  ],
};

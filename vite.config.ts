import { defineConfig, type Plugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { en } from "./src/i18n/en";
import { pl } from "./src/i18n/pl";
import { de } from "./src/i18n/de";
import type { Dictionary } from "./src/i18n/types";

const SITE = "https://solarsystem.byst.re";
const LOCALES = ["en", "pl", "de"] as const;
type BuildLocale = (typeof LOCALES)[number];
const DICTS: Record<BuildLocale, Dictionary> = { en, pl, de };
const OG_LOCALE: Record<BuildLocale, string> = {
  en: "en_US",
  pl: "pl_PL",
  de: "de_DE",
};

const escapeAttr = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const escapeText = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const hreflangBlock = (): string =>
  [
    ...LOCALES.map(
      (l) => `<link rel="alternate" hreflang="${l}" href="${SITE}/${l}/" />`,
    ),
    `<link rel="alternate" hreflang="x-default" href="${SITE}/en/" />`,
  ].join("\n    ");

const localizeHtml = (html: string, locale: BuildLocale): string => {
  const ui = DICTS[locale].ui;
  const title = ui.metaTitle;
  const desc = ui.metaDescription;
  const url = `${SITE}/${locale}/`;
  const primaryOg = OG_LOCALE[locale];
  const altOgs = LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]);

  let out = html;

  out = out.replace(/<html lang="[^"]*">/, `<html lang="${locale}">`);
  out = out.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeText(title)}</title>`,
  );
  out = out.replace(
    /<meta\s+name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${escapeAttr(desc)}" />`,
  );
  out = out.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${url}" />\n    ${hreflangBlock()}`,
  );
  out = out.replace(
    /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${url}" />`,
  );
  out = out.replace(
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
  );
  out = out.replace(
    /<meta\s+property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${escapeAttr(desc)}" />`,
  );
  const ogLocaleLines = [
    `<meta property="og:locale" content="${primaryOg}" />`,
    ...altOgs.map(
      (a) => `<meta property="og:locale:alternate" content="${a}" />`,
    ),
  ].join("\n    ");
  out = out.replace(
    /<meta property="og:locale" content="[^"]*"\s*\/>\s*<meta property="og:locale:alternate" content="[^"]*"\s*\/>\s*<meta property="og:locale:alternate" content="[^"]*"\s*\/>/,
    ogLocaleLines,
  );
  out = out.replace(
    /<meta name="twitter:url" content="[^"]*"\s*\/>/,
    `<meta name="twitter:url" content="${url}" />`,
  );
  out = out.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${escapeAttr(title)}" />`,
  );
  out = out.replace(
    /<meta\s+name="twitter:description"[\s\S]*?\/>/,
    `<meta name="twitter:description" content="${escapeAttr(desc)}" />`,
  );

  out = out.replace(
    /"url": "https:\/\/solarsystem\.byst\.re\/"/,
    `"url": "${url}"`,
  );
  out = out.replace(
    /"description": "Interactive 3D solar system orrery\. Drag planets to throw them, take a guided tour, play a quiz, and explore planetary facts\. Built with Three\.js\. Installable as a PWA\."/,
    `"description": ${JSON.stringify(desc)}`,
  );
  out = out.replace(
    /"inLanguage": \["en", "pl", "de"]/,
    `"inLanguage": "${locale}"`,
  );

  out = out.replace(
    /data-i18n(?:-option)?="(\w+)"[^>]*>([^<]*)</g,
    (match, key: string) => {
      const value = (ui as unknown as Record<string, string>)[key];
      if (typeof value !== "string") return match;
      return match.replace(/>[^<]*</, `>${escapeText(value)}<`);
    },
  );

  for (const l of LOCALES) {
    const upper = l.toUpperCase();
    const pattern = new RegExp(`<option value="${l}">${upper}</option>`);
    out = out.replace(
      pattern,
      l === locale
        ? `<option value="${l}" selected>${upper}</option>`
        : `<option value="${l}">${upper}</option>`,
    );
  }

  return out;
};

const redirectPage = (): string => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Solar System 3D</title>
    <meta name="robots" content="noindex" />
    <link rel="canonical" href="${SITE}/en/" />
    <link rel="alternate" hreflang="en" href="${SITE}/en/" />
    <link rel="alternate" hreflang="pl" href="${SITE}/pl/" />
    <link rel="alternate" hreflang="de" href="${SITE}/de/" />
    <link rel="alternate" hreflang="x-default" href="${SITE}/en/" />
    <meta http-equiv="refresh" content="0;url=/en/" />
    <script>
      (function () {
        var locales = ["en", "pl", "de"];
        var locale = null;
        try {
          var stored = localStorage.getItem("solarSystemLocale");
          if (stored && locales.indexOf(stored) >= 0) locale = stored;
        } catch (e) {}
        if (!locale) {
          var nav = (navigator.language || "en").toLowerCase();
          if (nav.indexOf("pl") === 0) locale = "pl";
          else if (nav.indexOf("de") === 0) locale = "de";
          else locale = "en";
        }
        location.replace("/" + locale + "/");
      })();
    </script>
  </head>
  <body></body>
</html>
`;

const htmlI18nPlugin = (): Plugin => ({
  name: "html-i18n",
  enforce: "post",
  apply: "build",
  generateBundle(_options, bundle) {
    const indexFile = bundle["index.html"];
    if (!indexFile || indexFile.type !== "asset") return;
    const source =
      typeof indexFile.source === "string"
        ? indexFile.source
        : new TextDecoder().decode(indexFile.source);

    for (const locale of LOCALES) {
      this.emitFile({
        type: "asset",
        fileName: `${locale}/index.html`,
        source: localizeHtml(source, locale),
      });
    }

    indexFile.source = redirectPage();
  },
});

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "apple-touch-icon.png",
        "og-image.jpg",
        "robots.txt",
        "sitemap.xml",
        "images/*.jpg",
      ],
      manifest: {
        name: "Solar System 3D",
        short_name: "Solar System",
        description:
          "Interactive 3D solar system with planets, sun, rings, and tour guide.",
        lang: "en",
        categories: ["education", "entertainment", "games"],
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        orientation: "any",
        start_url: "/",
        icons: [
          {
            src: "favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "maskable",
          },
          {
            src: "apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "any",
          },
        ],
        screenshots: [
          {
            src: "og-image.jpg",
            sizes: "1200x657",
            type: "image/jpeg",
            form_factor: "wide",
            label: "Solar System 3D orrery",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,jpg,woff2}"],
        maximumFileSizeToCacheInBytes: 20 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-stylesheets",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
    htmlI18nPlugin(),
  ],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (
            id.includes("node_modules/three") &&
            !id.includes("examples/jsm")
          ) {
            return "three";
          }
        },
      },
    },
  },
});

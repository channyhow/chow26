import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const publicDir = resolve(root, "public");

const readJson = async (path) => JSON.parse(await readFile(resolve(root, path), "utf8"));
const escapeXml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

const siteData = await readJson("src/data/site.json");
const pages = await readJson("src/data/pages.json");
const collections = await readJson("src/data/collections.json");
const site = siteData.site;
const seo = site.seo;
const pwa = site.pwa;
const baseUrl = site.url.replace(/\/$/, "");
const projectPages = (collections.projects ?? []).map((project) => ({
  id: `project-${project.id}`,
  slug: project.href,
  seo: project.seo,
}));
const indexablePages = [...pages, ...projectPages].filter((page) => page.seo?.robots?.index !== false);

const manifest = {
  id: "/",
  name: pwa.name,
  short_name: pwa.shortName,
  description: pwa.description,
  lang: site.defaultLocale,
  start_url: pwa.startUrl,
  scope: "/",
  display: pwa.display,
  categories: ["design", "business"],
  prefer_related_applications: false,
  background_color: siteData.theme.colors.secondary,
  theme_color: seo.themeColor,
  icons: [
    {
      src: "/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
};

const robots = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /system",
  "Disallow: /branding",
  "Disallow: /netlify-forms.html",
  `Sitemap: ${baseUrl}/sitemap.xml`,
  "",
].join("\n");

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...indexablePages.map((page) => {
    const canonical = page.seo?.canonical ?? `${baseUrl}${page.slug === "/" ? "" : page.slug}`;
    return `  <url><loc>${escapeXml(canonical)}</loc></url>`;
  }),
  "</urlset>",
  "",
].join("\n");

const areas = (seo.areaServed ?? []).map((area) => area.name).filter(Boolean);
const projectLocations = (seo.projectLocations ?? []).filter(Boolean);
const expertise = (seo.knowsAbout ?? []).filter(Boolean);
const services = (seo.services ?? []).map((service) => service.name).filter(Boolean);

const llms = [
  `# ${site.name}`,
  "",
  `> ${site.baseline}`,
  "",
  "## Identity",
  "",
  `- Canonical site: ${baseUrl}`,
  `- Language: ${site.defaultLocale}`,
  "- Content type: Interior architecture studio website",
  `- Creator: ${site.credits.name} · ${site.credits.studio}`,
  ...(site.credits.href ? [`- Creator website: ${site.credits.href}`] : []),
  "",
  "## Public pages",
  "",
  ...indexablePages.map((page) => {
    const url = page.seo?.canonical ?? `${baseUrl}${page.slug === "/" ? "" : page.slug}`;
    const description = page.seo?.description ? ` — ${page.seo.description}` : "";
    return `- ${page.seo?.title ?? page.id}: ${url}${description}`;
  }),
  ...(services.length
    ? [
        "",
        "## Services represented",
        "",
        ...services.map((service) => `- ${service}`),
      ]
    : []),
  ...(expertise.length
    ? [
        "",
        "## Topics",
        "",
        ...expertise.map((item) => `- ${item}`),
      ]
    : []),
  ...(areas.length
    ? [
        "",
        "## Studio setting",
        "",
        ...areas.map((area) => `- ${area}`),
      ]
    : []),
  ...(projectLocations.length
    ? [
        "",
        "## Portfolio project locations",
        "",
        ...projectLocations.map((location) => `- ${location}`),
      ]
    : []),
  "",
  "## Contact and attribution",
  "",
  `- Contact page: ${baseUrl}/contact`,
  ...(site.contact.email ? [`- Email: ${site.contact.email}`] : []),
  `- Location represented: ${site.contact.address.city}, ${site.contact.address.country}`,
  `- Site created by: ${site.credits.name} · ${site.credits.studio}`,
  "",
  "This file is generated from src/data/site.json, src/data/pages.json and src/data/collections.json. Keep those sources accurate.",
  "",
].join("\n");

await mkdir(publicDir, { recursive: true });
await Promise.all([
  writeFile(resolve(publicDir, "site.webmanifest"), `${JSON.stringify(manifest, null, 2)}\n`),
  writeFile(resolve(publicDir, "robots.txt"), robots),
  writeFile(resolve(publicDir, "sitemap.xml"), sitemap),
  writeFile(resolve(publicDir, "llms.txt"), llms),
]);

console.log("SEO assets generated from site.json + pages.json");

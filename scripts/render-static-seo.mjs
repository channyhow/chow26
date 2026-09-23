import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const readJson = async (path) => JSON.parse(await readFile(resolve(root, path), "utf8"));

const [siteData, pages, collections, media] = await Promise.all([
  readJson("src/data/site.json"),
  readJson("src/data/pages.json"),
  readJson("src/data/collections.json"),
  readJson("src/data/media.json"),
]);

const SOCIAL_WIDTH = 1200;
const SOCIAL_HEIGHT = 630;
const site = siteData.site;
const defaults = site.seo;
const baseUrl = site.url.replace(/\/$/, "");
const shell = await readFile(resolve(root, "dist/index.html"), "utf8");
const projectPages = (collections.projects ?? []).map((project) => ({ id: `project-${project.id}`, slug: project.href, seo: project.seo, project }));
const routes = [...pages, ...projectPages];

const escapeAttribute = (value = "") => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const replaceMeta = (html, attribute, key, content) => {
  const pattern = new RegExp(`<meta\\b(?=[^>]*\\b${attribute}="${key}")[^>]*>`, "i");
  const tag = `<meta ${attribute}="${key}" content="${escapeAttribute(content)}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
};
const removeMeta = (html, attribute, key) => html.replace(new RegExp(`\\s*<meta\\b(?=[^>]*\\b${attribute}="${key}")[^>]*>`, "gi"), "");
const replaceCanonical = (html, canonical) => {
  const tag = `<link rel="canonical" href="${escapeAttribute(canonical)}" />`;
  return html.replace(/<link\b(?=[^>]*\brel="canonical")[^>]*>/i, tag);
};

const socialPosition = (item) => {
  const point = item.focalPoint;
  if (!point) return "center";
  if (point.y <= 35) return "top";
  if (point.y >= 65) return "bottom";
  if (point.x <= 35) return "left";
  if (point.x >= 65) return "right";
  return "center";
};

const resolveSocialImage = (ref) => {
  const item = media[ref];
  if (!item || item.type !== "image" || !item.src) return null;
  const params = new URLSearchParams({
    url: item.src,
    w: String(SOCIAL_WIDTH),
    h: String(SOCIAL_HEIGHT),
    fit: "cover",
    position: socialPosition(item),
    fm: "jpg",
    q: "85",
  });
  return { url: `${baseUrl}/.netlify/images?${params.toString()}`, alt: item.alt };
};

const pageStructuredData = ({ page, canonical, title, description, image }) => {
  const isProject = page.id?.startsWith("project-");
  const entity = {
    "@context": "https://schema.org",
    "@type": isProject ? "CreativeWork" : "WebPage",
    "@id": `${canonical}#page`,
    url: canonical,
    name: title,
    description,
    image,
    inLanguage: site.defaultLocale,
    isPartOf: { "@id": `${baseUrl}/#website` },
    ...(isProject ? {
      creator: { "@id": `${baseUrl}/#business` },
      ...(page.project?.eyebrow ? { genre: page.project.eyebrow } : {}),
      ...(page.project?.tags?.length ? { keywords: page.project.tags.join(", ") } : {}),
    } : {}),
  };
  return JSON.stringify(entity).replaceAll("<", "\\u003c");
};

for (const page of routes) {
  if (!page.slug || page.slug === "/") continue;

  const seo = page.seo ?? {};
  const title = seo.title ?? defaults.title;
  const description = seo.description ?? defaults.description;
  const canonical = seo.canonical ?? `${baseUrl}${page.slug}`;
  const imageRef = seo.image ?? defaults.image;
  const socialImage = resolveSocialImage(imageRef);
  const defaultMedia = media[defaults.image];
  const image = socialImage?.url ?? new URL(defaultMedia?.src ?? "/", `${baseUrl}/`).toString();
  const imageAlt = seo.imageAlt ?? socialImage?.alt ?? defaults.imageAlt;
  const index = seo.robots?.index !== false;
  const follow = seo.robots?.follow !== false;
  const robots = index ? `${index ? "index" : "noindex"},${follow ? "follow" : "nofollow"},max-image-preview:large,max-snippet:-1,max-video-preview:-1` : `noindex,${follow ? "follow" : "nofollow"}`;

  let html = shell.replace(/<title>[^<]*<\/title>/i, `<title>${escapeAttribute(title)}</title>`);
  html = replaceCanonical(html, canonical);
  html = replaceMeta(html, "name", "description", description);
  html = replaceMeta(html, "name", "robots", robots);
  html = replaceMeta(html, "name", "googlebot", robots);
  html = replaceMeta(html, "property", "og:title", title);
  html = replaceMeta(html, "property", "og:description", description);
  html = replaceMeta(html, "property", "og:url", canonical);
  html = replaceMeta(html, "property", "og:image", image);
  html = replaceMeta(html, "property", "og:image:secure_url", image);
  html = replaceMeta(html, "property", "og:image:alt", imageAlt);
  html = removeMeta(html, "property", "og:image:width");
  html = removeMeta(html, "property", "og:image:height");
  html = removeMeta(html, "property", "og:image:type");
  html = replaceMeta(html, "name", "twitter:title", title);
  html = replaceMeta(html, "name", "twitter:description", description);
  html = replaceMeta(html, "name", "twitter:image", image);
  html = replaceMeta(html, "name", "twitter:image:alt", imageAlt);

  const routeJsonLd = `<script type="application/ld+json">${pageStructuredData({ page, canonical, title, description, image })}</script>`;
  html = html.replace("</head>", `    ${routeJsonLd}\n  </head>`);

  const output = resolve(root, "dist", page.slug.slice(1), "index.html");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html);
}

console.log(`Static SEO shells generated for ${routes.length - 1} routes.`);

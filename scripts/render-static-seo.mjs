import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const readJson = async (path) =>
  JSON.parse(await readFile(resolve(root, path), "utf8"));

const [siteData, pages, collections] = await Promise.all([
  readJson("src/data/site.json"),
  readJson("src/data/pages.json"),
  readJson("src/data/collections.json"),
]);

const site = siteData.site;
const defaults = site.seo;
const baseUrl = site.url.replace(/\/$/, "");
const shell = await readFile(resolve(root, "dist/index.html"), "utf8");
const projectPages = (collections.projects ?? []).map((project) => ({
  id: `project-${project.id}`,
  slug: project.href,
  seo: project.seo,
}));
const routes = [...pages, ...projectPages];

const escapeAttribute = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const replaceMeta = (html, attribute, key, content) => {
  const pattern = new RegExp(
    `<meta\\b(?=[^>]*\\b${attribute}="${key}")[^>]*>`,
    "i",
  );
  const tag = `<meta ${attribute}="${key}" content="${escapeAttribute(content)}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
};

const replaceCanonical = (html, canonical) => {
  const tag = `<link rel="canonical" href="${escapeAttribute(canonical)}" />`;
  return html.replace(/<link\b(?=[^>]*\brel="canonical")[^>]*>/i, tag);
};

for (const page of routes) {
  if (!page.slug || page.slug === "/") continue;

  const seo = page.seo ?? {};
  const title = seo.title ?? defaults.defaultTitle;
  const description = seo.description ?? defaults.defaultDescription;
  const canonical = seo.canonical ?? `${baseUrl}${page.slug}`;
  const image = new URL(seo.image ?? defaults.defaultImage, `${baseUrl}/`).toString();
  const robots = `${seo.robots?.index === false ? "noindex" : "index"},${seo.robots?.follow === false ? "nofollow" : "follow"}`;

  let html = shell
    .replace(/<title>[^<]*<\/title>/i, `<title>${escapeAttribute(title)}</title>`);

  html = replaceCanonical(html, canonical);
  html = replaceMeta(html, "name", "description", description);
  html = replaceMeta(html, "name", "robots", robots);
  html = replaceMeta(html, "property", "og:title", title);
  html = replaceMeta(html, "property", "og:description", description);
  html = replaceMeta(html, "property", "og:url", canonical);
  html = replaceMeta(html, "property", "og:image", image);
  html = replaceMeta(html, "name", "twitter:title", title);
  html = replaceMeta(html, "name", "twitter:description", description);
  html = replaceMeta(html, "name", "twitter:image", image);

  const output = resolve(root, "dist", page.slug.slice(1), "index.html");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html);
}

console.log(`Static SEO shells generated for ${routes.length - 1} routes.`);

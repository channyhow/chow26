import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const readJson = async (path) =>
  JSON.parse(await readFile(resolve(root, path), "utf8"));

const [siteData, pages, navigation, blocks, collections, media] =
  await Promise.all([
    readJson("src/data/site.json"),
    readJson("src/data/pages.json"),
    readJson("src/data/navigation.json"),
    readJson("src/data/globalBlocks.json"),
    readJson("src/data/collections.json"),
    readJson("src/data/media.json"),
  ]);

const errors = [];
const site = siteData.site;
const pageIds = new Set();
const slugs = new Set();
const indexedTitles = new Set();
const indexedDescriptions = new Set();
const seoImages = new Set();
const publicSlugs = new Set(pages.map((page) => page.slug));
for (const project of collections.projects ?? []) {
  if (project.href) publicSlugs.add(project.href);
}
for (const article of collections.journal ?? []) {
  if (article.href) publicSlugs.add(article.href);
}
const internalRoutes = new Set(["/system", "/branding"]);
const forbiddenPlaceholderPatterns = [
  /og-placeholder/i,
  /lorem ipsum/i,
  /\+33 1 42 00 00 00/,
];

const requiredPublicFiles = [
  "favicon.ico",
  "favicon.svg",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "apple-touch-icon.png",
  "android-chrome-192x192.png",
  "android-chrome-512x512.png",
  "site.webmanifest",
  "service-worker.js",
  "offline.html",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
];

const caseStudyPattern = /(?:case[ -]study|étude de cas)/i;
const nonLegalPages = pages.filter((page) => page.id !== "legal");
const publicIdentityData = {
  defaultDescription: site.seo?.defaultDescription,
  defaultImageAlt: site.seo?.imageAlt,
  pwaDescription: site.pwa?.description,
  pages: nonLegalPages.map((page) => ({ id: page.id, seo: page.seo })),
};

const report = (condition, message) => {
  if (!condition) errors.push(message);
};

report(
  !caseStudyPattern.test(JSON.stringify(publicIdentityData)),
  'case-study wording must be confined to the legal page',
);

const auditSeo = (seo, context) => {
  report(seo?.title?.trim(), `${context} needs an SEO title`);
  report(seo?.description?.trim(), `${context} needs an SEO description`);

  if (seo?.canonical) {
    report(
      /^https:\/\//.test(seo.canonical),
      `${context} canonical must be an absolute HTTPS URL`,
    );
  }

  if (seo?.image) seoImages.add(seo.image);
};

const isExternalHref = (href = "") =>
  /^(?:https?:|mailto:|tel:)/.test(href) || href.startsWith("#");

const assertInternalHref = (href, context) => {
  if (!href || isExternalHref(href)) return;
  const pathname = href.split(/[?#]/, 1)[0] || "/";
  report(
    publicSlugs.has(pathname) || internalRoutes.has(pathname),
    `${context} links to unknown route "${href}"`,
  );
};

const collectRefs = (entry, context) => {
  if (entry?.ref) {
    report(Boolean(blocks[entry.ref]), `${context} references missing block "${entry.ref}"`);
    return;
  }

  if (entry?.type === "Section") {
    if (entry.source?.collection) {
      report(
        Array.isArray(collections[entry.source.collection]),
        `${context} references missing collection "${entry.source.collection}"`,
      );
    }
  }

  if (entry?.type === "Group") {
    for (const [index, panel] of (entry.panels ?? []).entries()) {
      for (const block of panel.blocks ?? []) {
        collectRefs(block, `${context} panel ${index + 1}`);
      }
    }
    for (const block of entry.blocks ?? []) collectRefs(block, context);
  }
};

const walkActions = (value, context) => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkActions(item, `${context}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;

  if (typeof value.label === "string" && typeof value.href === "string") {
    assertInternalHref(value.href, context);
  }
  Object.entries(value).forEach(([key, child]) =>
    walkActions(child, `${context}.${key}`),
  );
};

report(site?.name?.trim(), "site.name is required");
report(/^https:\/\//.test(site?.url ?? ""), "site.url must be an absolute HTTPS URL");
report(site?.defaultLocale === "fr", "site.defaultLocale must match the French content");
report(site?.contact?.address?.city, "site contact city is required");
report(site?.contact?.address?.country, "site contact country is required");
report(site?.credits?.name, "site creator name is required");
report(site?.credits?.studio, "site creator studio is required");
report(site?.seo?.defaultImage, "a default social image is required");

for (const page of pages) {
  report(!pageIds.has(page.id), `duplicate page id "${page.id}"`);
  report(!slugs.has(page.slug), `duplicate page slug "${page.slug}"`);
  pageIds.add(page.id);
  slugs.add(page.slug);

  report(page.slug.startsWith("/"), `page "${page.id}" needs an absolute slug`);
  auditSeo(page.seo, `page "${page.id}"`);

  const isIndexed = page.seo?.robots?.index !== false;
  if (isIndexed) {
    report(!indexedTitles.has(page.seo.title), `duplicate indexed title "${page.seo.title}"`);
    report(
      !indexedDescriptions.has(page.seo.description),
      `duplicate indexed description on page "${page.id}"`,
    );
    indexedTitles.add(page.seo.title);
    indexedDescriptions.add(page.seo.description);
  }

  forbiddenPlaceholderPatterns.forEach((pattern) => {
    report(!pattern.test(JSON.stringify(page.seo)), `page "${page.id}" contains placeholder SEO`);
  });

  (page.blocks ?? []).forEach((entry, index) =>
    collectRefs(entry, `page "${page.id}" block ${index + 1}`),
  );
}

report(pageIds.has("home") && slugs.has("/"), "a home page at / is required");
const notFound = pages.find((page) => page.id === "not-found");
report(Boolean(notFound), "a not-found page is required");
report(notFound?.seo?.robots?.index === false, "not-found page must be noindex");

for (const [id, block] of Object.entries(blocks)) {
  report(block.id === id, `block key "${id}" does not match its id`);
  if (block.source?.collection) {
    report(
      Array.isArray(collections[block.source.collection]),
      `block "${id}" references missing collection "${block.source.collection}"`,
    );
  }
}

walkActions(blocks, "globalBlocks");
walkActions(collections, "collections");
walkActions(navigation, "navigation");

const mediaRefs = new Set();
const collectMediaRefs = (value) => {
  if (Array.isArray(value)) return value.forEach(collectMediaRefs);
  if (!value || typeof value !== "object") return;
  if (typeof value.media === "string") mediaRefs.add(value.media);
  if (Array.isArray(value.media)) value.media.forEach((ref) => mediaRefs.add(ref));
  Object.values(value).forEach(collectMediaRefs);
};
collectMediaRefs(blocks);
collectMediaRefs(collections);
for (const project of collections.projects ?? []) {
  for (const ref of project.gallery ?? []) mediaRefs.add(ref);
  report(project.slug?.trim(), `project "${project.id}" needs a slug`);
  report(project.href === `/projets/${project.slug}`, `project "${project.id}" has an invalid detail href`);
  report(project.summary?.trim(), `project "${project.id}" needs a summary`);
  report(Array.isArray(project.description) && project.description.length, `project "${project.id}" needs a description`);
  report(Array.isArray(project.facts) && project.facts.length, `project "${project.id}" needs facts`);
  report(Array.isArray(project.gallery) && project.gallery.length, `project "${project.id}" needs a gallery`);
  auditSeo(project.seo, `project "${project.id}"`);

  const isIndexed = project.seo?.robots?.index !== false;
  if (isIndexed) {
    report(
      !indexedTitles.has(project.seo.title),
      `duplicate indexed title "${project.seo.title}"`,
    );
    report(
      !indexedDescriptions.has(project.seo.description),
      `duplicate indexed description on project "${project.id}"`,
    );
    indexedTitles.add(project.seo.title);
    indexedDescriptions.add(project.seo.description);
  }
}

for (const article of collections.journal ?? []) {
  report(article.id?.trim(), "journal article needs an id");
  report(
    article.href === `/journal/${article.id}`,
    `journal article "${article.id}" has an invalid detail href`,
  );
  report(
    pages.some((page) => page.slug === article.href),
    `journal article "${article.id}" links to a missing page`,
  );
}

for (const path of requiredPublicFiles) {
  try {
    await access(resolve(root, "public", path));
  } catch {
    errors.push(`required public file is missing "/${path}"`);
  }
}

for (const image of seoImages) {
  if (!image.startsWith("/")) continue;
  try {
    await access(resolve(root, "public", image.slice(1)));
  } catch {
    errors.push(`SEO image points to missing file "${image}"`);
  }
}

for (const ref of mediaRefs) {
  report(Boolean(media[ref]), `missing media record "${ref}"`);
}

for (const [id, item] of Object.entries(media)) {
  report(item.id === id, `media key "${id}" does not match its id`);
  report(item.alt?.trim(), `media "${id}" needs alternative text`);
  if (item.src?.startsWith("/")) {
    try {
      await access(resolve(root, "public", item.src.slice(1)));
    } catch {
      errors.push(`media "${id}" points to missing file "${item.src}"`);
    }
  }
}

if (errors.length) {
  console.error("\nContent audit failed:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(
    `Content audit passed: ${pages.length} pages, ${Object.keys(blocks).length} blocks, ${Object.keys(media).length} media records.`,
  );
}

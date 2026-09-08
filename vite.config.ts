import { fileURLToPath, URL } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";

import muxTokenHandler from "./netlify/functions/mux-token.mjs";
import collectionsData from "./src/data/collections.json";
import globalBlocksData from "./src/data/globalBlocks.json";
import { blockRegistrySchema, collectionsSchema } from "./src/data/schemas";
import siteData from "./src/data/site.json";

function validateStaticData() {
  collectionsSchema.parse(collectionsData);
  blockRegistrySchema.parse(globalBlocksData);
}

const escapeHtml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const areaTypeMap: Record<string, string> = {
  city: "City",
  region: "AdministrativeArea",
  country: "Country",
  place: "Place",
};

function muxTokenDevPlugin(): Plugin {
  return {
    name: "chow-mux-token-dev",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/.netlify/functions/mux-token", async (req, res) => {
        try {
          const origin = `http://${req.headers.host ?? "localhost"}`;
          const request = new Request(new URL(req.url ?? "", origin), {
            method: req.method,
          });
          const response = await muxTokenHandler(request);

          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(await response.text());
        } catch (error) {
          console.error("Unable to serve local Mux token", error);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ error: "Video unavailable" }));
        }
      });
    },
  };
}

function seoIndexPlugin(): Plugin {
  const site = siteData.site;
  const seo = site.seo;
  const siteUrl = site.url.replace(/\/$/, "");
  const imageUrl = new URL(seo.defaultImage, `${siteUrl}/`).toString();
  const businessId = `${siteUrl}/#business`;
  const creatorId = `${siteUrl}/#creator`;

  const sameAs = Object.values(site.socials)
    .filter((social) => social.enabled && /^https?:\/\//.test(social.href))
    .map((social) => social.href);

  const areaServed = (seo.areaServed ?? [])
    .filter((area) => area.name)
    .map((area) => ({
      "@type": areaTypeMap[area.kind] ?? "Place",
      name: area.name,
    }));

  const services = (seo.services ?? []).filter((service) => service.name);

  const creator = site.credits?.name
    ? {
        "@type": "Person",
        "@id": creatorId,
        name: site.credits.name,
        ...(sameAs.length ? { sameAs } : {}),
        worksFor: { "@id": businessId },
      }
    : undefined;

  const business = {
    "@type": seo.organizationType,
    "@id": businessId,
    name: site.name,
    url: siteUrl,
    description: seo.defaultDescription,
    ...(site.contact.email ? { email: site.contact.email } : {}),
    ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
    image: imageUrl,
    ...(sameAs.length ? { sameAs } : {}),
    ...(creator ? { founder: { "@id": creatorId } } : {}),
    ...(site.contact.address.city || site.contact.address.country
      ? {
          address: {
            "@type": "PostalAddress",
            ...(site.contact.address.street
              ? { streetAddress: site.contact.address.street }
              : {}),
            ...(site.contact.address.postalCode
              ? { postalCode: site.contact.address.postalCode }
              : {}),
            ...(site.contact.address.city
              ? { addressLocality: site.contact.address.city }
              : {}),
            ...(site.contact.address.country
              ? { addressCountry: site.contact.address.country }
              : {}),
          },
        }
      : {}),
    ...(areaServed.length ? { areaServed } : {}),
    ...(seo.knowsAbout?.length ? { knowsAbout: seo.knowsAbout } : {}),
    ...(services.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: seo.offerCatalogName,
            itemListElement: services.map((service) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: service.name,
                ...(service.description ? { description: service.description } : {}),
                provider: { "@id": businessId },
              },
            })),
          },
        }
      : {}),
  };

  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      ...(creator ? [creator] : []),
      business,
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: site.name,
        description: seo.defaultDescription,
        inLanguage: site.defaultLocale,
        publisher: { "@id": businessId },
        ...(creator ? { creator: { "@id": creatorId } } : {}),
      },
    ],
  }).replaceAll("<", "\\u003c");

  const replacements: Record<string, string> = {
    __SITE_LANG__: site.defaultLocale,
    __THEME_COLOR__: seo.themeColor,
    __SEO_DESCRIPTION__: seo.defaultDescription,
    __SITE_URL__: siteUrl,
    __SITE_NAME__: site.name,
    __OG_LOCALE__: site.defaultLocale.replace("-", "_"),
    __SEO_TITLE__: seo.defaultTitle,
    __SEO_IMAGE__: imageUrl,
    __SEO_IMAGE_ALT__: seo.imageAlt,
    __TWITTER_CARD__: seo.twitterCard,
  };

  return {
    name: "chow-seo-index",
    transformIndexHtml(html) {
      const withMetadata = Object.entries(replacements).reduce(
        (result, [token, value]) => result.replaceAll(token, escapeHtml(value)),
        html,
      );
      return withMetadata.replace("__STRUCTURED_DATA__", structuredData);
    },
  };
}

export default defineConfig(({ mode }) => {
  validateStaticData();

  if (mode === "development") {
    Object.assign(process.env, loadEnv(mode, process.cwd(), "MUX_"));
  }

  return {
    plugins: [seoIndexPlugin(), muxTokenDevPlugin(), react()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      target: "es2022",
      cssCodeSplit: true,
      sourcemap: false,
    },
  };
});

import { useEffect } from "react";

import siteData from "@/data/site.json";
import type { PageSeo } from "@/types/content";

const ensureMeta = (selector: string, attribute: "name" | "property", key: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.append(element);
  }
  return element;
};

const ensureCanonical = () => {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.append(element);
  }
  return element;
};

const absoluteUrl = (value: string) => new URL(value, siteData.site.url).toString();

export function Seo({ seo, slug }: { seo?: PageSeo; slug: string }) {
  useEffect(() => {
    const defaults = siteData.site.seo;
    const title = seo?.title ?? defaults.defaultTitle;
    const description = seo?.description ?? defaults.defaultDescription;
    const canonical = seo?.canonical ?? absoluteUrl(slug === "/" ? "/" : slug);
    const image = absoluteUrl(seo?.image ?? defaults.defaultImage);
    const robots = `${seo?.robots?.index === false ? "noindex" : "index"},${seo?.robots?.follow === false ? "nofollow" : "follow"}`;

    document.documentElement.lang = siteData.site.defaultLocale;
    document.title = title;

    ensureMeta('meta[name="description"]', "name", "description").content = description;
    ensureMeta('meta[name="robots"]', "name", "robots").content = robots;
    ensureMeta('meta[property="og:title"]', "property", "og:title").content = title;
    ensureMeta('meta[property="og:description"]', "property", "og:description").content = description;
    ensureMeta('meta[property="og:url"]', "property", "og:url").content = canonical;
    ensureMeta('meta[property="og:image"]', "property", "og:image").content = image;
    ensureMeta('meta[property="og:image:alt"]', "property", "og:image:alt").content = defaults.imageAlt;
    ensureMeta('meta[name="twitter:title"]', "name", "twitter:title").content = title;
    ensureMeta('meta[name="twitter:description"]', "name", "twitter:description").content = description;
    ensureMeta('meta[name="twitter:image"]', "name", "twitter:image").content = image;
    ensureCanonical().href = canonical;
  }, [seo, slug]);

  return null;
}

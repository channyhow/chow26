import { useEffect } from "react";

import mediaData from "@/data/media.json";
import siteData from "@/data/site.json";
import type { PageSeo } from "@/types/content";
import type { MediaItem } from "@/types/media";

const SOCIAL_WIDTH = 1200;
const SOCIAL_HEIGHT = 630;
const media = mediaData as Record<string, MediaItem>;

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

const socialPosition = (item: MediaItem) => {
  const point = item.focalPoint;
  if (!point) return "center";
  if (point.y <= 35) return "top";
  if (point.y >= 65) return "bottom";
  if (point.x <= 35) return "left";
  if (point.x >= 65) return "right";
  return "center";
};

const resolveSocialImage = (ref: string) => {
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

  return { url: absoluteUrl(`/.netlify/images?${params.toString()}`), alt: item.alt };
};

export function Seo({ seo, slug }: { seo?: PageSeo; slug: string }) {
  useEffect(() => {
    const defaults = siteData.site.seo;
    const title = seo?.title ?? defaults.title;
    const description = seo?.description ?? defaults.description;
    const canonical = seo?.canonical ?? absoluteUrl(slug === "/" ? "/" : slug);
    const imageRef = seo?.image ?? defaults.image;
    const socialImage = resolveSocialImage(imageRef);
    const defaultMedia = media[defaults.image];
    const defaultImageSrc = defaultMedia?.type === "image" ? defaultMedia.src : undefined;
    const image = socialImage?.url ?? absoluteUrl(defaultImageSrc ?? "/");
    const imageAlt = seo?.imageAlt ?? socialImage?.alt ?? defaults.imageAlt;
    const robots = `${seo?.robots?.index === false ? "noindex" : "index"},${seo?.robots?.follow === false ? "nofollow" : "follow"}`;

    document.documentElement.lang = siteData.site.defaultLocale;
    document.title = title;

    ensureMeta('meta[name="description"]', "name", "description").content = description;
    ensureMeta('meta[name="robots"]', "name", "robots").content = robots;
    ensureMeta('meta[property="og:title"]', "property", "og:title").content = title;
    ensureMeta('meta[property="og:description"]', "property", "og:description").content = description;
    ensureMeta('meta[property="og:url"]', "property", "og:url").content = canonical;
    ensureMeta('meta[property="og:image"]', "property", "og:image").content = image;
    ensureMeta('meta[property="og:image:secure_url"]', "property", "og:image:secure_url").content = image;
    ensureMeta('meta[property="og:image:alt"]', "property", "og:image:alt").content = imageAlt;

    document.head.querySelector('meta[property="og:image:width"]')?.remove();
    document.head.querySelector('meta[property="og:image:height"]')?.remove();
    document.head.querySelector('meta[property="og:image:type"]')?.remove();

    ensureMeta('meta[name="twitter:title"]', "name", "twitter:title").content = title;
    ensureMeta('meta[name="twitter:description"]', "name", "twitter:description").content = description;
    ensureMeta('meta[name="twitter:image"]', "name", "twitter:image").content = image;
    ensureMeta('meta[name="twitter:image:alt"]', "name", "twitter:image:alt").content = imageAlt;
    ensureCanonical().href = canonical;
  }, [seo, slug]);

  return null;
}

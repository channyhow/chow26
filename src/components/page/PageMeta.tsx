import { useEffect } from "react";

import type { PageSeo } from "@/types/content";

function upsertMeta(name: string, content?: string) {
  const selector = `meta[name="${name}"]`;
  const existing = document.head.querySelector<HTMLMetaElement>(selector);

  if (!content) {
    existing?.remove();
    return;
  }

  const node = existing ?? document.createElement("meta");
  node.setAttribute("name", name);
  node.setAttribute("content", content);
  if (!existing) document.head.append(node);
}

function upsertCanonical(href?: string) {
  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!href) {
    existing?.remove();
    return;
  }

  const node = existing ?? document.createElement("link");
  node.setAttribute("rel", "canonical");
  node.setAttribute("href", href);
  if (!existing) document.head.append(node);
}

export function PageMeta({ seo }: { seo?: PageSeo }) {
  useEffect(() => {
    if (!seo) return;

    document.title = seo.title;
    upsertMeta("description", seo.description);
    upsertCanonical(seo.canonical);

    const robots = seo.robots
      ? `${seo.robots.index === false ? "noindex" : "index"},${seo.robots.follow === false ? "nofollow" : "follow"}`
      : undefined;

    upsertMeta("robots", robots);
  }, [seo]);

  return null;
}

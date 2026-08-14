import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageMeta } from "@/components/page/PageMeta";
import { Section } from "@/components/section/Section";
import { SectionGroup } from "@/components/groups/SectionGroup";
import siteData from "@/data/site.json";
import { resolveBlock } from "@/data/resolve";
import type { PageBlock, PageData, SectionBlock } from "@/types/content";

export type PageRendererProps = {
  page: PageData;
};

const studioServiceMeta: Record<string, { label: string; value: string }[]> = {
  "studio-service-create": [
    { label: "Identité", value: "Logo · Branding · Identité visuelle" },
    { label: "Outils & intégrations", value: "Formulaires · Calendly · Newsletter" },
    { label: "Budget", value: "À partir de 1 200 € HT" },
  ],
  "studio-service-clarify": [
    { label: "Diagnostic", value: "Audit · UX/UI · Architecture de contenu" },
    { label: "Optimisation", value: "SEO · Analytics · Accessibilité" },
    { label: "Budget", value: "À partir de 800 € HT" },
  ],
  "studio-service-evolve": [
    { label: "Conversion", value: "Réservation · Cartographie · Paiement" },
    { label: "Automatisation", value: "Tally · Notion · Make" },
    { label: "Budget", value: "Sur devis" },
  ],
};

const footerLinks = [
  { label: "Accueil", href: "/", intent: "navigate" },
  { label: "Projets", href: "/projets", intent: "navigate" },
  { label: "Studio", href: "/studio", intent: "navigate" },
  {
    label: "Parler d’un projet",
    href: "/contact",
    intent: "contact",
    variant: "cta",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/hellochowstudio/",
    intent: "navigate",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/channyhow",
    intent: "navigate",
  },
  {
    label: "Confidentialité",
    href: "/confidentialite",
    intent: "navigate",
  },
  {
    label: "Mentions légales",
    href: "/mentions-legales",
    intent: "navigate",
  },
] as const;

function prepareSection(entry: SectionBlock): SectionBlock {
  if (entry.id === "studio-founders") {
    return {
      ...entry,
      color: "special",
    };
  }

  if (entry.id === "studio-services") {
    return {
      ...entry,
      layout: "content-switcher",
      content: {
        ...entry.content,
        items: entry.content?.items?.map((item) => ({
          ...item,
          meta: studioServiceMeta[item.id ?? ""] ?? item.meta,
        })),
      },
    };
  }

  if (entry.id === "site-footer") {
    return {
      ...entry,
      content: {
        ...entry.content,
        header: {
          ...entry.content?.header,
          links: [...footerLinks],
        },
      },
    };
  }

  return entry;
}

function renderEntry(entry: PageBlock) {
  if ("ref" in entry) {
    const block = resolveBlock(entry.ref);
    return block ? <Section key={entry.ref} block={prepareSection(block)} /> : null;
  }

  if (entry.type === "Section") {
    const block = prepareSection(entry as SectionBlock);
    return <Section key={entry.id} block={block} />;
  }

  if (entry.type === "Group") {
    return <SectionGroup key={entry.id} group={entry} />;
  }

  return null;
}

function renderFooter(entry: PageBlock) {
  if (!("ref" in entry)) return null;
  const block = resolveBlock(entry.ref);
  if (!block) return null;
  return <SiteFooter key={entry.ref} block={prepareSection(block)} />;
}

export function PageRenderer({ page }: PageRendererProps) {
  const isNotFoundPage = page.id === "not-found" || page.slug === "/404";
  const footerReveal = Boolean(siteData.ui.experience.footerReveal) && !isNotFoundPage;
  const footerEntries = page.blocks.filter(
    (entry) => "ref" in entry && entry.ref === "site-footer",
  );
  const contentEntries = page.blocks.filter(
    (entry) => !("ref" in entry && entry.ref === "site-footer"),
  );

  return (
    <>
      <PageMeta seo={page.seo} />
      <div
        className="page"
        data-page-id={page.id}
        data-variant={page.variant}
        data-footer-reveal={footerReveal && footerEntries.length ? "true" : "false"}
      >
        <div className="page__content">
          {contentEntries.map(renderEntry)}
        </div>
        {footerEntries.length ? (
          <footer className="page__footer">
            {footerEntries.map(renderFooter)}
          </footer>
        ) : null}
      </div>
    </>
  );
}

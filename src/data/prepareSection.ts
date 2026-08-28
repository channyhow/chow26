import type { SectionBlock } from "@/types/content";

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

export function prepareSection(entry: SectionBlock): SectionBlock {
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

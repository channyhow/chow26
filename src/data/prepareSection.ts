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

const sectionMotionDefaults: Record<
  string,
  Pick<SectionBlock, "motion" | "motionPreset">
> = {
  "home-opening": { motion: "scene", motionPreset: "parallax" },
  "projects-featured": { motion: "scene", motionPreset: "ambient" },
  "project-gallery": { motion: "scene", motionPreset: "ambient" },
  "home-services": { motion: "scene", motionPreset: "ambient" },
  "approach-default": { motion: "scene", motionPreset: "draw" },
  "studio-founders": { motion: "scene", motionPreset: "parallax" },
  "final-cta": { motion: "scene", motionPreset: "ambient" },
};

const footerLinks = [
  { label: "Accueil", href: "/", intent: "navigate" },
  { label: "Projets", href: "/projets", intent: "navigate" },
  { label: "Studio", href: "/studio", intent: "navigate" },
  {
    label: "Contact",
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
    label: "CGV",
    href: "/cgv",
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
  const prepared: SectionBlock = {
    ...(sectionMotionDefaults[entry.id] ?? {}),
    ...entry,
  };

  if (prepared.id === "home-services") {
    return {
      ...prepared,
      content: {
        ...prepared.content,
        header: {
          ...prepared.content?.header,
          links: prepared.content?.header?.links?.map((link) => ({
            ...link,
            label: "Voir les services",
            href: "/studio",
            intent: "navigate",
          })),
        },
      },
    };
  }

  if (prepared.id === "studio-services") {
    return {
      ...prepared,
      layout: "content-switcher",
      motion: prepared.motion ?? "scene",
      motionPreset: prepared.motionPreset ?? "ambient",
      content: {
        ...prepared.content,
        items: prepared.content?.items?.map((item) => ({
          ...item,
          meta: studioServiceMeta[item.id ?? ""] ?? item.meta,
        })),
      },
    };
  }

  if (prepared.id === "studio-approach") {
    return {
      ...prepared,
      motion: prepared.motion ?? "scene",
      motionPreset: prepared.motionPreset ?? "draw",
    };
  }

  if (prepared.id === "site-footer") {
    return {
      ...prepared,
      content: {
        ...prepared.content,
        header: {
          ...prepared.content?.header,
          links: [...footerLinks],
        },
      },
    };
  }

  return prepared;
}

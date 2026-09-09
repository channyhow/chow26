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
  "approach-default": { motion: "scene", motionPreset: "ambient" },
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
  { label: "CGV", href: "/cgv", intent: "navigate" },
  { label: "Confidentialité", href: "/confidentialite", intent: "navigate" },
  { label: "Mentions légales", href: "/mentions-legales", intent: "navigate" },
] as const;

const legalNoticeContent = {
  header: {
    title: "Mentions légales",
    text: [
      "Informations relatives à l’éditeur, à l’hébergement et aux droits applicables au site Chow Studio.",
    ],
  },
  items: [
    {
      title: "Éditeur du site",
      text: [
        "Channy How-Choong, entrepreneure individuelle exerçant sous le nom commercial Chow Studio.",
        "SIREN : 913 912 143 · SIRET : 913 912 143 00017 · Code APE : 70.21Z — Conseil en relations publiques et communication.",
        "Contact : channyhow@gmail.com · +33 7 88 48 40 06.",
      ],
    },
    {
      title: "Direction de la publication",
      text: ["Directrice de la publication : Channy How-Choong."],
    },
    {
      title: "Design & développement",
      text: [
        "Direction visuelle, UX/UI design et développement frontend : Channy How-Choong · Chow Studio.",
      ],
    },
    {
      title: "Hébergement",
      text: [
        "Le site est hébergé par Netlify, Inc., 101 2nd Street, San Francisco, CA 94105, États-Unis.",
      ],
    },
    {
      title: "Propriété intellectuelle",
      text: [
        "Sauf mention contraire, les textes, créations graphiques, interfaces et autres éléments originaux présentés sur ce site sont protégés par le droit de la propriété intellectuelle. Toute reproduction, adaptation ou diffusion non autorisée est interdite.",
        "Les marques, photographies, contenus et créations appartenant à des clients ou à des tiers restent la propriété de leurs titulaires respectifs et sont présentés uniquement dans le cadre de la documentation des projets concernés.",
      ],
    },
    {
      title: "Données personnelles",
      text: [
        "Les informations relatives au traitement des données personnelles, aux formulaires et aux droits des personnes sont détaillées dans la page Confidentialité & données personnelles.",
      ],
    },
  ],
};

export function prepareSection(entry: SectionBlock): SectionBlock {
  const prepared: SectionBlock = {
    ...(sectionMotionDefaults[entry.id] ?? {}),
    ...entry,
  };

  // Home is deliberately a sparse preview of the richer detail pages. Keep the
  // canonical blocks intact in data; only their homepage presentation is reduced.
  if (prepared.id === "home-opening") {
    return {
      ...prepared,
      content: {
        ...prepared.content,
        header: {
          title: "Sites, identités & expériences digitales.",
          text: ["Design et développement frontend entre Paris et la Réunion."],
        },
      },
    };
  }

  if (prepared.id === "projects-featured") {
    return {
      ...prepared,
      content: {
        ...prepared.content,
        header: undefined,
      },
    };
  }

  if (prepared.id === "approach-default") {
    return {
      ...prepared,
      content: {
        ...prepared.content,
        items: prepared.content?.items?.map((item, index) =>
          index === 0
            ? {
                ...item,
                text: [
                  "Chaque projet commence par comprendre ce qui doit réellement fonctionner : le public, les objectifs, les contenus, les contraintes et ce qui freine aujourd’hui. À partir de là, je structure le parcours, construis une direction visuelle cohérente puis la traduis en une interface responsive, accessible et performante. Design et développement avancent ensemble pour éviter les écarts entre l’idée et ce qui est réellement livré.",
                ],
              }
            : item,
        ),
      },
    };
  }

  if (prepared.id === "home-services") {
    return {
      ...prepared,
      layout: "statement",
      className: [prepared.className, "home-preview", "home-preview--services"].filter(Boolean).join(" "),
      content: {
        header: {
          title: "Créer, clarifier ou faire évoluer une présence.",
          text: ["Identité, site web et développement frontend selon ce dont le projet a réellement besoin."],
          links: [
            {
              label: "Voir les accompagnements",
              href: "/studio",
              intent: "navigate",
              priority: "secondary",
              variant: "cta",
            },
          ],
        },
      },
    };
  }

  if (prepared.id === "final-cta") {
    return {
      ...prepared,
      className: [prepared.className, "home-preview", "home-preview--contact"].filter(Boolean).join(" "),
      content: {
        ...prepared.content,
        header: {
          title: "Vous avez un projet en tête ?",
          links: [
            {
              label: "Parlons-en",
              href: "/contact",
              intent: "contact",
              priority: "primary",
              variant: "cta",
            },
          ],
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

  if (prepared.id === "legal-notice-default") {
    return {
      ...prepared,
      content: legalNoticeContent,
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

import type { FormSchema } from "@/types/forms";

export type StyleVariant = "classic" | "editorial" | "organic";
export type Tone = "default" | "inverse" | "accent";
export type SectionColor =
  | "primary"
  | "secondary"
  | "special"
  | "accent";
export type SectionSurface = "solid" | "glass" | "transparent";
export type MotionLevel = "none" | "reveal" | "scene";
export type CardEffect = "none" | "glass" | "grain";

export type CardAppearance = {
  frame?: boolean;
  effect?: CardEffect;
};
export type SectionLayout =
  | "text"
  | "statement"
  | "split"
  | "grid"
  | "list"
  | "gallery"
  | "carousel"
  | "media"
  | "media-overlay"
  | "timeline"
  | "horizontal-scroll"
  | "content-switcher";
export type GroupLayout = "flow" | "scroll-panel" | "sticky" | "overlap";
export type PanelMode = "scene" | "stack";
export type PanelSize = "sm" | "md" | "lg" | "full";
export type PanelAlign = "left" | "center" | "right";
export type PanelSurface = SectionSurface;
export type PanelBehavior = "fixed" | "moving" | "stack";

export type ActionIntent =
  | "navigate"
  | "contact"
  | "call"
  | "directions"
  | "book"
  | "buy"
  | "subscribe"
  | "download"
  | "share"
  | "submit";

export type ActionVariant = "primary" | "outline" | "arrow" | "cta";

export type Action = {
  label: string;
  href?: string;
  linkKey?: string;
  variant?: ActionVariant;
  priority?: "primary" | "secondary";
  intent?: ActionIntent;
};

export type MetaItem = {
  label: string;
  value?: string;
  href?: string;
};

export type MediaRef = string;

export type ContentItem = {
  id?: string;
  eyebrow?: string | string[];
  title?: string;
  subtitle?: string | string[];
  text?: string | string[];
  media?: MediaRef | MediaRef[];
  links?: Action[];
  meta?: MetaItem[];
  tags?: string[];
  category?: string;
  group?: string;
  featured?: boolean;
  enabled?: boolean;
  order?: number;
  href?: string;
};

export type ProjectRecord = ContentItem & {
  id: string;
  slug: string;
  href: string;
  title: string;
  summary: string;
  description: string[];
  facts: MetaItem[];
  gallery: MediaRef[];
  seo: PageSeo;
};

export type SourceRef = {
  collection: string;
  query?: {
    featured?: boolean;
    category?: string;
    group?: string;
    enabled?: boolean;
    limit?: number;
  };
};

export type SectionContent = {
  header?: ContentItem;
  items?: ContentItem[];
  media?: MediaRef | MediaRef[];
  links?: Action[];
  form?: string | FormSchema;
};

export type SectionBlock = {
  id: string;
  type: "Section";
  variant?: StyleVariant;
  tone?: Tone;
  surface?: SectionSurface;
  color?: SectionColor;
  layout?: SectionLayout;
  source?: SourceRef;
  content?: SectionContent;
  frame?: boolean;
  itemAppearance?: CardAppearance;
  motion?: MotionLevel;
  className?: string;
};

export type BlockRef = {
  ref: string;
};

export type PanelLane = {
  id: string;
  behavior?: PanelBehavior;
  size?: PanelSize;
  align?: PanelAlign;
  surface?: PanelSurface;
  color?: SectionColor;
  blocks: BlockRef[];
};

export type SectionGroup = {
  id: string;
  type: "Group";
  layout?: GroupLayout;
  panel?: {
    mode?: PanelMode;
    size?: PanelSize;
    align?: PanelAlign;
    surface?: PanelSurface;
    color?: SectionColor;
  };
  panels?: PanelLane[];
  motion?: {
    level: MotionLevel;
    preset?:
      | "panel"
      | "media-reveal"
      | "sticky-story"
      | "horizontal-rail";
  };
  blocks?: BlockRef[];
};

export type PageBlock = SectionBlock | SectionGroup | BlockRef;

export type PageSeo = {
  title: string;
  description?: string;
  image?: MediaRef;
  canonical?: string;
  robots?: {
    index?: boolean;
    follow?: boolean;
  };
};

export type PageData = {
  id: string;
  slug: string;
  variant?: StyleVariant;
  seo?: PageSeo;
  blocks: PageBlock[];
};

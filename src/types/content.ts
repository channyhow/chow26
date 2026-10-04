import type { FormSchema } from "@/types/forms";

export type StyleVariant = "classic" | "editorial" | "organic";
export type Tone = "default" | "inverse" | "accent";
export type SectionColor = "primary" | "secondary" | "special" | "accent";
export type SectionSurface = "solid" | "glass" | "transparent";
export type MotionLevel = "none" | "micro" | "reveal" | "scene";
export type ScrollMotionPreset = "drift" | "parallax" | "ambient" | "draw" | "recede";
export type ScrollMotionRange = "through" | "exit";
export type MotionIntensity = "quiet" | "default" | "expressive";
export type CardEffect = "none" | "glass" | "grain";
export type CardVariant = "default" | "service" | "editorial" | "profile";
export type SplitVariant = "default" | "balanced" | "editorial" | "media-lead";
export type TimelineOrientation = "vertical" | "horizontal";
export type ProjectLayout = "a" | "b";

export type CardAppearance = { frame?: boolean; effect?: CardEffect; variant?: CardVariant };
export type SectionLayout = "text" | "statement" | "split" | "grid" | "list" | "gallery" | "carousel" | "media" | "media-overlay" | "timeline" | "horizontal-scroll" | "content-switcher";
export type GroupLayout = "flow" | "scroll-panel" | "sticky" | "overlap";
export type PanelSize = "sm" | "md" | "lg" | "full";
export type PanelFrame = "content" | "viewport";
export type PanelAlign = "left" | "center" | "right";
export type PanelSurface = SectionSurface;
export type PanelBehavior = "normal" | "overlay" | "sticky";

export type ActionIntent = "navigate" | "contact" | "call" | "directions" | "book" | "buy" | "subscribe" | "download" | "share" | "submit";
export type ActionVariant = "primary" | "accent" | "outline" | "arrow" | "cta";
export type ActionGroup = "primary" | "social" | "legal";
export type Action = { label: string; href?: string; linkKey?: string; variant?: ActionVariant; priority?: "primary" | "secondary"; intent?: ActionIntent; group?: ActionGroup; };
export type ActionRef = string | Action;
export type MetaItem = { label: string; value?: string; href?: string };
export type MediaRef = string;
export type GridTrackPlacement = { start?: number; span?: number; row?: number; rowSpan?: number; align?: "start" | "center" | "end" | "stretch"; justify?: "start" | "center" | "end" | "stretch" };
export type GridPlacement = { mobile?: GridTrackPlacement; tablet?: GridTrackPlacement; desktop?: GridTrackPlacement };

export type Seo = {
  title: string;
  description?: string;
  /** Media registry id. */
  image?: MediaRef;
  /** Optional contextual override; media.alt remains the source default. */
  imageAlt?: string;
  canonical?: string;
  robots?: { index?: boolean; follow?: boolean };
};

export type SiteSeo = Seo & {
  siteType: "website";
  organizationType: "ProfessionalService";
  twitterCard: "summary_large_image";
  themeColor: string;
  areaServed?: { kind: "city" | "region" | "country"; name: string }[];
  knowsAbout?: string[];
  offerCatalogName?: string;
  services?: { name: string; description: string }[];
  projectLocations?: string[];
};

export type PageSeo = Seo;

export type ContentItem = {
  id?: string; eyebrow?: string | string[]; title?: string; subtitle?: string | string[]; text?: string | string[]; media?: MediaRef | MediaRef[]; links?: ActionRef[]; meta?: MetaItem[]; tags?: string[]; category?: string; group?: string; href?: string; enabled?: boolean; featured?: boolean; order?: number; slug?: string; projectLayout?: ProjectLayout; grid?: GridPlacement; summary?: string; description?: string[]; facts?: MetaItem[]; gallery?: MediaRef[]; seo?: PageSeo; offers?: ContentItem[];
};

export type ProjectRecord = ContentItem & { id: string; title: string; text: string[]; media: MediaRef; href: string; slug: string; summary: string; description: string[]; facts: MetaItem[]; gallery?: MediaRef[]; links?: ActionRef[]; seo: PageSeo; projectLayout?: ProjectLayout; };
export type SectionHeader = { eyebrow?: string | string[]; title?: string; subtitle?: string | string[]; text?: string | string[]; links?: ActionRef[]; media?: MediaRef | MediaRef[]; meta?: MetaItem[]; };
export type SectionContent = { header?: SectionHeader; items?: ContentItem[]; media?: MediaRef | MediaRef[]; form?: string | FormSchema };
export type SourceQuery = { featured?: boolean; enabled?: boolean; category?: string; group?: string; limit?: number; excludeIds?: string[]; prioritizeIds?: string[] };
export type SourceRef = { collection: string; query?: SourceQuery };

export type SectionBlock = {
  id: string; type: "Section"; layout?: SectionLayout; variant?: StyleVariant; splitVariant?: SplitVariant; tone?: Tone; surface?: SectionSurface; color?: SectionColor; timelineOrientation?: TimelineOrientation; source?: SourceRef; content?: SectionContent; frame?: boolean; progressive?: boolean; itemAppearance?: CardAppearance; motion?: MotionLevel; motionPreset?: ScrollMotionPreset; motionRange?: ScrollMotionRange; motionIntensity?: MotionIntensity; className?: string;
};
export type BlockRef = { ref: string };
export type PanelBlock = BlockRef | SectionBlock;
export type PanelLane = { id: string; behavior?: PanelBehavior; frame?: PanelFrame; size?: PanelSize; align?: PanelAlign; surface?: PanelSurface; color?: SectionColor; blocks: PanelBlock[] };
export type SectionGroup = { id: string; type: "Group"; layout?: GroupLayout; panel?: { frame?: PanelFrame; size?: PanelSize; align?: PanelAlign; surface?: PanelSurface; color?: SectionColor }; panels?: PanelLane[]; motion?: { level: MotionLevel; preset?: "panel" | "media-reveal" | "sticky-story" | "horizontal-rail" }; blocks?: PanelBlock[] };
export type PageBlock = SectionBlock | SectionGroup | BlockRef;
export type PageData = { id: string; slug: string; variant?: StyleVariant; seo?: PageSeo; blocks: PageBlock[] };
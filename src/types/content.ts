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
export type TimelineOrientation = "vertical" | "horizontal";
export type ProjectLayout = "a" | "b";

export type CardAppearance = { frame?: boolean; effect?: CardEffect; variant?: CardVariant };
export type SectionLayout = "text" | "statement" | "split" | "grid" | "list" | "gallery" | "carousel" | "media" | "media-overlay" | "timeline" | "horizontal-scroll" | "content-switcher";
export type GroupLayout = "flow" | "scroll-panel" | "sticky" | "overlap";
export type PanelMode = "scene" | "stack";
export type PanelSize = "sm" | "md" | "lg" | "full";
export type PanelAlign = "left" | "center" | "right";
export type PanelSurface = SectionSurface;
export type PanelBehavior = "fixed" | "moving" | "stack" | "cover";

export type ActionIntent = "navigate" | "contact" | "call" | "directions" | "book" | "buy" | "subscribe" | "download" | "share" | "submit";
export type ActionVariant = "primary" | "outline" | "arrow" | "cta";
export type ActionGroup = "primary" | "social" | "legal";

export type Action = { label: string; href?: string; linkKey?: string; variant?: ActionVariant; priority?: "primary" | "secondary"; intent?: ActionIntent; group?: ActionGroup; };
export type ActionRef = string | Action;
export type MetaItem = { label: string; value?: string; href?: string };
export type MediaRef = string;
export type GridTrackPlacement = { start?: number; span?: number; row?: number; rowSpan?: number; align?: "start" | "center" | "end" | "stretch"; justify?: "start" | "center" | "end" | "stretch" };
export type GridPlacement = { mobile?: GridTrackPlacement; tablet?: GridTrackPlacement; desktop?: GridTrackPlacement };

export type ContentItem = {
  id?: string; eyebrow?: string | string[]; title?: string; subtitle?: string | string[]; text?: string | string[]; media?: MediaRef | MediaRef[]; links?: ActionRef[]; meta?: MetaItem[]; tags?: string[]; category?: string; group?: string; href?: string; enabled?: boolean; featured?: boolean; order?: number; slug?: string; projectLayout?: ProjectLayout; grid?: GridPlacement; summary?: string; description?: string[]; facts?: MetaItem[]; gallery?: MediaRef[]; seo?: PageSeo;
};

export type ProjectRecord = ContentItem & { id: string; title: string; text: string[]; media: MediaRef; href: string; slug: string; summary: string; description: string[]; facts: MetaItem[]; gallery?: MediaRef[]; links?: ActionRef[]; seo: PageSeo; projectLayout?: ProjectLayout; };
export type SectionHeader = { eyebrow?: string | string[]; title?: string; subtitle?: string | string[]; text?: string | string[]; links?: ActionRef[]; media?: MediaRef | MediaRef[]; meta?: MetaItem[]; };
export type SectionContent = { header?: SectionHeader; items?: ContentItem[]; media?: MediaRef | MediaRef[]; form?: string | FormSchema };
export type SourceQuery = { featured?: boolean; enabled?: boolean; category?: string; group?: string; limit?: number; excludeIds?: string[]; prioritizeIds?: string[] };
export type SourceRef = { collection: string; query?: SourceQuery };

export type SectionBlock = {
  id: string; type: "Section"; layout?: SectionLayout; variant?: StyleVariant; tone?: Tone; surface?: SectionSurface; color?: SectionColor; timelineOrientation?: TimelineOrientation; source?: SourceRef; content?: SectionContent; frame?: boolean; progressive?: boolean; itemAppearance?: CardAppearance; motion?: MotionLevel; motionPreset?: ScrollMotionPreset; motionRange?: ScrollMotionRange; motionIntensity?: MotionIntensity; className?: string;
};

export type PageSeo = { title: string; description: string; image?: string };
export type PageRecord = { id: string; slug: string; seo: PageSeo; blocks: Array<string | SectionBlock> };

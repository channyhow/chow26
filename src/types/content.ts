import type { FormSchema } from "@/types/forms";

export type StyleVariant = "classic" | "editorial" | "organic";
export type Tone = "default" | "inverse" | "accent";
export type SectionColor =
  | "primary"
  | "secondary"
  | "special"
  | "accent";
export type SectionSurface = "solid" | "glass" | "transparent";
export type MotionLevel = "none" | "micro" | "reveal" | "scene";
export type ScrollMotionPreset = "drift" | "parallax" | "ambient" | "draw" | "recede";
export type ScrollMotionRange = "through" | "exit";
export type MotionIntensity = "quiet" | "default" | "expressive";
export type CardEffect = "none" | "glass" | "grain";
export type TimelineOrientation = "vertical" | "horizontal";
export type ProjectLayout = "a" | "b";

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
export type PanelBehavior = "fixed" | "moving" | "stack" | "cover";

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
export type ActionGroup = "primary" | "social" | "legal";

export type Action = {
  label: string;
  href?: string;
  linkKey?: string;
  variant?: ActionVariant;
  priority?: "primary" | "secondary";
  intent?: ActionIntent;
  group?: ActionGroup;
};

export type MetaItem = {
  label: string;
  value?: string;
  href?: string;
};

export type MediaRef = string;

export type GridTrackPlacement = {
  start?: number;
  span?: number;
  row?: number;
  rowSpan?: number;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "stretch";
};

export type ContentItem = {
  id?: string;
  eyebrow?: string | string[];
  title?: string;
  subtitle?: string;
  text?: string[];
  links?: Action[];
  meta?: MetaItem[];
  media?: MediaRef | MediaRef[];
  items?: ContentItem[];
  className?: string;
};

export type ContentSource = {
  collection: string;
  query?: Record<string, string | number | boolean>;
};

export type SectionContent = {
  header?: ContentItem;
  items?: ContentItem[];
  links?: Action[];
  media?: MediaRef | MediaRef[];
  form?: string | FormSchema;
};

export type SectionBlock = {
  id: string;
  type: "Section";
  layout?: SectionLayout;
  groupLayout?: GroupLayout;
  panelMode?: PanelMode;
  panelSize?: PanelSize;
  panelAlign?: PanelAlign;
  panelSurface?: PanelSurface;
  panelBehavior?: PanelBehavior;
  variant?: StyleVariant;
  tone?: Tone;
  color?: SectionColor;
  surface?: SectionSurface;
  motion?: MotionLevel;
  motionPreset?: ScrollMotionPreset;
  motionRange?: ScrollMotionRange;
  motionIntensity?: MotionIntensity;
  timelineOrientation?: TimelineOrientation;
  projectLayout?: ProjectLayout;
  className?: string;
  progressive?: boolean;
  source?: ContentSource;
  content?: SectionContent;
  itemAppearance?: CardAppearance;
};

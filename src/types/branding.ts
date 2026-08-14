import type { CardEffect, MotionLevel, SectionColor, StyleVariant, Tone } from "@/types/content";

export type MoodAxes = {
  editorial: number;
  organic: number;
  contrast: number;
  warmth: number;
  motion: number;
  density: number;
};

export type MoodReference = {
  label: string;
  value: string;
  image?: string;
};

export type ProjectMood = {
  axes: MoodAxes;
  typography?: string[];
  media?: string[];
  inspiration?: MoodReference[];
  colors?: string[];
  illustration?: string;
  words?: string[];
  film?: string;
  place?: string;
  music?: string;
  sound?: string;
  food?: string;
  material?: string;
  scent?: string;
};

export type BrandProfile = {
  variant: StyleVariant;
  tone: Tone;
  color: SectionColor;
  motion: MotionLevel;
  cardEffect: CardEffect;
  composition: "structured" | "editorial" | "organic";
  mediaTreatment: "clean" | "editorial" | "soft";
  spacing: "compact" | "balanced" | "spacious";
  storyLayout: "text" | "split";
  galleryLayout: "gallery" | "carousel";
};

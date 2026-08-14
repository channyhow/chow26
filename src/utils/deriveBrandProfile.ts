import type { BrandProfile, MoodAxes } from "@/types/branding";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function deriveBrandProfile(input: MoodAxes): BrandProfile {
  const axes = {
    editorial: clamp01(input.editorial),
    organic: clamp01(input.organic),
    contrast: clamp01(input.contrast),
    warmth: clamp01(input.warmth),
    motion: clamp01(input.motion),
    density: clamp01(input.density),
  };

  const variant = axes.organic >= 0.72
    ? "organic"
    : axes.editorial >= 0.62
      ? "editorial"
      : "classic";

  const tone = axes.contrast >= 0.82
    ? "inverse"
    : axes.warmth >= 0.82 && axes.contrast >= 0.58
      ? "accent"
      : "default";

  const color = tone === "inverse"
    ? "primary"
    : tone === "accent"
      ? "accent"
      : axes.warmth >= 0.68
        ? "special"
        : "secondary";

  const motion = axes.motion >= 0.72
    ? "scene"
    : axes.motion >= 0.28
      ? "reveal"
      : "none";

  const composition = axes.organic >= 0.72
    ? "organic"
    : axes.editorial >= 0.62
      ? "editorial"
      : "structured";

  const mediaTreatment = composition === "organic"
    ? "soft"
    : composition === "editorial"
      ? "editorial"
      : "clean";

  const spacing = axes.density >= 0.68
    ? "compact"
    : axes.density <= 0.34
      ? "spacious"
      : "balanced";

  const cardEffect = axes.organic >= 0.78 && axes.contrast < 0.72
    ? "glass"
    : axes.editorial >= 0.75 && axes.warmth >= 0.55
      ? "grain"
      : "none";

  const storyLayout = composition === "structured" || axes.density >= 0.66
    ? "text"
    : "split";

  const galleryLayout = axes.motion >= 0.75 && axes.editorial >= 0.55
    ? "carousel"
    : "gallery";

  return {
    variant,
    tone,
    color,
    motion,
    cardEffect,
    composition,
    mediaTreatment,
    spacing,
    storyLayout,
    galleryLayout,
  };
}

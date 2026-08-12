import mediaData from "@/data/media.json";
import type { MediaItem } from "@/types/media";

const registry = mediaData as Record<string, MediaItem>;

export function resolveMedia(ref?: string): MediaItem | null {
  if (!ref) return null;
  return registry[ref] ?? null;
}

export function resolveMediaList(refs?: string | string[]): MediaItem[] {
  if (!refs) return [];
  const keys = Array.isArray(refs) ? refs : [refs];
  return keys.map((key) => registry[key]).filter(Boolean);
}

import type { MediaItem } from "@/types/media";

export type MediaOrientation = "square" | "landscape" | "portrait";

export function getMediaOrientation(
  media?: Pick<MediaItem, "width" | "height">,
): MediaOrientation | undefined {
  if (!media?.width || !media?.height) return undefined;
  if (media.width === media.height) return "square";
  return media.width > media.height ? "landscape" : "portrait";
}

export function getMediaObjectPosition(media: MediaItem) {
  return media.focalPoint
    ? `${media.focalPoint.x}% ${media.focalPoint.y}%`
    : "50% 50%";
}

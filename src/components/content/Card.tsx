import clsx from "clsx";
import { Link } from "react-router-dom";

import { Media } from "@/components/content/Media";
import { TextBlock } from "@/components/content/TextBlock";
import { resolveMedia } from "@/data/resolveMedia";
import type { CardEffect, ContentItem } from "@/types/content";
import type { MediaItem } from "@/types/media";

export type CardProps = {
  item: ContentItem;
  frame?: boolean;
  effect?: CardEffect;
  className?: string;
};

const getMediaOrientation = (media?: MediaItem) => {
  if (!media?.width || !media?.height) return undefined;
  if (media.width === media.height) return "square";
  return media.width > media.height ? "landscape" : "portrait";
};

export function Card({
  item,
  frame = false,
  effect = "none",
  className,
}: CardProps) {
  const mediaRef = Array.isArray(item.media) ? item.media[0] : item.media;
  const media = resolveMedia(mediaRef);
  const isProject = Boolean(item.href?.startsWith("/projets/"));
  const mediaOrientation = getMediaOrientation(media);
  const visibleItem = isProject ? { ...item, eyebrow: undefined } : item;
  const cardClassName = clsx(
    "card",
    isProject && "projectCard",
    frame && "frame",
    effect === "glass" && "effectGlass",
    effect === "grain" && "effectGrain",
    className,
  );
  const content = (
    <>
      {media ? (
        <div
          className="card__mediaWrap"
          data-media-type={media.type}
          data-orientation={mediaOrientation}
        >
          <Media media={media} className="card__media" />
        </div>
      ) : null}
      <TextBlock content={visibleItem} titleAs="h3" className="card__body" />
    </>
  );

  if (item.href) {
    return (
      <Link
        className={cardClassName}
        to={item.href}
        aria-label={item.title ? `Consulter : ${item.title}` : "Consulter"}
      >
        {content}
      </Link>
    );
  }

  return <article className={cardClassName}>{content}</article>;
}

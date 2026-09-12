import clsx from "clsx";
import { Link } from "react-router-dom";

import { Media } from "@/components/content/Media";
import { TextBlock } from "@/components/content/TextBlock";
import { resolveMedia } from "@/data/resolveMedia";
import type { CardEffect, ContentItem } from "@/types/content";
import { getMediaOrientation } from "@/utils/media";

export type CardProps = {
  item: ContentItem;
  frame?: boolean;
  effect?: CardEffect;
  className?: string;
};

function getProjectMission(item: ContentItem) {
  if (!Array.isArray(item.text)) return undefined;

  const mission = item.text.find((line) =>
    line.trim().toLocaleLowerCase("fr").startsWith("mission :"),
  );

  return mission?.replace(/^\s*mission\s*:\s*/i, "");
}

export function Card({
  item,
  frame = false,
  effect = "none",
  className,
}: CardProps) {
  const mediaRef = Array.isArray(item.media) ? item.media[0] : item.media;
  const media = resolveMedia(mediaRef);
  const isProject = Boolean(item.href?.startsWith("/projets/"));
  const cardMedia = isProject && media?.type === "mux"
    ? { ...media, focalPoint: { x: 50, y: 50 } }
    : media;
  const mediaOrientation = getMediaOrientation(cardMedia ?? undefined);
  const projectMission = isProject ? getProjectMission(item) : undefined;
  const visibleItem = isProject
    ? {
        title: item.title,
        ...(projectMission ? { text: projectMission } : {}),
      }
    : item;
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
      {cardMedia ? (
        <div
          className="card__mediaWrap"
          data-media-type={cardMedia.type}
          data-orientation={mediaOrientation}
        >
          <Media media={cardMedia} className="card__media" />
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

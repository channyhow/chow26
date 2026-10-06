import clsx from "clsx";

import { Card } from "@/components/content/Card";
import { Media } from "@/components/content/Media";
import { TextBlock } from "@/components/content/TextBlock";
import { Split } from "@/components/layout/Split";
import { resolveMedia } from "@/data/resolveMedia";
import type { CardEffect, CardVariant, ContentItem } from "@/types/content";
import { getMediaOrientation } from "@/utils/media";

export type CardItemProps = {
  item: ContentItem;
  frame?: boolean;
  effect?: CardEffect;
  className?: string;
  variant?: CardVariant;
};

function getProjectMission(item: ContentItem) {
  if (!Array.isArray(item.text)) return undefined;

  const lines = item.text.flatMap((group) =>
    Array.isArray(group) ? group : [group],
  );
  const mission = lines.find((line) =>
    line.trim().toLocaleLowerCase("fr").startsWith("mission :"),
  );

  return mission?.replace(/^\s*mission\s*:\s*/i, "");
}

export function CardItem({
  item,
  frame = false,
  effect = "none",
  className,
  variant = "default",
}: CardItemProps) {
  const mediaRef = Array.isArray(item.media) ? item.media[0] : item.media;
  const media = resolveMedia(mediaRef);
  const isProject = Boolean(item.href?.startsWith("/projets/"));
  const isService = variant === "service";
  const ratio = variant === "profile" ? "square" : isService ? "landscape" : undefined;
  const projectMission = isProject ? getProjectMission(item) : undefined;
  const visibleItem = isProject
    ? { title: item.title, ...(projectMission ? { text: projectMission } : {}) }
    : item;

  const mediaNode = media ? (
    <div
      className="card__mediaWrap"
      data-media-type={media.type}
      data-orientation={getMediaOrientation(media)}
    >
      <Media media={media} className="card__media" ratio={ratio} />
    </div>
  ) : null;

  const bodyNode = (
    <TextBlock
      content={visibleItem}
      titleAs="h3"
      className="card__body"
      metaVariant={isService ? "rows" : "default"}
    />
  );

  return (
    <Card
      href={item.href}
      label={item.title}
      frame={frame}
      effect={effect}
      variant={variant}
      surface={item.surface}
      className={clsx(isProject && "projectCard", className)}
    >
      {isService && mediaNode ? (
        <Split
          primary={mediaNode}
          secondary={bodyNode}
          className="card__split"
          primaryColumn="1 / span 6"
          secondaryColumn="8 / span 4"
        />
      ) : (
        <>
          {mediaNode}
          {bodyNode}
        </>
      )}
    </Card>
  );
}

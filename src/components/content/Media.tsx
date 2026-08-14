import clsx from "clsx";
import type { MediaItem } from "@/types/media";

export type MediaProps = {
  media: MediaItem;
  className?: string;
  priority?: boolean;
  sizes?: string;
  autoPlay?: boolean;
};

export function Media({
  media,
  className,
  priority = false,
  sizes = "100vw",
  autoPlay = true,
}: MediaProps) {
  const position = media.focalPoint
    ? `${media.focalPoint.x}% ${media.focalPoint.y}%`
    : "50% 50%";

  if (media.type === "video") {
    return (
      <figure className={clsx("media", className)}>
        <div className="media__frame">
          <video
            className="media__asset"
            src={media.src}
            poster={media.poster}
            width={media.width}
            height={media.height}
            autoPlay={autoPlay}
            muted
            playsInline
            loop
            preload={priority ? "auto" : "metadata"}
            style={{ objectPosition: position }}
          />
        </div>

        {media.caption ? (
          <figcaption className="media__caption">
            {media.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  const srcSet = media.sources?.length
    ? media.sources
        .map((source) => `${source.src} ${source.width}w`)
        .join(", ")
    : undefined;

  return (
    <figure className={clsx("media", className)}>
      <div className="media__frame">
        <img
          className="media__asset"
          src={media.src}
          srcSet={srcSet}
          sizes={srcSet ? sizes : undefined}
          alt={media.alt ?? ""}
          width={media.width}
          height={media.height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          style={{ objectPosition: position }}
        />
      </div>

      {media.caption ? (
        <figcaption className="media__caption">
          {media.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
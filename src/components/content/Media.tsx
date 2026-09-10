import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import { useReducedMotion } from "motion/react";

import { MuxMedia } from "@/components/content/MuxMedia";
import type { MediaFit, MediaItem } from "@/types/media";
import { getMediaObjectPosition, getMediaOrientation } from "@/utils/media";

export type MediaProps = {
  media: MediaItem;
  className?: string;
  priority?: boolean;
  sizes?: string;
  autoPlay?: boolean;
  fit?: MediaFit;
};

export function Media({
  media,
  className,
  priority = false,
  sizes = "100vw",
  autoPlay = true,
  fit,
}: MediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const position = getMediaObjectPosition(media);
  const resolvedFit = fit ?? media.fit ?? "cover";
  const mediaStyle = media.width && media.height
    ? ({ "--media-ratio": `${media.width} / ${media.height}` } as CSSProperties)
    : undefined;

  useEffect(() => {
    const video = videoRef.current;

    if (!video || media.type !== "video" || !autoPlay || reduceMotion) {
      video?.pause();
      return;
    }

    const play = () => {
      void video.play().catch(() => undefined);
    };

    if (priority || typeof IntersectionObserver === "undefined") {
      play();
      return () => video.pause();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) play();
        else video.pause();
      },
      { rootMargin: "200px 0px", threshold: 0.1 },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [autoPlay, media.type, priority, reduceMotion]);

  let asset: ReactNode;

  if (media.type === "mux") {
    asset = (
      <MuxMedia
        className="media__asset"
        mediaKey={media.id}
        alt={media.alt ?? ""}
        priority={priority}
        autoPlay={autoPlay}
        fit={resolvedFit}
        position={position}
      />
    );
  } else if (media.type === "video") {
    asset = (
      <video
        ref={videoRef}
        className="media__asset"
        src={media.src}
        poster={media.poster}
        width={media.width}
        height={media.height}
        muted
        playsInline
        loop
        preload={priority ? "metadata" : "none"}
        style={{ objectFit: resolvedFit, objectPosition: position }}
      />
    );
  } else {
    const srcSet = media.sources?.length
      ? media.sources
          .map((source) => `${source.src} ${source.width}w`)
          .join(", ")
      : undefined;

    asset = (
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
        style={{ objectFit: resolvedFit, objectPosition: position }}
      />
    );
  }

  return (
    <figure
      className={clsx("media", className)}
      data-media-type={media.type}
      data-orientation={getMediaOrientation(media)}
      style={mediaStyle}
    >
      <div className="media__frame">{asset}</div>

      {media.caption ? (
        <figcaption className="media__caption">
          {media.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

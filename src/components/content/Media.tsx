import { useEffect, useRef } from "react";
import clsx from "clsx";
import { useReducedMotion } from "motion/react";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const position = media.focalPoint
    ? `${media.focalPoint.x}% ${media.focalPoint.y}%`
    : "50% 50%";

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

  if (media.type === "video") {
    return (
      <figure className={clsx("media", className)}>
        <div className="media__frame">
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

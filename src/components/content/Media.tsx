import { useEffect, useRef, type CSSProperties } from "react";
import clsx from "clsx";
import { useReducedMotion } from "motion/react";

import { MuxMedia } from "@/components/content/MuxMedia";
import type { MediaItem } from "@/types/media";

export type MediaProps = {
  media: MediaItem;
  className?: string;
  priority?: boolean;
  sizes?: string;
  autoPlay?: boolean;
};

const getMediaOrientation = (media: MediaItem) => {
  if (media.width === media.height) return "square";
  return media.width > media.height ? "landscape" : "portrait";
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
  const mediaStyle = {
    "--media-ratio": `${media.width} / ${media.height}`,
  } as CSSProperties;

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

  if (media.type === "mux") {
    return (
      <figure
        className={clsx("media", className)}
        data-media-type={media.type}
        data-orientation={getMediaOrientation(media)}
        style={mediaStyle}
      >
        <div className="media__frame">
          <MuxMedia
            className="media__asset"
            mediaKey={media.id}
            alt={media.alt ?? ""}
            priority={priority}
            autoPlay={autoPlay}
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

  if (media.type === "video") {
    return (
      <figure
        className={clsx("media", className)}
        data-media-type={media.type}
        data-orientation={getMediaOrientation(media)}
        style={mediaStyle}
      >
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
    <figure
      className={clsx("media", className)}
      data-media-type={media.type}
      data-orientation={getMediaOrientation(media)}
      style={mediaStyle}
    >
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

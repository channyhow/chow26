import { createElement, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

type MuxTokenResponse = {
  playbackId: string;
  playbackToken: string;
  thumbnailToken: string;
};

type MuxPlayerElement = HTMLElement & {
  play?: () => Promise<void>;
  pause?: () => void;
};

export type MuxMediaProps = {
  playbackKey: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  autoPlay?: boolean;
  className?: string;
};

const MUX_PLAYER_SRC =
  "https://cdn.jsdelivr.net/npm/@mux/mux-player@3.13.2/dist/mux-player.mjs";

let muxPlayerPromise: Promise<void> | null = null;

function ensureMuxPlayer() {
  if (typeof window === "undefined" || customElements.get("mux-player")) {
    return Promise.resolve();
  }

  if (!muxPlayerPromise) {
    muxPlayerPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${MUX_PLAYER_SRC}"]`,
      );

      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.type = "module";
      script.src = MUX_PLAYER_SRC;
      script.addEventListener("load", () => resolve(), { once: true });
      script.addEventListener("error", () => reject(), { once: true });
      document.head.appendChild(script);
    });
  }

  return muxPlayerPromise;
}

export function MuxMedia({
  playbackKey,
  alt,
  width,
  height,
  priority = false,
  autoPlay = true,
  className,
}: MuxMediaProps) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<MuxPlayerElement | null>(null);
  const [tokens, setTokens] = useState<MuxTokenResponse | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(priority);
  const [isVisible, setIsVisible] = useState(priority);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    const anchor = containerRef.current;
    if (!anchor) return;

    if (priority || typeof IntersectionObserver === "undefined") {
      setIsNearViewport(true);
      setIsVisible(true);
      return;
    }

    const loadObserver = new IntersectionObserver(
      ([entry]) => setIsNearViewport(Boolean(entry?.isIntersecting)),
      { rootMargin: "300px 0px", threshold: 0 },
    );
    const playbackObserver = new IntersectionObserver(
      ([entry]) => setIsVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.1 },
    );

    loadObserver.observe(anchor);
    playbackObserver.observe(anchor);

    return () => {
      loadObserver.disconnect();
      playbackObserver.disconnect();
    };
  }, [priority]);

  useEffect(() => {
    if (!isNearViewport || tokens) return;

    const controller = new AbortController();

    fetch(`/.netlify/functions/mux-token?media=${encodeURIComponent(playbackKey)}`, {
      signal: controller.signal,
      credentials: "same-origin",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to authorize Mux playback");
        return response.json() as Promise<MuxTokenResponse>;
      })
      .then((payload) => setTokens(payload))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error(error);
      });

    return () => controller.abort();
  }, [isNearViewport, playbackKey, tokens]);

  useEffect(() => {
    if (!tokens || reduceMotion) return;

    let active = true;
    void ensureMuxPlayer()
      .then(() => {
        if (active) setPlayerReady(true);
      })
      .catch((error: unknown) => console.error(error));

    return () => {
      active = false;
    };
  }, [reduceMotion, tokens]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !playerReady || reduceMotion || !autoPlay) {
      player?.pause?.();
      return;
    }

    if (isVisible) {
      void player.play?.().catch(() => undefined);
    } else {
      player.pause?.();
    }
  }, [autoPlay, isVisible, playerReady, reduceMotion]);

  const thumbnailSrc = useMemo(() => {
    if (!tokens) return undefined;
    return `https://image.mux.com/${tokens.playbackId}/thumbnail.webp?token=${tokens.thumbnailToken}`;
  }, [tokens]);

  const player =
    tokens && !reduceMotion
      ? createElement("mux-player", {
          ref: (node: MuxPlayerElement | null) => {
            playerRef.current = node;
          },
          "playback-id": tokens.playbackId,
          "playback-token": tokens.playbackToken,
          "thumbnail-token": tokens.thumbnailToken,
          "metadata-video-title": alt,
          muted: true,
          loop: true,
          preload: priority ? "metadata" : "none",
          tabindex: -1,
          "aria-hidden": "true",
          style: {
            "--controls": "none",
            width: "100%",
            height: "100%",
            display: "block",
          },
        })
      : null;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ aspectRatio: `${width} / ${height}` }}
      role="img"
      aria-label={alt}
    >
      {reduceMotion && thumbnailSrc ? (
        <img
          src={thumbnailSrc}
          alt=""
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        player
      )}
    </div>
  );
}

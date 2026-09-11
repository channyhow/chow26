import { createElement, useEffect, useMemo, useRef, useState } from "react";

type MuxTokenResponse = {
  playbackId: string;
  playbackPolicy: "public" | "signed";
  playbackToken?: string;
  thumbnailToken?: string;
};

type MuxPlayerElement = HTMLElement & {
  play?: () => Promise<void>;
  pause?: () => void;
};

export type MuxMediaProps = {
  mediaKey: string;
  alt: string;
  priority?: boolean;
  autoPlay?: boolean;
  className?: string;
  fit?: "cover" | "contain";
  position?: string;
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

function supportsNativeHls() {
  if (typeof document === "undefined") return false;
  const probe = document.createElement("video");
  return Boolean(
    probe.canPlayType("application/vnd.apple.mpegurl")
      || probe.canPlayType("application/x-mpegURL"),
  );
}

export function MuxMedia({
  mediaKey,
  alt,
  priority = false,
  autoPlay = true,
  className,
  fit = "cover",
  position = "50% 50%",
}: MuxMediaProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<MuxPlayerElement | null>(null);
  const nativeVideoRef = useRef<HTMLVideoElement | null>(null);
  const [tokens, setTokens] = useState<MuxTokenResponse | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(priority);
  const [isVisible, setIsVisible] = useState(priority);
  const [playerReady, setPlayerReady] = useState(false);
  const [useNativeHls, setUseNativeHls] = useState(false);

  useEffect(() => {
    setUseNativeHls(supportsNativeHls());
  }, []);

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
      { rootMargin: "500px 0px", threshold: 0 },
    );
    const playbackObserver = new IntersectionObserver(
      ([entry]) => setIsVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.08 },
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

    fetch(`/.netlify/functions/mux-token?media=${encodeURIComponent(mediaKey)}`, {
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
  }, [isNearViewport, mediaKey, tokens]);

  useEffect(() => {
    if (!tokens || useNativeHls) return;

    let active = true;
    void ensureMuxPlayer()
      .then(() => {
        if (active) setPlayerReady(true);
      })
      .catch((error: unknown) => console.error(error));

    return () => {
      active = false;
    };
  }, [tokens, useNativeHls]);

  useEffect(() => {
    if (useNativeHls) {
      const video = nativeVideoRef.current;
      if (!video || !autoPlay) {
        video?.pause();
        return;
      }

      if (isVisible) {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
      return;
    }

    const player = playerRef.current;
    if (!player || !playerReady || !autoPlay) {
      player?.pause?.();
      return;
    }

    if (isVisible) {
      void player.play?.().catch(() => undefined);
    } else {
      player.pause?.();
    }
  }, [autoPlay, isVisible, playerReady, useNativeHls]);

  const thumbnailSrc = useMemo(() => {
    if (!tokens) return undefined;
    const base = `https://image.mux.com/${tokens.playbackId}/thumbnail.webp`;
    return tokens.playbackPolicy === "signed" && tokens.thumbnailToken
      ? `${base}?token=${encodeURIComponent(tokens.thumbnailToken)}`
      : base;
  }, [tokens]);

  const playbackSrc = useMemo(() => {
    if (!tokens) return undefined;
    const base = `https://stream.mux.com/${tokens.playbackId}.m3u8`;
    return tokens.playbackPolicy === "signed" && tokens.playbackToken
      ? `${base}?token=${encodeURIComponent(tokens.playbackToken)}`
      : base;
  }, [tokens]);

  const player =
    tokens && !useNativeHls && playerReady
      ? createElement("mux-player", {
          ref: (node: MuxPlayerElement | null) => {
            playerRef.current = node;
          },
          "playback-id": tokens.playbackId,
          ...(tokens.playbackPolicy === "signed" && tokens.playbackToken
            ? { "playback-token": tokens.playbackToken }
            : {}),
          ...(tokens.playbackPolicy === "signed" && tokens.thumbnailToken
            ? { "thumbnail-token": tokens.thumbnailToken }
            : {}),
          "metadata-video-title": alt,
          muted: true,
          loop: true,
          controls: false,
          autoplay: autoPlay && isVisible,
          preload: priority || isNearViewport ? "metadata" : "none",
          tabindex: -1,
          "aria-hidden": "true",
          style: {
            "--controls": "none",
            "--media-object-fit": fit,
            "--media-object-position": position,
            width: "100%",
            height: "100%",
            display: "block",
            position: "absolute",
            inset: "0",
            pointerEvents: "none",
          },
        })
      : null;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%", position: "relative" }}
      role="img"
      aria-label={alt}
    >
      {thumbnailSrc ? (
        <img
          src={thumbnailSrc}
          alt=""
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            objectFit: fit,
            objectPosition: position,
            display: "block",
          }}
        />
      ) : null}

      {tokens && useNativeHls && playbackSrc ? (
        <video
          ref={nativeVideoRef}
          src={playbackSrc}
          muted
          playsInline
          loop
          autoPlay={autoPlay && isVisible}
          preload={priority || isNearViewport ? "metadata" : "none"}
          aria-hidden="true"
          tabIndex={-1}
          style={{
            width: "100%",
            height: "100%",
            objectFit: fit,
            objectPosition: position,
            display: "block",
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        />
      ) : player}
    </div>
  );
}
